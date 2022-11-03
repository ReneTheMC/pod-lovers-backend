require('dotenv').config();
const express = require('express');
const router = express.Router();
const Podcast = require('../models/podcast');
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
          const randPodcasts = {
            method: "post",
            url: "https://api.podchaser.com/graphql",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              query: `query {
                  podcasts(searchTerm: "${searchTerm}") {
                      paginatorInfo {
                          currentPage,
                          hasMorePages,
                          lastPage,
                      },
                      data {
                          imageUrl,
                          title,
                          description,
                    }
                }  
              }`,
            },
          };
          axios
            .request(randPodcasts)
            .then((response) => {
              console.log('Loading Podcasts....',response.data.data.podcasts.data);
              res.json({ podcasts: response.data.data.podcasts.data })
            })
            .catch((error) => {
              console.log("error", error);
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
      
})

     
module.exports = router;