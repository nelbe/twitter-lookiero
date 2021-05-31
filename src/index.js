import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './redux/store';
import { App } from './App/App';

import './index.css';

const app = (store) => (
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
);

ReactDOM.render(app(store), document.getElementById('root'));
