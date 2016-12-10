import {combineReducers} from 'redux';
import todos from './todos';

const todoApp = combineReducers({
  todos
});

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

export default todoApp;
