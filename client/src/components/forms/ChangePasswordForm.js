import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';

import GenericField from '../componentSubs/GenericField';
import SubmitButton from '../componentSubs/SubmitButton';

import { validateChangePassword } from './validation';

class ChangePasswordForm extends Component {
  constructor() {
    super();

    this.state = {
      loader: false
    };

    this.formSubmitHandler = this.formSubmitHandler.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.requestReceived !== prevProps.requestReceived) {
      if (this.props.requestReceived > 0) {
        this.setState({
          loader: false
        });
      }
    }
  }

  render() {
    const { user, handleSubmit, mode } = this.props;
    return (
      <form
        onSubmit={handleSubmit(values => {
          if (mode === 'recovery') {
            this.formSubmitHandler(values, false);
          } else {
            this.formSubmitHandler(values, user.isSocial);
          }
          this.setState({ loader: true });
        })}
      >
        <div className="container-fluid">
          <div className="row form">
            {mode === 'normal' &&
              <Field
                id="currentPassword"
                name="currentPassword"
                placeholder="Current Password *"
                type="password"
                component={GenericField}
                disabled={mode === 'normal' ? user.isSocial : false}
              />}
          </div>
          <div className="row form group">
            <p className="zero-bottom">
              <strong>Enter your new password and confirm below.</strong>
            </p>
            <div className="col-sm-12">
              <div className="row form minimize-fields">
                <Field
                  id="password"
                  name="password"
                  placeholder="New Password *"
                  type="password"
                  component={GenericField}
                  disabled={mode === 'normal' ? user.isSocial : false}
                />
              </div>
              <div className="row form minimize-fields">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password *"
                  type="password"
                  component={GenericField}
                  disabled={mode === 'normal' ? user.isSocial : false}
                />
              </div>
            </div>
          </div>
          <div className="row form">
            <div className="col-sm-10 offset-sm-1">
              <SubmitButton classes="main submit" loader={this.state.loader}>
                Change My Password
              </SubmitButton>
            </div>
          </div>
        </div>
      </form>
    );
  }

  formSubmitHandler(values, isSocial) {
    if (isSocial) {
      return false;
    }
    if (this.props.mode === 'recovery') {
      this.props.changePassword(
        null,
        values.password,
        true,
        this.props.userEmail
      );
    } else {
      this.props.changePassword(
        values.currentPassword,
        values.password,
        null,
        null
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    requestReceived: state.user.requestReceived,
    user: state.user.user
  };
}

ChangePasswordForm = connect(mapStateToProps, actions)(ChangePasswordForm);

export default reduxForm({
  form: 'changePasswordForm',
  validate: validateChangePassword
})(ChangePasswordForm);
