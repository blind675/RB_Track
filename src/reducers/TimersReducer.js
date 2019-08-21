import { TIMERS_UPDATE_SUCCESS } from '../actions/types';

const INITIAL_STATE = {
	timeForRide: 0,
    totalTime: 0,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TIMERS_UPDATE_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};
