import { Link } from 'react-router-dom';
import ListErrors from '../ListErrors';
import React from 'react';
import { inject, observer } from 'mobx-react';

const btnStyle = {
  "backgroundColor": "5f0f0f",
  "color": "FFFFFF"
};

/**
 * Registration form for users
 */
@inject('authStore')
@observer
export default class Register extends React.Component {

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

  handleFirstNameChange = (ev) => {
    this.props.authStore.setFirstName(ev.target.value);
  };

  handleLastNameChange = (ev) => {
    this.props.authStore.setLastName(ev.target.value);
  };

  handleEmailChange = (ev) => {
    this.props.authStore.setEmail(ev.target.value);
  };

  handlePasswordChange = (ev) => {
    this.props.authStore.setPassword(ev.target.value);
  };

  handlePasswordCheckChange = (ev) => {
    const fieldValue = ev.target.value;
    this.setState({passwordValidationField: fieldValue});

    // set default class and handle class change as the field changes...
    // if the password validation check doesn't match the original password, set input to invalid
    let passwordValidationClass = "form-control form-control-sm";
    if (fieldValue !== "" && fieldValue !== this.props.authStore.values.password){
      passwordValidationClass = "form-control form-control-sm is-invalid";
    }

    this.setState({passwordValidationClass: passwordValidationClass});
  };

  handleGroupName = (ev) => {
    this.props.authStore.setGroupName(ev.target.value);
  };

  handleSubmitForm = (ev) => {
    ev.preventDefault();
    this.props.authStore
      .register()
      .then(() => this.props.history.replace('/login'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;
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

            <ListErrors errors={errors} />

            <form>
              <div className="form-group">

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={this.handleFirstNameChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={this.handleLastNameChange}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Group Name"
                    value={values.groupName}
                    onChange={this.handleGroupName}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Email (also login / username)"
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
                    className="btn btn-sm"
                    style={btnStyle}
                    onClick={this.handleSubmitForm}
                  >
                    Sign up
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
