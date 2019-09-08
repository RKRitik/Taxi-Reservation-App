const express =require('express');
const oracledb =require('oracledb');
const app = express();
app.listen(3000,()=>{console.log('listening at 3000')}); //telling app to listen to requests at port 3000
//and giving it an anonymous callback function.

app.use(express.static('public')); //telling app to use files from directory : "public"
app.use(express.json({limit:'1mb'}));//parse incoming requests with JSON payloads


app.post('/api',(request,response)=> {
    response.json({
        status: 'success'
    });
});
