import React from 'react';

const LoginField = ({
  id,
  name,
  placeholder,
  type,
  input,
  meta: { error, touched }
}) => {
  var isValid = '';
  if (touched) {
    isValid = error ? 'invalid' : 'valid';
  }
  return (
    <div className="col-sm-10 offset-sm-1">
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

export default LoginField;
