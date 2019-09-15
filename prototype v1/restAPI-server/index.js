const reqProm = require('request-promise');
const express = require('express');
const fs = require('fs');
const app = express();

const movieHostAddress = 'https://api.themoviedb.org/3/movie/';
const imgHostAddress = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';
let apiKey = "";
fs.readFile('tmdb_api_key.txt', 'utf-8', function(content) {
    apiKey = content.substring(1);
});

function randomQuestion1(callback) {
    const maxPage = 20;
    
    let randPage = randNext(0, maxPage) + 1;

    console.log('Page number: ' + randPage);

    let question = {
        title: 'Guess the movie',
        answers: []
    };

    let movieTitle = "";

    const options = {
        method: 'GET',
            uri: movieHostAddress + 'top_rated',
            qs: {
                api_key: apiKey,
                language: 'en-US',
                page: randPage
            },
        json: true
    };

    reqProm(options)
        .then(function(resp) {
            let randIndex = randNext(0, resp.results.length);

            console.log('Index in page: ' + randIndex);

            let movie = resp.results[randIndex];

            question.poster = imgHostAddress + movie.poster_path;
            question.answers.push(movie.title);

            movieTitle = movie.title;

            const options = {
                method: 'GET',
                uri: movieHostAddress + movie.id + '/similar',
                qs: {
                    api_key: apiKey,
                    language: 'en-US',
                },
                json: true
            };
            
            return reqProm(options);
        })
        .then(function(resp) {

            console.log('Similar count: ' + resp.results.length);

            question.answers.push(
                resp.results[0].title,
                resp.results[1].title,
                resp.results[2].title
            );

            shuffle(question.answers);

            console.log(movieTitle);
            let answer = question.answers.findIndex((val, index, obj) => {
                console.log(val);
                return val === movieTitle;
            });

            callback(question, answer);
        })
        .catch(function(err) {
            console.error(err);
        });
}

let currentQuestion = {};
let rightAnswer = {};

function start() {
    randomQuestion1(function(question, answer) {
        currentQuestion = question;
        rightAnswer = answer;

        console.log('Right answer: ' + rightAnswer);
    });

    setTimeout(function() {
        start();
    }, 5000);
};

start();

app.get('/', (req, resp) => {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.set('Access-Control-Allow-Methods', 'GET');
    resp.set('Access-Control-Allow-Headers', 'Content-Type');

    resp.json(currentQuestion);
});

app.listen(3000);

function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
}

function randNext(from, to) {
    return from + Math.floor(Math.random() * (to - from));
}