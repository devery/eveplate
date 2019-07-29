# <%= title %> API

## Usage

```bash
# install modules
npm install

# start in development mode
npm start

# build in production mode
npm build
```
This application is using MongoDB. Be sure you have it. You can run it with Docker for development.

```
docker run --name devery -p 27017:27017 -d mongo
```


## Environment variables

Name       | Description | Example
---------- | ----------- | -------
`APP_ENV` | Defines the environment of the API application. | `APP_ENV='dev'`
`API_PREFIX` | Defines the prefix for the API. | `API_PREFIX='/api'`
`PORT` | Defines the TCP port, the API should run on. | `PORT=4444`
`INFURA_API_KEY` | Defines the infura service key. | `INFURA_API_KEY=''`
`INFURA_NET` | Defines the infura service key. | `INFURA_NET='ropsten'`
`WALLET_PRIVATE_KEY` | Defines the infura service key. | `WALLET_PRIVATE_KEY=''`
`WALLET_ID` | Defines the infura service key. | `WALLET_ID=''`<% if (uses_mongodb) { %>
`MONGODB_URI` | The name of the MongoDB database. | `MONGODB_URI='mongodb://localhost:27017/devery'`<% } %><% if (uses_auth) { %>
`JWT_SECRET` | Secret key for JWT. | `JWT_SECRET='some-secret`<% } %>

## Start coding

Have a look at the following files, to get an idea how to work with the code.

Name       | Description
---------- | -----------
`/src/index.js` | Application's entry point.
`/src/api/devery.routes.js` | Contains devery api.<% if (uses_mongodb) { %>
`/src/boostrap/db.js` | Contains the MongoDB database schema and the database class.<% } %><% if (uses_auth) { %>
`/src/middleware/requireAuth.js` | Contains the config for jwt passport and helpers.<% } %>

## Credits

The project has been generated by [generator](https://github.com) for [Yeoman](http://yeoman.io/).