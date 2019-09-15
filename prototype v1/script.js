var webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'The Online Movie Quiz',
        question: {}
    },
    filters: {
        answerId: function(index) {
            return 'ans-' + (index + 1);
        }
    },
    mounted() {
        axios.get('http://localhost:3000/')
            .then(resp => {
                this.question = resp.data
            })
            .catch(err => {
                console.error(err);
        });
    }
});