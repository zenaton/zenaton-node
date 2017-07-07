import axios from 'axios';

    export const get = (url) => {
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error.response)
                });
        });
    }

    export const post = (url, body) => {
        return new Promise((resolve, reject) => {
            axios.post(url, body)
                .then(response => {
                    resolve(response.data)})
                .catch(error => {
                    reject(error.response)
                });
        });
    }

    export const put = (url, body) => {
        return new Promise((resolve, reject) => {
            axios.put(url, body)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error.response)
                });
        });
    }
