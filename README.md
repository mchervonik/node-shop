# node-shop

> NoSQL test site

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

Step to deploy localy

    1. Install MongoDB or use MongoDB Atlas(Cloud)
    2. node-shop -> server -> index.js - change your mongo settings (mongoose.connect)
    3. Start mongo: sudo service mongod start
    4. Change the current working directory to your local project
    5. Run in terminal command: npm install
    6. Run in terminal command: npm run dev (in case of error please follow debag info)
    7. Open in browser http://localhost:3000/admin
    8. You will be prompted to log in - click SINGUP and fill form (click SIGNUP button)
    9. Click on SHOP title
    10. Click on PRODUCTS
    11. Create product by clicking on NEW PRODUCT button
    12. After products creation open in browser: http://localhost:3000/
