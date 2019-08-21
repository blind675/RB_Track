import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import firebase from 'react-native-firebase';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';



export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentState: 'Not Tracking',
		};
		this.geolocationWatch = null;
		this.accelerometerObserver = null;
		this.accelerometerData = {};
	}

	startTracking = () => {
		this.setState({
			currentState: 'Tracking',
		});

		setUpdateIntervalForType(SensorTypes.accelerometer, 400);
		this.accelerometerObserver = accelerometer.subscribe(data => {
			// create new accelerometer object
			this.accelerometerData = {
				x: data.x,
				y: data.y,
				z: data.z,
			};

			console.log(' - accelerometer point: ', this.accelerometerData);
		});

		this.geolocationWatch = Geolocation.watchPosition(
			position => {
				// "coords":{
				//     "speed":3.19,
				//     "longitude":-122.01981015,
				//     "latitude":37.3294642,
				//     "accuracy":10,
				//     "heading":183.13,
				//     "altitude":0,
				//     "altitudeAccuracy":-1
				//  },
				//  "timestamp":1565095295116.673

				console.log(' - location accuracy: ', position.coords.accuracy);

				// only send locations with accuracy less then 31
				if (position.coords && position.coords.accuracy < 31) {
					const geoPoint: GeoPoint = {
						longitude: position.coords.longitude,
						latitude: position.coords.latitude,
						altitude: position.coords.altitude,
						accuracy: position.coords.accuracy,
						altitudeAccuracy: position.coords.altitudeAccuracy,
						accelerometerData: this.accelerometerData,
					};
					console.log(' - got new location: ', geoPoint);

					//sent geoPoint to Firebase
					firebase.firestore().collection('geo_points').add(geoPoint);

					this.accelerometerData = [];
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
		this.setState({
			currentState: 'Not Tracking',
		});

		this.accelerometerObserver.unsubscribe();

		Geolocation.stopObserving();
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.titleText}>
					{this.state.currentState}
				</Text>
				<TouchableOpacity onPress={this.startTracking} style={styles.buttonStyle}>
					<Text style={styles.welcome}>Start tracking</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.stopTracking} style={styles.buttonStyle}>
					<Text style={styles.welcome}>Stop tracking</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		margin: 10,
		color: 'white',
	},
	titleText: {
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
		margin: 32,
		color: 'black',
	},
	buttonStyle: {
		width: 150,
		height: 50,
		backgroundColor: 'blue',
		borderRadius: 4,
		margin: 32,
	},
});
