require('dotenv').config();
const express = require('express');
const router = express.Router();
const Podcast = require('../models/podcast');
const Comment = require('../models/comment');
const passport = require('passport');
const axios = require("axios")
let token;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

//routes

//test endpoint 
router.get('/test', (req, res) => {
  res.json({ message: "Comment endpoint." });
})

//create comments

router.post('/', (req, res) => {
  Comment.create({
    user: req.body.user,
    content: req.body.content,
    reviewedAt: req.body.reviewedAt
  })
    .then(comment => {
      console.log("New comment created", comment);
      res.json({ comment: comment });
    })
    .catch(error => {
      console.log("error", error)
      res.json({ message: "Error ocurred" });
    });
})



//=================== association with comment =======================

// GET a podcast's comments
router.get('/:title/comments', (req, res) => {
  Podcast.findOne(req.params.title).populate('comments').exec()
  .then(podcast => {
      console.log('This is the comment', comment );
  })
})

// create a comment on a podcast
router.post('/:title/comments', (req, res) => {
  Podcast.findOne(req.params.title)
  .then(podcast => {
      console.log('Heyyy, this is the podcast', podcast);
      // create and pust comment inside of podcast
      Comment.create({
        pcid: req.body.pcid,
        user: req.body.user,
        rating: req.body.rating,
        content: req.body.content,
        url: req.body.url,
        reviewedAt: req.body.reviewAt,
        modifiedDate: req.body.modifiedDate,
        reply: req.body.reply,
      })
      .then(comment => {
          podcast.comments.push(comment);
          // save the podcast
          podcast.save();
          res.redirect(`/podcasts/${req.params.title}`);
      })
      .catch(error => { 
          console.log('error', error);
          res.json({ message: "Error ocurred" });
      });
  })
  .catch(error => { 
      console.log('error', error);
      res.json({ message: "Error ocurred" });
  });
});


module.exports = router;