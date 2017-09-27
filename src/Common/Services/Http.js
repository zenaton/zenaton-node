import request from 'sync-request';

    export const get = (url) => {
        const response = request('GET', url);
        return parseBody(response);
    };

    export const post = (url, body) => {

        const response = request('POST', url, {
            json: body
        });
        return parseBody(response);
    };

    export const put = (url, body) => {

        const response = request('PUT', url, {
            json: body
        });
        return parseBody(response);
    };

    const parseBody = (response) => {
        return JSON.parse(response.body.toString('utf8'));
    };
