

export default defineEventHandler(async (event) => {
        return {
            status: "success",
            code: 200,
            filename: "hello.logs.txt",
        } 
})