import { STATES_UPDATE_SUCCESS } from '../actions/types';

const INITIAL_STATE = {
	avgSpeed: 0,
	recordCount: 0,
	currentDistance: 0,
	maxSpeed: 0,
	totalDistance: 0,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case STATES_UPDATE_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};
