import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

/**
 * Routing wrapper for private routes; if the user is logged in, display the passed in component
 * else redirect to home
 */
@inject('userStore', 'commonStore')
@observer
export default class PrivateRoute extends React.Component {
  render() {
    const { userStore, ...restProps } = this.props;
    if (userStore.currentUser) return <Route {...restProps} />;
    return <Redirect to="/" />;
  }
}
