import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useReactTable, flexRender, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { Genre } from '../../../types/Genre';
import DeleteGenre from './DeleteGenre/DeleteGenre';
import { useGenresData, useStationsData } from '../../../api/api';

const columnHelper = createColumnHelper<Genre>()

type GenresTableProps = {
  onRowClick: (genreId: string) => void;
};


function GenresTable({
  onRowClick
}: GenresTableProps) {

  const stations = useStationsData();

  const genresData = useGenresData();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name'
    }),
    columnHelper.display({
      header: 'Stations',
      id: 'stations',
      cell: ({ row }) => (
        stations?.filter(station => station.genreId === row.original.id).length
      )
    }),
    columnHelper.display({
      header: '',
      id: 'delete',
      cell: ({ row }) => (
        <DeleteGenre genre={row.original} />
      )
    })
  ], [stations]);

  const data = useMemo(() => genresData || [], [genresData]);

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
            onClick={() => onRowClick(row.original.id)}
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

export default GenresTable;