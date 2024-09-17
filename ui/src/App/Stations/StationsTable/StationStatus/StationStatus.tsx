import {
  Button,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { Station } from '../../../../types/Station';
import { useState } from 'react';
import StationStatusModal from './StationStatusModal/StationStatusModal';

interface StationStatusProps {
  station: Station;
}

const StationStatus = ({ station }: StationStatusProps) => {

  const [isChecking, setIsChecking] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);

  const { isAvailable, streamUrl } = station;

  const openToast = useToast();

  const setCheckingState = (state: boolean) => {
    setIsChecking(state);
  };

  const fetchStationStatus = async (url: string) => {
    return await fetch(url);
  };

  const handleResponse = (response: Response) => {
    if (response.ok) {
      openToast({
        title: 'Station is up',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setModalMounted(true);
    }
  };

  const handleError = (error: unknown) => {
    console.error('Error checking station status:', error);
    setModalMounted(true);
  };

  const checkIsUp = async () => {
    try {
      setCheckingState(true);
      const response = await fetchStationStatus(streamUrl);
      handleResponse(response);
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setCheckingState(false);
    }
  };

  return (
    <Flex
      alignItems="center"
      gap="2"
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {isAvailable ? '✅' : '❌'} <Button
        isDisabled={isChecking}
        onClick={checkIsUp}
        size="xs">Refresh</Button>
      {modalMounted && <StationStatusModal
        onClose={() => setModalMounted(false)}
        station={station} />}
    </Flex>
  );
};

export default StationStatus;