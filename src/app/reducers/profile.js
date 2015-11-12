import {
    GET_PROFILE_REQUEST,
    GET_PROFILE_RESPONSE,
    UPDATE_PROFILE_PHOTOS_RESPONSE,
    GET_PROFILE_PHOTOS_REQUEST,
    GET_PROFILE_PHOTOS_RESPONSE
} from '../constants';

const initialState = {
    profile: {},
    counts: {},
    profileLoaded: false,
    profilePhotos: [],
    profilePagination: {},
    profileError: null
};

export const profile = (state = initialState.profile, action) => {
    switch (action.type) {
        case GET_PROFILE_RESPONSE:
            return action.payload.profile || {};
        case GET_PROFILE_REQUEST:
        default:
            return state;
    }
};

export const counts = (state = initialState.counts, action) => {
    switch (action.type) {
        case GET_PROFILE_RESPONSE:
            return action.payload.counts;
        case GET_PROFILE_REQUEST:
        default:
            return state;
    }
};

export const profileLoaded = (state = initialState.profileLoaded, action) => {
    switch (action.type) {
        case GET_PROFILE_RESPONSE:
        case GET_PROFILE_REQUEST:
            return action.payload.profileLoaded;
        default:
            return state;
    }
};

export const profilePhotos = (state = initialState.profilePhotos, action) => {
    switch (action.type) {
        case UPDATE_PROFILE_PHOTOS_RESPONSE:
            return state.concat(action.payload.profilePhotos);
        case GET_PROFILE_PHOTOS_RESPONSE:
            return action.payload.profilePhotos;
        case GET_PROFILE_PHOTOS_REQUEST:
            return initialState.profilePhotos;
        default:
            return state;
    }
};

export const profilePagination = (state = initialState.profilePagination, action) => {
    switch (action.type) {
        case GET_PROFILE_PHOTOS_RESPONSE:
        case UPDATE_PROFILE_PHOTOS_RESPONSE:
            return action.payload.profilePagination;
        case GET_PROFILE_PHOTOS_REQUEST:
        default:
            return state;
    }
};


export const profileError = (state = initialState.profileError, action) => {
    switch (action.type) {
        case GET_PROFILE_PHOTOS_RESPONSE:
        case UPDATE_PROFILE_PHOTOS_RESPONSE:
            return action.payload.profileError;
        case GET_PROFILE_PHOTOS_REQUEST:
        default:
            return state;
    }
};
