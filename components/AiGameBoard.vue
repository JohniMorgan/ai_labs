<script setup>

const props = defineProps({
    configuration: {
        type: Array,
        default() {
            return [1, 2, 3, 4, 0, 5, 6, 7, 8];
        }
    }
})
</script>

<template>
<div class="board">
    <ai-tile v-for="tile in configuration" :value="tile ? tile : undefined"/>
</div>
</template>

<style scoped lang='scss'>
    .board {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        flex-wrap:wrap;
        border: 0.5rem solid;
        border-color: $surface;
        border-radius: 10px;
        min-width: 200px;
        width: 65%;
        max-width: 400px;
    }
</style>