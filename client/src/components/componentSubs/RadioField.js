import React from 'react';

const RadioField = ({ index, title, name, input }) => {
  var newInput = { ...input, value: title };
  return (
    <li>
      <label className="container">
        {title}
        <input type="radio" name={name} {...newInput} />
        <span className="checkmark" />
      </label>
    </li>
  );
};

export default RadioField;
