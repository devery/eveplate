import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native';

import LoadData from '../components/LoadDataHelper'
import devery from '../components/devery'

export default class extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      checkBrandAddr: '',
      checkProductAddr: '',
      appAccount: null,
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
    return (
        <View style={styles.home}>
          <Text style={styles.h2}>APP INFO</Text>
          <Text style={styles.h3}>Get App Accounts:</Text>

          <LoadData
              buttonMessage='Get App Accounts'
              loadDataFunc={this.handleGetAppAccounts}
          />

          <Text style={styles.h3}>Get App:</Text>
          <Text style={styles.span}>App Info: active, appAccount, appName, fee, feeAccount</Text>
          <TextInput style={styles.input} placeholder="App Address" onChangeText={this.handleAppAccountChange}/>
          {
            !this.state.appAccount
                ? (<Text style={styles.span}>Please insert App address first</Text>)
                : (<LoadData
                    buttonMessage='Get App'
                    loadDataFunc={this.handleGetApp}
                />)
          }

          <Text style={styles.h2}>BRAND INFO</Text>

          <Text style={styles.h3}>Get Brand Accounts:</Text>
          <Text style={styles.p}>This gets ALL brand accounts. i.e. Not just for your app.</Text>

          <LoadData
              buttonMessage='Get Brand Accounts'
              loadDataFunc={this.handleGetBrandAccounts}
          />

          <Text style={styles.h3}>Get Brand Info:</Text>
          <Text style={styles.span}>Brand Info: brandAccount, appAccount, brandName, active</Text>
          <TextInput style={styles.input} placeholder="Enter Brand Address" onChangeText={this.handleBrandAddrChange}/>

          {
            !this.state.checkBrandAddr
                ? (<Text style={styles.span}>Please insert Brand address first</Text>)
                : (<LoadData
                    buttonMessage='Get Brand Info'
                    loadDataFunc={this.getBrand}
                />)
          }

          <Text style={styles.h2}>PRODUCT INFO</Text>

          <Text style={styles.h3}>Get Product Accounts:</Text>
          <Text style={styles.p}>This gets ALL product accounts. i.e. Not just for your app/brand.</Text>

          <LoadData
              buttonMessage='Get Product Accounts'
              loadDataFunc={this.handleGetProductAccounts}
          />

          <Text style={styles.h3}>Get Product Info:</Text>
          <Text style={styles.span}>Product Info: productAccount, brandAccount, description, details, year, origin, active</Text>
          <TextInput style={styles.input} placeholder="Enter A Product Address" onChangeText={this.handleProductAddrChange}/>

          {
            !this.state.checkProductAddr
                ? (<Text style={styles.span}>Please insert Product address first</Text>)
                : (<LoadData
                    buttonMessage='Get Product Info'
                    loadDataFunc={this.getProduct}
                />)
          }
        </View>
    )
  }
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 34,
    marginVertical: 16,
    fontWeight: 'bold',
  },

  h3: {
    fontSize: 28,
    marginVertical: 16,
    fontWeight: 'bold',
  },

  input: {
    height: 40,
    borderColor: '#bebebe',
    paddingLeft: 4,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 16,
  },

  p: {
    fontSize: 18,
    marginVertical: 16,
  },

  span: {
    fontSize: 16,
    marginVertical: 12,
  },
});
