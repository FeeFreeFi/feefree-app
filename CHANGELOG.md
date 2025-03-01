# CHANGELOG

## 0.7.5 (2025-03-01)

### Refactor
- **Config**: Migrate configuration files from JavaScript to TypeScript
  - Convert `eslint.config.js` to `eslint.config.ts`
  - Convert `postcss.config.js` to `postcss.config.ts`
  - Convert `tailwind.config.js` to `tailwind.config.ts`
  - Remove `babel.config.js` (no longer needed)

### Dependencies
- **Core**: Upgrade key dependencies
  - Upgrade `jose` to v6.0.8
  - Upgrade `viem` to v2.23.5
  - Upgrade `@antfu/eslint-config` and other dev dependencies

### Types
- **Wallet**: Improve TypeScript types and implementations
  - Add EIP6963 provider types
  - Enhance window type declarations for wallet detection
  - Update useWalletDetector to properly handle EIP6963 announce events
  - Use rdns as wallet id in EIP6963 provider detection
  - Add JSDoc type annotations in environment config

### Chore
- **Editor**: Clean up `.editorconfig` by removing redundant markdown rules


## 0.7.4 (2025-01-14)

### Features
- `BlockExplorer`: Replace default explorer with [BlockScout](https://blockscout.com/).
- `TypeScript`: Add [vue-tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc) for type checking.

### Builds
- `esbuild-loader`: Migrate to [esbuild-loader](https://github.com/privatenumber/esbuild-loader) for faster builds.

### Chores
- `Dependencies`: Upgrade dependencies.


## 0.7.3 (2025-01-14)

### Features
- `TypeScript`: Migrate vue files to typescript.

### Chores
- `Build`: Skip type checking to improve build speed.


## 0.7.2 (2025-01-10)

### Styles
- `Prettier`: Format code using [@antfu/eslint-config](https://github.com/antfu/eslint-config)


## 0.7.1 (2025-01-09)

### Features
- `Webpack`: Optimize webpack build speed in development environment.
- `Types`: Enhance process.env type definitions.

### Fixex
- `Wallet`: Automatically connect the Blockscout wallet.


## 0.7.0 (2025-01-09)

### Breaking changes
- `TypeScript`: Migrate code to typescript.


## 0.6.4 (2024-12-20)

### Features
- `Wallet`: Automatically connect the Blockscout wallet when [FeeFree](https://explorer.zora.energy/apps/feefree) is opened in Blockscout.


## 0.6.3 (2024-12-20)

### Fixes
- `NFT`: Corrected NFT type declaration.

### Features
- `Chain icon`: Add chain icon for Pool, Nft, etc.
- `Token balance`: Highlight token balance changes.


## 0.6.2 (2024-12-19)

### Features
- `Background`: Change the dynamic background from meteors to [snowflakes](https://github.com/hcodes/snowflakes).


## 0.6.1 (2024-12-19)

### Features
- `FFWeekNFT`: Launch Christmas-themed weekly [NFT(202452)](https://app.feefree.fi/nft).


## 0.6.0 (2024-12-18)

### Fixes
- `Withdraw`: Fix a bug causing withdrawal failures.

### Features
- `Notice`: Add a new top notification on the website.

### Breaking changes
- `Liquidty`: Contract upgraded. If missing LIQUIDITY, please CHECK [Migrate](https://app.feefree.fi/migrate).
