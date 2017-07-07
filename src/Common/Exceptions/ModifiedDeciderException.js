import ZenatonException from './ZenatonException';

export default class ModifiedDeciderException extends ZenatonException {
    constructor(message = null){
        super(message || "Error: your workflow has changed - please use versioning", 'ModifiedDeciderException');
    }
}
