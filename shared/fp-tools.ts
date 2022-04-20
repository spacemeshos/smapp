const compose = <A extends unknown, F extends (arg0: A) => A>(...fns: F[]) => (initialVal: A) => fns.reduce((acc, fn) => fn(acc), initialVal);

export default compose;
