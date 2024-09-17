import { Flex } from '@chakra-ui/react'
import NewStation from './NewStation/NewStation';
import GenreTabs from './GenreTabs/GenreTabs';

type HeaderProps = {
  activeGenreId: string;
  setActiveGenreId: (genreId: string) => void;
};

function Header({
  activeGenreId,
  setActiveGenreId
}: HeaderProps) {

  return (
    <Flex justifyContent="space-between">
      <GenreTabs activeGenreId={activeGenreId} setActiveGenreId={setActiveGenreId} />
      <NewStation />
    </Flex>
  );
}

export default Header;