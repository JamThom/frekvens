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
import { useStationDelete } from '../../../../api/stations';

interface Station {
  id: string;
  name: string;
  // Add other station properties if needed
}

interface DeleteStationProps {
  station: Station;
}

const DeleteStation: React.FC<DeleteStationProps> = ({ station }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const stationDelete = useStationDelete();

  const handleDelete = async () => {
    await stationDelete(station.id);
    onClose();
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpen();
  }

  return (
    <>
      <Button size="xs" colorScheme="red" onClick={handleClick}>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Station</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete the station "{station.name}"?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteStation;