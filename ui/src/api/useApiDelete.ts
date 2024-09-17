import useApiRequest from "./useApiRequest";

const useApiDelete = () => {
    return useApiRequest({ method: 'DELETE' });
};

export default useApiDelete;