import React from 'react';
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Button,
} from 'semantic-ui-react';
import { expandToBackendURL } from '@plone/volto/helpers';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable';

import './brokenlinks.less';

function BrokenLinks({ reactTable }) {
  const [results, setResults] = React.useState({});
  const {
    createColumnHelper,
    useReactTable,
    getPaginationRowModel,
    getCoreRowModel,
    flexRender,
  } = reactTable;

  React.useEffect(() => {
    const url = expandToBackendURL('/@broken_links');
    let isMounted = true;
    async function handler() {
      try {
        const response = await fetch(url);
        const results = await response.json();
        const data = Array.from(Object.values(results.broken_links));
        if (isMounted) setResults(data);
      } catch {
        // eslint-disable-next-line no-console
        console.error('Error in fetching broken links');
      }
    }
    handler();
    return () => (isMounted = false);
  }, []);

  const columnHelper = createColumnHelper();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor('url', {
        header: () => 'URL',
        cell: (info) => (
          <a href={info.getValue()}>{info.getValue().slice(0, 20)}</a>
        ),
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
      }),
      columnHelper.accessor('date', {
        header: () => 'Last checked',
      }),

      columnHelper.accessor('object_url', {
        header: () => 'Reference from',
        cell: (info) => (
          <a href={info.getValue()}>{info.getValue().slice(0, 20)}</a>
        ),
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="broken-links-table">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeaderCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="pagination">
        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </Button>
        <Button
          onClick={() => {
            console.log('nextPage');
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </Button>
        <Button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </Button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          onBlur={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default injectLazyLibs(['reactTable'])(BrokenLinks);
