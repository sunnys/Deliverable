import React from 'react';
import { Header } from "react-native-elements";

const AppHeader = () => (
  <Header
    leftComponent={{ icon: 'menu', color: '#fff' }}
    centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
    rightComponent={{ icon: 'home', color: '#fff' }}
    containerStyle={{
      backgroundColor: '#455a64',
      justifyContent: 'space-around',
    }}
  />
);

export default AppHeader;
