import { Plug } from '@plone/volto/components/manage/Pluggable';
import { getBaseUrl } from '@plone/volto/helpers';

function MigrationButtons(props) {
  const { content, token, pathname } = props;
  const contentId = content?.['@id'] || '';
  const show = !!token && contentId && contentId.indexOf('europa.eu') === -1;
  const base = getBaseUrl(pathname);

  const handleClickMigrate = () => {
    window.open(`http://localhost:8080/cca/${base}/@@volto_migrate`, '_blank');
  };

  const handleClickView = () => {
    window.open(`https://climate-adapt.eea.europa.eu${base}`, '_blank');
  };

  return show ? (
    <Plug pluggable="main.toolbar.top" id="cca-migration-helpers" order={0}>
      <button
        className={`circle-right-btn `}
        id="toolbar-migration"
        onClick={handleClickMigrate}
        title="Migrate context"
      >
        M
      </button>

      <button
        className={`circle-right-btn `}
        id="toolbar-view"
        onClick={handleClickView}
        title="View original"
      >
        V
      </button>
    </Plug>
  ) : null;
}

export default MigrationButtons;
