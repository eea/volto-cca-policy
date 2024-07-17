import React from 'react';
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from 'semantic-ui-react';
import { expandToBackendURL } from '@plone/volto/helpers';

export default function BrokenLinks(props) {
  const [results, setResults] = React.useState({});

  React.useEffect(() => {
    const url = expandToBackendURL('/@broken_links');
    let isMounted = true;
    async function handler() {
      try {
        const response = await fetch(url);
        const results = await response.json();
        if (isMounted) setResults(results.broken_links);
      } catch {
        // eslint-disable-next-line no-console
        console.error('Error in fetching broken links');
      }
    }
    handler();
    return () => (isMounted = false);
  }, []);

  return (
    <div className="broken-links-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>URL</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Last checked</TableHeaderCell>
            <TableHeaderCell>Referenced from</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(Object.entries(results)).map(([id, info]) => (
            <TableRow key={id}>
              <TableCell>
                <a href={info.url}>{info.url.slice(0, 20)}</a>
              </TableCell>
              <TableCell>{info.status}</TableCell>
              <TableCell>{info.date}</TableCell>
              <TableCell>
                <a target="_blank" href={info.object_url}>
                  {info.object_url.slice(0, 20)}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
