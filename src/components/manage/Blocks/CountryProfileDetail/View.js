import React from 'react';
import { TabPane, Tab } from 'semantic-ui-react';

const extract_body = (html_string) => {
  let parser = new DOMParser();
  let dom_document = parser.parseFromString(html_string, 'text/html');

  let list = dom_document
    .getElementById('third-level-menu')
    .getElementsByTagName('a');
  let response = { options: [], values: [] };
  for (let i = 0; i < list.length; i++) {
    let theId = list[i].href.split('#')[1];
    response.options.push({
      id: theId,
      name: list[i].innerHTML.replace('&amp;', '&'),
    });
    response.values.push(dom_document.getElementById(theId).innerHTML);
  }
  return response;
};

export default function View(props) {
  const data = extract_body(
    props.properties['@components'].countryprofile.html
      .replaceAll('\n', '')
      .replaceAll('\\"', '"'),
  );

  const panes = [];
  if (data?.options) {
    data.options.forEach((element, index) => {
      panes.push({
        menuItem: element.name,
        render: () => (
          <TabPane>
            <div dangerouslySetInnerHTML={{ __html: data.values[index] }}></div>
          </TabPane>
        ),
      });
    });
  }

  return (
    <Tab
      className="secondary mnu"
      panes={panes}
      grid={{ paneWidth: 8, tabWidth: 4 }}
      menu={{
        tabular: true,
        vertical: true,
        inverted: false,
        pointing: true,
        fluid: true,
        className: 'secondary',
        tabIndex: 0,
      }}
    />
  );
}
