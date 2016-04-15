import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history'
import { Provider } from 'react-redux';
import store from './store';

// Pages
import App from './handlers/App';
import Timeline from './handlers/Timeline';
import SearchPhotos from './handlers/SearchPhotos';
import SearchUsers from './handlers/SearchUsers';
import Profile from './handlers/Profile';
import Followers from './handlers/Followers';
import PageNotFound from './handlers/PageNotFound';

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});
render((
    <Provider store={store}>
        <Router history={appHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Timeline} />
                <Route path="timeline" name="Timeline" component={Timeline} />
                <Route path="photos" name="Photos" component={SearchPhotos} />
                <Route path="users" name="People" component={SearchUsers} />
                <Route path="profile/:id" name="Profile" component={Profile} />
                <Route path="followed-by/:id" name="followed-by" component={Followers} />
                <Route path="follows/:id" name="follows" component={Followers} />
                <Route path="*" name="not-found" component={PageNotFound} />
            </Route>
        </Router>
    </Provider>
), document.querySelector('.page'));
