import React, { Component } from 'react';
import { View } from 'react-native';
import { NativeRouter, Route, Switch } from 'react-router-native';
import Stack from './RouteStack';
import Home from './Home';
import Message from './Message';
import Messages from './Messages';
import styles from './styles';

export default class PageTransitionApp extends Component {
  render() {
    return (
      <NativeRouter>
        <Route
          path="/"
          render={({ location }) =>
            <View style={styles.container}>
              <Stack>
                <Switch location={location}>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/messages" component={Messages} />
                  <Route path="/messages/:messageId" component={Message} />
                </Switch>
              </Stack>
            </View>}
        />
      </NativeRouter>
    );
  }
}
