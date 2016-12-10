import AddTodo from './AddTodo';
import VisibleTodoList from './VisibleTodoList';
import Footer from './Footer';

const TodoApp = ({ params }) => (
  <form action="javascript:void(0)">
    <AddTodo />
    <VisibleTodoList
      filter={params.filter || 'all'}
    />
    <Footer />
  </form>
);

export default TodoApp;
