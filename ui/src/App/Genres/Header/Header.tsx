import { Flex } from '@chakra-ui/react'
import NewGenre from './NewGenre/NewGenre';

function Header() {

  return (
    <Flex justifyContent="space-between">
      <NewGenre />
    </Flex>
  );
}

export default Header;