import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  screen: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    height: 50,
    width: 100,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebar: {
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    top: 0,
  },
  menuText: {
    color: 'white',
  },
});
