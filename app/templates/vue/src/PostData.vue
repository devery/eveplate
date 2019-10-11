<template>
    <form v-on:submit="handlePostData">
        <template v-for="(name, index) in fields">
            <input
                    type="text"
                    v-bind:title="name"
                    v-bind:placeholder="name"
                    v-model="args[name]">
            <b v-if="(index < fields.length - 1)"> , </b>
        </template>
        <br />
        <button type="submit">Add</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                args: {},
            }
        },
        props: {
            postDataFunc: {
                type: Function
            },
            fields: {
                type: Array
            }
        },
        methods: {
            async handlePostData(event) {
                event.preventDefault();

                try {
                    const result = await this.postDataFunc(...this.fields.map(i => this.args[i]));
                    console.log(result)
                } catch (e) {
                    console.error(e);
                }

                this.fields.forEach(i => this.args[i] =  '');
            }
        }
    }
</script>
