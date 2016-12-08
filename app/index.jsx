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

const FilterLink = ({
  filter,
  currentFilter,
  children
}) => {
  if (filter === currentFilter) {
    return (<span>{children}</span>);
  }
  return (
    <a href="#"
       onClick={e => {
         e.preventDefault();
         store.dispatch({
           type: 'SET_VISIBILITY_FILTER',
           filter
         })
       }}
    >
      {children}
    </a>

  );
};

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
  }
};

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ?
        'line-through' : 'none'
    }}
  >
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

class TodoApp extends Component {
  render() {
    const {
      todos,
      visibilityFilter
    } = this.props;

    const filterTodos = getVisibleTodos(todos, visibilityFilter);
    return (
      <form action="javascript:void(0)">
        <input type="text" ref={node => {
          this.input = node;
        }} />
        <button type="submit"
          onClick={() => {
            if (this.input.value) {
              store.dispatch({
                type: 'ADD_TODO',
                text: this.input.value,
                id: nextTodoId++
              });
              this.input.value = '';
            }
          }}
        >
          addTodo
        </button>
        <TodoList
          todos={filterTodos}
          onTodoClick={id =>
            store.dispatch({
              type: 'TOGGLE_TODO',
              id
            })
          }
        />
        <p>
          Show:
          {' '}
          <FilterLink
            filter="SHOW_ALL"
            currentFilter={visibilityFilter}
          >
            All
          </FilterLink>
          {' '}
          <FilterLink
            filter="SHOW_ACTIVE"
            currentFilter={visibilityFilter}
          >
            Active
          </FilterLink>
          {' '}
          <FilterLink
            filter="SHOW_COMPLETED"
            currentFilter={visibilityFilter}
          >
            Completed
          </FilterLink>
        </p>
      </form>
    );
  };
}

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    rootEl
  );
};

store.subscribe(render);
render();
