import { accelerometer } from 'react-native-sensors';
import Geolocation from '@react-native-community/geolocation';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import { updateStats } from '../actions/StatsActions';

export type GeoPoint = {
	longitude: number,
	latitude: number,
	accuracy: number,
	heading: number,
	altitude: number,
	altitudeAccuracy: number,
};

class TrackingManager {
	static instance = null;

	/**
     * @returns {TrackingManager}
     */
	static getInstance() {
		if (TrackingManager.instance == null) {
			TrackingManager.instance = new TrackingManager();
		}

		return this.instance;
	}

	constructor() {
		//internal flags
		this._accelerometerObserver = null;
		this._accelerometerData = [];
		this._geolocationWatch = null;

		// internal variables
		this._lastGeoPoint = null;
		this._lastTimestamp = null;

		return this;
	}

	addAccelerometer = accelerometerObject => {
		if (this._accelerometerData.length < 15) {
			this._accelerometerData.push(accelerometerObject);
		} else {
			this._accelerometerData.push(accelerometerObject);
			this._accelerometerData = this._accelerometerData.slice(
				this._accelerometerData.length - 15,
				this._accelerometerData.length
			);
		}
	};

	//TODO: if user si stationary show a local notification telling him to stop his app
	// https://github.com/wumke/react-native-local-notifications

	startTracking = () => {
		//start timestamp
		this._lastTimestamp = Date.now();

		// setUpdateIntervalForType(SensorTypes.accelerometer, 400);
		this._accelerometerObserver = accelerometer.subscribe(data => {
			// create new accelerometer object
			const accelerometerObject = {
				x: data.x,
				y: data.y,
				z: data.z,
			};

			this.addAccelerometer(accelerometerObject);
		});

		this._geolocationWatch = Geolocation.watchPosition(
			position => {
				// only send locations with accuracy less then 31
				if (position.coords && position.coords.accuracy < 31) {
					const geoPoint: GeoPoint = {
						longitude: position.coords.longitude,
						latitude: position.coords.latitude,
						altitude: position.coords.altitude,
						accuracy: position.coords.accuracy,
						altitudeAccuracy: position.coords.altitudeAccuracy,
						accelerometerData: this._accelerometerData,
						uniqueId: DeviceInfo.getUniqueID(),
						manufacturer: DeviceInfo.getManufacturer(),
					};

					// send data to firebase.. no need to call redux
					firebase.firestore().collection('geo_points').add(geoPoint);
					this._accelerometerData = [];

					if (this._lastGeoPoint) {
						//calculate distance of 2 points
						const durationInSeconds = Math.floor((Date.now() - this._lastTimestamp) / 1000);
						const distance = this._distanceToPointInM(geoPoint, this._lastGeoPoint);
						updateStats(distance, durationInSeconds);
					}

					this._lastGeoPoint = geoPoint;
					this._lastTimestamp = Date.now();
				} else {
					console.log(' - got location error: ', position);
				}
			},
			error => {
				console.log(' - error tracking location: ', error);
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000,
			}
		);
	};

	stopTracking = () => {
		if (this._accelerometerObserver) {
			this._accelerometerObserver.unsubscribe();
		}

		Geolocation.clearWatch(this._geolocationWatch);
		Geolocation.stopObserving();
		Geolocation.clearWatch(this._geolocationWatch);

		//clear timestamp
		this._lastTimestamp = null;
		this._lastGeoPoint = null;
		this._accelerometerData = [];
	};

	_distanceToPointInM = (firstGeoPoint, secondGeoPoint) => {
		const deltaLat = this._toRad(firstGeoPoint.latitude - secondGeoPoint.latitude);
		const deltaLon = this._toRad(firstGeoPoint.longitude - secondGeoPoint.longitude);

		const a = Math.abs(
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
				Math.cos(this._toRad(secondGeoPoint.latitude)) *
					Math.cos(this._toRad(firstGeoPoint.longitude)) *
					(Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2))
		);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distanceInM = 6371 * c; // 6371 - Radius of the earth in km

		return Math.floor(distanceInM * 1000);
	};

	_toRad = value => {
		return value * (Math.PI / 180.0);
	};

	_toDeg = value => {
		return value / (Math.PI / 180.0);
	};
}

export default TrackingManager;
