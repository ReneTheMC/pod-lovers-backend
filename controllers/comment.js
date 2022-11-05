require('dotenv').config();
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const passport = require('passport');
const axios = require("axios")
let token;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

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



router.get('/', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

router.get('/:id', (req, res) => {
    console.log('find comment by ID', req.params.id);
    // console.log(mongoose.Types.ObjectId(req.params.id))
    Comment.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    .then(comment => {
        console.log('Here is the comment', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

router.put('/:id', (req, res) => {
    console.log('route is being on PUT')
    Comment.findById(req.params.id)
    .then(foundComment => {
        console.log('Comment found', foundComment);
        Comment.findByIdAndUpdate(req.params.id, { 
                header: req.body.header ? req.body.header : foundComment.header,
                content: req.body.content ? req.body.content : foundComment.content,
        }, { 
            upsert: true 
        })
        .then(comment => {
            console.log('Comment was updated', comment);
            res.redirect(`/comments/${req.params.id}`);
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
});

router.delete('/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('This was deleted', response);
        res.json({ message: `Comment ${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});


module.exports = router;