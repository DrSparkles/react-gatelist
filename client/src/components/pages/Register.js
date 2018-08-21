import { Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import { inject, observer } from 'mobx-react';
import UserDetailsForm from "../UserDetailsForm/UserDetailsForm";

/**
 * Registration form for users
 */
@inject('authStore')
@observer
export default class Register extends React.Component {

  handleSubmitForm = (ev) => {
    ev.preventDefault();
    this.props.authStore
      .register()
      .then(() => {
          this.props.history.replace('/login');
        }
      );
  };

  render() {

    const { errors } = this.props.authStore;

    return (

      <div id="Register">
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Create an account</h1>
            <p className="text-xs-center">
              <Link to="login">
                Have an account?
              </Link>
            </p>
          </div>
        </div>

        <ListErrors errors={errors} />

        <UserDetailsForm handleSaveUser={this.handleSubmitForm} />
      </div>

    );
  }
}
