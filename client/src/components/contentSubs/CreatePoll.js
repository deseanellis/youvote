import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CreatePollForm from '../forms/CreatePollForm';
import Alert from '../componentSubs/Alert';
import * as actions from '../../actions';

import { loginRequired } from '../../functions';
import NotFound from './NotFound';

class CreatePoll extends Component {
  constructor() {
    super();

    this.state = {
      showAlert: true
    };

    this.hideAlert = this.hideAlert.bind(this);
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    if (params.mode === 'edit') {
      this.props.getEditPoll(params.id);
    }
  }
  componentDidUpdate(prevProps) {
    const { loggedIn, history } = this.props;
    loginRequired(loggedIn, prevProps, history);

    if (this.props.requestReceived !== prevProps.requestReceived) {
      if (this.props.requestReceived > 0) {
        this.setState({
          showAlert: true
        });
      }
    }
  }

  render() {
    const { loggedIn, poll, match: { params } } = this.props;
    if (loggedIn) {
      if (
        (params.mode === 'edit' && poll.currentPoll) ||
        params.mode === 'create'
      ) {
        const pageTitle =
          params.mode === 'edit'
            ? `Edit Poll: ${poll.currentPoll.title}`
            : 'Create a New Poll';
        return (
          <div className="content-box">
            <div className="title">
              {pageTitle}
            </div>
            <div className="body">
              {poll.requestReceived > 0 &&
                <Alert
                  {...this.buildAlert.call(this, poll, params.mode)}
                  show={this.state.showAlert}
                  onClickHandler={this.hideAlert}
                />}

              <CreatePollForm
                mode={params.mode}
                options={poll.currentPoll ? poll.currentPoll.options : []}
                id={poll.currentPoll ? poll.currentPoll._id : null}
                isPrivate={
                  poll.currentPoll ? poll.currentPoll.isPrivate : false
                }
              />
            </div>
          </div>
        );
      } else if (poll.currentPoll === false) {
        return <NotFound />;
      } else {
        return <div />;
      }
    } else {
      return <div />;
    }
  }

  hideAlert() {
    this.setState({
      showAlert: false
    });
  }

  buildAlert(resObj, mode) {
    if (!resObj.error && !resObj.warning) {
      return {
        type: 'success',
        title: 'Success:',
        message: `Poll ${mode === 'edit'
          ? 'updated'
          : 'created'}. Please click here to view `,
        link: {
          title: resObj.currentPoll.title,
          href: `/poll/single/${resObj.currentPoll.hashId}`
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
    poll: state.poll,
    requestReceived: state.poll.requestReceived
  };
}

export default connect(mapStateToProps, actions)(withRouter(CreatePoll));
