import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';
import { useGenresData, useGenreUpdate } from '../../../api/api';

type GenrePropertiesProps = {
  genreId: string;
  onClose: () => void;
};

const GenreProperties: React.FC<GenrePropertiesProps> = ({ genreId, onClose }) => {

  const genre = useGenresData().find(g => g.id === genreId);

  const [formData, setFormData] = useState({
    name: genre?.name ?? ''
  });

  const updateGenre = useGenreUpdate();
  const openToast = useToast();

  const handleSubmit = async () => {
    await updateGenre(genre?.id ?? '', formData);
    openToast({
      title: 'Genre updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Genre Properties</DrawerHeader>

          <DrawerBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChangeName}
              />
            </FormControl>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default GenreProperties;