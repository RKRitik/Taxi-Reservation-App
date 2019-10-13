const express =require('express');
const oracledb =require('oracledb');
oracledb.autoCommit = true;
//const Joi = require('@hapi/joi.');
const fetch = require('node-fetch');
// const geocoding = require();
const app = express();
app.listen(3000,()=>{console.log('listening at 3000')}); //telling app to listen to requests at port 3000
//and giving it an anonymous callback function.

app.use(express.static('public')); //telling app to use files from directory : "public"
app.use(express.json({limit:'1mb'}));//parse incoming requests with JSON payloads
//app.use(express.bodyParser());
// the application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.
app.post('/api',(request,response)=> {
    console.log('i got a request!');
    console.log(request.body);
    response.json({
         status: 'success'
     });
});
app.post('/details/:userId',async (req,res)=>{
    const nameData = req.params.userId.split(',');
    console.log('name data '+nameData);
   // res.send('Checking Database!!!');
    try {

        let connection = await oracledb.getConnection(  {
            user          : "SYSTEM",
            password      : 'root',
            connectString : "localhost/oracle"
                                                 });
        console.log('connection made');


     //   let json = JSON.stringify(myContent);
        let query = 'SELECT * ' +
            ' FROM user__ ' +
             ' where user_id = \'' + nameData +'\'' ;
       //const query = ;
       console.log('query : '+ query);
        const result = await connection.execute(query);
        console.log('result rows = ');
        console.log(result.rows);
        res.json(result);
    } catch (err) {


        console.error(err);
    }

    });

app.post('/create/:user_id/:fname/:lname/:phone/:type', async (req,res)=>{
    //console.log('inside create acc');
  //  app.post('/create/:details', async (req,res)=>{
    // res.send('Checking Database!!!');
       // const accData = req.params.details.split(',');
     //   console.log(accData.entries());
    try {
       let connection = await oracledb.getConnection(  {
            user          : "SYSTEM",
            password      : 'root',
            connectString : "localhost/oracle"
        });

        console.log(req.params.user_id);
        const user_Id = req.params.user_id;
        const f_name = req.params.fname;
        const l_name = req.params.lname;
        const phone = req.params.phone;
        const type = req.params.type;
        //   const user_Id = accData[0];
       //   const f_name = accData[1];
       //   const l_name = accData[2];
       //   const phone = accData[3];
       //   const type = accData[4];
        // let json = JSON.stringify(user_Id);
         let query = 'insert into user__  ' +
             ' (user_id , f_name , l_name , phone,user_type)' +
             ' values ( \'' + user_Id + '\' ,' +
             '\' '+ f_name + '\' ,'  +
             '\' '+ l_name + '\' ,'  +
             '\' '+ phone + '\' ,'  +
             '\''+ type + '\' )'  ;

             console.log('query : '+ query);
        const result = await connection.execute(
            query
        );

        console.log(result.rowsAffected);
        res.json(result);
    } catch (err) {


        console.error(err);
    }

});


app.get('/names/:data', async (req,res)=>{
    const nameData = req.params.data.split(',');
    console.log('I got a request to find names whose details are :');
    console.log(nameData);

});
app.get('/current',()=>{
   console.log('got request inside current');
});