<template>
    <div class="centered">
        <v-card>
            <nuxt-link to="/algorithm/dfs" class="link-as-btn">Лабораторная работа №1.1 (DFS)</nuxt-link>
            <nuxt-link to="/algorithm/iterativ" class="link-as-btn">Лабораторная работа №1.2 (IterativDFS)</nuxt-link>
            <nuxt-link to="/labs_2/dfs" class="link-as-btn">Лабораторная работа №2.1 (A* DFS)</nuxt-link>
            <nuxt-link to="/labs_2/iterativ" class="link-as-btn">Лабораторная работа №2.2 (A* IterativeDFS)</nuxt-link>
        </v-card>
    </div>
</template>

<style lang="scss" scoped>
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