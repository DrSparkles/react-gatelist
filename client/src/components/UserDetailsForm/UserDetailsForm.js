import React from 'react';
import { inject, observer } from 'mobx-react';

import './style.css';

/**
 * User Detail Form
 */
@inject('authStore')
@observer
class UserDetailsForm extends React.Component {

  editableUser = this.props.editableUser;
  editingProfile = (this.editableUser !== undefined);
  handleSaveUser = this.props.handleSaveUser;

  password;

  constructor(props) {
    super(props);
    this.state = {
      passwordValidationClass: "form-control form-control-sm",
      passwordValidationField: ""
    };
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
      this.props.userStore.currentUser.firstName = ev.target.value;
    }
    else {
      this.props.authStore.setFirstName(ev.target.value);
    }
  };

  handleLastNameChange = (ev) => {
    if (this.editingProfile){
      this.props.userStore.currentUser.lastName = ev.target.value;
    }
    else {
      this.props.authStore.setLastName(ev.target.value);
    }
  };

  handleEmailChange = (ev) => {
    if (this.editingProfile){
      this.props.userStore.currentUser.email = ev.target.value;
    }
    else {
      this.props.authStore.setEmail(ev.target.value);
    }
  };

  handlePasswordChange = (ev) => {

    this.password = ev.target.value;

    if (this.editingProfile){
      this.props.userStore.currentUser.firstName = ev.target.value;
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

    // if (this.editingProfile){
    // }
    // else {
    //
    // }
  };

  render() {
    const { values, inProgress } = this.props.authStore;
    const { editableUser } = this.props;

    const user = (editableUser !== undefined) ? editableUser : values;

    console.log('values inputUser user', values, editableUser, user);

    return (
      <div id='UserDetailForm'>
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">
            <form>
              <div className="form-group">

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={user.firstName}
                    onChange={this.handleFirstNameChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={user.lastName}
                    onChange={this.handleLastNameChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Email (also login / username)"
                    value={user.email}
                    onChange={this.handleEmailChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
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
                    disabled={inProgress}
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