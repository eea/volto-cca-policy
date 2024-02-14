import { Plug } from '@plone/volto/components/manage/Pluggable';
import { getBaseUrl } from '@plone/volto/helpers';

function MigrationButtons(props) {
  const { content, token, pathname } = props;
  const contentId = content?.['@id'] || '';
  const show = !!token && contentId && contentId.indexOf('europa.eu') === -1;
  const base = getBaseUrl(pathname);

  return show ? (
    <Plug
      pluggable="main.toolbar.top"
      id="cca-migration-helpers"
      order={0}
      dependencies={[contentId]}
    >
      <button
        className={`circle-right-btn `}
        id="toolbar-migration"
        onClick={() =>
          window.open(
            `http://localhost:8080/cca/${base}/@@volto_migrate`,
            '_blank',
          )
        }
        title="Migrate context"
      >
        M
      </button>

      <button
        className={`circle-right-btn `}
        id="toolbar-view"
        onClick={() =>
          window.open(`https://climate-adapt.eea.europa.eu${base}`, '_blank')
        }
        title="View original"
      >
        V
      </button>

      <button
        className={`circle-right-btn`}
        id="toolbar-migration"
        onClick={() => window.open(`http://localhost:8080/cca/${base}/@@gopdb`)}
        title="Migrate context"
      >
        PDB
      </button>
    </Plug>
  ) : null;
}

export default MigrationButtons;
