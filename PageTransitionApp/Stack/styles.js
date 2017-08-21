import { Platform, StyleSheet } from 'react-native';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default StyleSheet.create({
  stackView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: 'column-reverse',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
  },
  transitionContainer: {
    flex: 1,
  },
  header: {
    left: 0,
    right: 0,
    height: HEADER_HEIGHT + STATUSBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'grey',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});
