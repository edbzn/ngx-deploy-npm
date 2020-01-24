import { logging } from '../__mocks__/utils/dev-kit-logger';

import * as engine from './engine';

import { Schema } from '../deploy/schema';
import { npmAccess } from './defaults';

import * as exec from './utils/exec-async';

import * as fs from './utils/fs-async';
import { PromiseWithChild } from 'child_process';

describe('engine', () => {
  let dir: string;
  let options: Schema;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Spies
  beforeEach(() => {
    jest.spyOn(exec, 'execAsync').mockImplementation(
      () =>
        Promise.resolve({
          stdout: 'package published',
          stderr: undefined
        }) as PromiseWithChild<any>
    );
  });

  // Data
  beforeEach(() => {
    dir = 'customDir';
  });

  it('should call NPM Publish with the right options', done => {
    options = {
      access: npmAccess.restricted,
      tag: 'next',
      otp: 'someValue',
      configuration: 'stageConfig',
      dryRun: true
    };
    const optionsOnCMD = `--access ${options.access} --tag ${options.tag} --otp ${options.otp} --dry-run ${options.dryRun}`;

    engine
      .run(dir, options, logging)
      .then(() => {
        expect(exec.execAsync).toHaveBeenCalledWith(
          `npm publish ${dir} ${optionsOnCMD}`
        );
        done();
      })
      .catch(err => fail('should be completed' + err));
  });

  it('should indicate that an error occurred when there is an error publishing the package', done => {
    const customErr = 'custom err';
    jest
      .spyOn(exec, 'execAsync')
      .mockImplementation(
        () => Promise.reject(customErr) as PromiseWithChild<any>
      );

    engine
      .run(dir, options, logging)
      .then(() => fail('should enter in the catch section'))
      .catch(err => {
        expect(customErr).toEqual(err);
        done();
      });
  });

  describe('Options Management', () => {
    it('should set the default options', done => {
      const options: Schema = {};
      const optionsOnCMD = `--access public`;

      engine
        .run(dir, options, logging)
        .then(() => {
          expect(exec.execAsync).toHaveBeenCalledWith(
            `npm publish ${dir} ${optionsOnCMD}`
          );
          done();
        })
        .catch(err => fail('should be completed' + err));
    });

    it('should overwrite the default option dry-run', done => {
      const options: Schema = {
        otp: 'random-text',
        dryRun: true,
        tag: 'random-tag'
      };
      const optionsOnCMD = `--access public --tag ${options.tag} --otp ${options.otp} --dry-run true`;

      engine
        .run(dir, options, logging)
        .then(() => {
          expect(exec.execAsync).toHaveBeenCalledWith(
            `npm publish ${dir} ${optionsOnCMD}`
          );
          done();
        })
        .catch(err => fail('should be completed' + err));
    });

    it('should overwrite the default option dry-run and access', done => {
      const options = {
        dryRun: true,
        tag: 'random-tag',
        access: npmAccess.restricted
      };
      const optionsOnCMD = `--access ${npmAccess.restricted} --tag ${options.tag} --dry-run true`;

      engine
        .run(dir, options, logging)
        .then(() => {
          expect(exec.execAsync).toHaveBeenCalledWith(
            `npm publish ${dir} ${optionsOnCMD}`
          );
          done();
        })
        .catch(err => fail('should be completed' + err));
    });
  });

  describe('Package.json Feature', () => {
    let myPackageJSON: object;
    let expectedPackage: object;
    let version: string;
    let options: Schema;

    // Spies
    beforeEach(() => {
      jest
        .spyOn(fs, 'readFileAsync')
        .mockImplementation(() =>
          Promise.resolve(JSON.stringify(myPackageJSON))
        );

      jest
        .spyOn(fs, 'writeFileAsync')
        .mockImplementation(() => Promise.resolve());
    });

    // Data
    beforeEach(() => {
      version = '1.0.1-next0';

      myPackageJSON = {
        name: 'ngx-deploy-npm',
        version: 'boilerPlate',
        description:
          'Publish your angular packages to npm by just run `npm deploy your-packages`',
        main: 'index.js'
      };

      expectedPackage = {
        ...myPackageJSON,
        version
      };

      options = {
        packageVersion: version
      };
    });

    it('should write the version of the sent on the package.json', done => {
      engine
        .run(dir, options, logging)
        .then(() => {
          expect(fs.writeFileAsync).toHaveBeenCalledWith(
            `${dir}/package.json`,
            JSON.stringify(expectedPackage, null, 4),
            { encoding: 'utf8' }
          );
          done();
        })
        .catch(err => fail('should be completed' + err));
    });

    it('should not write the version of the sent on the package.json if is on dry-run mode', done => {
      options.dryRun = true;
      engine
        .run(dir, options, logging)
        .then(() => {
          expect(fs.writeFileAsync).not.toHaveBeenCalled();
          done();
        })
        .catch(err => fail('should be completed' + err));
    });

    describe('Errors', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should throw an error if there is an error reading the package.json', done => {
        const customErr = 'custom err';
        jest
          .spyOn(fs, 'readFileAsync')
          .mockImplementation(() => Promise.reject(customErr));

        engine
          .run(dir, options, logging)
          .then(() => fail('should enter in the catch section'))
          .catch(err => {
            expect(customErr).toEqual(err);
            done();
          });
      });

      it('should throw an error if there is an error writing the package.json', done => {
        const customErr = 'custom err';
        jest
          .spyOn(fs, 'writeFileAsync')
          .mockImplementation(() => Promise.reject(customErr));

        engine
          .run(dir, options, logging)
          .then(() => fail('should enter in the catch section'))
          .catch(err => {
            expect(customErr).toEqual(err);
            done();
          });
      });
    });
  });
});
