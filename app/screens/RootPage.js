// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import WalletRoot from '../components/WalletRoot';
import * as WalletActions from '../redux/wallet/actions';

const mapStateToProps = (state) => {
  return {
    wallet: state.wallet
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(WalletActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletRoot);
