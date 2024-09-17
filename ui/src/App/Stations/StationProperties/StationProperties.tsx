import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button
} from '@chakra-ui/react';
import { Station } from '../../../types/Station';
import { AddStationBody, useAddGenre, useStationUpdate } from '../../../api/api';
import StationForm from '../StationForm/StationForm';

type StationPropertiesProps = {
  station: Station;
  onClose: () => void;
};

const StationProperties: React.FC<StationPropertiesProps> = ({ station, onClose }) => {

  const [formData, setFormData] = useState<AddStationBody>(station);

  const updateStation = useStationUpdate();
  const addGenre = useAddGenre();

  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    setUpdating(true);
    if (formData.genreId === 'new') {
      const newGenre = await addGenre({ name: newGenreName });
      formData.genreId = newGenre.id;
    }
    await updateStation(station.id, formData);
    setUpdating(false);
  };

  const [newGenreName, setNewGenreName] = useState('');

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Station Properties</DrawerHeader>

          <DrawerBody>
            <StationForm
              formData={formData}
              setFormData={setFormData}
              newGenreName={newGenreName}
              setNewGenreName={setNewGenreName} />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={updating}
              colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default StationProperties;