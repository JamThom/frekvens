import { useQuery } from '@tanstack/react-query'
import getApiUrl from './getApiUrl';
import { useNavigate } from 'react-router-dom';
import { useAccessToken } from './Auth';

const useApiData = <T>(endpoint: string) => {

  const navigate = useNavigate();

  const accessToken = useAccessToken();

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(`${getApiUrl()}/${endpoint}`,
        {
          headers: {
            'authorization': `Bearer ${accessToken}`,
          },
        });
      if (res.status === 401) {
        navigate('/login');
      }
      if (!res.ok) {
        throw new Error(res.status.toString());
      }
      const data = res.json();
      return data;
    },
  });

  return { isLoading, error, data: data as T, isFetching };
}

export default useApiData;