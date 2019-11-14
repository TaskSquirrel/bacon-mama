import { AxiosRequestConfig } from "axios";

import { Response } from "../../models/API";

import APIClient from "../../api/APIClient";

/**
 * Inserts `Authorization` header to axios requests.
 */
const useAPI = () => {
    const request = <P extends Response>(
        url: string, options?: AxiosRequestConfig
    ) => {
        const headers = options ? options.headers : {};

        return APIClient.request<P>(
            url,
            {
                ...options,
                headers: {
                    ...headers
                }
            }
        );
    };

    return request;
};

export default useAPI;
