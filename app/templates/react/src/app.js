import React, { Component } from 'react'
import devery from './devery'
import LoadData from './LoadData'
import PostData from './PostData';

export default class extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            account: '',
            checkBrandAddr: '',
            checkProductAddr: '',
            appAddr: null,
        }
    }

    componentDidMount() {
        if (!window.web3) return;

        let [account] = window.web3.eth.accounts;
        if (account === undefined) {
            this.setState({ account: '' });
            return
        }
        if (account !== this.state.account) {
            this.setState({ account })
        }
    }

    handleBrandAddrChange = ({ target: { value } }) => {
        this.setState({ checkBrandAddr: value })
    };

    handleProductAddrChange = ({ target: { value } }) => {
        this.setState({ checkProductAddr: value })
    };

    handleAppAccountChange = ({ target: { value } }) => {
        this.setState({ appAddr: value })
    };

    // All devery methods used in this example can be found at https://devery.github.io/deveryjs/

    getBrand = async () => {
        const Brand = await devery.getBrand(this.state.checkBrandAddr);
        if (!Brand.active) return Promise.reject('No active brand');
        return Promise.resolve(Brand)
    };

    getProduct = async () => {
        const Product = await devery.getProduct(this.state.checkProductAddr);
        if (!Product.active) return Promise.reject('No product');
        return Promise.resolve(Product)
    };

    handleGetAppAccounts = () => {
        return devery.appAccountsPaginated()
    };

    handleGetApp = async () => {
        return devery.getApp(this.state.appAddr)
    };

    handleGetBrandAccounts = () => {
        return devery.brandAccountsPaginated()
    };

    handleGetProductAccounts = () => {
        return devery.productAccountsPaginated()
    };

    handleAddApp = async (data) => {
        try {
            await devery.addApp(data, this.account, 0);
        } catch (e) {
            if (e.message.indexOf('User denied')) {
                console.log('The user denied the transaction')
            }
        }
    };

    handleAddBrand = async (data) => {
        try {
            await devery.addBrand(this.account, data);
        } catch (e) {
            if (e.message.indexOf('User denied')) {
                console.log('The user denied the transaction')
            }
        }
    };

    handleAddProduct = async (data) => {
        try {
            await devery.addProduct(this.account, data, 'batch 001', new Date().getFullYear(), 'Unknown place');
        } catch (e) {
            if (e.message.indexOf('User denied')) {
                console.log('The user denied the transaction')
            }
        }
    };

    render() {
        const {
            account
        } = this.state;

        return (
            <div className="Explorer">
                <h1>Devery Explorer</h1>

                <h3>User Account:</h3>
                {
                    !account
                        ? <span>Please sign in to MetaMask</span>
                        : <span>{account}</span>
                }

                <h2>APP INFO</h2>
                <fieldset>
                    <h3>Get App Accounts:</h3>

                    <LoadData
                        buttonMessage='Get App Accounts'
                        loadDataFunc={this.handleGetAppAccounts}
                    />
                </fieldset>

                <fieldset>
                    <h3>Get App:</h3>
                    <label>
                        <span>App Info: active, appAccount, appName, fee, feeAccount</span>
                        <input type="text" placeholder="App Address" onChange={this.handleAppAccountChange}/>
                    </label>
                    {
                        !this.state.appAddr
                            ? (<span>Please insert App address first!</span>)
                            : (<LoadData
                                buttonMessage='Get App'
                                loadDataFunc={this.handleGetApp}
                            />)
                    }
                </fieldset>

                <fieldset>
                    <h3>Add App:</h3>
                    {
                        !this.state.account
                            ? (<span>Login with metamask first!</span>)
                            : (<PostData
                                postDataFunc={this.handleAddApp}
                            />)
                    }
                </fieldset>

                <h2>BRAND INFO</h2>

                <fieldset>
                    <h3>Get Brand Accounts:</h3>
                    <p>This gets ALL brand accounts. i.e. Not just for your app.</p>

                    <LoadData
                        buttonMessage='Get Brand Accounts'
                        loadDataFunc={this.handleGetBrandAccounts}
                    />
                </fieldset>

                <fieldset>
                    <h3>Get Brand Info:</h3>
                    <label>
                        <span>Brand Info: brandAccount, appAccount, brandName, active</span>
                        <input type="text" placeholder="Enter Brand Address" onChange={this.handleBrandAddrChange}/>
                    </label>

                    {
                        !this.state.checkBrandAddr
                            ? (<span>Please insert Brand address first!</span>)
                            : (<LoadData
                                buttonMessage='Get Brand Info'
                                loadDataFunc={this.getBrand}
                            />)
                    }
                </fieldset>

                <fieldset>
                    <h3>Add Brand:</h3>
                    {
                        !this.state.account
                            ? (<span>Login with metamask first!</span>)
                            : (<PostData
                                postDataFunc={this.handleAddBrand}
                            />)
                    }
                </fieldset>

                <h2>PRODUCT INFO</h2>

                <fieldset>
                    <h3>Get Product Accounts:</h3>
                    <p>This gets ALL product accounts. i.e. Not just for your app/brand.</p>

                    <LoadData
                        buttonMessage='Get Product Accounts'
                        loadDataFunc={this.handleGetProductAccounts}
                    />
                </fieldset>

                <fieldset>
                    <h3>Get Product Info:</h3>
                    <label>
                        <span>Product Info: productAccount, brandAccount, description, details, year, origin, active</span>
                        <input type="text" placeholder="Enter A Product Address" onChange={this.handleProductAddrChange}/>
                    </label>

                    {
                        !this.state.checkProductAddr
                            ? (<span>Please insert Product address first!</span>)
                            : (<LoadData
                                buttonMessage='Get Product Info'
                                loadDataFunc={this.getProduct}
                            />)
                    }
                </fieldset>

                <fieldset>
                    <h3>Add Product:</h3>
                    {
                        !this.state.account
                            ? (<span>Login with metamask first!</span>)
                            : (<PostData
                                postDataFunc={this.handleAddProduct}
                            />)
                    }
                </fieldset>
            </div>
        )
    }
}