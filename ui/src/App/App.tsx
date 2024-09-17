import { Flex, Stack } from '@chakra-ui/react'
import NavItem from './NavItem/NavItem';
import { Navigate, Route, Routes, useLocation, Link } from 'react-router-dom';
import Stations from './Stations/Stations';
import Genres from './Genres/Genres';


function App() {

  const location = useLocation();

  return (
    <Flex>
      <Stack alignItems="stretch" height="100vh" minWidth="200" bg="gray.50" gap="4" p="4">
        <Link to="/stations">
          <NavItem isActive={location.pathname.startsWith('/stations')}>Stations</NavItem>
        </Link>
        <Link to="/genres">
          <NavItem isActive={location.pathname.startsWith('/genres')}>Genres</NavItem>
        </Link>
      </Stack>
      <Routes>
        <Route path="/stations" element={
          <Stations />
        } />
        <Route path="/genres" element={<Genres />} />
        <Route path="/" element={<Navigate to="/stations" />} />
      </Routes>
    </Flex>
  );
}

export default App;