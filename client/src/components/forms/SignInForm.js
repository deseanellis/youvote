import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';

import LoginField from '../componentSubs/LoginField';
import SubmitButton from '../componentSubs/SubmitButton';

import { LOGIN_FORM_FIELDS } from '../formData';

import { validateLogin } from './validation';

class SignInForm extends Component {
  constructor() {
    super();

    this.state = {
      loader: false
    };
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
    return (
      <form
        onSubmit={this.props.handleSubmit(values => {
          this.props.loginUser(values, this.props.history);
          this.setState({ loader: true });
        })}
      >
        {this.renderFields(LOGIN_FORM_FIELDS)}
        <div className="row form">
          <div className="col-sm-10 offset-sm-1">
            <SubmitButton classes="main submit" loader={this.state.loader}>
              Login
            </SubmitButton>
          </div>
          <div className="col-sm-10 offset-sm-1 text-center">
            <Link to="/forgotpassword">Forgot your password?</Link>
          </div>
        </div>
      </form>
    );
  }

  renderFields(fields) {
    return fields.map((field, index) => {
      return (
        <div key={index} className="row form">
          <Field
            key={index}
            id={field.name}
            name={field.name}
            placeholder={field.required ? field.label + ' *' : field}
            type={field.type}
            component={LoginField}
          />
        </div>
      );
    });
  }
}

function mapStateToProps(state) {
  return {
    requestReceived: state.user.requestReceived
  };
}

SignInForm = connect(mapStateToProps, actions)(withRouter(SignInForm));

export default reduxForm({
  validate: validateLogin,
  form: 'signinForm'
})(SignInForm);
