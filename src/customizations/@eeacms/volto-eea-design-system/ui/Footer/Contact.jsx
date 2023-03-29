import React from 'react';
import PropTypes from 'prop-types';
import { UniversalLink } from '@plone/volto/components';

const Contact = ({ children, contacts }) =>
  children?.length ? (
    children
  ) : (
    <div className="contact-block">
      {contacts?.map((contact, index) => {
        return (
          <div className="contact" key={index}>
            <UniversalLink href={contact.link} className="bold">
              {contact.text}
            </UniversalLink>
            {contact.children && (
              <div className="subcontact">
                {contact.children.map((child, index) => (
                  <UniversalLink href={child.link} key={index}>
                    {child.text}
                  </UniversalLink>
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
