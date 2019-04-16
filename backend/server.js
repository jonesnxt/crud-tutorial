import "babel-polyfill";
/**
 * Welcome Developer,
 * This is everything you need for basic CRUD operations in the koji world.
 *   Contact us if you have any questions or need help!  contact@gometa.io
 */

/** requirements for Database */
import Jiro from '@madewithjiro/jiro-sdk';
const { Store } = new Jiro();


const uuid = require('uuid');
/** /END requirements for Database */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

/**
 *  Body parser - to decode the POST body's for our endpoints.
 *  More Information: https://github.com/expressjs/body-parser
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true,
}));


// CORS so that our requests can work from all locations.  
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Koji-Request-Tag, x-jiro-request-tag');
  next();
});

/**
 * Basic 'GET' method for endpoint: /hello
 * Returns a json object with the route and a message. 
 */

app.get('/', (req, res) => {
    res.json({route: '/', message: 'Hello Koji Dev!'});
    console.log('request received for /');
});

app.get('/error', (req, res) => {
  console.log('Received Bad Request to GET /error');
  res.status(400).json({error: 'Bad Request, check the README.md for known endpoints!'});
})

app.get('/data', async (req, res) => {    
    var objects = await Store.get('baseDB');
    res.status(200).json(objects)
});

/**
 * Store Data
 * POST method for endpoint: /data/add
 * Creates an entry in the database with your parameters given.   
 * Returns the ID (uuid) of your new stored object.
 */

app.post('/data', async (req, res) => {  
  console.log('POST /data/add', req.body);  
  if (req.body.value){
      var id = uuid.v4();
      var value = req.body.value;
      var object = { id, value };

    await Store.set('baseDB', object.id, object);
    res.status(200).json({ route: '/data', method:'post', id});
  }else{
      res.status(400).json({route: '/data', method:'post', error: 'No Value Set!'});
  }
});


/**
 * Get Data
 * GET method for endpoint: /data/:id
 * 
 * Retrieves the object from the storage mathcing the id (uuid) given in the request parameter.
 * Response contains ID: uuid, found: boolean, object: {}  * 
 */
app.get('/data/:id', async (req, res) => {
  console.log('Request for Object', req.params);
  var found = false;
  var object = await Store.get('baseDB', req.params.id);
  console.log(object);
  if (object && object.id){
      found = true;      
      res.status(200).json({route: '/data/:id', id: req.params.id, found, object})
  }else{
      res.status(404).json({route: '/data/:id', id: req.params.id, found})
  }
});

/**
 * Update Data
 * POST method for endpoint: /data/:id
 * 
 * Replaces the stored object with the new object contained in req.body
 * Response contains the ID: uuid, and found: boolean.
 * If object is not found, found in the response will = false.  No object will be created, use /data POST for creation.
 */
app.post('/data/:id', async (req, res) =>{
  console.log('Update for Object', req.params);
  var found = false;
  var object = await Store.get('baseDB', req.params.id);  
  if (object && object.id){
      found = true;
      if (req.body.value){          
        object.value = req.body.value;
        await Store.set('baseDB', object.id, object);
        res.status(200).json({ route: '/data/:id', method:'post', id: req.params.id, found, object });
      }else{
          res.status(400).json({ route: '/data/:id', method:'post', error: "No Value Set!" });
      }
  }else{
      res.status(404).json({ route: '/data/:id', method:'post', id: req.params.id, found });
  }  
});

/**
 * Delete Data
 * DELETE method for endpoint: /data/:id
 * 
 * Removes an object by id (uuid) if found.
 * If object is not found, found in the response will = false.
 */
app.delete('/data/:id', async (req, res) => {
  console.log('Deleting object', req.params);
  var found = false;
  var object = await Store.get('baseDB', req.params.id);  
  if (object && object.id){
      found = true;
      await Store.delete('baseDB', object.id);
      res.status(200).json({route: '/data/:id', method:'delete', id: req.params.id, found});
  }else{
    res.status(404).json({route: '/data/:id', method:'delete', id: req.params.id, found});
  }  
});

// Start backend server
const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
if (isInLambda) {
    const serverlessExpress = require('aws-serverless-express');
    const server = serverlessExpress.createServer(app);
    exports.default = (event, context) => {
        console.log('NEW', event);
        serverlessExpress.proxy(server, event, context);
    };
} else {
    app.listen(3333, null, async err => {
    if (err) {
        console.log(err.message);
    }
    console.log('[koji] backend started');
    });
}