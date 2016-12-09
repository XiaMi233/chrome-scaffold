import AddTodo from './AddTodo';
import VisibleTodoList from './VisibleTodoList';
import Footer from './Footer';

const TodoApp = () => (
  <form action="javascript:void(0)">
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </form>
);

export default TodoApp;
