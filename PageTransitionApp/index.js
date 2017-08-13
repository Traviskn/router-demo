import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NativeRouter, Route, Switch } from 'react-router-native';
import Home from './Home';
import Message from './Message';
import Messages from './Messages';
import styles from './styles';

export default class PageTransitionApp extends Component {
  render() {
    return (
      <NativeRouter>
        <View style={styles.container}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/messages" component={Messages} />
            <Route
              path="/messages/:messageId"
              component={Message}
            />
          </Switch>
        </View>
      </NativeRouter>
    );
  }
}
