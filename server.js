// var request = require('request');
var express = require('express');
var https = require('https');
var geohash = require('ngeohash');
var SpotifyWebApi = require('spotify-web-api-node');
var cors = require('cors');
var app = express();
const TICKETMASTER_API = "ghDLm5eMtGHLKLlVOTWmvzu1NtSD";
const GOOGLE_API = "AIzaSyAkZNY2CiQKs6sqp5iekdWGuxFpuVX";
const SONGKICK_API = "fLjZgRsG4bWa";

var spotify_access_token = "";
var clientId = '439fc6519d7c44298560be611e65',
    clientSecret = '810d1a74c5114eddb58c27f26701';

app.use(cors());
app.use(express.static("public"));

// response to autoComplete from app.js
app.get('/autoComplete', function (req, res) {
    var responseData = "";
    var autoCompleteURL = "";
    var autoComplete = req.query.autoComplete;

    autoCompleteURL = "https://app.ticketmaster.com/discovery/v2/suggest?apikey="
        + TICKETMASTER_API
        + "&keyword=" + autoComplete;

    https.get(autoCompleteURL, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});

// response to geocode from app.js
app.get('/geocode', function (req, res) {
    var responseData = "";
    var geocodeURL = "";
    var enteredLocation = req.query.enteredLocation;
    var latlng = req.query.latlng;
    if (enteredLocation.size > 0) {
        geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?"
            + "address=" + enteredLocation
            + "&key=" + GOOGLE_API;
    } else {
        geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?"
            + "latlng=" + latlng
            + "&key=" + GOOGLE_API;
    }

    console.log("geocodeURL: " + geocodeURL);
    console.log('\n');

    https.get(geocodeURL, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});

// response to resultTable from app.js
app.get('/resultTable', function (req, res) {
    var responseData = "";
    var resultTableURL = "";
    var keyword = req.query.keyword;
    var category = req.query.category;
    var distance = "";
    if (req.query.distance !== "") {
        distance = req.query.distance;
    } else {
        distance = "10";
    }
    var milesOrKilometer = req.query.milesOrKilometer;
    var lat = req.query.lat;
    var lng = req.query.lng;
    var geoPoint = geohash.encode(parseFloat(lat), parseFloat(lng));
    var segmentId = "";
    if (category == "music") {
        segmentId = "KZFzniwnSyZfZ7v7nJ";
    } else if (category == "sports") {
        segmentId = "KZFzniwnSyZfZ7v7nE";
    } else if (category == "arts") {
        segmentId = "KZFzniwnSyZfZ7v7na";
    } else if (category == "film") {
        segmentId = "KZFzniwnSyZfZ7v7nn";
    } else if (category == "miscellaneous") {
        segmentId = "KZFzniwnSyZfZ7v7n1";
    }

    resultTableURL = "https://app.ticketmaster.com/discovery/v2/events.json?"
        + "apikey=" + TICKETMASTER_API
        + "&keyword=" + keyword
        + "&segmentId=" + segmentId
        + "&radius=" + distance
        + "&unit=" + milesOrKilometer
        + "&geoPoint=" + geoPoint;

    console.log("resultTableURL: " + resultTableURL);
    console.log('\n');

    https.get(resultTableURL, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });


    // Create the api object with the credentials
    var spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: clientSecret
    });

// Get an access token and 'save' it using a setter
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            spotify_access_token = data.body['access_token'];
            console.log('The access token is ' + spotify_access_token);
            console.log('The token expires in ' + data.body['expires_in']);
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
            console.log('Something went wrong!', err);
        }
    );
});

// response to eventID from app.js
app.get('/eventID', function (req, res) {
    var responseData = "";
    var eventDetailURL = "";
    var eventID = req.query.eventID;

    eventDetailURL = "https://app.ticketmaster.com/discovery/v2/events/"
        + eventID
        + "?apikey=" + TICKETMASTER_API;

    console.log("eventDetailURL: " + eventDetailURL);
    console.log('\n');

    https.get(eventDetailURL, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});


// Spotify API:
// Create the api object with the credentials
app.get('/spotify', function (req, res) {
    var artistOrTeamName = req.query.artistOrTeamName;

    // Set the credentials when making the request
    var spotifyApi = new SpotifyWebApi({
        accessToken: spotify_access_token
    });

    // Do search using the access token
    // Search artists whose name contains 'Love'
    spotifyApi.searchArtists(artistOrTeamName)
        .then(function(data) {
            console.log("Spotify INFO about " + artistOrTeamName);
            console.log(data.body);
            res.send(data.body.artists.items);
        }, function(err) {
            console.error(err);
        });
});

// response to googleCustomSearch from app.js
app.get('/googleCustomSearch', function (req, res) {
    var responseData = "";
    var googleCustomSearchUrl = "";
    var artistOrTeamName = req.query.artistOrTeamName;

    googleCustomSearchUrl = "https://www.googleapis.com/customsearch/v1?q="
        + artistOrTeamName
        + "&cx=014697005259627660070:pmtricosf_m&imgSize=huge&imgType=news&num=6"
        + "&searchType=image&key=" + GOOGLE_API;
    console.log("googleCustomSearchUrl: " + googleCustomSearchUrl);
    console.log('\n');

    https.get(googleCustomSearchUrl, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});

// response to venue from app.js
app.get('/venue', function (req, res) {
    var responseData = "";
    var venueUrl = "";
    var venueName = req.query.venueName;

    venueUrl = "https://app.ticketmaster.com/discovery/v2/venues?apikey="
        + TICKETMASTER_API
        + "&keyword=" + venueName;
    console.log("venueUrl: " + venueUrl);
    console.log('\n');

    https.get(venueUrl, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});

// response to upcomingEventsID from app.js
app.get('/upcomingEventsID', function (req, res) {
    var responseData = "";
    var songKick_venue_id = "";
    var venueName = req.query.venueName;
    songKick_venue_id = "https://api.songkick.com/api/3.0/search/venues.json?query="
        + venueName
        + "&apikey="
        + SONGKICK_API;
    console.log("songKick_venue_id: " + songKick_venue_id);
    console.log('\n');

    https.get(songKick_venue_id, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});

// response to upcomingEventsDetail from app.js
app.get('/upcomingEventsDetail', function (req, res) {
    var responseData = "";
    var songKick_venue_detail = "";
    var upcomingEventsID = req.query.upcomingEventsID;
    songKick_venue_detail = "https://api.songkick.com/api/3.0/venues/"
        + upcomingEventsID
        + "/calendar.json?apikey="
        + SONGKICK_API;
    console.log("songKick_venue_detail: " + songKick_venue_detail);
    console.log('\n');

    https.get(songKick_venue_detail, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});

// response to favoriteEventID from app.js
app.get('/favoriteEventID', function (req, res) {
    var responseData = "";
    var favoriteEventDetailURL = "";
    var favoriteEventID = req.query.favoriteEventID;

    favoriteEventDetailURL = "https://app.ticketmaster.com/discovery/v2/events/"
        + favoriteEventID
        + "?apikey=" + TICKETMASTER_API;

    console.log("favoriteEventDetailURL: " + favoriteEventDetailURL);
    console.log('\n');

    https.get(favoriteEventDetailURL, function (response) {
        response.on("data", function (data) {
            // JSON format
            responseData += data;
        });
        response.on("end", function () {
            res.send(responseData);
        });
    });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
    console.log("=======================");
});

module.exports = app;
