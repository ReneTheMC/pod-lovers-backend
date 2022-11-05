require('dotenv').config();
const express = require('express');
const router = express.Router();
const Podcast = require('../models/podcast');
const passport = require('passport');
const axios = require("axios")
let token;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

//routes
//test endpoint 
router.get('/test', (req, res) => {
  res.json({ message: "Podcast endpoint." });
})

//get all podcasts
router.get('/', (req, res) => {
  Podcast.find({})
    .then(podcasts => {
      console.log('All podcasts', podcasts);
      res.json({ podcasts: podcasts });
    })
    .catch(error => {
      console.log('Error', error);
      res.json({ message: "Error ocurred" });
    });
})

//get one podcast by search term
router.post('/', (req, res) => {
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

//create podcast
router.post('/', (req, res) => {
  Podcast.create({
    imageUrl: req.body.imageUrl,
    title: req.body.title,
    description: req.body.description
  })
    .then(podcast => {
      console.log("New podcast created", podcast);
      res.json({ podcast: podcast });
    })
    .catch(error => {
      console.log("error", error)
      res.json({ message: "Error ocurred" });
    });
})

//find podcast by title and update
router.put('/:title', (req, res) => {
  console.log('Searching Podcast..')
  Podcast.findOne({ title: req.params.title })
    .then(foundPodcast => {
      console.log('Podcast found', foundPodcast);
      Podcast.findOneAndUpdate( req.params.title, {
        imageUrl: req.body.imageUrl ? req.body.imageUrl : foundPodcast.imageUrl,
        title: req.body.title ? req.body.title : foundPodcast.title,
        description: req.body.description ? req.body.description : foundPodcast.description
      }, {
        upsert: true
      })
        .then(podcast => {
          console.log('podcast was updated', podcast);
          res.redirect(`/podcasts/${req.params.title}`)
        })
        .catch(error => {
          consol.log('error', error);
          res.json({ message: "Error ocurred" });
        })
    })
    .catch(error => {
      console.log('error', error)
      res.json({ message: 'Error ocurred' });
    })
});

//delete podcast by title
router.delete('/:title', (req, res) => {
  Podcast.findOneAndRemove({ title: req.params.title})
  .then(response => {
    console.log('Podcast was deleted', response);
    res.json({ message: `${req.params.title} was deleted`});
  })
  .catch(error => {
    console.log('Error', error)
    res.json({ message : "Error ocurred"});
  })
});

module.exports = router;