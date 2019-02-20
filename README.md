# smapp
Spacemesh App (Full Node + Wallet)

# MVP1 Milestone
- [Desktop Specs and Visual Design Guide](https://docs.google.com/presentation/d/1G20T3KSt3iVmTqPJ7x9bljBA--PrPUNOpRNA9klVRSk/edit?usp=sharing)
- [Assets](https://drive.google.com/drive/folders/1OHXb15_5uKHsGGMlm0zQ8LSIMRz9C2E7)
- [Desktop screens specs and flows](https://xd.adobe.com/spec/82a02ed8-aecc-466a-4107-10c94808ade3-f491/)

# Signatures
- [ed25591](https://ed25519.cr.yp.to/) via [tweet-nacl.js](https://github.com/dchest/tweetnacl-js). https://tweetnacl.js.org
- hd key deriviation - BIP32 extension for ed25591 (homebrew)

# Terminology

## Wallet
- Has a user renambalbe friendly name
- Includes one main address by default
- Password protected, can be backed up and restored by users from backup
- Has a distinct encrypted data file in local app store
- User can add additional addresses
- Each user has one wallet by default when setting up the app but advanced users may create additional wallets
- Managed by the Spacemesh App but advanced users may use a CLI wallet that should support same data file and security features

## Address
- A public user identifier
- Used for all transactions
- Has a default re-nameable friendly display name
- Has an immutable public EC key and user has a matching private EC key for his public addresses
- Always part of a specific wallet. Has a unique shareable QR code.

## Full Node
- A spacemesh full p2p node running the Spacemesh blockmesh protocol. Working title for lack of a better agreed name by the team.
Coinbase Address
- The user configured address for receiving validations awards in a full node
Validator
- The main full node role. Validators are responsible for both creating blocks and agreeing on blocks. Validators are spacemesh miners
Dashboard
- The app section where users manage a locally running full node

## Spacemesh Coin
- Working title until we defined the final coin name for the testnet timeframe
