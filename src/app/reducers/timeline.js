import {
    GET_TIMELINE_REQUEST,
    GET_TIMELINE_RESPONSE,
    UPDATE_TIMELINE_RESPONSE
} from '../constants';

const initialState = {
    timelineItems: [],
    timelinePagination: {},
    timelineLoaded: false
};

export const timelineItems = (state = initialState.timelineItems, action) => {
    switch (action.type) {
        case GET_TIMELINE_REQUEST:
            return state;
        case GET_TIMELINE_RESPONSE:
        case UPDATE_TIMELINE_RESPONSE:
            return state.concat(action.payload.timelineItems);
        default:
            return state;
    }
};

export const timelinePagination = (state = initialState.timelinePagination, action) => {
    switch (action.type) {
        case GET_TIMELINE_REQUEST:
            return state;
        case GET_TIMELINE_RESPONSE:
        case UPDATE_TIMELINE_RESPONSE:
            return action.payload.pagination;
        default:
            return state;
    }
};

export const timelineLoaded = (state = initialState.timelineLoaded, action) => {
    switch (action.type) {
        case GET_TIMELINE_REQUEST:
        case GET_TIMELINE_RESPONSE:
            return action.payload.timelineLoaded;
        default:
            return state;
    }
};
