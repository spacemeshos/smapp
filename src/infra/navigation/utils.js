function getCurrentRouteName(navState : Object, { withParams }: { withParams : boolean }) : { name: string, params?: { origin: string } } {
    if (!navState) {
        return {};
    }
    const route = navState.routes[navState.index];

    if (route.routes) {
        return getCurrentRouteName(route, { withParams }); // nested routes
    } else {
        if (withParams) {
            return {
                name: route.routeName,
                params: { ...route.params }
            };
        }
        return { name: route.routeName };
    }
}

export { getCurrentRouteName }; // eslint-disable-line import/prefer-default-export
