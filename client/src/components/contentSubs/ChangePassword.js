import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import NotFound from './NotFound';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import Alert from '../componentSubs/Alert';

import { loginRequired } from '../../functions';

const validateChangePasswordURI = async obj => {
  try {
    const res = await axios.post('/api/validate/changepassworduri', obj);
    if (res.data.success) {
      return res.data;
    }
  } catch (e) {
    return { success: false };
  }

  return { success: false };
};

class ChangePassword extends Component {
  constructor() {
    super();

    this.state = {
      showAlert: true,
      validRequest: true
    };

    this.hideAlert = this.hideAlert.bind(this);
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    if (params.code && params.email) {
      //Validate Link Information
      var res = await validateChangePasswordURI({
        code: params.code,
        email: params.email
      });

      if (!res.success) {
        this.setState({ validRequest: false });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, history, user, match: { params } } = this.props;
    if (!params.code) {
      loginRequired(loggedIn, prevProps, history);
    }

    if (user.requestReceived !== prevProps.user.requestReceived) {
      if (user.requestReceived > 0) {
        this.setState({
          showAlert: true
        });
      }
    }
  }

  render() {
    const { loggedIn, user, match: { params } } = this.props;
    if (loggedIn || (params.code && this.state.validRequest)) {
      return (
        <div className="content-box">
          <div className="title">Change Password</div>
          <div className="body">
            {user.requestReceived > 0 &&
              <Alert
                {...this.buildAlert.call(this, user)}
                show={this.state.showAlert}
                onClickHandler={this.hideAlert}
              />}
            <p style={{ marginTop: '5px' }}>
              Use the form below to change your password.<br />
              {params.code === 'normal' &&
                <span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                  For security purposes, you will be required to enter your
                  current password.<br />If you cannot remember your password
                  you can click <Link to="/forgotpassword">here</Link> to start
                  the password recovery process.
                </span>}
            </p>
            <ChangePasswordForm
              mode={params.code ? 'recovery' : 'normal'}
              userEmail={params.email || null}
            />
          </div>
        </div>
      );
    } else if (!this.state.validRequest) {
      return (
        <NotFound
          title="400 Bad Request"
          message="This request has either been expended, expired or is in invalid."
        />
      );
    } else {
      return <div />;
    }
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
        message: `User password changed. Logout and log back in to verify `,
        link: {
          title: 'Logout',
          href: `/api/user/logout`
        }
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
    loggedIn: state.user.loggedIn,
    user: state.user
  };
}

export default connect(mapStateToProps)(withRouter(ChangePassword));
