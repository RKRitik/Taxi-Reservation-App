const express =require('express');
const oracledb =require('oracledb');
const path = require('path');
const bodyParser = require('body-parser');
oracledb.autoCommit = false;
//const Joi = require('@hapi/joi.');
const fetch = require('node-fetch');
// const geocoding = require();
const app = express();
app.listen(3000,()=>{console.log('listening at 3000')}); //telling app to listen to requests at port 3000
//and giving it an anonymous callback function.
app.use(bodyParser.json());
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
    let type ;
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
        type = req.params.type;
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
        await connection.close();
       // console.log(result.rowsAffected);
     //   res.json(result);
    } catch (err) {

        res.setHeader('Content-Type', 'application/json');
        console.log(err);
        res.end(JSON.stringify({ "message": "some error Occurred" }));
    }
    if(type=='Driver'){

        res.setHeader('Content-Type', 'text/html');
        console.log('sending file...');
        res.sendFile('public/createDriver.html' , { root : __dirname});
       // res.end();
    }
    else{
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ "message": "Account Created Successfully" }));
    }

});


app.get('/names/:data', async (req,res)=>{
    const nameData = req.params.data.split(','); ;
    console.log('I got a request to find names whose details are :');
    console.log(nameData);

});
app.get('/current',()=>{
   console.log('got request inside current');
});
app.post('/createDriver',async (req,res)=>{
    console.log('got a request to create a drivers account , request body:');
    console.log(req.body);
    const lic_exp = req.body.lic_exp;
    const lic_num = req.body.lic_num;
    const dr_id = req.body.driver_id;
    const shft = req.body.shift_id;
    const newQuery = `insert into driver (lic_exp , lic_num , driver_id , shift_id) values ( '${lic_exp}','${lic_num}','${dr_id}','${shft}')`;
    console.log(newQuery);
    try {
        let connection = await oracledb.getConnection(  {
            user          : "SYSTEM",
            password      : 'root',
            connectString : "localhost/oracle"
        });
        const result = await connection.execute(
            newQuery
        );
        await connection.close();
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({ "message": "Account Created Successfully" }));
        // console.log(result.rowsAffected);
        //   res.json(result);
    } catch (err) {

        res.setHeader('Content-Type', 'application/json');
        console.log(err);
        res.end(JSON.stringify({ "message": "some error Occurred" }));
    }


});
app.post('/bookRide',async (req,res)=>{
    console.log('got a request to create a new Ride , request body:');
    console.log(req.body);
    // const lic_exp = req.body.lic_exp;
    // const lic_num = req.body.lic_num;
    // const dr_id = req.body.driver_id;
    // const shft = req.body.shift_id;
    // const newQuery = `insert into ride (lic_exp , lic_num , driver_id , shift_id) values ( '${lic_exp}','${lic_num}','${dr_id}','${shft}')`;
    console.log(newQuery);
    try {
        let connection = await oracledb.getConnection(  {
            user          : "SYSTEM",
            password      : 'root',
            connectString : "localhost/oracle"
        });
        const result = await connection.execute(
            newQuery
        );
        await connection.close();
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({ "message": "Account Created Successfully" }));
        // console.log(result.rowsAffected);
        //   res.json(result);
    } catch (err) {

        res.setHeader('Content-Type', 'application/json');
        console.log(err);
        res.end(JSON.stringify({ "message": "some error Occurred" }));
    }


});