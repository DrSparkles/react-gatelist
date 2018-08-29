import React from 'react';
import { inject, observer } from 'mobx-react';

import './style.css';

/**
 * User Detail Form
 */
@inject('authStore', 'userStore')
@observer
class UserDetailsForm extends React.Component {

  editableUser = this.props.editableUser;

  editingProfile = (this.editableUser !== undefined);

  password;

  constructor(props) {
    super(props);
    this.state = {
      passwordValidationClass: "form-control form-control-sm",
      passwordValidationField: ""
    };
  }

  handleSaveUser = (ev) => {
    this.props.handleSaveUser(ev);
    this.setState({passwordValidationField: ''});
  };

  /**
   * Load values for user
   */
  componentWillMount(){
    if (this.editingProfile){
      this.props.userStore.setEditingUserFromCurrentUser();
    }
  }

  /**
   * Clear the user fields when the form is done
   */
  componentWillUnmount() {
    this.props.authStore.reset();
    this.setState({
      passwordValidationClass: "form-control form-control-sm",
      passwordValidationField: ""
    });
  }

  getButtonText = () => {
    if (this.editingProfile){
      return 'Save';
    }
    return 'Sign up';
  };

  handleFirstNameChange = (ev) => {
    if (this.editingProfile){
      console.log('trying to edit firstname', ev.target.value);
      this.props.userStore.editingUser.firstName = ev.target.value;
    }
    else {
      this.props.authStore.setFirstName(ev.target.value);
    }
  };

  handleLastNameChange = (ev) => {
    if (this.editingProfile){
      this.props.userStore.editingUser.lastName = ev.target.value;
    }
    else {
      this.props.authStore.setLastName(ev.target.value);
    }
  };

  handleEmailChange = (ev) => {
    if (this.editingProfile){
      this.props.userStore.editingUser.email = ev.target.value;
    }
    else {
      this.props.authStore.setEmail(ev.target.value);
    }
  };

  handlePasswordChange = (ev) => {
    this.password = ev.target.value;

    if (this.editingProfile){
      this.props.userStore.password = ev.target.value;
      this.props.userStore.editingUser.password = ev.target.value;
    }
    else {
      this.props.authStore.setPassword(ev.target.value);
    }
  };

  handlePasswordCheckChange = (ev) => {

    const fieldValue = ev.target.value;
    this.setState({passwordValidationField: fieldValue});

    // set default class and handle class change as the field changes...
    // if the password validation check doesn't match the original password, set input to invalid
    let passwordValidationClass = "form-control form-control-sm";
    if (fieldValue !== "" && fieldValue !== this.password){
      passwordValidationClass = "form-control form-control-sm is-invalid";
    }

    this.setState({passwordValidationClass: passwordValidationClass});

  };

  render() {
    let firstName, lastName, email, password = '';
    let loading;
    if (this.editingProfile){
      console.log('setting user var');
      firstName = this.props.userStore.editingUser.firstName;
      lastName = this.props.userStore.editingUser.lastName;
      email = this.props.userStore.editingUser.email;
      password = this.props.userStore.editingUser.password;
      loading = this.props.userStore.loading;
    }
    else {
      firstName = this.props.authStore.values.firstName;
      lastName = this.props.authStore.values.lastName;
      email = this.props.authStore.values.email;
      password = this.props.authStore.values.password;
      loading = this.props.authStore.loading;
    }

    console.log('this.props.userStore.editingUser', this.props.userStore.editingUser);
    console.log('firstName, lastName, email, loading', firstName, lastName, email, loading);

    return (
      <div id='UserDetailForm'>
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">
            <form>
              <div className="form-group">

                <div className="form-group">
                  <input
                    id='firstName'
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={this.handleFirstNameChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    id='lastName'
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={this.handleLastNameChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    id='email'
                    type="text"
                    placeholder="Email (also login / username)"
                    value={email}
                    onChange={this.handleEmailChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    id='password'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handlePasswordChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    id="passwordValidationField"
                    type="password"
                    placeholder="Double Check Password"
                    value={this.state.passwordValidationField}
                    onChange={this.handlePasswordCheckChange}
                    className={this.state.passwordValidationClass}
                  />
                </div>

                <div className="form-group text-center">
                  <button
                    type="button"
                    disabled={loading}
                    className="btn btn-sm btn-text"
                    onClick={this.handleSaveUser}>
                    {this.getButtonText()}
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

export default UserDetailsForm;