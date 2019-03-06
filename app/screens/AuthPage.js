// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Auth from '/components/Auth/Auth';
import * as AuthActions from '../redux/auth/actions';

const mapStateToProps = (state) => {
  return {
    wallet: state.wallet
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(AuthActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
