<template>
<header>
    <h1 class="nav-bar-item">
        <router-link :to="{ name: 'Welcome' }">
            {{sitename}}
        </router-link>
    </h1>
    <h1 class="nav-bar-item">
        <router-link :to="{ name: 'Quiz' }">
            Play
        </router-link>
    </h1>
    <h1 class="nav-bar-item">
        <router-link :to="{ name: 'Profile' }">
            Profile
        </router-link>
    </h1>
    <h1 class="nav-bar-item">
        <router-link :to="{ name: 'About' }">
            About
        </router-link>
    </h1>
</header>
</template>

<script>
    export default {
        name: 'site-header',
        data() {
            return {
                sitename: 'Movie Quiz'
            };
        }
    };
</script>