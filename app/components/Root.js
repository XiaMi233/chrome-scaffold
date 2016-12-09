import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from './App';

const Root = ({store}) => (
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>
);

export default Root;
