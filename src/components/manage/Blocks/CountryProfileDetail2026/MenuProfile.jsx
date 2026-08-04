import { Grid } from 'semantic-ui-react';
import './styles.less';

import StatusCircle from './StatusCircle';
// import { truncate } from 'lodash';

export default function MenuProfile(props) {
  const countryName = props?.countryName;
  const dataJsonString = props.dataJson;
  const dataJson = JSON.parse(dataJsonString);
  // console.log('dataJson', dataJson);
  const adaptationPolicies = dataJson['Legal_Policies']['AdaptationPolicies']
    .map(({ Type, Link, Title, Status }) => ({
      TitleBold: Type?.includes(':') ? Type.split(':')[1].trim() : Type,
      Link,
      Title,
      Status,
    }))
    .filter((item) => typeof item.Status === 'string')
    .map((item) => ({
      ...item,
      Status: item.Status.match(/\(([^)]+)\)/)?.[1] ?? item.Status,
    }))
    .map((item) => ({
      ...item,
      Status: item.Status.includes('-')
        ? item.Status.split('-')[1]
        : item.Status,
    }));
  const dataAndClimateServices = [
    {
      category: 'Meteorological observations',
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
      category: 'Reporting on adaptation under the Governance Regulation',
      elements: [
        {
          Title:
            '[2021] National climate change adaptation planning and strategies',
          LinkName: '2021 Art. 19',
          Link: 'https://reportnet.europa.eu/public/dataflow/110',
          Status: 'Adopted',
        },
        {
          Title:
            '[2023] National climate change adaptation planning and strategies',
          LinkName: '2023 Art. 19',
          Link: 'https://reportnet.europa.eu/public/dataflow/895',
          Status: 'Adopted',
        },
        {
          Title:
            '[2025] National climate change adaptation planning and strategies',
          LinkName: '2025 Art. 19',
          Link: 'https://reportnet.europa.eu/public/dataflow/1455',
          Status: 'Adopted',
        },
        {
          Title: '[2023] Annex III Decarbonisation – Adaptation ',
          LinkName: '2023 Art. 17',
          Link: 'https://reportnet.europa.eu/public/dataflow/897',
          Status: 'Adopted',
        },
        {
          Title: '[2025] Annex III Decarbonisation – Adaptation',
          LinkName: '2025 Art. 17',
          Link: 'https://reportnet.europa.eu/public/dataflow/1444',
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

    // const contactsArray = Array.isArray(contact) ? contact : [contact];
    const contactsArray = Array.isArray(contact)
      ? contact.slice(0, 1)
      : [contact];

    return contactsArray
      .flatMap((c) => c?.Website ?? [])
      .filter((w) => w?.Type === 'Website');
  })();

  // console.log('portalsAndPlatforms', portalsAndPlatforms);
  let portalsPublications = (() => {
    const contact = dataJson?.Contact;

    if (!contact) return [];

    const contactsArray = Array.isArray(contact)
      ? contact.slice(0, 1)
      : [contact];

    return contactsArray.flatMap((c) => c?.Publications ?? []);
  })();
  return (
    <div className="cp2026">
      <h2 id="adaptation_policies">Summary</h2>
      <p>
        This section provides an overview of key adaptation policies, climate
        data and services, knowledge portals and platforms and key publications.
        It also includes links to the datasets and contact information.
      </p>
      <p>
        The Climate projections and services table shows the availability of
        modelled climate data, including nationally used climate scenarios where
        relevant. The <strong>Meteorological services</strong> table provides
        information on where climate monitoring data can be accessed. Both
        tables indicate the status of each service and include details on how to
        access it.
      </p>
      <h3>Adaptation policies</h3>
      {adaptationPolicies.map((adaptation, index) => (
        <Grid key={index} columns="12" className="cpBgGray">
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={9}
            className="col-right"
          >
            <p>
              <strong>{adaptation['TitleBold']}</strong>
            </p>
            <div className="ui unstackable items row">
              <div className="item secondary">
                <i
                  aria-hidden="true"
                  className="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div className="middle aligned content">
                  <div className="description">
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
      <h3 id="climate_services">Data and climate services</h3>
      <ListDiv
        elements={dataAndClimateServices}
        showStatus={true}
        showTitle={false}
      />
      <h3 id="monitoring_reporting">Monitoring and reporting</h3>
      <ListDiv elements={monitoringAndReportingData} showStatus={false} />
      <h3 id="adaptation_knowledge">
        Adaptation knowledge portals and platforms
      </h3>
      <Grid columns="12">
        {portalsAndPlatforms.map((website, index) => (
          <Grid.Column key={index} mobile={12} tablet={12} computer={6}>
            <p>
              <b>{website.Title}</b>
            </p>
            <p>{website.Department}</p>
            <div className="ui unstackable items row">
              <div className="item secondary">
                <i
                  aria-hidden="true"
                  className="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div className="middle aligned content">
                  <div className="description">
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
      <h3 id="key_publications">Key publications</h3>
      <Grid columns="12">
        {portalsPublications.map((website, index) => (
          <Grid.Column key={index} mobile={12} tablet={12} computer={6}>
            <p>
              <b>{website.Publisher}</b>
            </p>
            <div className="ui unstackable items row">
              <div className="item secondary">
                <i
                  aria-hidden="true"
                  className="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div className="middle aligned content">
                  <div className="description">
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
      <h3 id="contact">Contact</h3>
      <Grid columns="12">
        {contactData.map((data, index) => (
          <Grid.Column key={index} mobile={12} tablet={12} computer={6}>
            <p>
              <b>{data.Organisation}</b>
            </p>
            <p>{data.Department}</p>
            <div className="ui unstackable items row">
              <div className="item secondary">
                <i
                  aria-hidden="true"
                  className="tiny icon ri-external-link-line secondary middle aligned"
                ></i>
                <div className="middle aligned content">
                  <div className="description">
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
      <div className="noticeBackGround">
        {[
          'Albania',
          'Bosnia and Herzegovina',
          'Georgia',
          'Kosovo',
          'Moldova',
          'Montenegro',
          'North Macedonia',
          'Georgia',
          'Serbia',
          'Ukraine',
        ].includes(countryName) ? (
          <p>
            <strong>Disclaimer:</strong>The information presented on these pages
            is based on the reporting according to the adapted Regulation (EU)
            2018/1999 on the Governance of the Energy Union and Climate Action,
            as incorporated and adapted by the Energy Community Ministerial
            Council decision 2021/14/mc-enc.
          </p>
        ) : (
          <p>
            <strong>Disclaimer:</strong>The information presented on these pages
            is based on the reporting according to the Regulation (EU) 2018/1999
            on the Governance of the Energy Union and Climate Action.
          </p>
        )}
      </div>
    </div>
  );
}

const ListDiv = ({ elements, showStatus = true, showTitle = true }) => {
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
            {categoryData.elements.map((element, idx) => (
              <Grid key={idx} columns="12">
                <Grid.Column
                  mobile={9}
                  tablet={9}
                  computer={9}
                  eteorological
                  observati
                  className="col-left"
                >
                  {showTitle && (
                    <p>
                      {element?.TitleBold && <b>{element.TitleBold}</b>}
                      {element?.Title && <>{element.Title}</>}
                    </p>
                  )}

                  <div className="item secondary">
                    <i
                      aria-hidden="true"
                      className="tiny icon ri-external-link-line secondary middle aligned"
                    ></i>
                    <span className="small-text">
                      <a href={element.Link}>{element.LinkName}</a>
                    </span>
                  </div>
                </Grid.Column>
                {showStatus && (
                  <Grid.Column
                    mobile={3}
                    tablet={3}
                    computer={3}
                    className="col-left font-weight-6"
                  >
                    <StatusCircle statusValue={element.Status} />
                  </Grid.Column>
                )}
              </Grid>
            ))}
          </div>
        ))}
    </div>
  );
};
