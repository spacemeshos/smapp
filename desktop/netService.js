const PROTO_PATH = './proto/api.proto';
const grpc = require('grpc');

const spacemeshProto = grpc.load(PROTO_PATH); // eslint-disable-line prefer-destructuring

const defaultUrl = 'localhost:9091';
const { SpacemeshService } = spacemeshProto.pb;
const netService = new SpacemeshService(defaultUrl, grpc.credentials.createInsecure());

netService.echo({ value: 'Hello World!' }, (error, response) => {
  if (error) {
    cosole.log('request failed'); // eslint-disable-line no-undef
  } else {
    console.log(response); // eslint-disable-line no-console
  }
});

export default netService;
