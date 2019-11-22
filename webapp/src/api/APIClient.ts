import axios, { AxiosRequestConfig } from "axios";

import { Response } from "../models/API";

class APIClient {
    /**
     * Singleton that creates an `APIClient` and initiates a request assuming
     * the shape of the response.
     */
    public static request<P extends Response>(
        endpoint: string, options: AxiosRequestConfig = {}
    ) {
        if (!APIClient.client) {
            APIClient.client = new APIClient();
        }

        return APIClient.client.connect<P>(endpoint, options);
    }

    private static client?: APIClient;

    private URL: string;

    constructor(https?: boolean) {
        const { REACT_APP_API: API_URL } = process.env;
        const USE_URL = API_URL || "localhost:5000/api";

        const useProtocol = https
            ? "https"
            : "http";

        this.URL = `${useProtocol}://${USE_URL}`;
    }

    public connect<T>(endpoint: string, options: AxiosRequestConfig = {}) {
        return axios.request<T>({
            ...options,
            url: `${this.URL}${endpoint}`
        });
    }
}

export default APIClient;
