import React from 'react';
import { Redirect, Router, Route, Switch } from 'react-router-dom';

import { history } from '../redux/store';

import { Dashboard } from '../containers/Dashboard';

const AppRouter = () => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
                <Route exact path="/dashboard" component={Dashboard} />
            </Switch>
        </Router>
    );
};
export default AppRouter;
