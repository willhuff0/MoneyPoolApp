import { AxiosInstance } from "axios";

import * as Tests from './endpoints/tests';

export const createApiSdk = (client: AxiosInstance) => {
    return {
        tests: {
            test: Tests.test(client),
        }
    };
}

export type Sdk = ReturnType<typeof createApiSdk>;