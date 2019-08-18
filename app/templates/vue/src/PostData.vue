<template>
    <form v-on:submit="handlePostData">
        <input type="text" title="Name" placeholder="Name" v-model="value">
        <button type="submit">Add</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                value: '',
            }
        },
        props: {
            postDataFunc: {
                type: Function
            },
        },
        methods: {
            async handlePostData(event) {
                event.preventDefault();

                try {
                    await this.postDataFunc(this.value);
                    this.value = '';
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
</script>
