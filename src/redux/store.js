import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const initialState = {};

const rootReducer = combineReducers({
    router: routerReducer
});

let middlewares;
if (process.env.NODE_ENV === 'development') {
    // When development is enabled allow debugging of redux changes with the "Redux DevTools".
    middlewares = composeWithDevTools();
}

const store = createStore(rootReducer, initialState, middlewares);

export { store, history };
