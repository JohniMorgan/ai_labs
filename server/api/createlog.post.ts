import fs from 'fs'
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    console.log(body.value);
    
    fs.writeFile(`public/${body.value}`,'', (err) => {
        console.log(err);
        if (err) throw err;
    })
})