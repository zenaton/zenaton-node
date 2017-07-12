import request from 'sync-request';

    export const get = (url) => {
        const response = request('GET', url);

        return JSON.parse(response.getBody('utf8'));

    };

    export const post = (url, body) => {
        const response = request('POST', url, {
            json: body
        });

        return JSON.parse(response.getBody('utf8'));
    };

    export const put = (url, body) => {
        const response = request('PUT', url, {
            json: body
        });

        return JSON.parse(response.getBody('utf8'));
    };
    // export const get = (url) => {
    //     return new Promise((resolve, reject) => {
    //         axios.get(url)
    //             .then(response => {
    //                 resolve(response.data)
    //             })
    //             .catch(error => {
    //                 reject(error.response)
    //             });
    //     });
    // }
    //
    // export const post = (url, body) => {
    //     return new Promise((resolve, reject) => {
    //         axios.post(url, body)
    //             .then(response => {
    //                 resolve(response.data)})
    //             .catch(error => {
    //                 reject(error.response)
    //             });
    //     });
    // }
    //
    // export const put = (url, body) => {
    //     return new Promise((resolve, reject) => {
    //         axios.put(url, body)
    //             .then(response => {
    //                 resolve(response.data)
    //             })
    //             .catch(error => {
    //                 reject(error.response)
    //             });
    //     });
    // }
