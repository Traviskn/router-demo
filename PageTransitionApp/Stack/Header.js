import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import styles from './styles';

// TODO: Add more header configuration options
// - title
// - right/left button
// - Allow rendering a custom header

export default function Header({ showBack, goBack }) {
  return (
    <View style={styles.header}>
      {showBack &&
        <TouchableHighlight onPress={goBack}>
          <Text style={styles.backText}>&lt;</Text>
        </TouchableHighlight>}

      <Text>HEADER</Text>
    </View>
  );
}
