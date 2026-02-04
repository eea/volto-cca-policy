import { Grid } from 'semantic-ui-react';
import './styles.less';

import StatusCircle from './StatusCircle';

export default function MenuProfile(props) {
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  const adaptationPolicies = dataJson['Legal_Policies']['AdaptationPolicies']
    .map(({ Type, Link, Title, Status }) => ({
      TitleBold: Type,
      Link,
      Title,
      Status,
    }))
    .filter((item) => typeof item.Status === 'string')
    .map((item) => ({
      ...item,
      Status: item.Status.match(/\(([^)]+)\)/)?.[1] ?? item.Status,
    }));
  const dataAndClimateServices = [
    {
      category: '',
      elements: (dataJson?.National_Circumstances?.Meteo_observation ?? []).map(
        ({ Name, WebLink, Status }) => ({
          TitleBold: 'Meteorological observations',
          LinkName: Name,
          Link: WebLink,
          Status,
        }),
      ),
    },
    {
      category: 'Climate projections and services',
      elements: (
        dataJson?.National_Circumstances?.Climate_Projections_Services ?? []
      ).map(({ Description, WebLink, Status }) => ({
        Title: Description,
        LinkName: Description,
        Link: WebLink,
        Status,
      })),
    },
  ];
  const monitoringAndReportingData = [
    {
      category:
        'Monitoring, reporting and evaluation (MRE) indicators and methodologies',
      elements: (
        dataJson?.Monitoring_Evaluation?.Monitoring_Indicator_Methodologies ??
        []
      ).map(({ Description, Link, IndicatorsMethodology }) => ({
        Title: Description,
        LinkName: Description,
        Link,
        Status: IndicatorsMethodology,
      })),
    },
    {
      category: 'National communication to the UNFCCC',
      elements: [],
    },
    {
      category: 'Governance regulation adaptation reporting',
      elements: [
        {
          Title: 'National climate change adaptation planning and strategies',
          LinkName: '2021 Art. 19',
          Link: 'https://reportnet.europa.eu/public/dataflow/110',
          Status: 'Adopted',
        },
        {
          Title: 'Decarbonisation adaptation progress reporting (2023)',
          LinkName: '2023 Art. 17',
          Link: 'https://reportnet.europa.eu/public/dataflow/897',
          Status: 'Adopted',
        },
        {
          Title:
            'National climate change adaptation planning and strategies (2023)',
          LinkName: '2023 Art. 19',
          Link: 'https://reportnet.europa.eu/public/dataflow/895',
          Status: 'Adopted',
        },
        {
          Title: 'Annex III Decarbonisation - Adaptation dataflow (2025)',
          LinkName: '2025 Art. 17',
          Link: 'https://reportnet.europa.eu/public/dataflow/1444',
          Status: 'Adopted',
        },
        {
          Title:
            'National climate change adaptation planning and strategies (2025)',
          LinkName: '2025 Art. 19',
          Link: 'https://reportnet.europa.eu/public/dataflow/1455',
          Status: 'Adopted',
        },
      ],
    },
  ];
  const contactData =
    dataJson?.Contact?.Contact_General ??
    dataJson?.Contact?.[0]?.Contact_General;
  let portalsAndPlatforms = (() => {
    const contact = dataJson?.Contact;

    if (!contact) return [];

    const contactsArray = Array.isArray(contact) ? contact : [contact];

    return contactsArray
      .flatMap((c) => c?.Website ?? [])
      .filter((w) => w?.Type === 'Website');
  })();
  let portalsPublications = (() => {
    const contact = dataJson?.Contact;

    if (!contact) return [];

    const contactsArray = Array.isArray(contact) ? contact : [contact];

    return contactsArray.flatMap((c) => c?.Publications ?? []);
  })();
  return (
    <div class="cp2026">
      <h2>Adaptation policy framework</h2>
      <h3>National framework</h3>
      {adaptationPolicies.map((adaptation, index) => (
        <Grid columns="12" className="cpBgGray">
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={9}
            className="col-right"
          >
            <p>
              <strong>{adaptation['Type']}</strong>
            </p>
            <div class="ui unstackable items row">
              <div class="item secondary">
                <i
                  aria-hidden="true"
                  class="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div class="middle aligned content">
                  <div class="description">
                    <p>
                      <a href={adaptation['Link']}>{adaptation['Title']}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={3}
            className="col-right"
          >
            <StatusCircle statusValue={adaptation['Status']} />
          </Grid.Column>
        </Grid>
      ))}
      <h3>Data and climate services</h3>
      <ListDiv elements={dataAndClimateServices} />
      <h3>Monitoring and reporting</h3>
      <ListDiv elements={monitoringAndReportingData} />
      <h3>Adaptation knowledge portals and platforms</h3>
      <Grid columns="12">
        {portalsAndPlatforms.map((website, index) => (
          <Grid.Column mobile={12} tablet={12} computer={6}>
            <p>
              <b>{website.Title}</b>
            </p>
            <p>{website.Department}</p>
            <div class="ui unstackable items row">
              <div class="item secondary">
                <i
                  aria-hidden="true"
                  class="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div class="middle aligned content">
                  <div class="description">
                    <p>
                      <a href={website['Url']}>{website['Url']}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Column>
        ))}
      </Grid>
      <h3>Key publications</h3>
      <Grid columns="12">
        {portalsPublications.map((website, index) => (
          <Grid.Column mobile={12} tablet={12} computer={6}>
            <p>
              <b>{website.Publisher}</b>
            </p>
            <div class="ui unstackable items row">
              <div class="item secondary">
                <i
                  aria-hidden="true"
                  class="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div class="middle aligned content">
                  <div class="description">
                    <p>
                      <a href={website['WebLink']}>{website['WebLink']}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Column>
        ))}
      </Grid>
      <h3>Contact</h3>
      <Grid columns="12">
        {contactData.map((data, index) => (
          <Grid.Column mobile={12} tablet={12} computer={6}>
            <p>
              <b>{data.Organisation}</b>
            </p>
            <p>{data.Department}</p>
            <div class="ui unstackable items row">
              <div class="item secondary">
                <i
                  aria-hidden="true"
                  class="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div class="middle aligned content">
                  <div class="description">
                    <p>
                      <a href={data['Website']}>{data['Website']}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Column>
        ))}
      </Grid>
      <div className="noticeBackGround mt-2">
        <p>
          <strong>Disclaimer:</strong>The information presented in these pages
          is based on the reporting according to 'Regulation (EU) 2018/1999 on
          the Governance of the Energy Union and Climate Action'. For
          Liechtenstein and Norway, the information presented is based on the
          reporting according to 'Regulation (EU) No 525/2013 on a mechanism for
          monitoring and reporting greenhouse gas emissions and for reporting
          other information relevant to climate change'.
        </p>
      </div>
    </div>
  );
}

const ListDiv = ({ elements }) => {
  return (
    <div>
      {elements
        .filter((categoryData) => categoryData.elements.length > 0)
        .map((categoryData, index) => (
          <div key={index} className="cpBgGray">
            {categoryData.category.length > 0 && (
              <p>
                <b>{categoryData.category}</b>
              </p>
            )}
            {categoryData.elements.map((element) => (
              <Grid columns="12">
                <Grid.Column
                  mobile={9}
                  tablet={9}
                  computer={9}
                  eteorological
                  observati
                  className="col-left"
                >
                  <p>
                    {element?.TitleBold && <b>{element.TitleBold}</b>}
                    {element?.Title && <>{element.Title}</>}
                  </p>

                  <div class="item secondary">
                    <i
                      aria-hidden="true"
                      class="tiny icon ri-external-link-line secondary middle aligned"
                    ></i>
                    <span class="small-text">
                      <a href={element.Link}>{element.LinkName}</a>
                    </span>
                  </div>
                </Grid.Column>
                <Grid.Column
                  mobile={3}
                  tablet={3}
                  computer={3}
                  className="col-left"
                >
                  <StatusCircle statusValue={element.Status} />
                </Grid.Column>
              </Grid>
            ))}
          </div>
        ))}
    </div>
  );
};
