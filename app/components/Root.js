import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
// import { createHistory } from 'history'

import App from './App';

// const history = useRouterHistory(createHistory)({
//   basename: '/popup.html'
// });

const Root = ({store}) => (
  <AppContainer>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/(:filter)" component={App} />
      </Router>
    </Provider>
  </AppContainer>
);

export default Root;
