import path from 'path';
import { nodeConsts } from '../app/vars';

const protoLoader = require('@grpc/proto-loader');

const grpc = require('grpc');

const PROTO_PATH = path.join(__dirname, '..', 'proto/api.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const spacemeshProto = grpc.loadPackageDefinition(packageDefinition);

class NetService {
  constructor(url = nodeConsts.DEFAULT_URL) {
    this.service = new spacemeshProto.pb.SpacemeshService(url, grpc.credentials.createInsecure());
  }

  getNodeStatus = () =>
    new Promise((resolve, reject) => {
      this.service.GetNodeStatus({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getStateRoot = () =>
    new Promise((resolve, reject) => {
      this.service.GetStateRoot({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getMiningStatus = () =>
    new Promise((resolve, reject) => {
      this.service.GetMiningStats({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  initMining = ({ logicalDrive, commitmentSize, coinbase }) =>
    new Promise((resolve, reject) => {
      this.service.StartMining({ logicalDrive, commitmentSize, coinbase }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getUpcomingAwards = () =>
    new Promise((resolve, reject) => {
      this.service.GetUpcomingAwards({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getAccountRewards = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountRewards({ address }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  setAwardsAddress = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.SetAwardsAddress({ address }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getNonce = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetNonce({ address }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getBalance = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetBalance({ address }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  submitTransaction = ({ tx }) =>
    new Promise((resolve, reject) => {
      this.service.SubmitTransaction({ tx }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getAccountTxs = ({ account, startLayer }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountTxs({ account: { address: account }, startLayer }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getTransaction = ({ id }) =>
    new Promise((resolve, reject) => {
      this.service.GetTransaction({ id }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  setNodeIpAddress = ({ nodeIpAddress }) => {
    this.service = new spacemeshProto.pb.SpacemeshService(nodeIpAddress, grpc.credentials.createInsecure());
  };
}

const NodeNetService = new NetService();
export default NodeNetService;
