import TaskyException from './TaskyException';

export default class ModifiedDeciderException extends TaskyException {
    constructor(message = null){
        super(message || "Error: your workflow has changed - please use versioning", 'ModifiedDeciderException');
    }
}
