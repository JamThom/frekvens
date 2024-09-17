import { useToast } from '@chakra-ui/react';
import getApiUrl from './getApiUrl';

const useApiRequest = (data: RequestInit) => {


  const openToast = useToast();

  return async <T>(endpoint: string, body?: T) => {
    const response = await fetch(`${getApiUrl()}/${endpoint}`, {
      ...data,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const { description } = await response.json();
      openToast({
        title: 'An error occurred',
        description,
        status: 'error',
        isClosable: true,
      });
      throw new Error('Failed to post');
    }
    if (response.status === 204) {
      return;
    }
    return response.json();
  }
};

export default useApiRequest;