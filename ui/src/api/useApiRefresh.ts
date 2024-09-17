import { useQuery } from '@tanstack/react-query'

const useApiRefresh = (endpoint: string) => {

    const refetch = useQuery({ queryKey: [endpoint] }).refetch;

    return refetch;

}

export default useApiRefresh;