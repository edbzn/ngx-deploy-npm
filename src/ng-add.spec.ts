import { Tree } from '@angular-devkit/schematics';
import { experimental } from '@angular-devkit/core';

import { ngAdd } from './ng-add';

describe('ng-add', () => {
  let originalAngularJSON: experimental.workspace.WorkspaceSchema;
  let expectedAngularJSON: experimental.workspace.WorkspaceSchema;

  beforeEach(() => {
    originalAngularJSON = {
      version: 1,
      projects: {
        testing: {
          projectType: 'application',
          schematics: {
            '@nrwl/angular:component': {
              style: 'scss'
            }
          },
          root: 'apps/testing',
          sourceRoot: 'apps/testing/src',
          prefix: 'myworkspace',
          architect: {
            build: {
              a: 'a',
              b: 'b'
            }
          }
        },
        publishable: {
          projectType: 'library',
          root: 'libs/publishable',
          sourceRoot: 'libs/publishable/src',
          prefix: 'myworkspace',
          architect: {
            build: {
              builder: '@angular-devkit/build-ng-packagr:build',
              a: 'a',
              b: 'b'
            }
          },
          schematics: {}
        },
        publishable2: {
          projectType: 'library',
          root: 'libs/publishable',
          sourceRoot: 'libs/publishable/src',
          prefix: 'myworkspace',
          architect: {
            build: {
              builder: '@angular-devkit/build-ng-packagr:build',
              a: 'a',
              b: 'b'
            }
          },
          schematics: {}
        },
        'non-publishable': {
          projectType: 'library',
          root: 'libs/non-publishable',
          sourceRoot: 'libs/non-publishable/src',
          prefix: 'myworkspace',
          architect: {
            lint: {
              a: 'a',
              b: 'b'
            }
          },
          schematics: {}
        },
        'non-publishable2': {
          projectType: 'library',
          root: 'libs/non-publishable',
          sourceRoot: 'libs/non-publishable/src',
          prefix: 'myworkspace',
          architect: {
            lint: {
              a: 'a',
              b: 'b'
            }
          },
          schematics: {}
        }
      },
      defaultProject: 'testing'
    };

    expectedAngularJSON = JSON.parse(JSON.stringify(originalAngularJSON));

    ['publishable', 'publishable2']
      .map(
        publishableProjectKey =>
          expectedAngularJSON.projects[publishableProjectKey]
      )
      .forEach(project => {
        if (project.architect) {
          project.architect.deploy = {
            builder: 'ngx-deploy-npm:deploy',
            options: {
              access: 'public'
            }
          };
        }
      });
  });

  describe('generating files', () => {
    let tree: Tree;

    beforeEach(() => {
      tree = Tree.empty();
      tree.create('angular.json', JSON.stringify(originalAngularJSON));
    });

    it('should set the deployer only on publishable libraries', () => {
      const result = ngAdd()(tree);

      const angularJsonModified = JSON.parse(
        result.read('angular.json')!.toString()
      );

      expect(angularJsonModified).toEqual(expectedAngularJSON);
    });
  });

  describe('error handling', () => {
    it('Should throw if angular.json not found', () => {
      expect(() => ngAdd()(Tree.empty())).toThrowError(
        'Could not find angular.json'
      );
    });

    it('Should throw if angular.json can not be parsed', () => {
      const tree = Tree.empty();
      tree.create('angular.json', 'hi');
      expect(() => ngAdd()(tree)).toThrowError('Could not parse angular.json');
    });

    it('Should throw if angular.json can not be parsed', () => {
      expect(() => ngAdd()(Tree.empty())).toThrowError(
        'Could not find angular.json'
      );
    });

    it('should throw if there is no library to add the deployer', () => {
      // Delete all libraries
      Object.keys(originalAngularJSON.projects)
        .filter(
          projectKey =>
            originalAngularJSON.projects[projectKey].projectType === 'library'
        )
        .forEach(libraryKey => {
          delete originalAngularJSON.projects[libraryKey];
        });
      const treeWithoutLibs = Tree.empty();
      treeWithoutLibs.create(
        'angular.json',
        JSON.stringify(originalAngularJSON)
      );

      expect(() => ngAdd()(treeWithoutLibs)).toThrowError(
        'There is no libraries to add this deployer'
      );
    });
  });
});
