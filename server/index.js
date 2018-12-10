
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Add routes files
const products = require('./api/routes/products');
const orders = require('./api/routes/orders');
const user = require('./api/routes/user');
const images = require('./api/routes/images');
const stats = require('./api/routes/stats');

mongoose.connect('mongodb://localhost:27017/node-shop',
  {
    useNewUrlParser: true
  }
);

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

app.use(morgan('dev'));



//Handling body message. Only for training purpose, in real dev should use formidable package
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use('/server/uploads', express.static('server/uploads'));

//Set up some headers for allowing other domain use this api
app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requsted-With, Accept, Authorization'
    );
  //If request has method options than return header and respond empty json
  if(req.method === "Options"){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/user', user);
app.use('/api/images', images);
app.use('/api/stats', stats);


async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
