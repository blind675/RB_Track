import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {};

class AboutScreen extends Component<Props> {
	render() {
		return (
			<View style={styles.screenContainer}>
				<Text style={styles.textStyle}>This app is a simple tracking app for ©Reactive Boards. For more details please visit www.reactive-boards.com</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		margin: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textStyle: {
		color: '#404040',
		fontSize: 18,
	},
});

export default AboutScreen;
