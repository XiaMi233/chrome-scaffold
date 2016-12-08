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
import App from './app';

const rootEl = document.getElementById('app');
// ReactDOM.render(
//   <AppContainer>
//     <App />
//   </AppContainer>,
//   rootEl
// );
//
// if (module.hot) {
//   module.hot.accept('./app', () => {
//     // If you use Webpack 2 in ES modules mode, you can
//     // use <App /> here rather than require() a <NextApp />.
//     const NextApp = require('./app').default;
//     ReactDOM.render(
//       <AppContainer>
//         <NextApp />
//       </AppContainer>,
//       rootEl
//     );
//   });
// }

import {createStore, combineReducers} from 'redux'

const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id != action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

//combineReducers内部实现
// const combineReducers = (reducers) => {
//   return (state = {}, action) => {
//     return Object.keys(reducers).reduce(
//       (nextState, key) => {
//         nextState[key] = reducers[key](
//           state[key],
//           action
//         );
//         return nextState;
//       },
//       {}
//     );
//   };
// };

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

let nextTodoId = 0;

class TodoApp extends Component {
  render() {
    return (
      <div>
        <button
          onClick={() => {
            store.dispatch({
              type: 'ADD_TODO',
              text: 'test',
              id: nextTodoId++
            })
          }}
        >
          addTodo
        </button>
        <ul>
          {this.props.todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
        </ul>
      </div>
    );
  };
}

const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos} />,
    rootEl
  );
};

store.subscribe(render);
render();
