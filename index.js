const express = require('express');
const app = express();
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
app.use(express.json());
const bodyParser = require('body-parser');
const port = 3000;

// Key and End Point details of Azure Face API
const key = 'key';
const Endpoint_detect = 'End point URL for Face detection';
const Endpoint_verify = 'End Point URL for Face verify';


app.use(express.urlencoded({extended: true}));

//Swagger implementation
const options = {
    swaggerDefinition: {
      info: {
        title: 'Face  API - Final project',
        version: '1.0.0',
        description: 'ITIS-6177 Final Project autogenerated swagger doc',
      },
      host:'167.172.151.164:3000',
      basePath: '/',
    },
    apis: ['./index.js'],
  };

const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());

/**
 * @swagger
 * definitions:
 *  Detect:
 *   type: object
 *   properties:
 *    url:
 *     type: string
 *     description: Image URL
 *     example: 'https://cdn-wp.thesportsrush.com/2022/03/fa6c8a09-ipl-2022-captains.jpg'
 *  Verify:
 *   type: object
 *   properties:
 *    faceId1:
 *     type: string
 *     description: Face Id retrieved from Face detect API
 *     example: '0ca9c346-8207-4baa-b66b-3586818a0d2b'
 *    faceId2:
 *     type: string
 *     description: Face Id retrieved from Face detect API
 *     example: 'c4fa1c85-fdad-4449-99dd-5d9bf332b735'
 */

/**
 * @swagger
 * /detect:
 *  post:
 *   summary: Face Detect API
 *   description: API to detect faces in an image
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of the face detect API
 *      schema:
 *       $ref: '#/definitions/Detect'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Detect'
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description : Bad Request. Might be invalid URL or invalid Image size
 *    401:
 *     description: Unspecified
 *    500:
 *     description: Internal Server Error
 */

// post method for Face Detection
app.post('/detect', (req,res)=>{
// reading the image URL from the request body    
var imageURL = req.body.url;

//Calling the API using axios
axios({
    method: 'post',
    url: Endpoint_detect,
    params: {
        returnFaceId: true,
        returnFaceLandmarks: true,
        returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories'
    },
    data: {
      url: imageURL
 
    },
    headers: { 'Ocp-Apim-Subscription-Key': key }
     
  }).then(function (response) {
      res.send(response.data);
}).catch(function (error) {
    console.log(error)
    
});
});


/**
 * @swagger
 * /verify:
 *  post:
 *   summary: Face Verify API
 *   description: API to verify whether two faces belong to a same person or whether one face belongs to a person.
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Body of the Face verify API
 *      schema:
 *       $ref: '#/definitions/Verify'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Verify'
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description : Bad Request. Might be invalid face Id
 *    401:
 *     description: Unspecified 
 *    500:
 *     description: Internal Server Error
 */
app.post('/verify', (req,res) => {
    // reading the Face Id's from the request body
    var faceId1 = req.body.faceId1;
    var faceId2 = req.body.faceId2;
    //Calling the API using axios
    axios({
        method: 'post',
        url: Endpoint_verify,
        params: {
        },
        data: {
          faceId1 : faceId1,
          faceId2 : faceId2
        },
        headers: {
            'Ocp-Apim-Subscription-Key': key
        }
         
      }).then(function (response) {
        
          res.json(response.data);
    }).catch(function (error) {
        console.log(error)
        
    });

});


app.get('/', (req,res) => {
   res.send("Please execute http://167.172.151.164:3000/docs for executing the API");
});


app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
    });
