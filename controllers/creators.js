require('dotenv').config();
const express = require('express');
const router = express.Router();
const Creator = require('../models/creator');
const passport = require('passport');
const axios = require("axios")
const token=process.env.TOKEN ;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

 axios({
    url: 'https://api.podchaser.com/graphql',
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      query: `
      {
        creator(identifier: CreatorIdenitfier) {
            name,
            formalName,
            apcid,
            bio
        }
    }
        `
    }
  }).then(result => {
    console.log(result.data);
  }).catch(err => {
    console.log(err)
    });
module.exports = router;