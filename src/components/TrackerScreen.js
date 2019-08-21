import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FlipToggle from 'react-native-flip-toggle-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import * as actions from '../actions';
import TrackingManager from '../managers/TrackingManager';

type Props = {};

class TrackerScreen extends Component<Props> {
	constructor(props) {
		super(props);
		this.state = {
			isActive: false,
		};
		this.timer = null;
	}

	componentDidMount(): void {
		this.props.loadData();
	}

	_convertMetersToKm(meters): number {
		return Math.floor(meters / 10) / 100;
	}

	_prettyPrintTime(time, extended = false): string {
		var hours = Math.floor(time / 3600);
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;

		if (extended || hours > 0) {
			return (
				this._str_pad_left(hours, '0', 2) +
				':' +
				this._str_pad_left(minutes, '0', 2) +
				':' +
				this._str_pad_left(seconds, '0', 2)
			);
		}

		return this._str_pad_left(minutes, '0', 2) + ':' + this._str_pad_left(seconds, '0', 2);
	}

	_str_pad_left(string, pad, length): string {
		return (new Array(length + 1).join(pad) + string).slice(-length);
	}

	render() {
		return (
			<View style={styles.screenContainer}>
				<View style={styles.flexOne} />
				<View style={styles.statusRow}>
					<Text> Status: </Text>
					<Text style={this.state.isActive ? styles.trackingStatus : styles.notTrackingStatus}>
						{this.state.isActive ? 'Tracking' : 'Stopped'}
					</Text>
				</View>
				<View style={styles.flexOne} />
				<View style={styles.row}>
					<Text> Avg speed: </Text>
					<Text style={styles.valuesLabels}>
						{`${this.props.stats.avgSpeed} km/h`}
					</Text>
				</View>
				<View style={styles.row}>
					<Text> Current distance: </Text>
					<Text style={styles.valuesLabels}>
						{`${this._convertMetersToKm(this.props.stats.currentDistance)} km`}
					</Text>
				</View>
				<View style={styles.row}>
					<Text> Time for ride: </Text>
					<Text style={styles.valuesLabels}>
						{this._prettyPrintTime(this.props.timers.timeForRide)}
					</Text>
				</View>
				<View style={styles.flexOne} />
				<View style={styles.row}>
					<Text> Max speed: </Text>
					<Text style={styles.valuesLabels}>
						{`${this.props.stats.maxSpeed} km/h`}
					</Text>
				</View>
				<View style={styles.row}>
					<Text> Total distance: </Text>
					<Text style={styles.valuesLabels}>
						{`${this._convertMetersToKm(this.props.stats.totalDistance)} km`}
					</Text>
				</View>
				<View style={styles.row}>
					<Text> Total time: </Text>
					<Text style={styles.valuesLabels}>
						{this._prettyPrintTime(this.props.timers.totalTime, true)}
					</Text>
				</View>
				<View style={styles.row}>
					<Text> Total rides: </Text>
					<Text style={styles.valuesLabels}>
						{' '}{this.props.rides}{' '}
					</Text>
				</View>
				<View style={styles.flexOne} />
				<View style={styles.row}>
					<View style={styles.sliderBorder}>
						<FlipToggle
							value={this.state.isActive}
							buttonWidth={270}
							buttonHeight={50}
							buttonRadius={0}
							sliderWidth={60}
							sliderHeight={40}
							sliderRadius={0}
							onLabel={'Stop'}
							offLabel={'Track'}
							sliderOnColor={'#F0592A'}
							sliderOffColor={'#BEBEBE'}
							buttonOnColor={'#FFFFFF'}
							buttonOffColor={'#FFFFFF'}
							labelStyle={styles.sliderLabel}
							onToggle={newState => {
								if (!this.state.isActive) {
									new TrackingManager().startTracking();
									this.timer = setInterval(() => {
										this.props.updateTimers();
									}, 1000);
									this.props.startNewRide();
								} else {
									new TrackingManager().stopTracking();
									clearInterval(this.timer);
									this.props.saveData();
								}
								this.setState({
									isActive: !this.state.isActive,
								});
							}}
						/>
					</View>
					<TouchableOpacity
						style={styles.buttonBorder}
						onPress={() => {
							new TrackingManager().stopTracking();
							clearInterval(this.timer);
							this.setState({
								isActive: false,
							});
							this.props.clearData();
						}}
					>
						<Icon name="trash" size={30} color="red" />
					</TouchableOpacity>
				</View>
				<View style={styles.flexOne} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		margin: 16,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	statusRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 30,
	},
	flexOne: {
		flex: 1,
	},
	sliderBorder: {
		borderColor: '#A0A0A0',
		borderWidth: 1,
	},
	sliderLabel: {
		color: '#808080',
		fontSize: 17,
		fontWeight: '500',
	},
	buttonBorder: {
		width: 50,
		height: 50,
		borderColor: '#A0A0A0',
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	trackingStatus: {
		color: '#F0592A',
		fontSize: 22,
		fontWeight: '700',
	},
	notTrackingStatus: {
		fontSize: 20,
		fontWeight: '500',
	},
	valuesLabels: {
		fontSize: 17,
		marginVertical: 4,
	},
	textInputStyle: {
		borderBottomColor: '#0F0F0F',
		borderBottomWidth: 0.5,
		margin: 16,
		height: 35,
		width: 200,
	},
});

const mapStateToProps = state => ({
	stats: state.stats,
	timers: state.timers,
	rides: state.rides,
});

export default connect(mapStateToProps, actions)(TrackerScreen);