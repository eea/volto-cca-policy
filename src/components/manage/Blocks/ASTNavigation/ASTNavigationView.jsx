import loadable from '@loadable/component';

const ASTLogoMap = loadable(() =>
  import('@eeacms/volto-cca-policy/components/theme/ASTNavigation/ASTLogoMap'),
);
const UASTLogoMap = loadable(() =>
  import('@eeacms/volto-cca-policy/components/theme/ASTNavigation/UASTLogoMap'),
);

export default function ASTNavigationView(props) {
  const { data, path } = props;
  const { items = [], image_type = 'ast', href } = data;
  if (items.length !== 6) return <div>Incomplete number of sources</div>;
  const itemsMap = Object.assign(
    {},
    ...items.map((item, i) => ({ [`step-${i + 1}`]: item.href?.[0] })),
  );

  return image_type === 'ast' ? (
    <ASTLogoMap items={itemsMap} pathname={path} href={href?.[0]} />
  ) : image_type === 'uast' ? (
    <UASTLogoMap items={itemsMap} pathname={path} href={href?.[0]} />
  ) : null;
}
