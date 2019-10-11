<template>
    <div class="Explorer">
        <h1>Devery Explorer</h1>
        <h3>User Account:</h3>
        <span v-if="!account">Please sign in to MetaMask</span>
        <span v-else>{{account}}</span>
        <span>Registry Contract Address: {{registryContractAddress}}</span>
        <span>ERC721 Contract Address: {{ercContractAddress}}</span>

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
                <input type="text" placeholder="App Address" v-model="appAddr"/>
            </label>

            <span v-if="!appAddr">Please insert App address first!</span>
            <LoadData
                    v-else
                    v-bind:loadDataFunc="handleGetApp"
                    buttonMessage='Get App Info'
            />
        </fieldset>

        <fieldset>
            <h3>Add App:</h3>

            <span v-if="!account">Login with metamask first!</span>
            <PostData
                    v-else
                    v-bind:postDataFunc="handleAddApp"
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
                <input type="text" placeholder="Enter Brand Address" v-model="brandAddr"/>
            </label>

            <span v-if="!brandAddr">Please insert Brand address first!</span>
            <LoadData
                    v-else
                    v-bind:loadDataFunc="getBrand"
                    buttonMessage='Get Brand Info'
            />
        </fieldset>

        <fieldset>
            <h3>Add Brand:</h3>

            <span v-if="!account">Login with metamask first!</span>
            <PostData
                    v-else
                    v-bind:postDataFunc="handleAddBrand"
            />
        </fieldset>

        <fieldset>
            <h3>Permission account marking</h3>

            <span v-if="!account">Login with metamask first!</span>
            <PostData
                    v-else
                    v-bind:postDataFunc="handlePermissionAccount"
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
                <input type="text" placeholder="Enter A Product Address" v-model="productAddr"/>
            </label>

            <span v-if="!productAddr">Please insert Product address first!</span>
            <LoadData
                    v-else
                    v-bind:loadDataFunc="getProduct"
                    buttonMessage='Get Product Info'
            />
        </fieldset>

        <fieldset>
            <h3>Add Product:</h3>

            <span v-if="!account">Login with metamask first!</span>
            <PostData
                    v-else
                    v-bind:postDataFunc="handleAddProduct"
            />
        </fieldset>

        <h2>OWNER INFO</h2>

        <fieldset>
            <h3>Transfer Token:</h3>
            <p>Safe Transfer Token: current owner account address as fromAddress, new owner account address as
                toAddress, tokenId</p>


            <span v-if="!account">Login with metamask first!</span>
            <PostData
                    v-else
                    v-bind:postDataFunc="this.safeTransferTo"
                    v-bind:fields="['fromAddress', 'toAddress', 'tokenId']"
            />
        </fieldset>
    </div>
</template>

<script>
    import DeveryExplorer, {registryContractAddress, ercContractAddress} from './devery'
    import LoadData from './LoadData.vue'
    import PostData from './PostData.vue'

    export default {
        components: {
            LoadData,
            PostData
        },
        data() {
            return {
                account: '',
                appAddr: '',
                brandAddr: '',
                productAddr: '',
                registryContractAddress,
                ercContractAddress
            }
        },
        created() {
            DeveryExplorer.getAccount(async (account) => {
                if (this.account === account) return;
                this.account = account;
                await DeveryExplorer.checkAndUpdateAllowance(account);
            })
        },
        methods: {
            /* Handle App */
            handleGetAppAccounts: () => DeveryExplorer.getAppAccounts(),
            handleGetApp: () => DeveryExplorer.getApp(this.appAddr),
            handleAddApp: data => DeveryExplorer.addApp(this.account, data),

            /* Handle Brand */
            handleGetBrandAccounts: () => DeveryExplorer.getBrandAccounts(),
            getBrand: () => DeveryExplorer.getBrand(this.brandAddr),
            handleAddBrand: data => DeveryExplorer.addBrand(this.account, data),

            /* Handle Account permission to mark account */
            handlePermissionAccount: () => DeveryExplorer.permissionAccount(this.account),

            /* Handle Product */
            handleGetProductAccounts: () => DeveryExplorer.getProductAccounts(),
            getProduct: () => DeveryExplorer.getProduct(this.productAddr),
            handleAddProduct: data => DeveryExplorer.addProduct(data),

            /* Handle Token */
            safeTransferTo: DeveryExplorer.safeTransferTo
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