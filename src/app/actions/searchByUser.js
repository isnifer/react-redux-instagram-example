import { searchByUser } from '../api';
import {
    SEARCH_BY_USER_REQUEST,
    SEARCH_BY_USER_RESPONSE
} from '../constants';

const token = localStorage.accessToken;

export const searchByUserAction = (username) => (dispatch, getState) => {

    username = username.replace(/\s/, '');

    dispatch({
        type: SEARCH_BY_USER_REQUEST
    });

    searchByUser({username, token}).then(payload => {
        dispatch({
            type: SEARCH_BY_USER_RESPONSE,
            payload
        })
    });
};
