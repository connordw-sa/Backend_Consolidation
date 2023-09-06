// BACKEND
// Here is the media’s structure :

//     {
//         "title": "The Lord of the Rings: The Fellowship of the Ring",
//         "year": "2001",
//         "imdbID": "tt0120737",  //UNIQUE
//         "type": "movie",
//         "poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
//     }
// /medias
// POST Media
// GET Media (list)
// /medias/:id
// GET Media (single)
// /medias/:id/poster
// POST Upload poster to single media
// medias/:id/pdf
//  Export single media data as PDF

// Connect backend and frontend
// Deploy backend on Cyclic and frontend on Vercel

// EXTRAS
// Search media by title (if it’s not found in your medias.json file, search in OMDB and sync with your database). You can use Axios or Node-fetch to perform http requests towards OMDB
// Example :
// Searching for batman

// exists in my media.json ?
// return movie in response
// else
// search that query (batman) in omdbapi
// exists in omdb ?
// put in our media.json (push inside of our collection)

// return in response
// else
// return not found
// CRUD for reviews. The reviews look like:
//      {
//         "_id": "123455", //SERVER GENERATED
//         "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
//         "rate": 3, //REQUIRED, max 5
//         "elementId": "5d318e1a8541744830bef139", //REQUIRED = IMDBID
//         "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
// }

// Build documentation with Swagger or Postman (if you don’t have much time, just do one or two endpoints)
// Add whatever feature you think it could be cool 😉
