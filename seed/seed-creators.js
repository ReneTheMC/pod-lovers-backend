// "use strict";
// require("dotenv").config();
// const mongoose = require("mongoose");
// // connect to datbase
// const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
// mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
// const db = mongoose.connection;
// const clientKey = process.env.CLIENT_KEY;
// const clientSecret = process.env.CLIENT_SECRET;
// let token;
// db.once("open", () => {
//   console.log(`Connected to MongoDB at HOST: ${db.host} and PORT: ${db.port}`);
// });

// db.on("error", (error) => {
//   console.log(`Database Error: ${error}`);
// });

// const axios = require("axios");
// const Creator = require("../models/creator");


// axios({
//   url: "https://api.podchaser.com/graphql",
//   method: "post",
//   data: {
//     query: `
//       mutation {
//           requestAccessToken(
//               input: {
//                   grant_type: CLIENT_CREDENTIALS
//                   client_id: "${clientKey}"
//                   client_secret: "${clientSecret}"
//               }
//           ) {
//               access_token
//           }
//       }
//         `,
//   },
// })
//   .then((result) => {
//     console.log(result.data);
//     token = result.data.data.requestAccessToken.access_token;
//     const randCreators = {
//       method: "post",
//       url: "https://api.podchaser.com/graphql",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: {
//         query: `query {
//             creators(searchTerm: "Trevor Noah") {
//                 paginatorInfo {
//                     currentPage,
//                     hasMorePages,
//                     lastPage,
//                 },
//                 data {
//                     name,
//                     bio,
//                     location,
//               }
//           }  
//         }`,
//       },
//     };
//     axios
//       .request(randCreators)
//       .then((response) => {
//         console.log('LIZ.....',response.data.data.creators.data);
//         let newCreators = [];
//         // response.data.data.creators.data.forEach((creator) => {
//         //   newCreators.push({
//         //     name: creator.name,
//         //     bio: creator.bio,
//         //     location: creator.location,
//         //   });
//         // });
//         // Creator.insertMany(newCreators)
//         // .then(response => {
//         //     console.log(response)
//         // })
//         // .catch((error) => {
//         //     console.log('error', error)
//         // })
//       })
//       .catch((error) => {
//         console.log("error", error);
//       });
//   })
//   .catch((error) => {
//     console.log("error", error);
//   });


