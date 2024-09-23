
import { useToast } from '@chakra-ui/react';
import { Station } from '../types/Station';
import useApiData from './useApiData';
import useApiDelete from './useApiDelete';
import useApiPost from './useApiPost';
import useApiPut from './useApiPut';
import useApiRefresh from './useApiRefresh';

export const useStationsData = () => {
  const { data } = useApiData<Station[]>('stations');
  return data;
}

export type AddStationBody = Omit<Station, 'id'>;

export const useAddStation = () => {
  const post = useApiPost();
  const openToast = useToast();

  const refetchStations = useApiRefresh('stations');

  return async (station: AddStationBody) => {
    await post<AddStationBody>('stations', station);
    await refetchStations();
    openToast({
      title: 'Station added',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
}

export const useStationDelete = () => {
  const deleteStation = useApiDelete();
  const openToast = useToast();

  const refetchStations = useApiRefresh('stations');

  return async (id: string) => {
    await deleteStation(`stations/${id}`);
    await refetchStations();
    openToast({
      title: 'Station deleted',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
}

export const useStationUpdate = () => {
  const openToast = useToast();
  const put = useApiPut();

  const refetchStations = useApiRefresh('stations');

  return async (id: string, station: AddStationBody) => {
    await put<AddStationBody>(`stations/${id}`, station);
    await refetchStations();
    openToast({
      title: 'Station updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
}