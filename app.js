require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/artist-search', (req,res) => {
    const artist = req.query.Artist;
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
    res.render('artist-search-results', { data : data.body.artists.items });
  })
  .catch(error => console.log('The error while searching artists occurred: ', error));

})

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => {
  console.log(data.body.items);
  res.render('albums', { data : data.body.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.get('/tracks/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  console.log(albumId);
  spotifyApi
  .getAlbumTracks(albumId, { limit : 5, offset : 1 })
  .then(data => {
  console.log(data.body.items)
  res.render('tracks', { data : data.body.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
