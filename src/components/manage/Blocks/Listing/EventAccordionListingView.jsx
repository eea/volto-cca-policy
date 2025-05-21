import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Icon, Accordion, Button } from 'semantic-ui-react';
import { ConditionalLink } from '@plone/volto/components';
import { When } from '@plone/volto/components/theme/View/EventDatesInfo';

import './styles.less';

function formatDateRange(startStr, endStr, locale = 'en') {
  if (!startStr || !endStr) return null;

  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  if (isNaN(startDate) || isNaN(endDate)) return null;

  const sameDay = startDate.toDateString() === endDate.toDateString();
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  const day = (date) => date.toLocaleDateString(locale, { day: 'numeric' });

  const month = (date) => date.toLocaleDateString(locale, { month: 'long' });

  const year = (date) => date.toLocaleDateString(locale, { year: 'numeric' });

  if (sameDay) {
    return `${day(startDate)} ${month(startDate)} ${year(startDate)}`;
  }

  if (sameMonth && sameYear) {
    return `${day(startDate)} - ${day(endDate)} ${month(endDate)} ${year(
      endDate,
    )}`;
  }

  if (sameYear) {
    return `${day(startDate)} ${month(startDate)} - ${day(endDate)} ${month(
      endDate,
    )} ${year(endDate)}`;
  }

  // Different years
  return `${day(startDate)} ${month(startDate)} ${year(startDate)} – ${day(
    endDate,
  )} ${month(endDate)} ${year(endDate)}`;
}

const EventAccordionListingView = ({ items, isEditMode }) => {
  const currentLang = useSelector((state) => state.intl.locale);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className="ui fluid event-accordion-view">
      <Accordion className="primary">
        {items.map((item, index) => {
          const formattedDate = formatDateRange(
            item.start,
            item.end,
            currentLang,
          );
          return (
            <React.Fragment key={item.UID}>
              <Accordion.Title
                active={activeIndex === index}
                onClick={() => handleAccordionClick(index)}
              >
                <Icon
                  className={
                    activeIndex === index
                      ? 'ri-arrow-up-s-line'
                      : 'ri-arrow-down-s-line'
                  }
                />
                <div>
                  <div className="listing-header">
                    {item?.start && <span>{formattedDate}</span>}
                    {item.location && <> - {item.location}</>}
                  </div>
                  <div>{item.title}</div>
                </div>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === index}>
                {item?.description && (
                  <p className="listing-description">{item.description}</p>
                )}

                <div className="bottom-info">
                  <ConditionalLink item={item} condition={!isEditMode}>
                    <Button inverted primary>
                      <FormattedMessage
                        id="Learn more"
                        defaultMessage="Learn more"
                      />
                    </Button>
                  </ConditionalLink>
                  <When
                    start={item.start}
                    end={item.end}
                    whole_day={item.whole_day}
                    open_end={item.open_end}
                  />
                </div>
              </Accordion.Content>
            </React.Fragment>
          );
        })}
      </Accordion>
    </div>
  );
};

EventAccordionListingView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default EventAccordionListingView;
