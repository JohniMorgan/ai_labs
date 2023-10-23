<template>
<div class="app">
    <header>
        <slot name="head" />
    </header>
    <hr>
    <main>
        <slot />
    </main>
    <footer>
        <slot name="foot" />
    </footer>
</div>
</template>

<script setup>

</script>

<style lang="scss">
    header {
        min-height: 5em;
    }
</style>