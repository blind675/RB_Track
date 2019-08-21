import AsyncStorage from '@react-native-community/async-storage';

import {
	STATES_KEY,
	TIMERS_KEY,
	RIDES_KEY,
	TIMERS_UPDATE_SUCCESS,
	STATES_UPDATE_SUCCESS,
	RIDES_UPDATE_SUCCESS,
} from './types';

export const loadData = () => {
	return dispatch => {
		AsyncStorage.getItem(STATES_KEY, (err, stats_result) => {
			if (!err && stats_result) {
				dispatch({
					type: STATES_UPDATE_SUCCESS,
					payload: JSON.parse(stats_result),
				});
			}
		});

		AsyncStorage.getItem(TIMERS_KEY, (err, timers_result) => {
			if (!err && timers_result) {
				dispatch({
					type: TIMERS_UPDATE_SUCCESS,
					payload: JSON.parse(timers_result),
				});
			}
		});

		AsyncStorage.getItem(RIDES_KEY, (err, rides_result) => {
			if (!err && rides_result) {
				dispatch({
					type: RIDES_UPDATE_SUCCESS,
					payload: JSON.parse(rides_result).rides,
				});
			}
		});
	};
};

export const saveData = () => {
	return (dispatch, getState) => {
		const { timers, stats, rides } = getState();

		AsyncStorage.setItem(
			STATES_KEY,
			JSON.stringify({
				...stats,
				avgSpeed: 0,
				recordCount: 0,
				currentDistance: 0,
			})
		);

		AsyncStorage.setItem(
			TIMERS_KEY,
			JSON.stringify({
				...timers,
				timeForRide: 0,
			})
		);

		AsyncStorage.setItem(
			RIDES_KEY,
			JSON.stringify({
				rides: rides,
			})
		);
	};
};

export const clearData = () => {
	return dispatch => {
		const emptyStats = {
			avgSpeed: 0,
			recordCount: 0,
			currentDistance: 0,
			maxSpeed: 0,
			totalDistance: 0,
		};

		AsyncStorage.setItem(STATES_KEY, JSON.stringify(emptyStats));

		dispatch({
			type: STATES_UPDATE_SUCCESS,
			payload: emptyStats,
		});

		const emptyTimers = {
			timeForRide: 0,
			totalTime: 0,
		};

		AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(emptyTimers));

		dispatch({
			type: TIMERS_UPDATE_SUCCESS,
			payload: emptyTimers,
		});

		dispatch({
			type: RIDES_UPDATE_SUCCESS,
			payload: 0,
		});
		AsyncStorage.setItem(
			RIDES_KEY,
			JSON.stringify({
				rides: 0,
			})
		);
	};
};
