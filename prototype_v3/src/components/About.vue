<template>
<div>
    <site-header></site-header>
    
    <div id="tmdb-notice">
        <img src="https://www.themoviedb.org/assets/2/v4/logos/primary-green-d70eebe18a5eb5b166d5c1ef0796715b8d1a2cbc698f96d311d62f894ae87085.svg"
        alt="TMDb' logo" width="81" height="79">
        <p>This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
    </div>

    <div>
        <p>Visit project's repository on GitHub: <a href="https://github.com/Godis715/Online-Movie-Quiz">link</a>.</p>
    </div>

</div>
</template>

<script>
    import siteHeader from './Header.vue';

    export default {
        name: 'About',
        components: { siteHeader }
    };
</script>

<style>
    #tmdb-notice {
        display: flex;
        flex-direction: row;
        flex-basis: 1rem;
    }

    #tmdb-notice > img {
        margin-right: 1rem;
    }
</style>