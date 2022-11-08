require('dotenv').config();
const express = require('express');
const router = express.Router();
const Creator = require('../models/creator');
const passport = require('passport');
const axios = require("axios")
let token;
const clientKey = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;

//Find all Creators in your favorites
// router.get('/findFavCreator', (req, res) => {
//     Creator.find({})
//     .then(creators => {
//         console.log('All creators', creators);
//         res.json({ creators: creators });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

//See each creator information
// router.get('/:id', (req, res) => {
//     console.log('find creator by ID', req.params.id);
//     Creator.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
//     .then(creator=> {
//         console.log('Here is the creator', creator);
//         res.json({ creator: creator });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });
//search creators
router.post('/results', (req, res) => {
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
          const randCreators = {
            method: "post",
            url: "https://api.podchaser.com/graphql",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              query: `query {
                  creators(searchTerm: "${searchTerm}") {
                      paginatorInfo {
                          currentPage,
                          hasMorePages,
                          lastPage,
                      },
                      data {
                          pcid,  
                          name,
                          bio,
                          location,
                          imageUrl
        
                    }
                }  
              }`,
            },
          };
          axios
            .request(randCreators)
            .then((response) => {
              console.log('LIZ.....',response.data.data.creators.data);
              res.json({ creators: response.data.data.creators.data })
            })
            .catch((error) => {
              console.log("error", error);
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
      
})

//delete from favorites 
// router.delete('/:id', (req, res) => {
//     Creator.findByIdAndRemove(req.params.id)
//     .then(response => {
//         console.log('This was deleted', response);
//         res.json({ message: `Creator ${req.params.id} was deleted`});
//     })
//     .catch(error => {
//         console.log('error', error) 
//         res.json({ message: "Error ocurred, please try again" });
//     })
// });  
module.exports = router;