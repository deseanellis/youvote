import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loginRequired } from '../../functions';
import EditUserForm from '../forms/EditUserForm';
import Alert from '../componentSubs/Alert';

class BasicInformation extends Component {
  constructor() {
    super();

    this.state = {
      showAlert: true
    };

    this.hideAlert = this.hideAlert.bind(this);
  }

  componentDidMount() {
    const { history, match: { params } } = this.props;
    if (params.response) {
      if (['success', 'failed'].indexOf(params.response) === -1) {
        history.push('/basicinformation');
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, history } = this.props;
    loginRequired(loggedIn, prevProps, history);
  }

  render() {
    const { loggedIn, user, match: { params } } = this.props;
    if (loggedIn) {
      return (
        <div className="content-box">
          <div className="title">Basic Information</div>
          <div className="body">
            {params.response &&
              <Alert
                {...this.buildAlert.call(this, params.response)}
                show={this.state.showAlert}
                onClickHandler={this.hideAlert}
              />}
            <p style={{ marginTop: '5px' }}>
              Use the form below to update your personal information.<br />
              <i style={{ fontWeight: 'bold' }}>
                Please note that social network linked accounts (Google,
                Facebook, GitHub) information can only be view and not updated.
              </i>
            </p>
            <EditUserForm user={user} />
          </div>
        </div>
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

  buildAlert(response) {
    if (response === 'success') {
      return {
        type: 'success',
        title: 'Success:',
        message: 'Account information has been updated'
      };
    } else {
      return {
        type: 'danger',
        title: 'Error:',
        message: 'User basic information update failed'
      };
    }
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: state.user.loggedIn,
    user: state.user.user
  };
}

export default connect(mapStateToProps)(withRouter(BasicInformation));
