import React, { Component } from 'react';
import { connect } from 'react-redux';

import dateFormat from 'dateformat';

import * as actions from '../../actions';

import DataGrid from '../componentSubs/DataGrid';

const PAGE_COUNT = 10;

class RecentPolls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [
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
      ]
    };
  }

  componentDidMount() {
    this.props.getAllPolls(true, { limit: PAGE_COUNT });
  }

  render() {
    const { state: { headers }, props: { polls } } = this;
    return (
      <div className="content-box">
        <div className="title">Recent Polls</div>
        <div className="body">
          <p>
            Below are a list of the <strong> Ten (10) </strong> most recent
            polls.{' '}
          </p>
          <DataGrid
            headers={headers}
            rows={polls || null}
            pageRowCount={PAGE_COUNT}
            canSort={false}
          />
        </div>
      </div>
    );
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
}

function mapStateToProps(state) {
  return {
    polls: state.poll.polls
  };
}

export default connect(mapStateToProps, actions)(RecentPolls);
