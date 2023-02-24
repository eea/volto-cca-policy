import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import { Helmet } from '@plone/volto/helpers';

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

//    <Helmet
//      script={[{ src: CDS_TOOLBOX }]}
//      onChangeClientState={(newState, addedTags) => {
//        if (addedTags.scriptTags) {
//          const script = addedTags.scriptTags[0];
//          script.onload = () => setLoadedScript(true);
//        }
//      }}
//    />

const CDS_TOOLBOX =
  'https://cds.climate.copernicus.eu/toolbox/toolbox-4.35.4.js';

// handleScriptInject({ scriptTags }) {
//     if (scriptTags) {
//         const scriptTag = scriptTags[0];
//         scriptTag.onload = this.handleOnLoad;
//     }
// }
//
// // ...
//
// <Helmet
//     script={[{ src: '//cdn.example.com/script.js' }]}
//     // Helmet doesn't support `onload` in script objects so we have to hack in our own
//     onChangeClientState={(newState, addedTags) => this.handleScriptInject(addedTags)}
// />
const createIframe = (details_url) => {
  return `
  <iframe srcdoc="<head>
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

    <h1>Hello world</h1>

    <select id='app-selection'>
        <option selected value='ecde-app-growing-degree-days'>ECDE growing degree days</option>
        <option value='ecde-app-mean-temperature'>ECDE Mean Temperature</option>
    </select>

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
                window.cds_toolbox.runApp(ID, 'https://cds.climate.copernicus.eu/workflows/c3s/ecde-app-growing-degree-days/master/configuration.json', {
                    workflowParams: {
                        default: 'Bayern'
                    }
                });

                const defaults = {
                    'ecde-app-growing-degree-days': 'Bayern',
                    'ecde-app-mean-temperature': 'Occitanie'
                }

                let selectedApp = 'ecde-app-growing-degree-days';
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
  const [loadedScript, setLoadedScript] = React.useState();

  const details_url = indicator?.details_app_toolbox_url;
  const ID = 'toolbox-app';

  React.useEffect(() => {
    if (loadedScript) {
      // if (window.cds_toolbox[ID]?.app_instance) {
      //   window.cds_toolbox[ID].app_instance.destroy();
      // }
      window.cds_toolbox.runApp(
        ID,
        details_url,

        {
          workflowParams: {
            default: 'Bayern',
          },
        },
      );
    }
    return () => {
      if (window.cds_toolbox[ID]?.app_instance) {
        window.cds_toolbox[ID].app_instance.destroy();
      }
    };
    console.log(window.cds_toolbox.runApp, window.cds_toolbox);
  }, [loadedScript, details_url]);

  return (
    <>
      {details_url ? (
        <div dangerouslySetInnerHTML={{ __html: createIframe(details_url) }} />
      ) : null}
    </>
  );
}
