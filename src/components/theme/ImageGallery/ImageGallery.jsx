import React from 'react';
import loadable from '@loadable/component';
import { Modal, Image } from 'semantic-ui-react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './styles.less';

const Slider = loadable(() => import('react-slick'));

const ImageGallery = (props) => {
  const {
    items = [],
    propOpen,
    setPropOpen,
    propSlideIndex,
    setPropSlideIndex,
  } = props;
  // if state is managed from an external component then use the external state
  // else use the local one
  const [localOpen, setLocalOpen] = React.useState(false);
  const open = propOpen === undefined ? localOpen : propOpen;
  const setOpen = propOpen === undefined ? setLocalOpen : setPropOpen;

  // if state is managed from an external component then use the external state
  // else use the local one
  const [localSlideIndex, setLocalSlideIndex] = React.useState(0);
  const slideIndex =
    propSlideIndex === undefined ? localSlideIndex : propSlideIndex;
  const setSlideIndex =
    propSlideIndex === undefined ? setLocalSlideIndex : setPropSlideIndex;

  const [updateCount, setUpdateCount] = React.useState(0);
  const sliderRef = React.useRef(null);

  const carouselSettings = React.useMemo(
    () => ({
      afterChange: () => setUpdateCount(updateCount + 1),
      beforeChange: (current, next) => setSlideIndex(next),
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      adaptiveHeight: true,
      autoplay: false,
      fade: false,
      useTransform: false,
      initialSlide: slideIndex,
    }),
    [slideIndex, setSlideIndex, updateCount],
  );

  const handleClick = () => {
    if (items.length) {
      setSlideIndex(0);
      setOpen(true);
    }
  };

  const image = items[slideIndex];

  return (
    <div className="image-gallery">
      <div
        tabIndex={0}
        role="button"
        onKeyDown={handleClick}
        onClick={handleClick}
      >
        <Image
          src={items[0]?.url}
          alt={items[0]?.title}
          className="preview-image"
        />
      </div>

      <Modal
        closeIcon
        open={open}
        className="slider-modal"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Modal.Content>
          <h3>{image?.title}</h3>
          <p>{image?.description}</p>
          <Slider {...carouselSettings} ref={sliderRef}>
            {items.map((item, i) => {
              return image.rights ? (
                <div key={i}>
                  <div className="image-slide">
                    <div className="image-rights">@ {image.rights}</div>
                    <Image src={item.url} alt={item?.title} />
                  </div>
                </div>
              ) : (
                <Image key={i} src={item.url} alt={item?.title} />
              );
            })}
          </Slider>
          <div className="slide-image-count">
            <strong>{slideIndex + 1}</strong> of {items.length}
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default ImageGallery;
