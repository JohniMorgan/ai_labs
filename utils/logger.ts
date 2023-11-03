export class Logger {
    private static buffer : string;
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    openStream() {
        useFetch('/api/createlog', {
            method: 'post',
            body:{
                value:  this.filePath,
            }
        })
    }

    buferrize(content: string) : void {
        Logger.buffer += content;
    }

    reset() {
        Logger.buffer = '';
    }

    async dump() {
        await useFetch('/api/logs', {
            method: 'post',
            headers: {
                contentType: 'text/html; charset=utf-8',
            },
            body: {
                content: Logger.buffer,
                path: this.filePath,
            }
        })  
    }
}