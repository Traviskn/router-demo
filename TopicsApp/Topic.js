import React from 'react';
import { Text } from 'react-native';
import styles from './styles';

export default function Topic({ match }) {
  return (
    <Text style={styles.topic}>
      {match.params.topicId}
    </Text>
  );
}
