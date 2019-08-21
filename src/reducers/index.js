import { combineReducers } from 'redux';

import StatsReducer from './StatsReducer';
import TimersReducer from './TimersReducer';
import RidesReducer from './RidesReducer';

export default combineReducers({
    stats: StatsReducer,
    timers: TimersReducer,
    rides: RidesReducer,
});

