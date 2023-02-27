<!DOCTYPE html>
<html>

<head>
    <title>CDS integration test</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script type="text/javascript">
        window.cds_toolbox = { cds_public_path: 'https://cds.climate.copernicus.eu/toolbox/' };
    </script>
    <script type="text/javascript" src="https://cds.climate.copernicus.eu/toolbox/toolbox-latest.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.3.min.js"
        integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>

<body>

    <h1>Hello world</h1>

    <select id="app-selection">
        <option selected value="ecde-app-growing-degree-days">ECDE growing degree days</option>
        <option value="ecde-app-mean-temperature">ECDE Mean Temperature</option>
    </select>

    <div class="t-ct">
        <div id="toolbox-app">
            <div class="pre-app-loading">
                <img src="/toolbox/assets/spinner.svg" alt="Loading">
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
                        window.cds_toolbox.runApp(ID, `https://cds.climate.copernicus.eu/workflows/c3s/${selectedApp}/master/configuration.json`, {
                            workflowParams: {
                                default: defaults[selectedApp]
                            }
                        });
                    }
                })
            });
        })();

    </script>

</body>

</html>
