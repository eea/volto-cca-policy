/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React from 'react'; // , { Component }
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Container, Image, Menu, Grid } from 'semantic-ui-react';

import closeIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/close-line.svg';
import searchIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/search-line.svg';
import burgerIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/menu-line.svg';

import HeaderMenuPopUp from './HeaderMenuPopUp';

const HeaderMain = ({
  logo,
  menuItems,
  renderMenuItem,
  renderGlobalMenuItem,
  pathname,
  transparency,
  inverted,
}) => {
  const history = useHistory();
  const [activeItem, setActiveItem] = React.useState(pathname);
  const [menuIsActive, setMenuIsActive] = React.useState(false);
  const [burger, setBurger] = React.useState('');

  React.useEffect(() => {
    setMenuIsActive(false);

    setBurger('');
    // remove active menu when we have no pathname which means we hit logo to go home
    if (!pathname) {
      setActiveItem('');
    }
  }, [pathname]);

  const mobileBurgerOnClick = () => {
    if (burger === '') {
      setBurger('open');
      setMenuIsActive(true);
    } else {
      setBurger('');
      setMenuIsActive(false);
      setActiveItem('');
    }
  };

  const menuOnClickOutside = () => {
    // restore active element if nothing was selected from the menu dropdown
    if (pathname !== activeItem) {
      setActiveItem(pathname);
    }
    // close mobile navigation when clicking outside if we have value for nav
    if (burger) {
      setBurger('');
    }
    // always close the  menu
    setMenuIsActive(false);
  };

  const menuOnClick = (e, item) => {
    setActiveItem(item['@id'] || item.url);
    if (item.items.length) {
      setMenuIsActive(true);
    } else {
      history.push(item.url);
    }
  };

  // Listens for escape keydown event
  React.useEffect(() => {
    const escKeyPressed = (e) => {
      if (e.key === 'Escape') {
        // menuOnClickOutside();
        // restore active element if nothing was selected from the menu dropdown
        if (pathname !== activeItem) {
          setActiveItem(pathname);
        }
        // close mobile navigation when clicking outside if we have value for nav
        if (burger) {
          setBurger('');
        }
        // always close the  menu & search
        setMenuIsActive(false);
      }
    };

    document.addEventListener('keydown', escKeyPressed);

    return () => {
      document.removeEventListener('keydown', escKeyPressed);
    };
  }, [activeItem, burger, pathname]);

  const node = React.useRef();
  const mobileMenuBurgerRef = React.useRef();
  const desktopMenuRef = React.useRef();

  return (
    <div
      className={`main bar ${transparency ? 'transparency' : ''}`}
      ref={node}
    >
      <Container>
        <Grid>
          <Grid.Column mobile={8} tablet={8} computer={4}>
            {logo}
          </Grid.Column>
          <Grid.Column mobile={4} tablet={4} computer={8}>
            <div className={inverted ? 'main-menu inverted' : 'main-menu'}>
              {menuItems && (
                <div
                  className="ui text eea-main-menu tablet or lower hidden menu"
                  ref={desktopMenuRef}
                  id={'navigation'}
                >
                  {menuItems.map((item) => (
                    <Menu.Item
                      name={item['@id'] || item.url}
                      key={item['@id'] || item.url}
                      active={
                        activeItem.indexOf(item['@id']) !== -1 ||
                        activeItem.indexOf(item.url) !== -1
                      }
                    >
                      {renderGlobalMenuItem(item, {
                        onClick: menuOnClick,
                      })}
                    </Menu.Item>
                  ))}
                </div>
              )}

              <Link to="/en/mission/knowledge-and-data/search-the-database">
                <button
                  className="search-action"
                  tabIndex="0"
                  aria-pressed="false"
                  aria-haspopup="true"
                >
                  <Image src={searchIcon} alt="search button open/close" />
                </button>
              </Link>

              <BurgerAction
                className={`mobile ${burger}`}
                onClick={mobileBurgerOnClick}
                ref={mobileMenuBurgerRef}
              >
                <Image
                  src={burger === 'open' ? `${closeIcon}` : `${burgerIcon}`}
                  alt="menu icon open/close"
                />
              </BurgerAction>
            </div>
          </Grid.Column>
        </Grid>
      </Container>
      <HeaderMenuPopUp
        renderMenuItem={renderMenuItem}
        activeItem={activeItem}
        menuItems={menuItems}
        pathName={pathname}
        onClose={menuOnClickOutside}
        triggerRefs={[mobileMenuBurgerRef, desktopMenuRef]}
        visible={menuIsActive}
      />
    </div>
  );
};

const BurgerAction = React.forwardRef((props, ref) => (
  <button
    ref={ref}
    className={`burger-action ${props.className}`}
    tabIndex="0"
    aria-pressed="false"
    aria-haspopup="true"
    onClick={props.onClick}
  >
    {props.children}
  </button>
));

export default HeaderMain;
