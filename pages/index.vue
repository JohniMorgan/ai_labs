<template>
    <div class="centered">
        <v-card>
            <nuxt-link to="/algorithm/dfs" class="link-as-btn">Лабораторная работа №1.1 (DFS)</nuxt-link>
            <nuxt-link to="/algorithm/iterativ" class="link-as-btn">Лабораторная работа №1.2 (IterativDFS)</nuxt-link>
            <nuxt-link to="/" class="link-as-btn" disabled>Лабораторная работа #2.1 (A* DFS)</nuxt-link>
            <nuxt-link to="/" class="link-as-btn" disabled>Лабораторная работа #2.2 (A* IterativeDFS)</nuxt-link>
        </v-card>
    </div>
</template>

<style lang="scss" scoped>

    .link-as-btn {
        min-height: 2em;
        width: 250px;
        background-color: $secondary;
        display: flex;
        align-content: center;
        justify-content: center;
        text-align: center;
        padding: {
            right: 10px;
            left:10px;
            top: 5px;
            bottom: 5px;
        }
        margin: {
            top: 15px;
            bottom: 15px;
        }
        color: $text;
        border-radius: 8px;

        &:hover {
            color: $text;
            background-color: $secondary-hover;
        }
    }

    .v-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50%;

        @media (max-width: 660px) {
            width: 90%;
        }
        padding: {
            top: 15px; 
            bottom: 15px;
        }
    }
</style>