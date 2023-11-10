export class Logger {
    private static buffer : string;
    private filePath : string = '';
    
    openStream() {
        return useFetch('/api/logs');
    }

    setFilePath(path: string) {
        this.filePath = path;
    }

    buferrize(content: string) : void {
        Logger.buffer += content;
    }

    reset() {
        Logger.buffer = '';
    }

    async dump() {

        await $fetch('/api/logs/dump?key=esbutov', {
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