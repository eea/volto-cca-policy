import React from 'react';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import './styles.less';

function ItemIcon({ value, hoverValue, color, size }) {
  const getImageUrl = (image) => {
    const selected = Array.isArray(image) ? image[0] : image;
    if (typeof selected === 'string') {
      // Some object-browser values store the scale path without its leading
      // slash. Keep it from being mistaken for a Remix Icon class below.
      return selected.startsWith('@@images/') ? `/${selected}` : selected;
    }

    // Plone exposes generated image URLs on the selected content item. Prefer
    // those URLs so the image scale name and cache-busting hash stay correct
    // for every uploaded icon.
    const imageScale = selected?.scales?.image?.download;
    const legacyImageScale = selected?.image_scales?.image?.[0]?.download;
    const download = imageScale || legacyImageScale;
    if (download) {
      if (/^(https?:|\/|data:)/i.test(download)) return download;
      const contentUrl = selected?.['@id'] || selected?.linkHref;
      if (contentUrl) {
        return `${contentUrl.replace(/\/$/, '')}/${download.replace(/^\//, '')}`;
      }
      return `/${download}`;
    }

    const url =
      selected?.['@id'] || selected?.linkHref || selected?.linkWithHash;
    return typeof url === 'string' && url.startsWith('@@images/')
      ? `/${url}`
      : url;
  };
  value = getImageUrl(value);
  hoverValue = getImageUrl(hoverValue);
  const isImage = (icon) =>
    /^(https?:|\/|data:image\/|@@images\/)/i.test(icon || '');
  return (
    <span
      className={`items-list-icon ${hoverValue ? 'has-hover-icon' : ''} ${color ? 'has-hover-color' : ''}`}
      style={{
        '--items-list-hover-color': color || 'currentColor',
        '--items-list-icon-size': `${size}px`,
      }}
    >
      {value &&
        (isImage(value) ? (
          <img src={value} alt="" />
        ) : (
          <i
            className={value.startsWith('ri-') ? value : `ri-${value}`}
            aria-hidden="true"
          />
        ))}
      {hoverValue &&
        (isImage(hoverValue) ? (
          <img className="hover-icon" src={hoverValue} alt="" />
        ) : (
          <i
            className={`hover-icon ${hoverValue.startsWith('ri-') ? hoverValue : `ri-${hoverValue}`}`}
            aria-hidden="true"
          />
        ))}
    </span>
  );
}

export default function View({ data = {}, id, mode }) {
  const {
    title,
    description_top,
    description_bottom,
    icon_size = 48,
    listing_mode = 'inline',
    columns = 2,
    items = [],
  } = data;
  const isColumnLayout = listing_mode === 'columns';
  const columnCount = Math.max(1, Math.min(6, Number(columns) || 2));
  return (
    <section
      className={`items-list-block ${mode === 'edit' ? 'is-editing' : ''}`}
      id={id}
    >
      {title && <h2>{title}</h2>}
      {description_top && (
        <div className="items-list-description">{description_top}</div>
      )}
      <div
        className={`items-list-items ${isColumnLayout ? 'is-columns' : 'is-inline'}`}
        style={
          isColumnLayout ? { '--items-list-columns': columnCount } : undefined
        }
      >
        {items.map((item, index) => {
          const icon = (
            <>
              {(item.icon ||
                item.custom_icon ||
                item.hover_icon ||
                item.custom_hover_icon) && (
                <ItemIcon
                  value={item.custom_icon || item.icon}
                  hoverValue={item.custom_hover_icon || item.hover_icon}
                  color={item.hover_color}
                  size={icon_size}
                />
              )}
            </>
          );
          const href = item.href || item.link;
          const selectedHref = Array.isArray(href) ? href[0] : href;
          const linkProps =
            selectedHref && typeof selectedHref === 'object'
              ? { item: selectedHref }
              : { href: selectedHref };

          if (isColumnLayout) {
            const title =
              item.title &&
              (mode !== 'edit' && href ? (
                <UniversalLink className="items-list-item-title" {...linkProps}>
                  {item.title}
                </UniversalLink>
              ) : (
                <span className="items-list-item-title">{item.title}</span>
              ));
            return (
              <div
                className="items-list-item is-column-item"
                key={`${item.title}-${index}`}
              >
                {title}
                {item.description && (
                  <div className="items-list-item-description">
                    {item.description}
                  </div>
                )}
              </div>
            );
          }

          const content = icon;
          return href && mode !== 'edit' ? (
            <UniversalLink
              className="items-list-item"
              {...linkProps}
              key={`${item.title}-${index}`}
              title={item.title || undefined}
              aria-label={item.title || undefined}
            >
              {content}
            </UniversalLink>
          ) : (
            <div
              className="items-list-item"
              key={`${item.title}-${index}`}
              title={item.title || undefined}
              aria-label={item.title || undefined}
            >
              {content}
            </div>
          );
        })}
      </div>
      {description_bottom && (
        <div className="items-list-description">{description_bottom}</div>
      )}
    </section>
  );
}
