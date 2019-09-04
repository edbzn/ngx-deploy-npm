# ngx-deploy-npm 🚀

[![NPM version][npm-image]][npm-url]
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?color=blue&style=flat-square)](http://opensource.org/licenses/MIT)

### **Deploy your Angular Package to NPM directly from the Angular CLI! 🚀**

**Table of contents:**

- [⚠️ Prerequisites](#prerequisites)
- [🚀 Quick Start (local development)](#quick-start)
- [🚀 Continuous Delivery](#continuous-delivery)
- [📦 Options](#options)
  - [--configuration](#--configuration)
  - [--tag](#--tag)
  - [--access](#--access)
  - [--otp](#--otp)
  - [--dry-run](#--dry-run)
- [📁 Configuration File](#configuration-file)
- [🧐 Essential considerations](#essential-considerations)
- [🏁 Next milestones](#next-milestones)
- [License](#license)
- [🚀 Powered By ngx-deploy-starter](#-powered-by-ngx-deploy-starter)

---

## ⚠️ Prerequisites <a name="prerequisites"></a>

This command has the following prerequisites:

- Angular project created via [Angular CLI](https://github.com/angular/angular-cli) v8.3.0 or greater (execute `ng update @angular/cli @angular/core` to upgrade your project if necessary)

## 🚀 Quick Start (local development) <a name="quick-start"></a>

This quick start assumes that you already an existing Angular project with a publishable package created

1. Add `ngx-deploy-npm` to your project. It will configure all your libraries present in the project

   ```sh
   ng add ngx-deploy-npm
   ```

2. Deploy your library to NPM with all default settings. Your library will be automatically built in production mode.

   ```sh
   ng deploy your-library
   ```

3. Your library should be published on npm. So go and check npm.js

## 🚀 Continuous Delivery <a name="continuous-delivery"></a>

**🚧 coming soon 🚧**

## 📦 Options <a name="options"></a>

#### --configuration

- **optional**
- Alias: `-c`
- Default: `production` (string)
- Example:
  - `ng deploy` – Angular project is build in production mode
  - `ng deploy --configuration=test` – Angular project is using the configuration `test` (this configuration must exist in the `angular.json` file)

A named build target, as specified in the `configurations` section of `angular.json`.
Each named target is accompanied by a configuration of option defaults for that target.
Same as `ng build --configuration=XXX`.

#### --tag

- **optional**
- Default: `latest` (string)
- Example:
  - `ng deploy --tag alpha` – Your package will be available for download using that tag, `npm install your-package@alpha` useful for RC versions, alpha, betas.

Registers the published package with the given tag, such that `npm install @` will install this version. By default, `npm publish` updates and `npm install` installs the `latest` tag. See [`npm-dist-tag`](https://docs.npmjs.com/cli/dist-tag) for details about tags.

#### --access

- Default: `public` (string)
- Example:
  - `ng deploy --access public`

Tells the registry whether this package should be published as public or restricted. Only applies to scoped packages, which default to restricted. If you don’t have a paid account, you must publish with --access public to publish scoped packages.

#### --otp

- **optional**
- Default: `public` (string)
- Example:
  - `ng deploy --otp TOKEN`

If you have two-factor authentication enabled in auth-and-writes mode then you can provide a code from your authenticator with this.

#### --dry-run

- **optional**
- Default: `false` (boolean)
- Example:
  - `ng deploy --dry-run`

For testing: Run through without making any changes. Execute with --dry-run and nothing will happen. A list of options will be printed

## 📁 Configuration File <a name="configuration-file"></a>

To avoid all these command-line cmd options, you can write down your configuration in the `angular.json` file in the `options` attribute of your deploy project's architect. Just change the kebab-case to lower camel case. This is the notation of all options in lower camel case:

- access
- configuration
- dryRun
- otp
- tag

A list of all available options is also available [here](https://github.com/bikecoders/ngx-deploy-npm/blob/master/src/deploy/schema.json).

Example:

```sh
ng deploy your-library --tag alpha --access public --dry-run
```

becomes

```json
"deploy": {
  "builder": "ngx-deploy-npm:deploy",
  "options": {
    "tag": "alpha",
    "access": "public",
    "dryRun": "true"
  }
}
```

And just run `ng deploy` 😄.

> ℹ️ You can always use the [--dry-run](#dry-run) option to verify if your configuration is right.

## 🧐 Essential considerations <a name="essential-considerations"></a>

### Readme and Licence

The licence and the readme must be in the root of the library. They are being copyed at the moment of deployment

### Version bumping

This deployer do not bumps or creates a new version of the package, it just build the **package/library**, take the package.json as it and **publish** it.

**You must take care about the version by yourself. Maybe using a script that sets the version**

## 🏁 Next milestones <a name="next-milestones"></a>

We are looking forward to the following features:

- Implement Continuous Everything:
  - Integration
  - Inspection
  - Delivery
- Specify which library add the deployer on the `ng add`
- Compatibility with [Nx](https://nx.dev)
- Continuous Delivery Documentation
- Add all the RFC proposals of [ngx-deploy-starter](https://github.com/angular-schule/ngx-deploy-starter)
- ChangeLog Compatibility
- Custom Readme and Licence Paths

Your feature that's not on the list yet?

We look forward to any help. PRs are welcome! 😃

## License <a name="license"></a>

Code released under the [MIT license](LICENSE).

## 🚀 Powered By [ngx-deploy-starter](https://github.com/angular-schule/ngx-deploy-starter)

[npm-url]: https://www.npmjs.com/package/ngx-deploy-npm
[npm-image]: https://badge.fury.io/js/ngx-deploy-npm.svg
