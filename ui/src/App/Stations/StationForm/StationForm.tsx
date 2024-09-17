import React from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Text,
  SliderThumb,
  Flex,
} from '@chakra-ui/react';
import { AddStationBody, useGenresData } from '../../../api/api';

type StationFormProps = {
  setFormData: (data: AddStationBody) => void;
  formData: AddStationBody;
  newGenreName: string;
  setNewGenreName: (name: string) => void;
};

const StationForm = ({
  setFormData,
  formData,
  newGenreName,
  setNewGenreName,
}: StationFormProps) => {

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

  const genres = useGenresData();

  return (
    <>
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
          defaultValue={parseInt(formData.frequency)}>
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
    </>
  );
};

export default StationForm;