import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ message, title }) => {
  return (
    <div className="content-box">
      <div className="title">
        <i className="fa fa-info-circle" aria-hidden="true" />{' '}
        {title ? title : '404 Not Found'}
      </div>
      <div className="body">
        {!message &&
          <p>
            Oops! Looks like we don't have that page. You can return home by
            clicking <Link to="/">here</Link>.
          </p>}
        {message &&
          <p>
            {message}
          </p>}
      </div>
    </div>
  );
};
export default NotFound;
