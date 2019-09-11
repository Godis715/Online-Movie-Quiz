const request = require('request-promise');
const fs = require('fs');

const movieHostAddress = 'https://api.themoviedb.org/3/movie/';
const imgHostAddress = 'https://image.tmdb.org/t/p/original/';

// getting first argument from cmd line
const whatMovie = process.argv[2];

/* to interact with TMDB's APIs 
 you have to get api_key and place into the path below */


new Promise(function(resolve, reject) {
    fs.readFile('tmdb_key.txt', 'utf8', function(err, contents) {
        if (err) reject(err);
        else resolve( contents.substr(1) );
    });
}).then(function(apiKey) {
        const requestMovieInfoOptions = {
            method: 'GET',
            uri: movieHostAddress + whatMovie,
            qs: {
                api_key: apiKey
            },
            json: true
        };
        
        return request(requestMovieInfoOptions);
    })
    .then(function(resp) {
        let posterPath = imgHostAddress + resp.poster_path;
        let fileName = generateMovieFilename(resp) + '.jpg';
        
        download(posterPath, fileName);
    })
    .catch(function(resp) {
        console.log('Failed!');
        console.log('Status code: ' + resp.statusCode);
        console.log('Message: ' + resp.error.status_message);
    });


// function, which downloads resource from the uri into a file
function download(uri, filename, callback) {
    let req = request(uri)
        .pipe( fs.createWriteStream(filename) )
    
    if (callback) {
        req.on('close', callback);
    }
}

let generateMovieFilename = (function() {
    var space = new RegExp(' ', 'g');
    var punctuation = new RegExp('[.,?:;]', 'g')
    return function(movie) {
        return movie.title.replace(space, '_').replace(punctuation, '');
    };
}());