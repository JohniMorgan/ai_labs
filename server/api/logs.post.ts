import fs from 'fs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    console.log(body);

    fs.appendFile('assets/logs.txt', body.content + '\n', (err) => {
        console.log(err);
    })

    return true;
})