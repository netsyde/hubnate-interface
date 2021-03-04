import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import routes from '../routes';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'mobx-react';
import rootStore from '@store/RootStore'
const stores = { rootStore };
const browserHistory = createBrowserHistory();

export default class App extends Component {
  render() {
    return (
      <Provider { ...stores }>
        <Router history={browserHistory}>
          {renderRoutes(routes)}
        </Router>
      </Provider>
    );
  }
}