import React, { Component } from 'react';

class TableCheckbox extends Component {
  render() {
    const { name, value, onClickHandler, label } = this.props;
    var toCheck = name === 'private' ? { checked: value } : {};

    return (
      <label>
        <input
          type="checkbox"
          name={name}
          value={value}
          onClick={() => onClickHandler(value)}
          {...toCheck}
        />
        <span
          className="lbl padding-8"
          dangerouslySetInnerHTML={{ __html: label ? label : '' }}
        />
      </label>
    );
  }
}

export default TableCheckbox;
