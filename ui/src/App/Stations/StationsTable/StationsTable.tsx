import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useReactTable, flexRender, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { Station } from '../../../types/Station';
import DeleteStation from './DeleteStation/DeleteStation';
import { useGenresData, useStationsData } from '../../../api/api';
import StationStatus from './StationStatus/StationStatus';

const columnHelper = createColumnHelper<Station>()

type StationsTableProps = {
  onRowClick: (station: Station) => void;
  activeGenreId: string;
};


function StationsTable({
  onRowClick,
  activeGenreId
}: StationsTableProps) {

  const stationsData = useStationsData();
  const genresData = useGenresData();

  const columns = useMemo(() => [
    columnHelper.accessor('frequency', {
      header: 'Frequency'
    }),
    columnHelper.accessor('name', {
      header: 'Name'
    }),
    columnHelper.accessor('isAvailable', {
      header: 'Available',
      cell: ({ row: { original } }) => <StationStatus station={original} />
    }),
    columnHelper.accessor('streamUrl', {
      header: 'Stream URL'
    }),
    columnHelper.accessor('genreId', {
      header: 'Genre',
      cell: ({ getValue }) => {
        return genresData?.find(({ id }) => id === getValue())?.name ?? '';
      }
    }),
    columnHelper.display({
      header: '',
      id: 'delete',
      cell: ({ row }) => (
        <DeleteStation station={row.original} />
      )
    })
  ], [genresData]);

  const data = useMemo(() => stationsData?.filter((station) => {
    return activeGenreId === station.genreId || activeGenreId === '';
  }).sort((a, b) => a.frequency.localeCompare(b.frequency)) || [], [activeGenreId, stationsData]);

  const table = useReactTable({
    columns, data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map(headerGroup => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map(row => (
          <Tr
            _hover={{ bg: 'gray.50' }}
            _active={{ bg: 'gray.100' }}
            cursor="pointer"
            onClick={() => onRowClick(row.original)}
            key={row.id}>
            {row.getAllCells().map(cell => (
              <Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default StationsTable;