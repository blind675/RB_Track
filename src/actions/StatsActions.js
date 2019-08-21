import { STATES_UPDATE_SUCCESS } from './types';
import store from '../Store';

export const updateStats = (distance, timePassed) => {
	const speedMpS = distance / timePassed;
	// correct to 1 decimals
	const speedKmpH = Math.floor(speedMpS * 3.6 * 10) / 10;

	const oldState = store.getState().stats;

	const newDistance = oldState.currentDistance + distance;
	const newTotalDistance = oldState.totalDistance + distance;

	let newRecordCount = oldState.recordCount;
	let newMaxSpeed = oldState.maxSpeed;
	let newAvgSpeed = oldState.avgSpeed;

	if (isFinite(speedKmpH)) {
		if (speedKmpH > newMaxSpeed) {
			newMaxSpeed = speedKmpH;
		}

		newAvgSpeed = Math.floor((newAvgSpeed * newRecordCount + speedKmpH) / (newRecordCount + 1) * 10) / 10;

		newRecordCount += 1;
	}

	const newState = {
		avgSpeed: newAvgSpeed,
		recordCount: newRecordCount,
		currentDistance: newDistance,
		maxSpeed: newMaxSpeed,
		totalDistance: newTotalDistance,
	};

	store.dispatch({
		type: STATES_UPDATE_SUCCESS,
		payload: newState,
	});
};
