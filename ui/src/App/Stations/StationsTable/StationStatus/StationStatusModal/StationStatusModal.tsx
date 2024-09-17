import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useToast
} from '@chakra-ui/react';
import { useStationUpdate } from '../../../../../api/api';
import { Station } from '../../../../../types/Station';
import { useState } from 'react';

interface StationStatusModalProps {
  onClose: () => void;
  station: Station;
}

const StationStatusModal = ({ onClose, station }: StationStatusModalProps) => {
  const updateStation = useStationUpdate();

  const openToast = useToast();

  const handleConfirm = async () => {
    try {
      await updateStation(station.id, { ...station, isAvailable: false });
      openToast({
        title: 'Station status updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      console.error('Error updating station status:', error);
    }
  };

  const [isOpened, setIsOpened] = useState(true);

  const handleClose = () => {
    setIsOpened(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <Modal isOpen={isOpened} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Station Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>The radio station is currently down. Would you like to update the status in the database?</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
            Yes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StationStatusModal;