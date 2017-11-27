import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DataGrid extends Component {
  render() {
    if (!this.props.headers || this.props.rows === undefined) {
      throw new Error('Header or rows not provided');
    }
    const {
      headers,
      rows,
      actions,
      sortFunction,
      pageRowCount,
      currentPage,
      view,
      paginate,
      canSort,
      sortStatus
    } = this.props;
    return (
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              {this.buildHeaders(
                headers,
                canSort,
                view,
                sortFunction,
                sortStatus
              )}
            </tr>
          </thead>
          <tbody>
            {!rows &&
              <tr>
                <td colSpan={headers.length} style={{ textAlign: 'center' }}>
                  <i className="fa fa-circle-o-notch fa-spin fa-fw" />
                </td>
              </tr>}
            {rows &&
              (rows.length > 0 &&
                this.buildDataRows(
                  headers,
                  rows,
                  actions,
                  pageRowCount,
                  currentPage,
                  paginate
                ))}
            {rows &&
              (rows.length === 0 &&
                <tr>
                  <td colSpan={headers.length} style={{ textAlign: 'center' }}>
                    No information found
                  </td>
                </tr>)}
          </tbody>
        </table>
        {rows &&
          (paginate &&
            <nav>
              <ul className="pagination justify-content-end">
                {this.getPages(rows, pageRowCount, currentPage, view)}
              </ul>
            </nav>)}
      </div>
    );
  }

  buildHeaders(headers, canSort, view, sortFunction, sortStatus) {
    return headers.map(header => {
      if (canSort === undefined || canSort === true) {
        if (!sortStatus) {
          throw new Error('Sort status not defined');
        }
        let sortIcon = '';
        if (sortStatus.field === header.key) {
          sortIcon = `<i class="fa fa-caret-${sortStatus.sorted === -1
            ? 'up'
            : 'down'}" aria-hidden="true"></i>`;
        }
        if (header.data === false) {
          return (
            <th
              className="non-data-field"
              key={header.key}
              style={header.style || {}}
              dangerouslySetInnerHTML={{ __html: `${header.label}` }}
            />
          );
        } else {
          return (
            <th
              className="data-field"
              key={header.key}
              style={header.style || {}}
              onClick={() => sortFunction(header.key, view)}
              dangerouslySetInnerHTML={{
                __html: `${header.label} ${sortIcon}`
              }}
            />
          );
        }
      } else {
        return (
          <th key={header.key} style={header.style || {}}>
            {header.label}
          </th>
        );
      }
    });
  }

  buildDataRows(headers, rows, actions, pageRowCount, currentPage, paginate) {
    if (paginate) {
      rows = rows.slice(
        (currentPage - 1) * pageRowCount,
        currentPage * pageRowCount
      );
    }

    return rows.map((row, i) => {
      return (
        <tr key={i}>
          {this.getRow(row, headers, actions)}
        </tr>
      );
    });
  }

  getRow(currentRow, headerList, actions) {
    return headerList.map((headerObj, j) => {
      let isData =
        typeof headerObj.data === undefined || headerObj.data === false
          ? false
          : true;
      let newRow;
      let rowData = currentRow[headerObj.key];
      if (isData) {
        if (headerObj.formatFunction) {
          if (headerObj.key === 'title') {
            rowData = headerObj.formatFunction(rowData, currentRow['hashId']);
          } else {
            rowData = headerObj.formatFunction(rowData);
          }
        }
        newRow = (
          <td
            style={headerObj.style || {}}
            key={j}
            dangerouslySetInnerHTML={{ __html: rowData }}
          />
        );
      } else {
        if (actions) {
          if (actions.key === headerObj.key) {
            newRow = (
              <td style={headerObj.style || {}} key={j}>
                {React.cloneElement(actions.component, {
                  name: 'bulkSelections',
                  value: currentRow._id,
                  onClickHandler: actions.function
                })}
              </td>
            );
          }
        }
      }
      return newRow;
    });
  }

  getPages(rows, pageRowCount, currentPage, view) {
    let pages =
      Math.floor(rows.length / pageRowCount) +
      (rows.length % pageRowCount > 0 ? 1 : 0);
    let pagesGenerated = [];
    for (let i = 0; i < pages; i++) {
      if (i === 0) {
        pagesGenerated.push(
          <li className="page-item" key={`${i}a`}>
            <Link
              className="page-link"
              to={`/poll/viewer/${view}/${currentPage - 1 === 0
                ? 1
                : currentPage - 1}`}
              aria-label="Previous"
            >
              <span aria-hidden="true">
                <i className="fa fa-angle-double-left" aria-hidden="true" />
              </span>
              <span className="sr-only">Previous</span>
            </Link>
          </li>
        );
      }
      pagesGenerated.push(
        <li
          className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
          key={i}
        >
          <Link className="page-link" to={`/poll/viewer/${view}/${i + 1}`}>
            {i + 1}
          </Link>
        </li>
      );
      if (i === pages - 1) {
        pagesGenerated.push(
          <li className="page-item" key={`${i}b`}>
            <Link
              className="page-link"
              to={`/poll/viewer/${view}/${currentPage + 1 > pages
                ? currentPage
                : currentPage + 1}`}
              aria-label="Next"
            >
              <span aria-hidden="true">
                <i className="fa fa-angle-double-right" aria-hidden="true" />
              </span>
              <span className="sr-only">Next</span>
            </Link>
          </li>
        );
      }
    }

    return pagesGenerated;
  }
}

export default DataGrid;
