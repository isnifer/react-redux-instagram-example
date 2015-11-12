import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadOnScrollBottom } from '../helpers';

// Actions
import { getTimelineAction, updateTimelineAction } from '../app/actions';

const token = localStorage.accessToken;
const userId = localStorage.userId;

const CommentsItem = ({src, author, text}) => {
    return (
        <li className="comments__item">
            <img src={src} className="comments__pic" />
            <a className="comments__username" href="#/profile/">{author}</a>:&#160;
            <span className="comments__text">{text}</span>
        </li>
    );
}

const TimelineUser = ({userId, avatar, username, likes, liked}) => {
    return (
        <div className="user g-clf">
            <a href={'#/profile/' + userId} className="user__pic">
                <img src={avatar} />
            </a>
            <span className="user__name">{username}</span>
            <LikeHeart likes={likes} liked={liked} />
        </div>
    );
}

const LikeHeart = ({liked, likes}) => {
    return (
        <span className="user__likes">
            <i className={liked ? 'user__like user__like_liked' : 'user__like'}></i>
            <span className="user__likes-count">{likes}</span>
        </span>
    );
}

const TimelinePhoto = ({id, src}) => {
    return (
        <img
            className="photo__pic"
            id={id}
            src={src} />
    );
}

const TimelineVideo = ({id, src}) => {
    return (
        <video className="photo__pic" id={id} controls>
            <source src={src}></source>
        </video>
    );
}

const TimelineItem = ({element, id, type, user}) => {
    const timelineElement = type === 'video' ?
        (<TimelineVideo
            src={element.videos.standard_resolution.url}
            id={id} />) :
        (<TimelinePhoto
            src={element.images.standard_resolution.url}
            id={id} liked={element.user_has_liked} />);

    const comments = element.comments.data.map((comment, i) => {
        return (
            <CommentsItem
                src={comment.from.profile_picture}
                authorId={comment.from.id}
                author={comment.from.username}
                text={comment.text}
                key={i} />
        );
    });

    return (
        <li className="feed__item">
            <TimelineUser
                liked={element.user_has_liked}
                userId={user.id}
                username={user.username}
                avatar={user.profile_picture}
                likes={element.likes.count}
                photoId={element.id} />
            <div className="photo">
                {timelineElement}
                <ul className="comments">
                    {comments}
                </ul>
            </div>
        </li>
    );
}

class Timeline extends Component {
    constructor (props, context) {
        super(props, context);
    }

    componentDidMount () {
        const { dispatch } = this.props;

        // Init
        dispatch(getTimelineAction({}));

        loadOnScrollBottom({
            dispatch,
            action: updateTimelineAction,
            that: this
        });
    }

    componentWillUnmount () {
        $(window).off('scroll');
    }

    render () {
        const items = this.props.model.timelineItems.map((picture, i) => {
            return (
                <TimelineItem
                    element={picture}
                    user={picture.user}
                    id={picture.id}
                    type={picture.type}
                    key={i} />
            );
        });

        return (
            <div className="timeline">
                <ul className="feed">
                    {items}
                </ul>
            </div>
        );
    }
}

Timeline.propTypes = {
    model: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(state => ({
    model: {
        timelineItems: state.timelineItems,
        pagination: state.timelinePagination,
        timelineLoaded: state.timelineLoaded
    }
}))(Timeline);
