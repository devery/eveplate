import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import Home from './screens/Home'

const { width } = Dimensions.get('screen');

export default class App extends React.Component {
  render() {
    return (
        <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
          <SafeAreaView>
            <Home/>
          </SafeAreaView>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    flex: 1,
    backgroundColor: '#fff',
  },
});
