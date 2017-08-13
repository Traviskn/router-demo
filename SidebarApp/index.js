import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { NativeRouter, Route, Link, Switch } from 'react-router-native';
import Sidebar from './Sidebar';
import styles from './styles';

export default class SidebarApp extends Component {
  state = {
    sidebarIsOpen: false,
  };

  render() {
    /* Sidebar without react-router
     *
     * const { sidebarIsOpen } = this.state;
     *
     * return (
     *   <View style={styles.container}>
     *     <Sidebar isOpen={sidebarIsOpen} />
     *
     *     <View style={styles.screen}>
     *       <TouchableHighlight
     *         onPress={() => {
     *           this.setState(state => ({ sidebarIsOpen: !state.sidebarIsOpen }));
     *         }}>
     *         <Text>
     *           {this.state.sidebarIsOpen ? 'Close ' : 'Open '} Sidebar
     *         </Text>
     *       </TouchableHighlight>
     *     </View>
     *   </View>
     * );
     */

    /* Sidebar with react-router */
    return (
      <NativeRouter>
        <View style={styles.container}>
          <Route
            path="/sidebar"
            children={({ match }) =>
              // `children` always renders, match or not. This
              // way we can always render the sidebar, and then
              // tell it if its open or not
              <Sidebar isOpen={!!match} />}
          />
          <View style={styles.screen}>
            <Switch>
              <Route
                exact
                path="/"
                render={() =>
                  <Link to="/sidebar">
                    <Text>Open Sidebar</Text>
                  </Link>}
              />
              <Route
                render={() =>
                  <Link to="/">
                    <Text>Close Sidebar</Text>
                  </Link>}
              />
            </Switch>
          </View>
        </View>
      </NativeRouter>
    );
  }
}
