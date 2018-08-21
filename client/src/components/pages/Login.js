import { withRouter, Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import { inject, observer } from 'mobx-react';

const btnStyle = {
  "backgroundColor": "5f0f0f",
  "color": "FFFFFF"
};

/**
 * Login form
 */
@inject('authStore','groupStore', 'routerStore')
@withRouter
@observer
export default class Login extends React.Component {

  /**
   * Clear the user fields when the form is done
   */
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore
      .login()
      .then(() => {

        // if user has no groups, go to the page to add groups...
        if (this.props.groupStore.getNumUserGroups === 0){
          this.props.routerStore.push('/groups');
        }

        // otherwise go to the home page
        else {
          //this.props.history.replace('/');
          this.props.routerStore.push('/');
        }
      });
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div id="Login">
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign In</h1>
            <p className="text-xs-center">
              <Link to="register">
                Need an account?
              </Link>
            </p>

            <ListErrors errors={errors} />

            <form>
              <div className="form-group">

                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={this.handleEmailChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={this.handlePasswordChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group text-center">
                  <button
                    onClick={this.handleSubmitForm}
                    type="button"
                    disabled={inProgress}
                    className="btn-text btn btn-sm"
                    style={btnStyle}
                  >
                    Sign in
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
