import React, { Component } from 'react';
import DataGrid from '../componentSubs/DataGrid';

class SearchResults extends Component {
  constructor() {
    super();

    this.state = {
      headers: [
        { key: 'title', label: 'Title', formatFunction: this.addTitleLinks }
      ]
    };
  }
  render() {
    const { state, props: { polls } } = this;
    return (
      <div className="content-body">
        <div className="content-box">
          <div className="title">Search Results</div>
          <div className="body">
            <DataGrid headers={state.headers} rows={polls} canSort={false} />
          </div>
        </div>
      </div>
    );
  }

  addTitleLinks(title, hashId) {
    return `<a href='/poll/single/${hashId}'>${title}</a>`;
  }
}

export default SearchResults;
