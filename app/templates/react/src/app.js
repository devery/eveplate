import React, { Component } from 'react'
import LoadData from './LoadDataHelper'
import devery from './devery'

export default class extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            account: 'Please sign in to MetaMask',
            checkBrandAddr: '',
            checkProductAddr: '',
            appAccount: null,
        }
    }

    componentDidMount() {
        if (!window.web3) return;

        // Checks for active MetaMask account info.
        let account = window.web3.eth.accounts[0];
        if (account === undefined) {
            this.setState({
                account: 'Please sign in to MetaMask.',
            });
            return
        }
        if (account !== this.state.account) {
            this.setState({ account })
        }
    }

    handleBrandAddrChange = e => {
        this.setState({ checkBrandAddr: e.target.value })
    };

    handleProductAddrChange = e => {
        this.setState({ checkProductAddr: e.target.value })
    };

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

    handleAppAccountChange = e => {
        this.setState({ appAccount: e.target.value })
    };

    handleGetApp = async () => {
        return devery.getApp(this.state.appAccount)
    };

    handleGetBrandAccounts = () => {
        return devery.brandAccountsPaginated()
    };

    handleGetProductAccounts = () => {
        return devery.productAccountsPaginated()
    };

    render() {
        const {
            account
        } = this.state;

        return (
            <div className="Explorer">
                <div>
                    <h1>Devery Explorer</h1>
                    <p>User Account: {account}</p>
                </div>

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
                        !this.state.appAccount
                            ? (<span>Please insert App address first</span>)
                            : (<LoadData
                                buttonMessage='Get App'
                                loadDataFunc={this.handleGetApp}
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
                            ? (<span>Please insert Brand address first</span>)
                            : (<LoadData
                                buttonMessage='Get Brand Info'
                                loadDataFunc={this.getBrand}
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
                            ? (<span>Please insert Product address first</span>)
                            : (<LoadData
                                buttonMessage='Get Product Info'
                                loadDataFunc={this.getProduct}
                            />)
                    }
                </fieldset>
            </div>
        )
    }
}