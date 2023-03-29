import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Contact = ({ children, contacts }) =>
  children?.length ? (
    children
  ) : (
    <div className="contact-block">
      {contacts?.map((contact, index) => {
        const isMailTo = contact.link.startsWith('mailto:');
        return (
          <div className="contact" key={index}>
            {isMailTo ? (
              <a href={contact.link} className="bold">
                {contact.text}
              </a>
            ) : (
              <Link to={contact.link} className="bold">
                {contact.text}
              </Link>
            )}
            {contact.children && (
              <div className="subcontact">
                {contact.children.map((child, index) => (
                  <Link to={child.link} key={index}>
                    {child.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

Contact.propTypes = {
  contacts: PropTypes.array,
  header: PropTypes.string,
};

export default Contact;
