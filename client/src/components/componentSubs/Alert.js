import React, { Component } from 'react';

class Alert extends Component {
  render() {
    const { props } = this;
    if (props.show) {
      return (
        <div
          className={`alert alert-dismissible fade show alert-${props.type}`}
          role="alert"
        >
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => props.onClickHandler()}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>
            {props.title}{' '}
          </strong>
          <span dangerouslySetInnerHTML={{ __html: props.message }} />
          {props.link &&
            <a href={props.link.href} className="alert-link">
              {' '}{props.link.title}
            </a>}
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default Alert;
