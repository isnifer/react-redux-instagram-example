import { getTimeline } from '../api';
import {
    GET_TIMELINE_REQUEST,
    GET_TIMELINE_RESPONSE,
    UPDATE_TIMELINE_RESPONSE
} from '../constants';

const token = localStorage.accessToken;
const userId = localStorage.userId;

export const getTimelineAction = ({url}) => (dispatch, getState) => {

    dispatch({
        type: GET_TIMELINE_REQUEST,
        payload: {
            timelineLoaded: false
        }
    });

    getTimeline({url, token}).then(payload => {
        dispatch({
            type: GET_TIMELINE_RESPONSE,
            payload: {
                timelineItems: payload.data,
                pagination: payload.pagination,
                timelineLoaded: true
            }
        })
    });
}

export const updateTimelineAction = ({url}) => (dispatch, getState) => {

    getTimeline({url, token}).then(payload => {
        dispatch({
            type: UPDATE_TIMELINE_RESPONSE,
            payload: {
                timelineItems: payload.data,
                pagination: payload.pagination
            }
        })
    });
}
