import { TIMERS_UPDATE_SUCCESS, STATES_UPDATE_SUCCESS, RIDES_UPDATE_SUCCESS } from './types';

export const startNewRide = () => {
	return (dispatch, getState) => {
        const { timers, stats, rides } = getState();

        dispatch({
			type: TIMERS_UPDATE_SUCCESS,
			payload: {
                ...timers,
                timeForRide: 0,
            },
		});

        dispatch({
			type: STATES_UPDATE_SUCCESS,
			payload: {
                ...stats,
                avgSpeed: 0,
                recordCount: 0,
                currentDistance: 0,
            },
		});

        dispatch({
			type: RIDES_UPDATE_SUCCESS,
			payload: rides + 1,
		});
    };
};
