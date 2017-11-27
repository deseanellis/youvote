import React from 'react';

const GenericField = ({
  id,
  name,
  placeholder,
  type,
  tabIndex,
  disabled,
  input,
  meta: { error, touched }
}) => {
  var isValid = '';
  if (touched) {
    isValid = error ? 'invalid' : 'valid';
  }
  let style = disabled ? { cursor: 'not-allowed' } : {};
  return (
    <div className="col-sm-10 offset-sm-1">
      <input
        id={id}
        className={isValid}
        type={type}
        placeholder={placeholder.trim()}
        name={name}
        tabIndex={tabIndex}
        disabled={disabled}
        style={style}
        {...input}
      />
      {touched &&
        (!disabled &&
          (error &&
            <div className="field error">
              {`\uf06a ${error}`}
            </div>))}
    </div>
  );
};

export default GenericField;
