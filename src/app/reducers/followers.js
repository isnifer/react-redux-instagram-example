import {
    GET_FOLLOWERS_REQUEST,
    GET_FOLLOWERS_RESPONSE,
    UPDATE_FOLLOWERS_RESPONSE
} from '../constants';

export const followers = (state = [], action) => {
    switch (action.type) {
        case GET_FOLLOWERS_REQUEST:
        case GET_FOLLOWERS_RESPONSE:
            return action.payload.followers;
        case UPDATE_FOLLOWERS_RESPONSE:
            return action.payload.followers.concat(action.payload.followers);
        default:
            return state;
    }
};


export const followersPagination = (state = {}, action) => {
    switch (action.type) {
        case GET_FOLLOWERS_REQUEST:
        case GET_FOLLOWERS_RESPONSE:
        case UPDATE_FOLLOWERS_RESPONSE:
            return action.payload.followersPagination;
        default:
            return state;
    }
};
