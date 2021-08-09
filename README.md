![Lint And Build Pass](https://github.com/spacemeshos/smapp/workflows/Lint%20And%20App%20Build/badge.svg)

<h1 align="center">
  <a href="https://spacemesh.io"><img width="400" src="https://spacemesh.io/content/images/2019/05/black_logo_hp.png" alt="Spacemesh logo" /></a>
  <p align="center">Smapp - the Spacemesh App 🏦📊</p>
  <p align="center">Smesher UI + Wallet</p>
</h1>


<p align="center">
<a href="https://gitcoin.co/profile/spacemeshos" title="Push Open Source Forward">
    <img src="https://gitcoin.co/static/v2/images/promo_buttons/slice_02.png" width="267px" height="52px" alt="Browse Gitcoin Bounties"/>
</a>
</p>

This repo includes the source code for the `Spacemesh App`. A desktop application for Windows 10, OS X and Linux which includes a Smesher and a basic wallet. The main artifects of this repo are the app and an app installer for all supported platforms.

![](https://github.com/spacemeshos/smapp/blob/develop/resources/smapp_app_smesher.png)

![](https://github.com/spacemeshos/smapp/blob/develop/resources/smapp_app_wallet.png)


## Installation & Quick Start

Download the latest Smapp release from [Spacemesh Website](https://spacemesh.io/start/).

### Building from Source

Smapp is written in TypeScript and bundled within Electron. You need Node.js (v12) and Yarn to build from source. Make sure they are available on your system.

1. Clone the repository
2. Read `node/use-version` file: this is the version of `go-spacemesh` that should be used
3. Download the specified version from [Go-spacemesh Releases](https://github.com/spacemeshos/go-spacemesh/releases)
4. Put the binary in either `node/windows`, `node/mac`, or `node/linux` folder, depending on you platform
5. Run `yarn` to install dependencies
6. Run `yarn start` to start the application in development mode

To build and pack application:

1. Run `yarn build`
2. Run one of the commands depending on your platform:
   - `yarn package-win`
   - `yarn package-mac`
     set env variable `DONT_SIGN_APP=1` to skip notarizing the app,
   - `yarn package-linux`

### Building Artifacts in CI

Smapp uses two workflows. Both of them builds an application for all supported platforms: windows, macOS, linux.

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

# Spacemesh 0.1 Release Milestone - WIP
We are currently finalizing the App and the installer - the artifacts of this repo for the Open Testnet Release. The best resource to understand the app functionality and capabilities is our [Spacemesh Testnet Guide](http://testnet.spacemesh.io). 

---

# MVP1 Milestone (Complete)
- [Interactive Prototype](https://xd.adobe.com/view/d1d14f8b-4c11-46a9-400b-c0157ecae268-a7e0/?fullscreen)
- [Desktop Specs and Visual Design Guide](https://docs.google.com/presentation/d/1G20T3KSt3iVmTqPJ7x9bljBA--PrPUNOpRNA9klVRSk/edit?usp=sharing)
- [Assets](https://drive.google.com/drive/folders/1OHXb15_5uKHsGGMlm0zQ8LSIMRz9C2E7)
- [Desktop screens specs and flows](https://xd.adobe.com/spec/82a02ed8-aecc-466a-4107-10c94808ade3-f491/)


