import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import Header from "./Header/Header";
import GenresTable from "./GenreTable/GenresTable";
import GenreProperties from "./GenreProperties/GenreProperties";

function Genres() {

  const [activeGenreId, setActiveGenreId] = useState<string>('');

  return (
    <Stack flex="1" gap="4" p="4">
      <Header />
      <GenresTable onRowClick={setActiveGenreId} />
      {activeGenreId && (
        <GenreProperties genreId={activeGenreId} onClose={() => {
          setActiveGenreId('');
        }} />
      )}
    </Stack>
  );
}

export default Genres;