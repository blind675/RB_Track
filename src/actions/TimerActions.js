import { TIMERS_UPDATE_SUCCESS } from './types';

export const updateTimers = () => {
	return (dispatch, getState) => {
		const oldTimers = getState().timers;

		const newTimersState = {
			timeForRide: oldTimers.timeForRide + 1,
			totalTime: oldTimers.totalTime + 1,
		};

		dispatch({
			type: TIMERS_UPDATE_SUCCESS,
			payload: newTimersState,
		});
	};
};
