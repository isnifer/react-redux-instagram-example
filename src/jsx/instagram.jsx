import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Provider } from 'react-redux';
import store from '../app/store';

// Page handlers
import App from './App';
import Timeline from './Timeline';
import SearchPhotos from './SearchPhotos';
import SearchUsers from './SearchUsers';
import Profile from './Profile';
import Followers from './Followers';

import getTimelineAction from '../app/actions/timeline';

const token = localStorage.accessToken;
const userId = localStorage.userId;

render((
    <Provider store={store}>
        <Router>
            <Route path="/" component={App}>
                <IndexRoute component={Timeline} />
                <Route path="timeline" name="Timeline" component={Timeline} />
                <Route path="photos" name="Photos" component={SearchPhotos} />
                <Route path="users" name="People" component={SearchUsers} />
                <Route path="profile/:id" name="Profile" component={Profile} />
                <Route path="followed-by/:id" name="followed-by" component={Followers} />
                <Route path="follows/:id" name="follows" component={Followers} />
            </Route>
        </Router>
    </Provider>
), document.querySelector('.page'));
