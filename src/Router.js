import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import TrackerScreen from './components/TrackerScreen';
import RouteScreen from './components/RouteScreen';
import AboutScreen from './components/AboutScreen';

class NavigationDrawerStructure extends Component {
	//Structure for the navigation Drawer
	toggleDrawer = () => {
		//Props to open/close the drawer
		this.props.navigationProps.toggleDrawer();
	};
	render() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
					<Icon name="bars" size={30} color="white" style={{ marginLeft: 12 }} />
				</TouchableOpacity>
			</View>
		);
	}
}

const Tracker_StackNavigator = createStackNavigator({
	//All the screen from the Tracker will be indexed here
	First: {
		screen: TrackerScreen,
		navigationOptions: ({ navigation }) => ({
			title: 'Tracker',
			headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
			headerStyle: {
				backgroundColor: '#F0592A',
			},
			headerTintColor: '#fff',
		}),
	},
});

const Route_StackNavigator = createStackNavigator({
	//All the screen from the Route will be indexed here
	Second: {
		screen: RouteScreen,
		navigationOptions: ({ navigation }) => ({
			title: 'Route',
			headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
			headerStyle: {
				backgroundColor: '#F0592A',
			},
			headerTintColor: '#fff',
		}),
	},
});

const About_StackNavigator = createStackNavigator({
	//All the screen from the About will be indexed here
	Third: {
		screen: AboutScreen,
		navigationOptions: ({ navigation }) => ({
			title: 'About',
			headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
			headerStyle: {
				backgroundColor: '#F0592A',
			},
			headerTintColor: '#fff',
		}),
	},
});

const DrawerNavigator = createDrawerNavigator({
	//Drawer Options and indexing
	Tracker: {
		//Title
		screen: Tracker_StackNavigator,
		navigationOptions: {
			drawerLabel: 'Tracker',
			drawerIcon: () => <Icon name="line-chart" size={20} color="#202020" />,
		},
	},
	Route: {
		//Title
		screen: Route_StackNavigator,
		navigationOptions: {
			drawerLabel: 'Route - COMING SOON',
			drawerIcon: () => <Icon name="road" size={20} color="#202020" />,
		},
	},
	About: {
		//Title
		screen: About_StackNavigator,
		navigationOptions: {
			drawerLabel: 'About',
			drawerIcon: () => <Icon name="info" size={20} color="#202020" />,
		},
	},
});

export const Router = createAppContainer(DrawerNavigator);

