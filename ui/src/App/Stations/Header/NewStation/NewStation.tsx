import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Text,
  SliderThumb,
  Flex,
} from '@chakra-ui/react';
import { AddStationBody, useAddGenre, useAddStation, useGenresData } from '../../../../api/api';

const NewStation: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<AddStationBody>({
    name: '',
    frequency: '',
    streamUrl: '',
    genreId: '',
  });
  const [newGenreName, setNewGenreName] = useState('');

  const addStation = useAddStation();
  const addGenre = useAddGenre();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        frequency: '',
        streamUrl: '',
        genreId: genres?.[0]?.id ?? '',
      });
      setNewGenreName('');
    }
  }, [isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'index' ? parseInt(value) : value,
    });
  };

  const changeFrequency = (value: number) => {
    setFormData({
      ...formData,
      frequency: value.toString(),
    });
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (formData.genreId === 'new') {
        const newGenre = await addGenre({ name: newGenreName });
        formData.genreId = newGenre.id;
      }
      await addStation(formData);
      onClose();
    } catch (error) {
      console.error('Error creating new station:', error);
    }
  };

  const validateForm = () => {
    return formData.name !== '' && formData.frequency !== '' && formData.streamUrl !== '' && formData.genreId !== '';
  };

  const genres = useGenresData();

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>Add New Station</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Station</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <Flex alignItems="center" justifyContent="space-between">
                <FormLabel>Frequency</FormLabel>
                <Text size="sm">{formData.frequency}</Text>
              </Flex>
              <Slider max={100}
                name="frequency"
                onChange={changeFrequency}
                defaultValue={50}>
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Stream URL</FormLabel>
              <Input
                name="streamUrl"
                value={formData.streamUrl}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Genre ID</FormLabel>
              <Select
                name="genreId"
                value={formData.genreId}
                onChange={handleChange}
              >
                {genres?.map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}
                <option value="new">New Genre</option>
              </Select>
            </FormControl>
            {formData.genreId === 'new' && (
              <FormControl mt={4}>
                <FormLabel>New Genre Name</FormLabel>
                <Input
                  name="newGenreName"
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                />
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewStation;