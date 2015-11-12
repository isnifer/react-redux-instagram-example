import { combineReducers } from 'redux';
import { timelineItems, timelinePagination, timelineLoaded } from './timeline';
import {
    profile,
    counts,
    profileLoaded,
    profilePhotos,
    profilePagination,
    profileError
} from './profile';
import { foundedUsers } from './searchByUser';
import {
    foundedPhotos,
    searchPagination,
    deniedTag,
    popularPhotos,
    popularPagination
} from './searchByTag';
import { followers, followersPagination } from './followers';

const rootReducer = combineReducers({

    // Timeline
    timelineItems,
    timelinePagination,
    timelineLoaded,

    // Profile
    profile,
    counts,
    profileLoaded,
    profilePhotos,
    profilePagination,
    profileError,

    // Search by user
    foundedUsers,

    // Search by tag,
    foundedPhotos,
    searchPagination,
    deniedTag,

    // Popular
    popularPhotos,

    // Followers
    followers,
    followersPagination
});

export default rootReducer;
