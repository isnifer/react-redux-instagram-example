import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { loadOnScrollBottom } from '../../helpers';

// Actions
import { getFollowersAction, updateFollowersAction } from '../actions';

class Followers extends Component {
    componentDidMount () {
        const userId = this.props.params.id;
        const type = this.props.route.name;

        this.props.getFollowersAction({userId, type});
    }

    render () {
        const followers = this.props.model.followers.map((follower, i) => {
            return (
                <div className="follow__item" key={follower.id}>
                    <Link to={`profile/${follower.id}`}>
                        <img className="follow__avatar" src={follower.profile_picture} />
                        <span className="follow__username">@{follower.username}</span>
                    </Link>
                </div>
            );
        });

        return (
            <div className="follow">
                <header className="follow__header">
                    {this.props.route.name === 'follows' && 'I Follow' || 'My Followers'}
                </header>
                <div className="follow__list">
                    {followers}
                </div>
            </div>
        );
    }
}

Followers.propTypes = {
    model: PropTypes.object.isRequired,
};

export default connect(state => ({
    model: {
        followers: state.followers,
        pagination: state.followersPagination
    }
}), {getFollowersAction, updateFollowersAction})(Followers);
