import '../manifest.json'
import 'locales/en/messages.json'
import 'locales/zh_CN/messages.json'
import 'locales/zh_TW/messages.json'
import 'images/icon16.png'
import 'images/icon24.png'
import 'images/icon32.png'
import 'images/icon48.png'

import { AppContainer } from 'react-hot-loader';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux'
import {Provider} from 'react-redux';
import App from 'components/App';
import {throttle} from 'lodash';
import {loadState, saveState} from 'localStorage';
import todoApp from 'reducers/index';

const persistedState = loadState();

const store = createStore(
  todoApp,
  persistedState
);

store.subscribe(throttle(() => {
  saveState({
    todos: store.getState().todos
  });
}, 1000));
store.subscribe(() =>
  console.log(store.getState())
);

const rootEl = document.getElementById('app');

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('components/App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('components/App').default;

    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </AppContainer>,
      rootEl
    );
  });
}

