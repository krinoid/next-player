import React from 'react';
import PropTypes from 'prop-types';

export default function Error({ message }) {
  return message;
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
}

Error.defaultProps = {
  message: 'Ooops, something unexpected happened. Try again later. Sorry about that :(',
}
