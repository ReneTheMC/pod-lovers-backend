## Spotify

```js
Imports
const express = require('express');
const router = express.Router();
const request = require('request');
const db = require('../models');
const passport = require('../config/ppConfig');
const axios = require('axios')
const querystring = require('querystring');
const { response } = require('express');
let buff = new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let authKey = buff.toString('base64');// changes key to string
```

```js
router.get('/', (req, res)=>{
    axios.post('https://accounts.spotify.com/api/token', 
        querystring.stringify({
            grant_type: 'client_credentials',
        }),
        {
            headers: {
                Authorization: `Basic ${authKey}`
           } 
           
    }).then((response)=>{                    
        token = response.data.access_token
        const config ={
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        let composer = req.query.composer
        let track = req.query.track
        let query = encodeURIComponent(`${composer} ${track}`)
        axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist,track&offset=0&limit=20`, config)
        .then((response)=>{                    
            console.log(response.data)
            let tracks = response.data.tracks.items
            res.render('trackResults', {tracks})
          })
          .catch(err =>{
            console.log(err)
          })
       //use search query in here'
        console.log(token)
        
      })
    .catch(err=>{
        console.log("error", err.message)
    })
})
```

```js
router.get('/:id', (req, res)=>{
    // console.log(req.params)
    axios.post('https://accounts.spotify.com/api/token',
    querystring.stringify({
        grant_type: 'client_credentials',
    }),
    {
        headers: {
            Authorization: `Basic ${authKey}`
       } 
       
    }).then((response)=>{                    
        let token = response.data.access_token
        const config ={
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        console.log(req.params)
        if(req.params.id === '[object Object]'){
            console.log('this is wrong')
        }else{
            console.log(req.params.id)
        }
        let trackId = req.params.id
        // console.log('line 68', trackId)
        try{
            
            axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, config)
                .then((response)=> {
            console.log('line 71', response.data.album.images[0])
            let result = response.data
                console.log(result)
            db.comment.findAll({
                where: {apiTrackId: req.params.id}//line 74
            }).then((comments)=>{
                res.render('trackDetails', {comments, result})//render found comments db query and result
            })
            
           
            }).catch(err=>{
                // console.log('error', err)
            })
        }catch{
            console.log('this')
        }
    })
})
```

# Merge One Branch to Another

```text
git checkout feature1
git merge master
```

#### Resources

Making a *pull request* from a **fork** [link](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwi9-6rCkpLvAhV0GjQIHcjMA5kQFjAAegQIBRAD&url=https%3A%2F%2Fdocs.github.com%2Fen%2Fgithub%2Fcollaborating-with-issues-and-pull-requests%2Fsyncing-a-fork&usg=AOvVaw3UCyL7JejM3Yi47oGqkaaa)
TFS: Updating branch with changes from main [link](https://stackoverflow.com/questions/5317703/tfs-updating-branch-with-changes-from-main)
[How to add authorization header in POSTMAN environment?](https://stackoverflow.com/questions/40539609/how-to-add-authorization-header-in-postman-environment)
[JSON Web Token](https://github.com/auth0/node-jsonwebtoken)
# API Setup

This is a initializing starting point for making an API.

### Example Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| _id | ObjectId | Made by MongoDB |
| name | String | Optional in this case |
| completed | Boolean | `true` or `false` |
| __v | Number | Made by Mongoose |

### Examples - Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | app.js | Welcome to API |
| GET | /examples | example.js | Get all examples |
| GET | /examples/:id | example.js | Get one example |
| POST | /examples | example.js | Create an example |
| PUT | /examples/:id | example.js | Update an example |
| DELETE | /examples/:id | example.js | Delete an example |

## Examples - Detailed Info

Detailed info for serialized examples
- Get all examples : GET /examples
- Get one example : GET /examples/:id
- Create a capsule : POST /examples
- Update a capsule : PUT /examples/:id
- Delete a capsule : DELETE /examples/:id


## Users

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | ObjectId | Made by MongoDB |
| name | String | required |
| email | String | required |
| password | String | required (hash) |
| date | Date | Set default date  |
| __v | Number | Made by Mongoose |

## Users - Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /users/test | user.js | Test route for users, no user returned |
| POST | /users/register | user.js | Create a new user and add to DB |
| POST | /users/login | user.js | Logs user in via credentials, returns user |
| GET | /users/profile | user.js | Protected route, need token to access |

# Users - Detailed Info

Detailed info for serialized examples
- Test user routes : GET /users/test
- Create a user : POST /users/signup
- Login a user : POST /users/login
- Return user data (must login beforehand and use token) : GET /users/profile


# How to Use the Spotify API

- [ ] Install `axios`
```text
npm install axios



/**
 * Critical documentation to read prior to working with this API. 
 *

/**
 * The code below will be used to authenticating to your api using the API key and secret provided to you when registering with podchaser
 * 
 * Keep in mind, this key will need to be updated often, so you'll need to create a flow that will retry for a new access token every time you get a 403 unauthorized status response(implying your key is no longer valid)
 * 
 * I would not recommend re-generating your access token on every request, as that will eat away at your graphql request points, of which you only have 25,000 on the free tier of podchaser.
 */
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
    /**
     * Once you get you access token, you'll want to attach it to the axios request using a headers property like shown below
     * 
     * you will also want to be paying attention to the graphql query(string template below and above). This needs to be added to the request body(inside of data) as a property called query
     * 
     * this will use the model passed in the query to generate complex queries on the graphql side allow you to grab from multiple collections in one request.
     */
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
