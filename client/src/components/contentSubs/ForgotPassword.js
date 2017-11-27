import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

import GenericField from '../componentSubs/GenericField';
import SubmitButton from '../componentSubs/SubmitButton';
import Alert from '../componentSubs/Alert';

import * as actions from '../../actions';
import { validateForgotPassword } from '../forms/validation';

class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      showAlert: true,
      loader: false,
      emailAddressee: ''
    };

    this.hideAlert = this.hideAlert.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (user.requestReceived !== prevProps.user.requestReceived) {
      if (user.requestReceived > 0) {
        this.setState({
          loader: false,
          showAlert: true
        });
      }
    }
  }

  render() {
    const { handleSubmit, user } = this.props;
    return (
      <div className="content-box">
        <div className="title">Forgot Your Password?</div>
        {user.requestReceived > 0 &&
          <Alert
            {...this.buildAlert.call(this, user)}
            show={this.state.showAlert}
            onClickHandler={this.hideAlert}
          />}
        <p style={{ marginTop: '5px' }}>
          No problem. Enter your email here and we'll send you a link to reset
          it.
        </p>
        <form
          onSubmit={handleSubmit(values => {
            this.props.forgotPassword(values.email);
            this.setState({ emailAddressee: values.email });
            this.setState({ loader: true });
          })}
        >
          <div className="container-fluid">
            <div className="row form">
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="E-Mail *"
                component={GenericField}
              />
            </div>
            <div className="row form">
              <div className="col-sm-10 offset-sm-1">
                <SubmitButton classes="main submit" loader={this.state.loader}>
                  Reset My Password
                </SubmitButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  hideAlert() {
    this.setState({
      showAlert: false
    });
  }

  buildAlert(resObj) {
    if (!resObj.warning && !resObj.error) {
      return {
        type: 'success',
        title: 'Success:',
        message: `Password reset request e-mail has been sent to: <b>${this
          .state.emailAddressee}</b>`
      };
    }

    if (resObj.warning) {
      return {
        type: 'warning',
        title: 'Warning:',
        message: resObj.warning
      };
    }

    if (resObj.error) {
      return {
        type: 'danger',
        title: 'Error:',
        message: resObj.error
      };
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

ForgotPassword = connect(mapStateToProps, actions)(ForgotPassword);

export default reduxForm({
  form: 'forgotPasswordForm',
  validate: validateForgotPassword
})(ForgotPassword);
