import fs from 'node:fs'

export default defineEventHandler(async (event) => {
        const body = await readBody(event);

        fs.appendFile(`public/${body.path}`, body.content + '\n', (err) => {
            if (err) throw err;
        })
    
})