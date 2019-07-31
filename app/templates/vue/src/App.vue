<template>
    <div class="Explorer">
        <h1>Devery Explorer</h1>
        <p>User Account: {{account}}</p>

        <h2>APP INFO</h2>
        <fieldset>
            <h3>Get App Accounts:</h3>

            <LoadData
                    v-bind:loadDataFunc="handleGetAppAccounts"
                    buttonMessage='Get App Accounts'
            />
        </fieldset>

        <fieldset>
            <h3>Get App:</h3>

            <label>
                <span>App Info: active, appAccount, appName, fee, feeAccount</span>
                <input type="text" placeholder="App Address" v-model="appAccount"/>
            </label>

            <span v-if="!appAccount">Please insert App address first</span>
            <LoadData
                    v-else
                    v-bind:loadDataFunc="handleGetApp"
                    buttonMessage='Get App Info'
            />
        </fieldset>

        <h2>BRAND INFO</h2>

        <fieldset>
            <h3>Get Brand Accounts:</h3>
            <p>This gets ALL brand accounts. i.e. Not just for your app.</p>

            <LoadData
                    v-bind:loadDataFunc="handleGetBrandAccounts"
                    buttonMessage='Get Brand Accounts'
            />
        </fieldset>

        <fieldset>
            <h3>Get Brand Info:</h3>
            <label>
                <span>Brand Info: brandAccount, appAccount, brandName, active</span>
                <input type="text" placeholder="Enter Brand Address" v-model="checkBrandAddr"/>
            </label>

            <span v-if="!checkBrandAddr">Please insert Brand address first</span>
            <LoadData
                    v-else
                    v-bind:loadDataFunc="getBrand"
                    buttonMessage='Get Brand Info'
            />
        </fieldset>

        <h2>PRODUCT INFO</h2>

        <fieldset>
            <h3>Get Product Accounts:</h3>
            <p>This gets ALL product accounts. i.e. Not just for your app/brand.</p>

            <LoadData
                    v-bind:loadDataFunc="handleGetProductAccounts"
                    buttonMessage='Get Product Accounts'
            />
        </fieldset>

        <fieldset>
            <h3>Get Product Info:</h3>

            <label>
                <span>Product Info: productAccount, brandAccount, description, details, year, origin, active</span>
                <input type="text" placeholder="Enter A Product Address" v-model="checkProductAddr"/>
            </label>

            <span v-if="!checkProductAddr">Please insert Product address first</span>
            <LoadData
                    v-else
                    v-bind:loadDataFunc="getProduct"
                    buttonMessage='Get Product Info'
            />
        </fieldset>
    </div>
</template>

<script>
    import LoadData from './LoadData.vue'
    import devery from './devery'

    const DEFAULT_MESSAGE = 'Please sign in to MetaMask';

    export default {
        components: {
            LoadData
        },
        data() {
            return {
                account: DEFAULT_MESSAGE,
                appAccount: null,
                checkBrandAddr: '',
                checkProductAddr: '',
            }
        },
        created() {
            if (!window.web3) return;

            // Checks for active MetaMask account info.
            let account = window.web3.eth.accounts[0];
            if (account === undefined) {
                this.account = DEFAULT_MESSAGE;

                return
            }

            if (account !== this.account) {
                this.account = account
            }
        },
        methods: {
            handleGetAppAccounts() {
                return devery.appAccountsPaginated()
            },
            handleGetApp() {
                return devery.getApp(this.appAccount)
            },
            handleGetBrandAccounts() {
                return devery.brandAccountsPaginated()
            },
            handleGetProductAccounts() {
                return devery.productAccountsPaginated()
            },
            async getBrand() {
                const Brand = await devery.getBrand(this.checkBrandAddr);
                if (!Brand.active) return Promise.reject('No active brand');
                return Promise.resolve(Brand)
            },
            async getProduct() {
                const Product = await devery.getProduct(this.checkProductAddr);
                if (!Product.active) return Promise.reject('No product');
                return Promise.resolve(Product)
            }
        }
    }
</script>

<style>
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
        monospace;
    }

    .Explorer fieldset {
        margin-bottom: 20px;
        border: none;
    }

    .Explorer pre {
        word-break: break-word;
        white-space: pre-line;
        background: #ebebeb;
        padding: 16px;
        overflow-wrap: break-word;
    }

    .Explorer span {
        display: block;
        margin: 12px 0;
    }

    .Explorer fieldset > span {
        padding: 16px;
        background: #f9f9f9;
    }

    .Explorer input {
        font-size: 16px;
        padding: 2px 4px;
    }

    .Explorer {
        width: 80%;
        margin: 0 auto;
    }
</style>