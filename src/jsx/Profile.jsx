import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { loadOnScrollBottom } from '../helpers';

// Actions
import { getProfileDataAction, getProfilePhotosAction, updateProfilePhotosAction } from '../app/actions';

class Profile extends Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        const { dispatch } = this.props;
        const userId = this.props.params.id;

        dispatch(getProfileDataAction({userId}));
        dispatch(getProfilePhotosAction({userId}));

        loadOnScrollBottom({
            dispatch,
            action: updateProfilePhotosAction,
            that: this,
            userId
        });
    }

    componentWillUnmount () {
        console.log('PROFILE UNDMOUNTED');
        $(window).off('scroll');
    }

    render () {

        const { profile, counts, photos, pagination, error } = this.props.model;

        if (error) {
            return (
                <div style={{fontSize: '20px', textTransform: 'uppercase', textAlign: 'center', margin: '50px 0'}}>
                    <strong>{error}</strong>
                </div>
            );
        }

        const photoList = photos.map((photo, i) => {
            return (
                <div className="photo-list__item" key={i}>
                    <a className="fancybox" href={photo.images.standard_resolution.url}>
                        <img
                            src={photo.images.low_resolution.url}
                            title={photo.caption && photo.caption.text || ''} />
                    </a>
                    <span className="photo-list__likes">Likes: {photo.likes.count}</span>
                </div>
            );
        });

        return (
            <div className="profile">
                <div className="profile__data">
                    <div className="profile__photo">
                        <img
                            src={profile.profile_picture}
                            alt={profile.username}
                            className="profile__picture" />
                    </div>
                    <div className="profile__username">
                        {profile.username}
                    </div>
                    <ul className="profile__stats">
                        <li className="profile__item">
                            <span className="profile__count">Photos</span><br />
                            <span className="profile__media-digits">{counts.media}</span>
                        </li>
                        <li className="profile__item">
                            <Link to={`/followed-by/${this.props.params.id}`} className="profile__link_followers">
                                <span className="profile__count">Followers</span><br />
                                <span className="profile__followed_by-digits">{counts.followed_by}</span>
                            </Link>
                        </li>
                        <li className="profile__item">
                            <Link to={`/follows/${this.props.params.id}`} className="profile__link_followers">
                                <span className="profile__count profile__count_follow">Follow</span><br />
                                <span className="profile__follows-digits">{counts.follows}</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className="profile__info">
                        <li className="profile__item">{profile.full_name}</li>
                        <li className="profile__item">{profile.bio}</li>
                        <li className="profile__item">
                            <a href={profile.website} target="_blank" className="profile__url">
                                {profile.website}
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="photo-list">
                    {photoList}
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    model: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(state => ({
    model: {
        profile: state.profile,
        counts: state.counts,
        photos: state.profilePhotos,
        pagination: state.profilePagination,
        error: state.profileError
    }
}))(Profile);
