import React from 'react';

const RegistrationField = ({
  id,
  name,
  placeholder,
  type,
  array,
  pos,
  input,
  meta: { asyncValidating, error, touched }
}) => {
  var isValid = '';
  if (touched) {
    isValid = error ? 'invalid' : 'valid';
  }

  const thisProps = buildProps(array, pos);
  return (
    <div {...thisProps}>
      <input
        id={id}
        className={isValid}
        type={type}
        placeholder={placeholder.trim()}
        name={name}
        {...input}
      />
      {touched &&
        (error &&
          <div className="field error">
            {`\uf06a ${error}`}
          </div>)}
    </div>
  );
};

const buildProps = (array, pos) => {
  if (array) {
    switch (pos) {
      case 0:
        return {
          className: 'col-sm-5 offset-sm-1 dual-right'
        };
      default:
        return { className: 'col-sm-5 dual-left' };
    }
  }
  return { className: 'col-sm-10 offset-sm-1' };
};

export default RegistrationField;
