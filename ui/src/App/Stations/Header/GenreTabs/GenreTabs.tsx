import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { useGenresData } from '../../../../api/api';

type GenreTabsProps = {
  activeGenreId?: string;
  setActiveGenreId: (genreId: string) => void;
};

function GenreTabs({
  activeGenreId,
  setActiveGenreId
}: GenreTabsProps) {

  const genres = useGenresData();

  const handleTabsChange = (index: number) => {
    if (index === 0) {
      setActiveGenreId('');
      return;
    }
    setActiveGenreId(genres[index-1].id??'');
  }

  const index = activeGenreId ? genres?.findIndex(({ id }) => id === activeGenreId) + 1 : 0;

  return (
    <Tabs index={index} onChange={handleTabsChange}>
      <TabList>
        <Tab>All</Tab>
        {genres?.map(({ id, name }) => (
          <Tab key={id}>{name}</Tab>
        ))}
      </TabList>
    </Tabs>
  );
}

export default GenreTabs;