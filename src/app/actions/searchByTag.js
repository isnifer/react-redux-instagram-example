import { searchByTag, getPopular } from '../api';
import {
    SEARCH_BY_TAG_REQUEST,
    SEARCH_BY_TAG_RESPONSE,
    GET_POPULAR_REQUEST,
    GET_POPULAR_RESPONSE
} from '../constants';

const token = localStorage.accessToken;

export const searchByTagAction = (tag) => (dispatch, getState) => {

    tag = tag.replace(/\s/, '');

    dispatch({
        type: SEARCH_BY_TAG_REQUEST
    });

    searchByTag({tag, token}).then(payload => {
        dispatch({
            type: SEARCH_BY_TAG_RESPONSE,
            payload
        });
    });
};

export const getPopularAction = () => (dispatch, getState) => {

    dispatch({
        type: GET_POPULAR_REQUEST
    });

    getPopular({token}).then(payload => {
        dispatch({
            type: GET_POPULAR_RESPONSE,
            payload
        })
    });
};
