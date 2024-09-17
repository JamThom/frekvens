import React, { useState } from 'react';
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
  useDisclosure
} from '@chakra-ui/react';
import { AddGenreBody, useAddGenre } from '../../../../api/api';

const NewGenre: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<AddGenreBody>({
    name: ''
  });

  const addGenre = useAddGenre();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'index' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await addGenre(formData);
      onClose();
    } catch (error) {
      console.error('Error creating new Genre:', error);
    }
  };

  const validateForm = () => {
    return formData.name !== '';
  };

  return (
    <>
      <Button marginLeft="auto" colorScheme='blue' onClick={onOpen}>Add New Genre</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Genre</ModalHeader>
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

export default NewGenre;