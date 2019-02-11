import { Platform, AppRegistry } from 'react-native';
import Root from './src/Root';

AppRegistry.registerComponent('cosmic', () => Root);
if (Platform.OS === 'web') {
    AppRegistry.runApplication('cosmic', {
        rootTag: document.getElementById('root')
    });
}
