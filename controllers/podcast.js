require('dotenv').config();
const express = require('express');
const router = express.Router();
const Podcast = require('../models/podcast');
const Comment = require('../models//comment');
const passport = require('passport');
const axios = require("axios")
let token;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

//get one podcast by search term
router.post('/results', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.body)
  const searchTerm = req.body.q
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
                          id,
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
          console.log('Loading Podcasts....', response.data.data.podcasts.data);
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

//=================== association with comment =======================

// // GET a podcast's comments
// router.get('/:title/comments', (req, res) => {
//   Podcast.findOne(req.params.title).populate('comments').exec()
//   .then(podcast => {
//       console.log('This is the podcast', podcast);
//   })
// })

// // create a comment on a podcast
// router.post('/:title/comments', (req, res) => {
//   Podcast.findOne(req.params.title)
//   .then(podcast => {
//       console.log('Heyyy, this is the podcast', podcast);
//       // create and pust comment inside of podcast
//       Comment.create({
//         pcid: req.body.pcid,
//         user: req.body.user,
//         rating: req.body.rating,
//         content: req.body.content,
//         url: req.body.url,
//         reviewedAt: req.body.reviewAt,
//         modifiedDate: req.body.modifiedDate,
//         reply: req.body.reply,
//       })
//       .then(comment => {
//           podcast.comments.push(comment);
//           // save the podcast
//           podcast.save();
//           res.redirect(`/podcasts/${req.params.title}`);
//       })
//       .catch(error => { 
//           console.log('error', error);
//           res.json({ message: "Error ocurred" });
//       });
//   })
//   .catch(error => { 
//       console.log('error', error);
//       res.json({ message: "Error ocurred" });
//   });
// });


module.exports = router;