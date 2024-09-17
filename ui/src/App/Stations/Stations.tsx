import { Stack } from '@chakra-ui/react'
import { useState } from 'react'
import StationProperties from './StationProperties/StationProperties';
import { Station } from '../../types/Station';
import StationsTable from './StationsTable/StationsTable';
import Header from './Header/Header';


function Stations() {

  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [activeGenreId, setActiveGenreId] = useState<string>('');

  return (
    <Stack flex="1" gap="4" p="4">
      <Header activeGenreId={activeGenreId} setActiveGenreId={setActiveGenreId} />
      <StationsTable
        onRowClick={setActiveStation}
        activeGenreId={activeGenreId} />
      {activeStation && (
        <StationProperties station={activeStation as Station} onClose={() => {
          setActiveStation(null);
        }} />
      )}
    </Stack>
  );
}

export default Stations;