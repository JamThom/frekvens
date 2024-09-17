import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { useGenreDelete } from '../../../../api/genres';
import { useStationsData } from '../../../../api/stations';

interface Genre {
  id: string;
  name: string;
  // Add other Genre properties if needed
}

interface DeleteGenreProps {
  genre: Genre;
}

const DeleteGenre: React.FC<DeleteGenreProps> = ({ genre }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const stations = useStationsData();

  const genreDelete = useGenreDelete();

  const handleDelete = async () => {
    await genreDelete(genre.id);
    onClose();
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpen();
  }

  const hasStations = stations?.some(station => station.genreId === genre.id);

  return (
    <>
      <Button size="sm" colorScheme="red" onClick={handleClick}>
        Delete
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {hasStations ? (
            <>
              <ModalHeader>Delete Genre</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>This Genre has stations associated with it. Please delete the stations before deleting the Genre.</Text>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>Delete Genre</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Are you sure you want to delete the Genre "{genre.name}"?</Text>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteGenre;