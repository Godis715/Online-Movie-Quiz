const reqProm = require('request-promise');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const fs = require('fs');
const app = express();

const movieHostAddress = 'https://api.themoviedb.org/3/movie/';
const imgHostAddress = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';

const userNote = {
    actualQuestion: undefined,
};

const checkLimitTimes = 25;
const userLimitTime = 10;

app.use(function(req, resp, next) {
    resp.set('Access-Control-Allow-Origin', '*');
    resp.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    resp.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

app.use(bodyParser.json());

app.get('/', (req, resp) => {

    let setNewQuestion = (question) => {
        let startTime = (new Date()).getTime();

        userNote.actualQuestion = {
            question: question,
            startTime: startTime,
            correctAnswer: question.correctAnswer
        };

        question.correctAnswer = undefined;

        resp.json({
            secondsLeft: userLimitTime,
            question: question
        });
    };

    if(!userNote.actualQuestion) {
        randomQuestion(setNewQuestion);
        return;
    }
    
    let timeNow = (new Date()).getTime();
    let secondsLeft = userLimitTime - Math.floor((timeNow - userNote.actualQuestion.startTime) / 1000);

    if (secondsLeft > 0) {
        resp.json({
            secondsLeft: secondsLeft,
            question: userNote.actualQuestion
        });
        return;
    } else {
        randomQuestion(setNewQuestion);
    }
});

app.post('/', urlEncodedParser, (req, resp) => {
    
    if (!req.body) return resp.sendStatus(400);

    if (!userNote.actualQuestion) {
        resp.json({
            result: false,
            message: 'There is no actual questions.'
        });
        return;
    }

    let usersQuestion = userNote.actualQuestion;
    delete userNote.actualQuestion;

    let timeNow = (new Date()).getTime();
    let secondsLeft = checkLimitTimes - Math.floor((timeNow - usersQuestion.startTime) / 1000);

    if (secondsLeft < 0) {
        resp.json({
            result: false,
            message: 'Time limit'
        });
        return;
    }

    let userAnswer = req.body.answer;

    if (usersQuestion.correctAnswer === userAnswer) {
        resp.json({
            result: true
        });
    }
    else {
        resp.json({
            result: false,
            message: 'Wrong answer'
        })
    }
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

function randomQuestion(callback) {
    const maxPage = 20;
    let randPage = randNext(0, maxPage) + 1;

    console.log('Page number: ' + randPage);

    let question = {
        title: 'Guess the movie',
        correctAnswer: '',
        answers: []
    };

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
            console.log()

            console.log('Index in page: ' + randIndex);
            if (!resp.results[randIndex]) {
                console.log(resp.results);
                throw -1;
            }
            let movie = resp.results[randIndex];


            question.poster = imgHostAddress + movie.poster_path;
            question.answers.push(movie.title);
            question.correctAnswer = movie.title;

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

            callback(question);
        })
        .catch(function(err) {
            console.error(err);
        });
}