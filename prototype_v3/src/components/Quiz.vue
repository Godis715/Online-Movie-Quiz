<template>
<div>
    <site-header></site-header>

    <div class="question-content">
        <img v-bind:src="question.poster">

        <form class="answer-form" @submit.prevent="onClickSendResults">
            <h2>{{question.title}}</h2>

            <h3 id="timer">
                <div style="display: inline-block">Time left:</div><div class="timer">{{secondsLeft | showTime}}</div>
            </h3>

            <div v-for="(answer, index) in question.answers" class="choice">
                <input type="radio" v-bind:id="index | answerId" name="answer" v-bind:value="answer" v-model="userAnswer">
                <label v-bind:for="index | answerId">{{answer}}</label>
            </div>
                
            <div>
                <input type="submit" name="submit" id="submit" value="submit">
            </div>                    
        </form>    
    </div>

</div>
</template>

<script>
    import siteHeader from './Header.vue';

    export default {
        name: 'Quiz',
        components: { siteHeader },
        data() {
            return {
                question: {},
                secondsLeft: 0,
                userAnswer: {},
                refreshMutex: true
            };
        },
        filters: {
            answerId: function(index) {
                return 'ans-' + (index + 1);
            },

            showTime: function(_seconds) {
                let minutes = Math.floor(_seconds / 60);
                let seconds = _seconds - minutes * 60;

                if (seconds < 10) 
                    return minutes + ':0' + seconds;
                else 
                    return minutes + ':' + seconds; 
            }
        },
        methods: {
            onClickSendResults: function() {
                this.timer.stop();
            },

            sendResults: function() {
    
                let data = {
                    'answer': this.userAnswer
                };

                axios.post('http://localhost:3000/', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function(resp) {
                    let message = (resp.data.result) ? 'Well done!' : resp.data.message;
                    console.log(message);

                    this.refreshQuestion2();
                }.bind(this))
                .catch(function(err) {
                    console.log(err);
                });
            },

            refreshQuestion2: function() {
                console.log('1. try refreshing question...');
                if (!this.refreshMutex) return;
                this.refreshMutex = false;
                console.log('2. Block refreshing..');
                
                this.setDefaultQuestion();

                axios.get('http://localhost:3000/')
                    .then(resp => {
                        return resp.data;
                    })
                    .then(data => {
                        this.secondsLeft = data.secondsLeft;
                        this.question = data.question;

                        let stopClbk = function() {
                            this.sendResults();
                        }.bind(this);

                        let tickClbk = function(secondsLeft) {
                            this.secondsLeft = secondsLeft;
                        }.bind(this);

                        this.timer = this.createTimer(data.secondsLeft, stopClbk, tickClbk);
                        this.timer.start();
                        console.log('3. Started timer');
                    })
                    .then(function() {
                        console.log('4. Can refresh again');
                        this.refreshMutex = true;
                    }.bind(this))
                    .catch(err => {
                        console.log(err);
                    });
            },

            setDefaultQuestion: function() {
                const defaultQuestion = {
                    title: 'Question is loading...',
                    poster: require('../assets/defaultPoster.jpg'),
                    answer: []
                };

                this.question = defaultQuestion;
            },

            createTimer: function(seconds, _stopClbk, _tickClbk) {

                let context = {
                    startMutex: true,
                    disposeMutex: true,

                    secondsLeft: seconds,

                    stopClbk: _stopClbk,
                    tickClbk: _tickClbk
                };

                let _dispose = function() {
                    console.log('Try dispose..');
                    if(!this.disposeMutex) return;
                    this.disposeMutex = false;

                    console.log('clearing the interval: ' + this.timer);
                    clearInterval(this.timer);
                    this.stopClbk();
                }.bind(context);

                context.dispose = _dispose;

                let _tick = function() {
                    if (this.secondsLeft <= 0) {
                        this.dispose();
                    } else {
                        this.secondsLeft--;
                        this.tickClbk(this.secondsLeft);
                    }
                }.bind(context);

                context.tick = _tick;

                return {
                    start: function() {
                        if (!this.startMutex) return;
                        this.startMutex = false;
                        this.timer = setInterval(this.tick, 1000);
                        console.log('Created interval: ' + this.timer);
                    }.bind(context),
                    
                    stop: function() {
                        this.dispose();
                    }.bind(context)
                }
            }
        },
        created() {
            console.log('CREATED!');
            this.refreshQuestion2();
        }
    };
</script>