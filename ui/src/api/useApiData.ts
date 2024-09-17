import { useQuery } from '@tanstack/react-query'
import getApiUrl from './getApiUrl';

const useApiData = <T>(endpoint: string) => {

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(`${getApiUrl()}/${endpoint}`)
      const data = res.json()
      return data;
    }
  });

  return { isLoading, error, data: data as T, isFetching };
}

export default useApiData;