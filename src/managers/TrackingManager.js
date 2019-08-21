import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import Geolocation from '@react-native-community/geolocation';
import firebase from 'react-native-firebase';

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
	constructor() {
		if (!TrackingManager.instance) {
			return TrackingManager.instance;
		}

		TrackingManager.instance = this;

		//internal flags
		this._accelerometerObserver = null;
		this._accelerometerData = null;
		this._geolocationWatch = null;

		// internal variables
		this._lastGeoPoint = null;
		this._lastTimestamp = null;

		return this;
	}

	startTracking = () => {
		//start timestamp
		this._lastTimestamp = Date.now();

		setUpdateIntervalForType(SensorTypes.accelerometer, 400);
		this._accelerometerObserver = accelerometer.subscribe(data => {
			// create new accelerometer object
			this._accelerometerData = {
				x: data.x,
				y: data.y,
				z: data.z,
			};
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

		//clear timestamp
		this._lastTimestamp = null;
		this._lastGeoPoint = null;
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
