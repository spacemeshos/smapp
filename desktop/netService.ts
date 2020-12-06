import path from 'path';
import Logger from './logger';

const logger = Logger({ className: 'NetService' });

const protoLoader = require('@grpc/proto-loader');

const grpc = require('@grpc/grpc-js');

const PROTO_PATH = path.join(__dirname, '..', 'proto/api.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const spacemeshProto = grpc.loadPackageDefinition(packageDefinition);

const getDeadline = () => new Date().setSeconds(new Date().getSeconds() + 120000);

class NetService {
  // @ts-ignore
  private service: spacemeshProto.pb.SpacemeshService;

  constructor(url = 'localhost:9091') {
    this.service = new spacemeshProto.pb.SpacemeshService(url, grpc.credentials.createInsecure());
  }

  isServiceReady = () =>
    new Promise<void>((resolve, reject) => {
      this.service.Echo({}, { deadline: new Date().setSeconds(new Date().getSeconds() + 200) }, (error: any) => {
        if (error) {
          logger.error('isServiceReady', error);
          reject();
        }
        logger.log('isServiceReady', true);
        resolve();
      });
    });

  getNodeStatus = () =>
    new Promise((resolve, reject) => {
      this.service.GetNodeStatus({}, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('getNodeStatus', error);
          reject(error);
        }
        logger.log('getNodeStatus', response);
        resolve(response);
      });
    });

  getStateRoot = () =>
    new Promise((resolve, reject) => {
      this.service.GetStateRoot({}, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('getStateRoot', error);
          reject(error);
        }
        logger.log('getStateRoot', response);
        resolve(response);
      });
    });

  getAccountRewards = ({ address }: { address: Uint8Array }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountRewards({ address }, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('getAccountRewards', error);
          reject(error);
        }
        logger.log('getAccountRewards', response, { address });
        resolve(response);
      });
    });

  getNonce = ({ address }: { address: Uint8Array }) =>
    new Promise((resolve, reject) => {
      this.service.GetNonce({ address }, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('getNonce', error);
          reject(error);
        }
        logger.log('getNonce', response, { address });
        resolve(response);
      });
    });

  getBalance = ({ address }: { address: Uint8Array }) =>
    new Promise((resolve, reject) => {
      this.service.GetBalance({ address }, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('getBalance', error);
          reject(error);
        }
        logger.log('getBalance', response, { address });
        resolve(response);
      });
    });

  submitTransaction = ({ tx }: { tx: any }) =>
    new Promise((resolve, reject) => {
      this.service.SubmitTransaction({ tx }, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('netService', 'grpc submitTransaction', error);
          reject(error);
        }
        logger.log('submitTransaction', response, { tx });
        resolve(response);
      });
    });

  getAccountTxs = ({ account, startLayer }: { account: any; startLayer: number }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountTxs({ account: { address: account }, startLayer }, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('getAccountTxs', error);
          reject(error);
        }
        logger.log('getAccountTxs', response, { account, startLayer });
        resolve(response);
      });
    });

  getTransaction = ({ id }: { id: Uint8Array }) =>
    new Promise((resolve, reject) => {
      this.service.GetTransaction({ id }, { deadline: getDeadline() }, (error: any, response: unknown) => {
        if (error) {
          logger.error('getTransaction', error);
          reject(error);
        }
        logger.log('getTransaction', response, { id });
        resolve(response);
      });
    });

  setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }) => {
    this.service = new spacemeshProto.pb.SpacemeshService(nodeIpAddress, grpc.credentials.createInsecure());
  };
}

const NodeNetService = new NetService();
export default NodeNetService;
