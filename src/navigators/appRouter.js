import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { smColors, screenGroupNames } from '/vars';
import MiddleSection from './middleSection';
import authentication from './authentication';

const AppTopNavigation = createSwitchNavigator(
    {
        [screenGroupNames.AUTHENTICATION]: {
            screen: authentication,
            navigationOptions: {
                header: null
            }
        },
        [screenGroupNames.SIGNED_IN]: {
            screen: MiddleSection,
            navigationOptions: {
                header: null
            }
        }
    },
    {
        initialRouteName: screenGroupNames.AUTHENTICATION,
        headerMode: 'screen',
        cardStyle: {
            backgroundColor: smColors.white
        }
    }
);
// $FlowFixMe
export default createAppContainer(AppTopNavigation, {});
