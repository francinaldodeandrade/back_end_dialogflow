import app from  './src/app.js'

const port = process.env.PORT
const host_name = process.env.HOST_NAME
const read = process.env.GET

app.listen(port, (req, res)=>{
console.log(`servidor rodando neste local: ${host_name}${port}${read}`);
})

