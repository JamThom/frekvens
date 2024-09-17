import useApiRequest from "./useApiRequest";

const useApiPut = () => {
    return useApiRequest({ method: 'PUT' });
}

export default useApiPut;