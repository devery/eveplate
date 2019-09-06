<template>
    <div>
        <pre>{{children}}</pre>
        <br/>
        <button type="button" v-on:click="handleLoadData">{{buttonMessage}}</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isLoading: false,
                children: 'Not loaded',
            }
        },
        props: {
            loadDataFunc: {
                type: Function
            },
            buttonMessage: {
                type: String,
                default: 'Load',
            },
        },
        methods: {
            async handleLoadData() {
                let children;

                this.isLoading = true;
                this.children = 'Loading';

                try {
                    children = JSON.stringify(await this.loadDataFunc());
                } catch (e) {
                    console.error(e);

                    children = 'Something went wrong';
                }

                this.children = children;
                this.isLoading = false;
            }
        }
    }
</script>
