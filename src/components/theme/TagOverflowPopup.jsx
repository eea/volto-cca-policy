import { Popup } from 'semantic-ui-react';

const TagOverflowPopup = ({ items, className, ariaLabel }) => {
  if (!items.length) return null;

  return (
    <Popup
      className="catalogue-tag-popup"
      content={
        <div className="catalogue-tag-tooltip">
          <ul>
            {items.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      }
      position="bottom left"
      trigger={
        <button type="button" className={className} aria-label={ariaLabel}>
          + {items.length}
        </button>
      }
    />
  );
};

export default TagOverflowPopup;
