require('dotenv').config();
const express = require('express');
const router = express.Router();
const Creator = require('../models/creator');
const passport = require('passport');
const axios = require("axios")
const token=process.env.TOKEN ;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

/**
 * Critical documentation to read prior to working with this API. 
 */

/**
 * The code below will be used to authenticating to your api using the API key and secret provided to you when registering with podchaser
 * 
 * Keep in mind, this key will need to be updated often, so you'll need to create a flow that will retry for a new access token every time you get a 403 unauthorized status response(implying your key is no longer valid)
 * 
 * I would not recommend re-generating your access token on every request, as that will eat away at your graphql request points, of which you only have 25,000 on the free tier of podchaser.
 */
axios({
  url: 'https://api.podchaser.com/graphql',
  method: 'post',
  data: {
    query: `
    mutation {
        requestAccessToken(
            input: {
                grant_type: CLIENT_CREDENTIALS
                client_id: "${clientKey}"
                client_secret: "${clientSecret}"
            }
        ) {
            access_token
        }
    }
      `
  }
}).then((result) => {
  console.log(result.data)
  token = result.data.data.requestAccessToken.access_token;
    /**
     * Once you get you access token, you'll want to attach it to the axios request using a headers property like shown below
     * 
     * you will also want to be paying attention to the graphql query(string template below and above). This needs to be added to the request body(inside of data) as a property called query
     * 
     * this will use the model passed in the query to generate complex queries on the graphql side allow you to grab from multiple collections in one request.
     */
  axios({
    url: 'https://api.podchaser.com/graphql',
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      query: `
      {
        (identifier: {id: "731600", type: PODCHASER}) {
            title,
            description,
            applePodcastsId
        }
    }
        `
    }
  }).then(result => {
    console.log(result.data);
  }).catch(err => {
    console.log(err)
    });
}).catch(err => {
    console.log(err)
});
module.exports = router;