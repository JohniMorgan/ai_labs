<script setup>
</script>

<template>
    <div class="jm">
        <button class="custom"><span><slot /></span></button>
    </div>
</template>

<style scoped lang="scss">
    .jm {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .custom {
            background-color: $secondary;
            color: $text;
            transition: background-color 0.25s;
            padding: 0 16px;
            border-radius: 5px;
            height: 2em;

            * {
                padding-left: 5px;
                padding-right: 5px;
            }

            &:hover {
                background-color: $secondary-hover;
            }
        }
    }
</style>