import useApiData from './useApiData';
import useApiPost from './useApiPost';
import useApiDelete from './useApiDelete';
import useApiPut from './useApiPut';
import useApiRefresh from './useApiRefresh';
import { Genre } from '../types/Genre';
import { useToast } from '@chakra-ui/react';

export const useGenresData = () => {
  return useApiData<Genre[]>('genres')?.data?.sort((a, b) => a.name.localeCompare(b.name));
}

export type AddGenreBody = Omit<Genre, 'id'>;

export const useAddGenre = () => {
  const post = useApiPost();
  const openToast = useToast();

  const refetchGenres = useApiRefresh('genres');

  return async (genre: Omit<Genre, 'id'>) => {
    const data = await post<AddGenreBody>('genres', genre);
    await refetchGenres();
    openToast({
      title: 'Genre added',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    return data.json() as Promise<Genre>;
  };
}

export const useGenreDelete = () => {
  const deleteGenre = useApiDelete();
  const openToast = useToast();

  const refetchGenres = useApiRefresh('genres');

  return async (id: string) => {
    await deleteGenre(`genres/${id}`);
    await refetchGenres();
    openToast({
      title: 'Genre deleted',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
}

export const useGenreUpdate = () => {
  const put = useApiPut();
  const openToast = useToast();

  const refetchGenres = useApiRefresh('genres');

  return async (id: string, genre: AddGenreBody) => {
    await put(`genres/${id}`, genre);
    await refetchGenres();
    openToast({
      title: 'Genre updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
}
