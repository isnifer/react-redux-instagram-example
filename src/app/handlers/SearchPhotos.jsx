import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Actions
import { searchByTagAction, getPopularAction } from '../actions';

class SearchPhotos extends Component {

    static propTypes = {
        model: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    search (event) {
        event.preventDefault();

        const { dispatch } = this.props;
        dispatch(searchByTagAction(this.refs.searchInput.value));
    }

    deniedTag () {
        this.refs.searchInput.style.border = '2px solid #f00';
        setTimeout(() => {
            this.refs.searchInput.style.border = 'none';
        }, 2000);
    }

    componentDidMount () {
        this.props.dispatch(getPopularAction());
    }

    render () {

        const { foundedPhotos, deniedTag } = this.props.model;

        let searchResultItems = foundedPhotos.map((photo, i) => {
            return (
                <a
                    className="photo-list__item fancybox"
                    key={i}
                    href={photo.images.standard_resolution.url}
                    title={photo.caption && photo.caption.text || ''}>
                    <img src={photo.images.standard_resolution.url} />
                </a>
            )
        });

        if (deniedTag) {
            this.deniedTag();

            searchResultItems = (
                <div>
                    Don't try to search <strong>{this.refs.searchInput.value}</strong> anymore. <br/>
                    This tag is disabled by instagram.
                </div>
            );
        }

        return (
            <div className="search">
                <form className="search__form" onSubmit={::this.search}>
                    <input
                        type="text"
                        defaultValue={null}
                        ref="searchInput"
                        className="search__input"
                        placeholder="Search photo by Hashtag" />
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
        foundedPhotos: state.foundedPhotos,
        pagination: state.searchPagination,
        deniedTag: state.deniedTag
    }
}))(SearchPhotos);

