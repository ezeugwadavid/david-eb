const { Pool, Client } = require('pg');
const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cons = require('consolidate'),
dust = require('dustjs-helpers');


app = express();

// DB connect string

 //var connectionString = "postgres://postgres:66139868AH@localhost:5432/receipebookdb";
 /*const config = {
    user: 'David',
    database: 'receipebookdb',
    password: '66139868AH',
    port: 5432
};*/ 

// Assign Dust Engine To .dust files

app.engine('dust', cons.dust);

// Set default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');


// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// pool takes the object above -config- as parameter
const connectionString = 'postgresql://David:66139868AH@localhost:5432/receipebookdb'

const pool = new Pool({
    connectionString: connectionString,
  })
  


app.get('/', (req, res, next) => {
   pool.connect(function (err, client, done){
        if (err) {
            console.log("Can not connect to the DB" + err);
        } 
       // console.log('databaseconnected')
        client.query('SELECT * FROM menus', function(err, result){
            
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            // res.status(200).send(result.rows);
            //console.log('RESULT HERE OOOOOO', result)

             res.render('index', {menus: result.rows});
             
            done();
        });
    }); 

    // pools will use environment variables
// for connection information
 /*pool.query('SELECT * from menu', (err, res) => {
    console.log(res.rows)
    pool.end()
  })*/
  

}); 



app.post('/add',function(req, res){

    pool.connect(function (err, client, done){
        if (err) {
            console.log("Can not connect to the DB" + err);
        } 
       // console.log('databaseconnected')
       client.query("INSERT INTO menus(name, ingredients, instructions) VALUES($1, $2, $3)",
       [req.body.name, req.body.ingredients, req.body.instructions]);
          done();
          res.redirect('/');

       

        });
    }); 


     app.delete('/delete/:id', function(req, res){
         
        pool.connect(function (err, client, done){
            if (err) {
                console.log("Can not connect to the DB" + err);
            } 
           // console.log('databaseconnected')
           client.query("DELETE FROM menus WHERE id = $1",
           [req.params.id]);
              done();
              res.send(200);
    
           
    
            });



     });





app.post('/edit', function(req, res){
    pool.connect(function (err, client, done){
        if (err) {
            console.log("Can not connect to the DB" + err);
        } 
       // console.log('databaseconnected')
       client.query("UPDATE menus SET name=$1, ingredients=$2, instructions=$3 WHERE id = $4",
       [req.body.name, req.body.ingredients, req.body.instructions, req.body.id]);
          done();
          res.redirect('/');

    });

});










// Server
app.listen(3000, function(){
    console.log('server started on port 3000');
});
