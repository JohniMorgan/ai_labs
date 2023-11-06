import api from './axios.configuration';


export class Logger {
    private static buffer : string;
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    openStream() {
        $fetch('/api/createlog', {
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
        await $fetch('/api/logs', {
            method: 'post',
            headers: {
                contentType: 'text/plain; charset=utf-8',
            },
            body: JSON.stringify({
                content: Logger.buffer,
                path: this.filePath,
            }),
        })  
    }
}