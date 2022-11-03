require('dotenv').config();
const express = require('express');
const router = express.Router();
const Creator = require('../models/creator');
const passport = require('passport');
const axios = require("axios")
const token=process.env.TOKEN ;
// const clientKey = process.env.CLIENT_KEY;
// const clientSecret = process.env.CLIENT_SECRET;

router.post('/', (req, res) => {
    console.log(req.body)
    const searchTerm= req.body.q
    const options= {
        method: 'post',
        url: "https://api.podchaser.com/graphql",
        params: {q: searchTerm},
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
 axios.get( "https://api.podchaser.com/graphql", options).then(function(response){
    // url: 'https://api.podchaser.com/graphql',
    // method: 'post',
    // headers: {
    //   Authorization: `Bearer ${token}`
    // },
    // data: {
    console.log(response.data.creators);
    if (response.status === 200 && response.data.creators && response.data.creators.length) {
        res.status(200).render('/', {creators: response.data.creators});
    } else {
        res.status(404).render('404');
    }
  }).catch(function (error) {
      console.error(error);
  });
  });



     
module.exports = router;