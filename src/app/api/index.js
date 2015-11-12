const dataType = 'jsonp';

export const getFollowers = ({url, userId, type, token}) => {
    const defaultUrl = `https://api.instagram.com/v1/users/${userId}/${type}?access_token=${token}`;
    return $.ajax({url: url || defaultUrl, dataType}).then(payload => {
        return {
            followers: payload.data,
            followersPagination: payload.pagination
        }
    });
};

export const getRelationshipStatus = ({follower, callback, id, token}) => {
    const url = `https://api.instagram.com/v1/users/${id}/relationship?access_token=${token}`;
    return $.ajax({url, dataType}).then(payload => {
        return {
            outgoingStatus: data.data.outgoing_status
        }
    });
}

export const getProfileData = ({userId, token}) => {
    const url = `https://api.instagram.com/v1/users/${userId}?access_token=${token}`;
    return $.ajax({url, dataType}).then(payload => {
        if (payload.meta.code !== 200) {
            return {
                profile: {},
                counts: {},
                profileError: payload.meta.error_message
            }
        }

        return {
            profile: payload.data,
            counts: payload.data.counts,
            profileError: null
        };
    });
};

export const getProfilePhotos = ({url, userId, token}) => {
    const defaultUrl = `https://api.instagram.com/v1/users/${userId}/media/recent?access_token=${token}`;

    return $.ajax({url: url || defaultUrl, dataType}).then(payload => {
        if (payload.meta.code !== 200) {
            return {
                profilePhotos: [],
                profilePagination: {},
                profileError: payload.meta.error_message
            }
        }

        return {
            profilePhotos: payload.data,
            profilePagination: payload.pagination,
            profileError: null
        }
    });
};

export const searchByTag = ({tag, token}) => {
    const url = `https://api.instagram.com/v1/tags/${tag}/media/recent?&access_token=${token}`;

    return $.ajax({url: url, dataType}).then(payload => {
        if (payload.meta.code !== 200) {
            return {
                deniedTag: true
            }
        }

        return {
            foundedPhotos: payload.data,
            searchPagination: payload.pagination,
            deniedTag: false
        }
    });
}

export const getPopular = ({token}) => {
    const url = `https://api.instagram.com/v1/media/popular/?access_token=${token}`;
    return $.ajax({url, dataType}).then(payload => {
        return {
            foundedPhotos: payload.data
        };
    });
}

export const searchByUser = ({username, token}) => {
    const url = `https://api.instagram.com/v1/users/search?q=${username}&access_token=${token}`;

    return $.ajax({url: url, dataType}).then(payload => {
        return {
            foundedUsers: payload.data
        }
    });
}

export const getTimeline = ({url, token}) => {
    const timelineUrl = `https://api.instagram.com/v1/users/self/feed?access_token=${token}`;
    return $.ajax({url: url || timelineUrl, dataType});
}
