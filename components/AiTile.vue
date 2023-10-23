<script setup>
const props = defineProps({
    value: {
        type: Number,
        default: undefined,
    }
})

</script>

<template>
<div class="tile-wrapper">
    <Transition name="fade" mode="out-in">
    <div v-if="value != undefined" class="tile">
        <span class="tile-value">{{ value }}</span>
    </div>
    </Transition>
</div>
</template>

<style scoped lang='scss'>
    .tile {
        &.fade-leave-active,
        &.fade-enter-active {
            transition: opacity 0.25s;
        }

        &.fade-enter-from,
        &.fade-leave-to {
            opacity: 0;
        }
        
        background-color: $secondary;
        color: $text;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border-radius: 50%;
    }
    .tile-wrapper {
        width: 31%;
        margin: 5px 0px;
        aspect-ratio: 1;
    }
</style>