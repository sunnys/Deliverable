import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import Routes from './components/Routes';
import {connect } from 'react-redux';

class Main extends React.Component {
    render(){
        return(
            <View style={styles.container}>
                <StatusBar backgroundColor="#1c313a" barStyle="light-content" />
                <Routes/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(null, null)(Main);