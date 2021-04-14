import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";

import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReduce from "./redux/reducers"

import App from "./app/App";

const store = createStore(rootReduce,
    localStorage['redux-store']
        ? {
            ...JSON.parse(localStorage.getItem('redux-store')),
            nameString: null,
            dialogModal: {},
            warningModal: {}
        }
        : {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

store.subscribe(() => {
    localStorage['redux-store'] = JSON.stringify(store.getState())
})

const Application = () =>
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>;


ReactDOM.render(<Application/>, document.getElementById("app"));
