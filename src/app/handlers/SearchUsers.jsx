import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

// Actions
import { searchByUserAction } from '../actions';

class SearchUsers extends Component {

    static propTypes = {
        model: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    search (event) {
        event.preventDefault();

        const { dispatch } = this.props;
        dispatch(searchByUserAction(this.refs.searchInput.value));
    }

    render () {
        const searchResultItems = this.props.model.users.map((photo, i) => {
            return (
                <Link
                    to={`profile/${photo.id}`}
                    className="photo-list__item fancybox"
                    title={photo.username || ''}
                    key={i}>
                    <img src={photo.profile_picture} />
                </Link>
            )
        });

        return (
            <div className="search">
                <form className="search__form" onSubmit={::this.search}>
                    <input
                        type="text"
                        defaultValue={null}
                        ref="searchInput"
                        className="search__input"
                        placeholder="Find user"/>
                </form>
                <div className="photo-list">
                    {searchResultItems}
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    model: {
        users: state.foundedUsers
    }
}))(SearchUsers);
