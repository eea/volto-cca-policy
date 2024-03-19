import { Plug } from '@plone/volto/components/manage/Pluggable';
import { getBaseUrl, toPublicURL } from '@plone/volto/helpers';

const button = (id, title, label, destination) => (
  <button
    className={`circle-right-btn `}
    id={id}
    onClick={() => window.open(destination, '_blank')}
    title={title}
  >
    {label}
  </button>
);

function MigrationButtons(props) {
  const { content, token, pathname } = props;
  const contentId = content?.['@id'] || '';
  const show = !!token && contentId;
  const base = getBaseUrl(pathname);
  let buttons = [
    button(
      'migration',
      'Migrate context',
      'M',
      `http://localhost:8080/cca/${base}/@@volto_migrate`,
    ),
    button(
      'view',
      'View original',
      'V',
      `https://climate-adapt.eea.europa.eu${base}`,
    ),
    button(
      'debug',
      'Debug',
      'PDB',
      `http://localhost:8080/cca/${base}/@@gopdb`,
    ),
    button(
      'translate',
      'Translate',
      'T',
      `http://localhost:8080/cca/${base}/@@volto-html`,
    ),
    button(
      'preview',
      'Preview Translation',
      'P',
      `http://localhost:8080/cca/${base}/@@volto-html?half=1`,
    ),
    button(
      'sync-translations',
      'Sync Translations',
      'RT',
      toPublicURL(`${base}/@@translate-this-async`),
    ),
  ];

  if (contentId.indexOf('europa.eu') > -1) {
    buttons = [
      button(
        'sync-translations',
        'Sync Translations',
        'T',
        `/${base}/@@translate-this-async`,
      ),
    ];
  }

  if (!show) return null;

  return (
    <Plug
      pluggable="main.toolbar.top"
      id="cca-migration-helpers"
      order={0}
      dependencies={[contentId]}
    >
      {buttons}
    </Plug>
  );
}

export default MigrationButtons;
