import ReactDOM from 'react-dom';
import configureStore from 'configureStore';
import 'configureChromeExtension';
import Root from 'components/Root';

const store = configureStore();
const rootEl = document.getElementById('app');

ReactDOM.render(
  <Root store={store} />,
  rootEl
);

if (module.hot) {
  module.hot.accept('components/Root', () => {
    const Root = require('components/Root').default;

    ReactDOM.render(
      <Root store={store} />,
      rootEl
    );
  });
}
