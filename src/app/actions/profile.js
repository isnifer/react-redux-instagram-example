import { getProfileData, getProfilePhotos } from '../api';
import {
    GET_PROFILE_REQUEST,
    GET_PROFILE_RESPONSE,
    UPDATE_PROFILE_PHOTOS_REQUEST,
    UPDATE_PROFILE_PHOTOS_RESPONSE,
    GET_PROFILE_PHOTOS_REQUEST,
    GET_PROFILE_PHOTOS_RESPONSE
} from '../constants';

const token = localStorage.accessToken;

export const getProfileDataAction = ({url, userId}) => (dispatch, getState) => {
    dispatch({
        type: GET_PROFILE_REQUEST,
        payload: {
            profileLoaded: false,
            profileError: null
        }
    });

    getProfileData({userId, token}).then(payload => {
        payload.profileLoaded = true;

        dispatch({
            type: GET_PROFILE_RESPONSE,
            payload
        });
    });
}

export const getProfilePhotosAction = ({url, userId}) => (dispatch, getState) => {
    dispatch({
        type: GET_PROFILE_PHOTOS_REQUEST,
        profileError: null
    });

    getProfilePhotos({url, userId, token}).then(payload => {
        dispatch({
            type: GET_PROFILE_PHOTOS_RESPONSE,
            payload
        });
    });
}

export const updateProfilePhotosAction = ({url, userId}) => (dispatch, getState) => {
    dispatch({
        type: UPDATE_PROFILE_PHOTOS_REQUEST
    });

    getProfilePhotos({url, userId, token}).then(payload => {
        dispatch({
            type: UPDATE_PROFILE_PHOTOS_RESPONSE,
            payload
        });
    });
}
