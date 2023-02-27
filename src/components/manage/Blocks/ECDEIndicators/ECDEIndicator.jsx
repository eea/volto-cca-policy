import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContent } from '@plone/volto/actions';

if (__CLIENT__) {
  window.cds_toolbox = {
    cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/',
  };
}

function useIndicator(path) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const action = getContent(path, null, 'fetch_indicator', null, false);
    dispatch(action);
  }, [dispatch, path]);

  return useSelector(
    (state) => state.content.subrequests.fetch_indicator?.data,
  );
}

const createIframe = (details_url, selected_region) => {
  let selected_app;
  // selected_region = 'Bayern';

  selected_app = details_url
    .split('https://cds.climate.copernicus.eu/workflows/c3s/')[1]
    .split('/')[0];
  console.log('selected app: ', selected_app);
  // console.log('region: ', selected_region);

  return `
  <iframe width="1000" height="1000" srcdoc="<head>
    <title>CDS integration test</title>
    <meta charset='utf-8' />
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <script type='text/javascript'>
        window.cds_toolbox = { cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/' };
    </script>
    <script type='text/javascript' src='https://cds.climate.copernicus.eu/toolbox/toolbox-latest.js'></script>
    <script src='https://code.jquery.com/jquery-3.6.3.min.js'
        integrity='sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=' crossorigin='anonymous'></script>

  <body>
    <div class='t-ct'>
        <div id='toolbox-app'>
            <div class='pre-app-loading'>
                <img src='/toolbox/assets/spinner.svg' alt='Loading'>
                <div>
                    ...loading configuration...
                </div>
            </div>
        </div>
    </div>

    <script>
        (function () {
            const ID = 'toolbox-app';
            $(document).ready(() => {
                window.cds_toolbox.runApp(ID, 'https://cds.climate.copernicus.eu/workflows/c3s/${selected_app}/master/configuration.json', {
                    workflowParams: {
                        default: '${selected_region}'
                    }
                });

                const defaults = {
                    'ecde-app-growing-degree-days': '${selected_region}',
                    'ecde-app-mean-temperature': 'Occitanie'
                }

                let selectedApp = '${selected_app}';
                const $appSelector = $('#app-selection');

                $appSelector.on('change', () => {
                    const value = $appSelector.val();
                    if (value !== selectedApp) {
                        selectedApp = value;
                        window.cds_toolbox[ID].app_instance.destroy();
                        window.cds_toolbox.runApp(ID, 'https://cds.climate.copernicus.eu/workflows/c3s/' + selectedApp + '/master/configuration.json', {
                            workflowParams: {
                                default: defaults[selectedApp]
                            }
                        });
                    }
                })
            });
        })();

    </script>

</body>" />`;
};

export default function ECDEIndicator(props) {
  const { indicatorUrl, selectedRegion } = props;
  const indicator = useIndicator(indicatorUrl);

  const details_url = indicator?.details_app_toolbox_url;

  return (
    <>
      {details_url ? (
        <div
          dangerouslySetInnerHTML={{
            __html: createIframe(details_url, selectedRegion),
          }}
        />
      ) : null}
    </>
  );
}
