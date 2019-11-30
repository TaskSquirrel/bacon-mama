import { AxiosRequestConfig } from "axios";

import { Response } from "../../models/API";

import APIClient from "../../api/APIClient";
import useUser from "./useUser";

/**
 * Inserts `Authorization` header to axios requests.
 */
const useAPI = () => {
    const { token } = useUser();

    const request = <P extends Response>(
        url: string, options?: AxiosRequestConfig
    ) => {
        const headers = options ? options.headers : {};
        const requestHeaders = {
            ...headers
        };

        if (token) {
            requestHeaders.Authorization = token;
        }

        return APIClient.request<P>(
            url,
            {
                ...options,
                headers: requestHeaders
            }
        );
    };

    return request;
};

export default useAPI;
