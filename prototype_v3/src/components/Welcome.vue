<template>
<div>
    <h1>Welcome to {{sitename}}!</h1>
    <router-link :to="{ name: 'Quiz' }">
        <h2>Play!</h2>
    </router-link>
</div>
</template>

<script>
    export default {
        name: 'Welcome',
        data() {
            return {
                sitename: 'Online Movie Quiz'
            };
        }
    };
</script>