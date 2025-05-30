/**
 * Error Page.
 * @module Error
 */

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    // backgroundColor: '#f8f9fa',
    color: '#343a40',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#004B7F',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  link: {
    color: '#004B7F',
    textDecoration: 'none',
    fontSize: '1rem',
  },
};

/**
 * Error page.
 * @function Error
 * @returns {string} Markup of the error page.
 */
const Error = ({ message, stackTrace }) => {
  let history = useHistory();

  return (
    <div
      style={{
        fontFamily: 'Helvetica, sans-serif',
        fontSize: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={styles.container}>
        <h1 style={styles.title}>
          <FormattedMessage
            id="Sorry, something went wrong with your request"
            defaultMessage="Sorry, something went wrong with your request"
          />
        </h1>
        <p style={styles.message}>We're sorry, but an error has occurred.</p>

        <button style={styles.button} onClick={() => history.goBack()}>
          <FormattedMessage id="Navigate back" defaultMessage="Navigate back" />
        </button>
        <a style={styles.link} href="/">
          <FormattedMessage
            id="return to the site root"
            defaultMessage="return to the site root"
          />
        </a>
        <p>
          <FormattedMessage
            id="or try a different page."
            defaultMessage="or try a different page."
          />
        </p>
        <div style={{ display: 'none' }}>
          <strong style={{ color: 'red' }}>{message}</strong>
          <pre>{stackTrace}</pre>
        </div>
      </div>
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
  stackTrace: PropTypes.string,
};

Error.defaultProps = {
  stackTrace: null,
};

export default injectIntl(Error);
