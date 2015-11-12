import {
    SEARCH_BY_TAG_REQUEST,
    SEARCH_BY_TAG_RESPONSE,
    GET_POPULAR_REQUEST,
    GET_POPULAR_RESPONSE
} from '../constants';

const initialState = {
    foundedPhotos: [],
    searchPagination: {},
    deniedTag: false
};

export const foundedPhotos = (state = initialState.foundedPhotos, action) => {
    switch (action.type) {
        case SEARCH_BY_TAG_RESPONSE:
        case GET_POPULAR_RESPONSE:

            // If we try to find denied tag like: xxx, booty, etc
            // we will not get anything here
            // and we will simply return empty array
            return action.payload.foundedPhotos || [];
        case GET_POPULAR_REQUEST:
        case SEARCH_BY_TAG_REQUEST:
        default:
            return state;
    }
};


export const searchPagination = (state = initialState.searchPagination, action) => {
    switch (action.type) {
        case SEARCH_BY_TAG_RESPONSE:

            // If we try to find denied tag like: xxx, booty, etc
            // we will not get anything here
            // and we will simply return empty array
            return action.payload.searchPagination || [];
        case SEARCH_BY_TAG_REQUEST:
        default:
            return state;
    }
};


export const deniedTag = (state = initialState.deniedTag, action) => {
    switch (action.type) {
        case SEARCH_BY_TAG_RESPONSE:
            return action.payload.deniedTag;
        case SEARCH_BY_TAG_REQUEST:
        default:
            return state;
    }
};
