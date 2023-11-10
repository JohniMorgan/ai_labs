<template>
    <div class="view-wraper">
        <label class="view">{{ stringifyData }}</label>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
    }
})

const stringifyData = computed(() => {
    let temp = '';
    props.data.conf.forEach((el, index) => {
        if (index % 3 == 0) temp += '| ';
        temp += el + ' ';
        if (index % 3 == 2) temp += '|\n';
    })
    temp += `Значение f(n) = ${props.data.evristic}`;
    return temp;
})
const color = computed(() => {
    switch (props.data.visitStatus) {
        case -1: return '#D0021B';
        case 0: return '#167201';
        case -2 : return '#E89100';
    }
    return '#172326';
})
</script>

<style lang="scss">

    .view {
        white-space: pre;

        &-wraper {
            background-color: v-bind(color);
            width: auto;
            margin: 5px;
        }
    }
</style>