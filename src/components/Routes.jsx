import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from "../pages/Profile";
import TodosScreen from "../pages/TodosScreen";

export default class Routes extends Component<{}> {
	async componentDidMount() {
		await Expo.Font.loadAsync({
		  Roboto: require('native-base/Fonts/Roboto.ttf'),
		  Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
		  Ionicons: require('native-base/Fonts/Ionicons.ttf'),
		});
	
		this.setState({ isReady: true });
	}
	
	render() {
		return(
			<Router>
			    <Scene>
					<Scene key="root" hideNavBar={true} initial={!this.props.isLoggedIn}>
						<Scene key="login" component={Login} initial={true} />
						<Scene key="signup" component={Signup} title="Register" />
					</Scene>
					<Scene key="app" hideNavBar={true} initial={this.props.isLoggedIn}>
						<Scene key="profile" component={Profile} title="Profile" />
						<Scene key="todo" component={TodosScreen} initial={true} />
					</Scene>
				</Scene>
			 </Router>
		)
	}
}