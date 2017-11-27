import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import RegistrationForm from '../forms/RegistrationForm';
import SignInForm from '../forms/SignInForm';

import SocialOptions from '../componentSubs/SocialOptions';
import Alert from '../componentSubs/Alert';

const registerPage = {
  view: 'register',
  title: 'Sign Up For Free'
};

const signinPage = {
  view: 'signin',
  title: 'Sign Into Your Account'
};

class Register extends Component {
  constructor() {
    super();

    let { view, title } = registerPage;
    this.state = {
      view,
      title,
      showAlert: true
    };

    this.hideAlert = this.hideAlert.bind(this);
  }

  componentDidUpdate(prevProps) {
    let { registry, user } = this.props;
    if (registry.registered !== prevProps.registry.registered) {
      if (registry.registered) {
        this.changeView(signinPage);
      }
    }

    if (user.requestReceived !== prevProps.user.requestReceived) {
      if (user.requestReceived > 0) {
        this.setState({
          showAlert: true
        });
      }
    }
  }

  componentDidMount() {
    if (this.props.view) {
      this.setState({
        view: this.props.view
      });
    }

    if (this.props.title) {
      this.setState({
        title: this.props.title
      });
    }
  }

  render() {
    let { registry, user } = this.props;
    let { state } = this;
    return (
      <div className="login-form-box">
        <div className="container-fluid">
          <div className="row logo">
            <div className="col-sm-12">
              <img
                src="images/youvote_logo.png"
                className="img-fluid"
                alt="logo"
              />
            </div>
          </div>
          <div className="row options">
            <div
              onClick={() => {
                this.props.history.push('/register');
                this.changeView(registerPage);
              }}
              className={`col-sm-5 offset-sm-1 ${state.view === 'register'
                ? 'active'
                : 'not-active'}`}
            >
              Sign Up
            </div>
            <div
              onClick={() => {
                this.props.history.push('/signin');
                this.changeView(signinPage);
              }}
              className={`col-sm-5 ${state.view === 'signin'
                ? 'active'
                : 'not-active'}`}
            >
              Log In
            </div>
          </div>
          <div className="row title">
            <div className="col-sm-12">
              {state.title}
            </div>
          </div>
          {registry.requestReceived > 0 &&
            <Alert
              {...this.buildAlert(registry)}
              show={this.state.showAlert}
              onClickHandler={this.hideAlert}
            />}
          {user.requestReceived > 0 &&
            <Alert
              {...this.buildAlert(user)}
              show={this.state.showAlert}
              onClickHandler={this.hideAlert}
            />}
          {this.getForm(state.view)}
          <div className="row social-title">
            <div className="col-sm-12">Or Sign In With:</div>
          </div>
          <SocialOptions />
        </div>
      </div>
    );
  }

  hideAlert() {
    this.setState({
      showAlert: false
    });
  }

  buildAlert(resObj) {
    if (!resObj.error && !resObj.warning) {
      return {
        type: 'success',
        title: 'Success:',
        message: `Please check your <strong>inbox/spam</strong> folders to validate your e-mail address (<strong>${resObj.email}</strong>).`
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

  getForm(view) {
    switch (view) {
      case 'register':
        return <RegistrationForm />;
      case 'signin':
        return <SignInForm />;
      default:
        return <div />;
    }
  }

  changeView(viewObj) {
    let { view, title } = viewObj;
    this.setState({
      view,
      title
    });
  }
}

function mapStateToProps(state) {
  return {
    registry: state.registry,
    user: state.user
  };
}

export default connect(mapStateToProps)(withRouter(Register));
