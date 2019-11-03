const express =require('express');
const oracledb =require('oracledb');
const path = require('path');
// const fs = require('fs');
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

app.get('/details/:userId',async (req,res)=>{
    const userId = req.params.userId;
       try {
           let connection = await oracledb.getConnection({
               user: "SYSTEM",
               password: 'root',
               connectString: "localhost/oracle"
           });
           let query = `SELECT * FROM user__ where user_id = '${userId}'`;
           console.log(query);
           const result = await connection.execute(query);
           await connection.close();
           if (result.rows.length) {
               const type = result.rows[0][6];
               const user_id = result.rows[0][0];
               if (type === 'Customer')
               {
                   let query2 = `SELECT * FROM RIDE WHERE PASSENGER_ID ='${user_id}'`;
                   console.log(query2);
                   try {let connection = await oracledb.getConnection({
                       user: "SYSTEM",
                       password: 'root',
                       connectString: "localhost/oracle"
                   });
                       let result2 = await connection.execute(query2);
                       connection.close();


                       if (result2.rows.length) {

                           res.setHeader('Content-Type', 'application/json');
                           result2.rows.push({type : 'Customer'});
                           res.end(JSON.stringify(result2.rows));
                       } else {
                           res.setHeader('Content-Type', 'application/json');
                           res.end(JSON.stringify({"message": "No Booked Rides"}));
                       }
                   } catch (err) {
                       res.setHeader('Content-Type', 'application/json');

                       res.end(JSON.stringify({"message": "Some Error Occurred Try Again"}));
                   }
               }
               else {
                   let query2 = `SELECT * FROM RIDE WHERE DRIVER_ID = '${user_id}'`;
                   console.log(query2);
                   try {
                       let connection = await oracledb.getConnection({
                           user: "SYSTEM",
                           password: 'root',
                           connectString: "localhost/oracle"
                       });
                       let result2 = await connection.execute(query2);

                       await connection.close();
                       if (result2.rows.length) {
                           res.setHeader('Content-Type', 'application/json');
                           result2.rows.push({type : 'Driver'});
                           console.log(result2.rows);
                           res.end(JSON.stringify(result2.rows));
                       } else {
                           res.setHeader('Content-Type', 'application/json');
                           res.end(JSON.stringify({"message": "No Customers"}));
                       }
                   }
                   catch (err) {
                       res.setHeader('Content-Type', 'application/json');
                       res.end(JSON.stringify({"message": "Some Error Occurred Try Again"}));
                   }
               }
           }
           else {
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify({"message": "No Such Record Found Try Again"}));
           }
       }
     catch (err) {
           res.setHeader('Content-Type', 'application/json');
           res.end(JSON.stringify({ "message": "Some Error Occurred Try Again" }));
    }

    });

app.post('/create', async (req,res)=>{

    let type ;
    try {
       let connection = await oracledb.getConnection(  {
            user          : "SYSTEM",
            password      : 'root',
            connectString : "localhost/oracle"
        });

        const user_Id = req.body.user_id;
        const f_name = req.body.fname;
        const l_name = req.body.lname;
        const phone = req.body.phone;
        type = req.body.type_;
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

       // console.log(result.rowsAffected);
     //   res.json(result);
        if(type=='Driver'){

            console.log('sending back...');
            res.setHeader('Content-Type', 'application/json');
           res.end(JSON.stringify({ "message": "Driver Account Created Successfully" }));
            }

            // res.render('createDriver');
            // res.sendFile('public/createDriver.html' , { root : __dirname});
            // res.end();

        else{
            console.log('sending back...');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ "message": "Account Created Successfully" }));
        }

    } catch (err) {

        res.setHeader('Content-Type', 'application/json');
        console.log(err);
        res.end(JSON.stringify({ "message": "some error Occurred" }));
    }

});

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

app.post('/pay',async (req,res)=>{
    const  user_id = req.body.user_id;
    const  type = req.body.payment_type;
    const book_id = req.body.booking_id;
    const pay_id = randomString(8);
    try {
        let connection = await oracledb.getConnection({
            user: "SYSTEM",
            password: 'root',
            connectString: "localhost/oracle"
        });
        const query = `insert into pays_for (BOOKING_ID,USER_ID ,PAYMENT_TYPE ,PAYMENT_ID) values ('${book_id}' , '${user_id}' , '${type}' , '${pay_id}'`;
        const result = await connection.execute(query);
        if(result.rows.length){
            console.log(result.rows);
        }
        else{
            res.setHeaders('ContentType','Application/JSON');
            res.end(JSON.stringify({message:'Payment Failed'}));
        }
    }
    catch(err){
        res.setHeaders('ContentType','Application/JSON');
        res.end(JSON.stringify({message:'Some Error Occurred'}));
    }
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
    //console.log('got a request to create a new Ride , request body:');
    const rate = 10,base = 50;
    console.log(req.body);
     const user_id = req.body.user_id;
     const book_id = randomString(8); ///////
     const pickup = req.body.pickup;
     const drop = req.body.drop;
     const dist = 1200; ////////
     const fare = (base + dist/1000 )*rate; /////////

     const taxi = req.body.taxi_type;
     //query to find a suitable taxi according to txi type
    const newQuery = `select v_id, owner_id from taxi where type_ = '${taxi}' and taxi_status = 'Free'` ;
    console.log(newQuery);
    let result,error=false;
    try {
        let connection = await oracledb.getConnection(  {
            user          : "SYSTEM",
            password      : 'root',
            connectString : "localhost/oracle"
        });
        result = await connection.execute(
            newQuery
            // newQuery,
            // { fetchInfo: {"C": {type: oracledb.STRING } }}
        );

        await connection.close();
    }
    catch (err) {
        console.log(err);
        error = true
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({ "message": "Some Error Occurred (Try checking Login ID) "}));

    }
    let js,v_id,driver_id;
    console.log(result);
    if (result.rows.length) {
          v_id = result.rows[0][0];
              driver_id = result.rows[0][1];


        const newQuery2 = `insert into ride (booking_id , pickup_location , drop_location,fare ,distance, 
     passenger_id,vehicle_id,driver_id ) values ( '${book_id}','${pickup}','${drop}','${fare}','${dist}'
      ,'${user_id}','${v_id}','${driver_id}')`;
        console.log(newQuery2);
        try {
            let connection = await oracledb.getConnection({
                user: "SYSTEM",
                password: 'root',
                connectString: "localhost/oracle"
            });
            const result = await connection.execute(
                newQuery2
            );

            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({"message": "Ride Booked Successfully"}));
            // console.log(result.rowsAffected);
            //   res.json(result);
        }
        catch (err) {

            res.setHeader('Content-Type', 'application/json');
            console.log(err);
            res.end(JSON.stringify({"message": "some error Occurred Try Again(check login id)"}));
        }
        const newQuery3 = `update taxi set taxi_status = 'Booked' where v_id = '${v_id}'`;
        console.log(newQuery3);
        try {
            let connection = await oracledb.getConnection({
                user: "SYSTEM",
                password: 'root',
                connectString: "localhost/oracle"
            });
            const result = await connection.execute(
                newQuery3
            );

            await connection.close();
        } catch (err) {
            console.log(err);
        }
    } else {
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({ "message": "NO Suitable Rides Found" }));
    }
});