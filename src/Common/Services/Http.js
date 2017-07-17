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
