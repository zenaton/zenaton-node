import { get, post, put } from '../Common/Services/index';

let instance = null;

const MICROSERVER_URL = 'http://localhost:4001';

export default class Microserver {
    constructor() {
        // Singleton
        if (instance) {
            return instance
        }

        instance = this;
    }

    sendEnv(body)
    {
        const url = this.microServerUrl('/configuration');

        return new Promise((resolve, reject) => {
            post(url, body)
                .then((response) => {
                    console.log(response.msg);
                    resolve(response.msg)
                })
                .catch((error) => {
                    reject(error);
                });
        });

    }

    microServerUrl(ressource)
    {
        return MICROSERVER_URL + ressource;
    }
}
