import request from 'sync-request';

    export const get = (url) => {
        try {
            const response = request('GET', url);

            return JSON.parse(response.getBody('utf8'));
        } catch (e) {
            return e.message;
        }
    };

    export const post = (url, body) => {
        try {
            const response = request('POST', url, {
                json: body
            });
            return JSON.parse(response.getBody('utf8'));
        } catch (e) {
            return e.message;
        }


    };

    export const put = (url, body) => {
        try {
            const response = request('PUT', url, {
                json: body
            });

            return JSON.parse(response.getBody('utf8'));
        } catch (e) {
            return e.message;
        }
    };
