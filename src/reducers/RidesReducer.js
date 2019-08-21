import { RIDES_UPDATE_SUCCESS } from '../actions/types';

const INITIAL_STATE = 0;

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case RIDES_UPDATE_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};
