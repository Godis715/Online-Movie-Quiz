const welcomeComponent = {
    template: `
        <div>
            Welcome!
        </div>
    `,
};

const profileComponent = {
    template: `
        <div>
            Your profile: null.
        </div>
    `,
};

const aboutComponent = {
    template: `
        <div>
            About: Online Movie Quiz.
        </div>
    `,
};

new Vue({
    el: '.app',
    components: {
        'welcome-component': welcomeComponent,
        'profile-component': profileComponent,
        'about-component': aboutComponent
    },
    data() {
        return {
            currentView: welcomeComponent
        }
    },
    methods: {
        cycle(type) {
            switch(type) {
                case 'Welcome': this.currentView = welcomeComponent; break;
                case 'Profile': this.currentView = profileComponent; break;
                case 'About': this.currentView = aboutComponent; break;
            }
        }
    }
});