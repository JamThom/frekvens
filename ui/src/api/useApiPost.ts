import useApiRequest from "./useApiRequest";

const useApiPost = () => {
    return useApiRequest({ method: 'POST' });
}

export default useApiPost;