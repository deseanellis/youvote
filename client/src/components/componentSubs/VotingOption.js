import React, { Component } from 'react';

class VotingOption extends Component {
  render() {
    const {
      index,
      value,
      isFirst,
      isLast,
      addNewOption,
      setOptionValue,
      deleteOption,
      arrangeOptions,
      disabled
    } = this.props;
    const style = disabled ? { cursor: 'not-allowed' } : {};
    return (
      <li>
        <button
          className={`btn--sort-option up ${isFirst ? 'disabled' : ''}`}
          type="button"
          title="Bring Up"
          disabled={isFirst ? true : false}
          onClick={() => arrangeOptions(index - 1, 'up')}
        >
          <i className="fa fa-arrow-up" aria-hidden="true" />
        </button>
        <button
          className={`btn--sort-option down ${isLast ? 'disabled' : ''}`}
          type="button"
          title="Bring Down"
          disabled={isLast ? true : false}
          onClick={() => arrangeOptions(index - 1, 'down')}
        >
          <i className="fa fa-arrow-down" aria-hidden="true" />
        </button>
        <input
          id={`voting-option-${index}`}
          type="text"
          name="options"
          placeholder={`Option ${index} *`}
          tabIndex={index + 1}
          onChange={e => setOptionValue(index - 1, e.target.value)}
          value={value}
          disabled={disabled}
          style={style}
        />
        <button
          className="btn--delete-option"
          title="Delete Option"
          type="button"
          disabled={disabled}
          style={style}
          onClick={() => deleteOption(index - 1)}
        >
          <i className="fa fa-trash" aria-hidden="true" />
        </button>
        <div>
          {isLast &&
            <button
              className="btn--add-option"
              onClick={() => addNewOption()}
              type="button"
            >
              <i className="fa fa-plus" aria-hidden="true" /> Add New Option
            </button>}
        </div>
      </li>
    );
  }
}

export default VotingOption;
