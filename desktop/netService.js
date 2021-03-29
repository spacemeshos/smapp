import path from 'path';
import { nodeConsts } from '../app/vars';
import { writeInfo, writeError } from './logger';

const protoLoader = require('@grpc/proto-loader');

const grpc = require('@grpc/grpc-js');

const PROTO_PATH = path.join(__dirname, '..', 'proto/api.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const spacemeshProto = grpc.loadPackageDefinition(packageDefinition);

const getDeadline = () => new Date().setSeconds(new Date().getSeconds() + 120000);

class NetService {
  constructor(url = nodeConsts.DEFAULT_URL) {
    this.service = new spacemeshProto.pb.SpacemeshService(url, grpc.credentials.createInsecure());
  }

  isServiceReady = () =>
    new Promise((resolve, reject) => {
      this.service.Echo({}, { deadline: new Date().setSeconds(new Date().getSeconds() + 200) }, (error) => {
        if (error) {
          writeError('netService', 'grpc isServiceReady', error);
          reject();
        }
        writeInfo('netService', 'grpc isServiceReady', 'true');
        resolve();
      });
    });

  getNodeStatus = () =>
    new Promise((resolve, reject) => {
      this.service.GetNodeStatus({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getNodeStatus', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getNodeStatus', { response });
        resolve(response);
      });
    });

  getStateRoot = () =>
    new Promise((resolve, reject) => {
      this.service.GetStateRoot({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getStateRoot', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getStateRoot', { response });
        resolve(response);
      });
    });

  getMiningStatus = () =>
    new Promise((resolve, reject) => {
      this.service.GetMiningStats({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getMiningStatus', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getMiningStatus', { response });
        resolve(response);
      });
    });

  initMining = ({ logicalDrive, commitmentSize, coinbase }) =>
    new Promise((resolve, reject) => {
      this.service.StartMining({ logicalDrive, commitmentSize, coinbase }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc initMining', error);
          reject(error);
        }
        writeInfo('netService', 'grpc initMining', { response }, { logicalDrive, commitmentSize, coinbase });
        resolve(response);
      });
    });

  getUpcomingAwards = () =>
    new Promise((resolve, reject) => {
      this.service.GetUpcomingAwards({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getUpcomingAwards', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getUpcomingAwards', { response });
        resolve(response);
      });
    });

  getAccountRewards = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountRewards({ address }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getAccountRewards', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getAccountRewards', { response }, { address });
        resolve(response);
      });
    });

  setRewardsAddress = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.SetAwardsAddress({ address }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc setRewardsAddress', error);
          reject(error);
        }
        writeInfo('netService', 'grpc setRewardsAddress', { response }, { address });
        resolve(response);
      });
    });

  getNonce = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetNonce({ address }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getNonce', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getNonce', { response }, { address });
        resolve(response);
      });
    });

  getBalance = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetBalance({ address }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getBalance', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getBalance', { response }, { address });
        resolve(response);
      });
    });

  submitTransaction = ({ tx }) =>
    new Promise((resolve, reject) => {
      this.service.SubmitTransaction({ tx }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc submitTransaction', error);
          reject(error);
        }
        writeInfo('netService', 'grpc submitTransaction', { response }, { tx });
        resolve(response);
      });
    });

  getAccountTxs = ({ account, startLayer }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountTxs({ account: { address: account }, startLayer }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getAccountTxs', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getAccountTxs', { response }, { account, startLayer });
        resolve(response);
      });
    });

  getTransaction = ({ id }) =>
    new Promise((resolve, reject) => {
      this.service.GetTransaction({ id }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          writeError('netService', 'grpc getTransaction', error);
          reject(error);
        }
        writeInfo('netService', 'grpc getTransaction', { response }, { id });
        resolve(response);
      });
    });

  setNodeIpAddress = ({ nodeIpAddress }) => {
    this.service = new spacemeshProto.pb.SpacemeshService(nodeIpAddress, grpc.credentials.createInsecure());
  };
}

const NodeNetService = new NetService();
export default NodeNetService;
