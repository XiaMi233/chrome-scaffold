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
import {Provider, connect} from 'react-redux';
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

let nextTodoId = 0;

const addTodo = (text) => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
});

const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
});


let AddTodo = ({
  dispatch
}) => {
  let input;
  return (
    <div>
      <input type="text" ref={node => {
        input = node;
      }} />
      <button
        type="submit"
        onClick={() => {
          if (input.value) {
            dispatch(addTodo(input.value));
          }
          input.value = '';
        }}
      >
        addTodo
      </button>
    </div>
  );
};

AddTodo = connect()(AddTodo);

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return (<span>{children}</span>);
  }
  return (
    <a href="#"
       onClick={e => {
         e.preventDefault();
         onClick();
       }}
    >
      {children}
    </a>
  );
};

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
};
const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () =>
      dispatch(
        setVisibilityFilter(ownProps.filter)
      )
  }
};
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

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

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter="SHOW_ALL"
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter="SHOW_ACTIVE"
    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter="SHOW_COMPLETED"
    >
      Completed
    </FilterLink>
  </p>
);

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

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: id =>
      dispatch(toggleTodo(id))
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

const TodoApp = () => (
  <form action="javascript:void(0)">
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </form>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  rootEl
);
