import {
    SEARCH_BY_USER_REQUEST,
    SEARCH_BY_USER_RESPONSE
} from '../constants';

export const foundedUsers = (state = [], action) => {
    switch (action.type) {
        case SEARCH_BY_USER_RESPONSE:
            return action.payload.foundedUsers;
        case SEARCH_BY_USER_REQUEST:
        default:
            return state;
    }
};
