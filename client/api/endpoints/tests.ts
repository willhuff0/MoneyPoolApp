import { AxiosInstance } from "axios";

export const test = (client: AxiosInstance) => async (param: number) => {
    const response = await client.post('test', {
        param: param + 1,
    });
    return response.data;
}