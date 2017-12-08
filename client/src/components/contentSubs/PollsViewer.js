import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import _ from 'lodash';
import ReactModal from 'react-modal';
import dateFormat from 'dateformat';

import * as actions from '../../actions';

import DataGrid from '../componentSubs/DataGrid';
import TableCheckbox from '../componentSubs/TableCheckbox';
import Alert from '../componentSubs/Alert';

import { loginRequired } from '../../functions';

const PAGE_COUNT = 10;

class PollsViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: true,
      showModal: false,
      loader: false,
      title: 'View All Polls',
      headers: [
        { key: 'actions', label: '...', data: false },
        { key: 'title', label: 'Title', formatFunction: this.addTitleLinks },
        {
          key: 'lastResponded',
          label: 'Last Responded',
          formatFunction: this.formatDates
        },
        {
          key: 'voterCount',
          label: 'Responses',
          style: { textAlign: 'right' }
        }
      ],
      actions: {
        key: 'actions',
        component: <TableCheckbox />,
        function: this.props.addToPollList
      },
      sortFunction: this.sortHandler.bind(this),
      sortStatus: { field: 'dateCreated', sorted: -1 }
    };

    this.setTitle = this.setTitle.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    //this.sortHandler = this.sortHandler.bind(this);
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    var headers = [...this.state.headers];

    switch (params.mode) {
      case 'personal':
        this.setTitle('My Polls');
        this.props.getAllPolls(false);
        break;
      case 'voted':
        this.setTitle('Polls Voted On');
        this.props.getPollsVotedOn();
        _.remove(headers, n => {
          return n.key === 'actions';
        });
        break;
      case 'popular':
        this.setTitle(
          '<i class="fa fa-fire" aria-hidden="true"></i> Most Popular Polls'
        );
        this.props.getAllPolls(true, { field: 'voterCount', sorted: -1 });
        _.remove(headers, n => {
          return n.key === 'actions';
        });
        break;
      default:
        this.setTitle('All Polls');
        this.props.getAllPolls(true);
        _.remove(headers, n => {
          return n.key === 'actions';
        });
    }

    this.setState({
      headers
    });
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, history, match: { params } } = this.props;

    if (params.mode === 'personal' || params.mode === 'voted') {
      loginRequired(loggedIn, prevProps, history);
    }

    if (this.props.requestReceived !== prevProps.requestReceived) {
      if (this.props.requestReceived > 0) {
        this.setState({
          showAlert: true
        });

        if (!this.props.polls) {
          this.setState({ loader: false, showModal: false });
          this.props.getAllPolls(false);
        }
      }
    }
  }
  render() {
    const { state } = this;
    const { poll, polls, pollList, match: { params } } = this.props;
    return (
      <div className="content-box">
        <div
          className="title"
          dangerouslySetInnerHTML={{ __html: state.title }}
        />
        <div className="body">
          {poll.requestReceived > 0 &&
            <Alert
              {...this.buildAlert.call(this, poll)}
              show={this.state.showAlert}
              onClickHandler={this.hideAlert}
            />}
          {params.mode === 'personal' &&
            <div className="bulk-actions">
              <select name="bulkCommands">
                <option value="delete">Delete</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (pollList.length > 0) {
                    this.setState({ showModal: true });
                  } else {
                    return false;
                  }
                }}
              >
                Submit
              </button>
            </div>}
          <DataGrid
            headers={state.headers}
            rows={polls || null}
            actions={state.actions}
            sortFunction={state.sortFunction}
            pageRowCount={PAGE_COUNT}
            currentPage={Number(params.page) || 1}
            view={params.mode}
            paginate={true}
            canSort={params.mode === 'popular' ? false : true}
            sortStatus={state.sortStatus}
          />
          <ReactModal
            isOpen={state.showModal}
            contentLabel="Minimal Modal Example"
            className="modalOverwrite"
            overlayClassName="modalOverlayOverwrite"
          >
            <h5>Delete Polls</h5>
            <p>{`Are you sure you want to delete ${pollList.length > 1
              ? 'these polls'
              : 'this poll'}.`}</p>
            <div className="modal-btn-group">
              <button
                className="btn--delete-poll"
                onClick={() => this.deletePollHandler.call(this, pollList)}
              >
                Delete{' '}
                <i
                  className="fa fa-circle-o-notch fa-spin fa-fw"
                  style={{
                    display: this.state.loader ? 'inline-block' : 'none'
                  }}
                />
              </button>
              <button
                className="btn--close-modal"
                onClick={() => this.handleCloseModal.call(this)}
              >
                Close Modal
              </button>
            </div>
          </ReactModal>
        </div>
      </div>
    );
  }

  sortHandler(field, mode) {
    let sortStatus = {};
    if (this.state.sortStatus.field === field) {
      sortStatus = {
        field,
        sorted: this.state.sortStatus.sorted === 1 ? -1 : 1
      };
    } else {
      sortStatus = { field, sorted: 1 };
    }
    switch (mode) {
      case 'personal':
        this.props.history.push('/poll/viewer/personal');
        this.props.getAllPolls(false, sortStatus);
        break;
      case 'voted':
        this.props.getPollsVotedOn(sortStatus);
        this.props.history.push('/poll/viewer/voted');
        break;
      default:
        this.props.getAllPolls(true, sortStatus);
        this.props.history.push('/poll/viewer/all');
    }

    this.setState({ sortStatus });
  }

  deletePollHandler(polls) {
    this.setState({ loader: true });
    this.props.deletePolls(polls);
  }

  handleCloseModal() {
    this.setState({
      showModal: false
    });
  }

  setTitle(title) {
    this.setState({
      title
    });
  }

  formatDates(date) {
    if (!date) {
      return 'No reponses';
    }
    return dateFormat(date, 'dd-mmm-yy (hh:MM tt)');
  }

  addTitleLinks(title, hashId) {
    return `<a href='/poll/single/${hashId}'>${title}</a>`;
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
        message: `Poll(s) deleted.`
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
    poll: state.poll,
    polls: state.poll.polls,
    pollList: state.poll.pollList,
    requestReceived: state.poll.requestReceived,
    loggedIn: state.user.loggedIn
  };
}

export default connect(mapStateToProps, actions)(withRouter(PollsViewer));
