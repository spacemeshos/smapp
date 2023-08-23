![Lint And Build Pass](https://github.com/spacemeshos/smapp/workflows/Lint%20And%20App%20Build/badge.svg)

<h1 align="center">
  <p align="center">Smapp - the Spacemesh App 🏦📊</p>
  <p align="center">Smesher UI + Wallet</p>
</h1>


<p align="center">
<a href="https://gitcoin.co/profile/spacemeshos" title="Push Open Source Forward">
    <img src="https://s.gitcoin.co/static/v2/images/promo_buttons/slice_02.png" width="267px" height="52px" alt="Browse Gitcoin Bounties"/>
</a>
</p>

This repo includes the source code for the `Spacemesh App`. A desktop application for Windows 10, OS X, and Linux which includes a Smesher and a basic wallet. The main artifacts of this repo are the app and an app installer for all supported platforms.

**Important note: Currently, Smapp does not support Hardware Wallets. This feature will be implemented in the future, but until then we highly recommend using [SMCLI](https://github.com/spacemeshos/smcli) to generate the necessary keys for your ledger setup.
Also, the Wallet-only mode is temporarily disabled.**

![](<img width="1442" alt="smesher" src="https://github.com/spacemeshos/smapp/assets/89876259/a9aa7389-c1dc-446f-8994-c8e306efc416">
)

![](<img width="1442" alt="wallet" src="https://github.com/spacemeshos/smapp/assets/89876259/65ba98e3-2d09-412b-b9f5-2042ecd1e30d">
)


## Installation & Quick Start

Download the latest Smapp release from [Spacemesh Website](https://spacemesh.io/start/).

### Building from Source

Smapp is written in TypeScript and bundled within Electron. You need Node.js (v12) and Yarn to build from the source. Make sure they are available on your system.

1. Clone the repository
2. Read `node/use-version` file: this is the version of `go-spacemesh` that should be used
3. Download the specified version from [Go-spacemesh Releases](https://github.com/spacemeshos/go-spacemesh/releases)
4. Put the binary in either `node/windows`, `node/mac`, or `node/linux` folder, depending on your platform
5. Run `yarn` to install dependencies
6. Run `yarn start` to start the application in development mode

To build and pack the application:

1. Run `yarn build`
2. Run one of the commands depending on your platform:
   - `yarn package-win`
   - `yarn package-mac`
     set env variable `DONT_SIGN_APP=1` to skip notarizing the app,
   - `yarn package-linux`

### Arguments
Smapp can be started with additional arguments:
- `--discovery` (string)
  _e.g._ `./Spacemesh --discovery=http://localhost:8000/networks.json`
  Specifies custom url to a custom networks list. It makes it possible for Smesher to connect to custom networks.
  Env variable alias: `DISCOVERY_URL`
- `--pprof-server` (boolean)
  _e.g._ `./Spacemesh --pprof-server`
  It makes Smapp runs go-spacemesh with the `--pprof-server` flag.
  Env variable alias: `PPROF_SERVER`
- `--test-mode` (boolean)
  _e.g._ `./Spacemesh --test-mode`
  It runs Smapp and the Node under the hood in standalone mode, making it much easier to test and debug the application.
  Env variable alias: `TEST_MODE`
- `--check-interval` (number)
  _e.g._ `./Spacemesh --check-interval=60` to check for updates every 60 seconds
  Smapp checks every N seconds for the updates the software updates and new config.
  If new config arrived — it automatically merges it with the custom User settings and
  restarts the Node.
  Default: `3600` seconds, or every hour

To run the application in dev mode with the same behavior set env variables instead:
```
PPROF_SERVER=1 DISCOVERY_URL=http://localhost:8000/networks.json yarn start
```

### Environment Variables

#### Connect to custom networks:
```
DISCOVERY_URL=http://localhost:8000/networks.json yarn start
```
Alias for `--discovery` argument.

<details>
    <summary>Deprecated</summary>

  > To run the application against DevNet you have to set URL to the config file to env variable `DEV_NET_URL`:
  > ```
  > DEV_NET_URL=https://.../config.json yarn start
  > ```
  >
  > To run the application against DevNet in the Wallet Only mode you have to also set the URL (or list of URLs separated by commas) to GRPC API provider to env variable `DEV_NET_REMOTE_API`:
  > ```
  > export DEV_NET_REMOTE_API=https://192.168.0.1:31030
  > export DEV_NET_URL=https://.../config.json
  > yarn start
  > ```

</details>

#### Profiling Node
```
PPROF_SERVER=1 yarn start
```
Alias for `--pprof-server` argument.

#### Sentry
```
SENTRY_DSN='collection errors/logs url taken from sentry'
SENTRY_LOG_LEVEL=boolean # enables debug information
SENTRY_AUTH_TOKEN='special auth token for sentry cli integration'
```

### Building Artifacts in CI

Smapp uses two workflows. Both of them build an application for all supported platforms: Windows, macOS, Linux.

- **PR builds**
  Triggered by open Pull Request and any further changes on the branch.
  For testing and development purposes only.
  Unsigned and can not be trusted.
  Artifacts and links a temporary.
  Links to artifacts posted by the bot in comments.
- **Release builds**
  Triggered by tag `v*`.
  Public releases of Smapp.
  Signed for macOS and Windows platforms.
  Artifacts and links should be permanent.
  CI prepares a draft release with links to the artifacts.

---
- [Roadmap & product details](https://product.spacemesh.io/)
- [Platform documentation](https://platform.spacemesh.io/)
- [Spacemesh improvement proposals](https://github.com/spacemeshos/SMIPS)


### Run the Spacemesh app on Ubuntu
We recommend choosing AppImage as it is not possible to embed certain features in the .deb package. 
For the Ubuntu platform Electron has an issue with setup, if you want to run it on the Ubuntu > 22.04 platform, please provide ```--no-sandbox``` flag

**command:** 
```/opt/Spacemesh/spacemesh_app --no-sandbox```

---

## Troubleshooting

### The first thing to check if you encounter any issues with Smapp

- Check the Release Notes on GitHub - you might find there the information about the known issues and workarounds to them. 
- We recommend visiting https://status.spacemesh.io/, to see if Spacemesh Team is already working on this issue.
- Check the Smapp version -it should always come from the official source and be the latest released package, update it if needed. 
- If you have the latest version, restart Smapp and check if the issue remains.
- The GPU drivers should be up to date; please check if you have the latest release. For NVIDIA, it should be version 525 (currently). 
- Check our [Discord](https://discord.com/channels/623195163510046732/691261757921951756) chats, the issue might have been discussed there.

Additionally: 

### Windows: 

- The following directories should be removed in case of reinstallation from scratch:

  ```C:\Users\{USERNAME}\AppData\Local\Programs\Spacemesh``` or your installation path

  ```C:\Users\{USERNAME}\AppData\Roaming\Spacemesh```

- Remove the PoS data directory if you want to remove/recreate PoS data:

  ```C:\Users\{USERNAME}\post\{GENESIS_ID}``` or your PoS directory path

  Where `{GENESIS_ID}` is first 8 chars from the HexString. Eg `7c8cef2b`

- The latest Visual C++ Redist should be installed
- Check the Firewall settings, and amend them if needed

### Linux: 

- The following directories should be removed in case of reinstallation from scratch:

  ```/opt/Spacemesh``` (deb) or ```~/Applications/Spacemesh-...``` (AppImage) or your installation path

  ```~/.config/Spacemesh```

- Remove the PoS data directory if you want to remove/recreate PoS data:

  ```~/post/{GENESIS_ID}``` or your PoS directory path

  Where `{GENESIS_ID}` is first 8 chars from the HexString. Eg `7c8cef2b`

- We recommend using AppImage as some features cannot be embedded into a .deb package.
- If you are using Ubuntu, check the OS version. We recommend at least 22.04
- Glibc and other libraries should be up to date

### macOS:

- The following directories should be removed in case of reinstallation from scratch:

  ```/Applications/Spacemesh``` or your installation path

  ```~/Library/Application\ Support/Spacemesh```

- Remove the PoS data directory if you want to remove/recreate PoS data:

  ```~/post/{GENESIS_ID}``` or your PoS directory path

  Where `{GENESIS_ID}` is first 8 chars from the HexString. Eg `7c8cef2b`

- Check if the incoming connections aren’t blocked for go-spacemesh
