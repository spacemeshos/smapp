import { Platform, AppRegistry } from 'react-native';
import Root from './src/Root';

AppRegistry.registerComponent('smApp', () => Root);
if (Platform.OS === 'web') {
    AppRegistry.runApplication('smApp', {
        rootTag: document.getElementById('root')
    });
}
