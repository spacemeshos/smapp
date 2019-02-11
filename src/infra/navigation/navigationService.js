import { NavigationActions, StackActions } from 'react-navigation';
import { isEqual } from '/infra/utils';
import { getCurrentRouteName as getCurrentRouteNameUtil } from './utils';

let _navigator;

function setTopLevelNavigator(navigatorRef : Object) {
    _navigator = navigatorRef;
}

function getCurrentRouteName({ withParams } : { withParams: boolean } = {}) {
    return getCurrentRouteNameUtil(_navigator.state.nav, { withParams });
}

function navigate(routeName : string, params : Object, options: { tabReset : boolean, noPush : boolean } = {}) {
    const isCurrentRoute = isRequestedRouteIdenticalToCurrent({ routeName, params });
    if (isCurrentRoute && !options.tabReset) {
        return;
    }
    if (options.tabReset) {
        // $FlowFixMe
        _navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
                action: StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName, params })]
                })
            })
        );
    } else if (options.noPush) {
        _navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params
            })
        );
    } else {
        _navigator.dispatch(
            StackActions.push({
                routeName,
                params
            })
        );
    }
}

function goBack({ key } : { key : string } = {}) {
    _navigator.dispatch(NavigationActions.back({ key }));
}

function replace(routeName : string, params : Object) {
    _navigator.dispatch(
        StackActions.replace({
            routeName,
            params
        })
    );
}

function resetToScreen(routeName : string, key : string) {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            key,
            actions: [NavigationActions.navigate({ routeName })]
        })
    );
}

function isRequestedRouteIdenticalToCurrent({ routeName, params = {} }) : boolean {
    if (!_navigator.state.nav) {
        return false;
    }
    const currentRoute = getCurrentRouteName({ withParams: true });
    delete currentRoute.params.origin;
    return !!(currentRoute.name === routeName && isEqual(currentRoute.params, params));
}

export default {
    navigate,
    goBack,
    replace,
    resetToScreen,
    getCurrentRouteName,
    setTopLevelNavigator
};
