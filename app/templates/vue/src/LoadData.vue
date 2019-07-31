<template>
    <div>
        <pre>{{children}}</pre>
        <br/>
        <button type="button" v-on:click="onClick">{{buttonMessage}}</button>
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
            async onClick() {
                const wrong = 'Something went wrong';
                let children;

                this.isLoading = true;
                this.children = 'Loading';

                try {
                    children = await this.loadDataFunc() || wrong;
                } catch (e) {
                    console.error(e);

                    children = wrong;
                }

                this.children = children;
                this.isLoading = false;
            }
        }
    }
</script>
