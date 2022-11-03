require('dotenv').config();
const express = require('express');
const router = express.Router();
const Podcast = require('../models/podcast');
const passport = require('passport');
const axios = require("axios")
const token = process.env.TOKEN ;


router.post('/', (req, res) => {
    console.log(req.body)
    const searchTerm = req.body.q
    const options = {
        method: 'post',
        url: "https://api.podchaser.com/graphql",
        params: {q: searchTerm},
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
 axios.get( "https://api.podchaser.com/graphql", options).then(function(response){
    
    console.log(response.data.podcasts);
    if (response.status === 200 && response.data.podcasts && response.data.podcasts.length) {
        res.status(200).render('/', {podcasts: response.data.podcasts});
    } else {
        res.status(404).render('404');
    }
  }).catch(function (error) {
      console.error(error);
  });
  });



     
module.exports = router;