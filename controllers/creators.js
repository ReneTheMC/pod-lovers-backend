require('dotenv').config();
const express = require('express');
const router = express.Router();
const Creator = require('../models/creator');
const passport = require('passport');
const axios = require("axios")
let token;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

router.post('/', (req, res) => {
    console.log(req.body)
    const searchTerm= req.body.q
    axios({
        url: "https://api.podchaser.com/graphql",
        method: "post",
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
              `,
        },
      })
      .then((result) => {
        console.log(result.data);
        token = result.data.data.requestAccessToken.access_token;
    const options= {
        method: 'post',
        url: "https://api.podchaser.com/graphql",
        params: {q: searchTerm},
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
 axios.get( "https://api.podchaser.com/graphql", options).then(function(response){

    console.log(response.data.data.creators.data);
    if (response.status === 200 && response.data.data.creators.data && response.data.data.creators.data.length) {
        res.status(200).render('/', {creators: response.data.data.creators.data});
    } else {
        res.status(404).render('404');
    }
  }).catch(function (error) {
      console.error(error);
  });
  });
})



     
module.exports = router;