// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import routes from '../routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <div>
          <Link to="/counter">to Counter</Link>
        </div>
        <div>
          <Link to="/root">to ROOT</Link>
        </div>
      </div>
    );
  }
}
