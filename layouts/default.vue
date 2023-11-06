<template>
<div class="app">
    <header>
        <slot name="head" />
        <nuxt-link to="/" class="link-as-btn">Вернуться в меню</nuxt-link>
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
<style lang="scss" scoped>
    header {
        min-height: 5em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .link-as-btn {
        min-height: 2em;
        width: 250px;
        background-color: $secondary;
        display: flex;
        align-content: center;
        justify-content: center;
        text-align: center;
        margin-left: auto;
        margin-right: 20px;
        padding: {
            right: 10px;
            left:10px;
            top: 5px;
            bottom: 5px;
        }
        color: $text;
        border-radius: 8px;

        &:hover {
            color: $text;
            background-color: $secondary-hover;
        }
    }
</style>