import { Tree } from '@angular-devkit/schematics';
import { ngAdd } from './ng-add';

const LIBRARY_NAME = 'pie-ka-chu';
const LIBRARY_ROOT = 'pirojok';

const OTHER_LIBRARY_NAME = 'pi-catch-you';

describe('ng-add', () => {
  describe('generating files', () => {
    let tree: Tree;

    beforeEach(() => {
      tree = Tree.empty();
      tree.create('angular.json', JSON.stringify(generateAngularJson()));
    });

    xit('generates new files if starting from scratch', async () => {
      const result = ngAdd({
        project: LIBRARY_NAME
      })(tree, {});
      expect(result.read('angular.json')!.toString()).toEqual(
        initialAngularJson
      );
    });

    xit('overrides existing files', async () => {
      const tempTree = ngAdd({
        project: LIBRARY_NAME
      })(tree, {});
      const result = ngAdd({
        project: OTHER_LIBRARY_NAME
      })(tempTree, {});
      expect(result.read('angular.json')!.toString()).toEqual(
        projectAngularJson
      );
    });
  });

  describe('error handling', () => {
    it('Should throw if angular.json not found', async () => {
      expect(() =>
        ngAdd({
          project: LIBRARY_NAME
        })(Tree.empty(), {})
      ).toThrowError(/Could not find angular.json/);
    });

    it('Should throw if angular.json can not be parsed', async () => {
      const tree = Tree.empty();
      tree.create('angular.json', 'hi');
      expect(() =>
        ngAdd({
          project: LIBRARY_NAME
        })(tree, {})
      ).toThrowError(/Could not parse angular.json/);
    });

    xit('Should throw if specified library does not exist ', async () => {
      const tree = Tree.empty();
      tree.create('angular.json', JSON.stringify({ projects: {} }));
      expect(() =>
        ngAdd({
          project: LIBRARY_NAME
        })(tree, {})
      ).toThrowError(
        /No Angular project selected and no default project in the workspace/
      );
    });

    xit('Should throw if specified project is not library', async () => {
      const tree = Tree.empty();
      tree.create(
        'angular.json',
        JSON.stringify({
          projects: { [LIBRARY_NAME]: { projectType: 'pokemon' } }
        })
      );
      expect(() =>
        ngAdd({
          project: LIBRARY_NAME
        })(tree, {})
      ).toThrowError(
        /No Angular project selected and no default project in the workspace/
      );
    });

    xit('Should throw if app does not have architect configured', async () => {
      const tree = Tree.empty();
      tree.create(
        'angular.json',
        JSON.stringify({
          projects: { [LIBRARY_NAME]: { projectType: 'application' } }
        })
      );
      expect(() =>
        ngAdd({
          project: LIBRARY_NAME
        })(tree, {})
      ).toThrowError(
        /No Angular project selected and no default project in the workspace/
      );
    });
  });
});

function generateAngularJson() {
  return {
    defaultProject: LIBRARY_NAME,
    projects: {
      [LIBRARY_NAME]: {
        projectType: 'application',
        root: LIBRARY_ROOT,
        architect: {
          build: {
            options: {
              outputPath: 'dist/ikachu'
            }
          }
        }
      },
      [OTHER_LIBRARY_NAME]: {
        projectType: 'application',
        root: LIBRARY_ROOT,
        architect: {
          build: {
            options: {
              outputPath: 'dist/ikachu'
            }
          }
        }
      }
    }
  };
}

const initialAngularJson = `{
  \"defaultProject\": \"pie-ka-chu\",
  \"projects\": {
    \"pie-ka-chu\": {
      \"projectType\": \"application\",
      \"root\": \"pirojok\",
      \"architect\": {
        \"build\": {
          \"options\": {
            \"outputPath\": \"dist/ikachu\"
          }
        },
        \"deploy\": {
          \"builder\": \"ngx-deploy-npm:deploy\",
          \"options\": {}
        }
      }
    },
    \"pi-catch-you\": {
      \"projectType\": \"application\",
      \"root\": \"pirojok\",
      \"architect\": {
        \"build\": {
          \"options\": {
            \"outputPath\": \"dist/ikachu\"
          }
        }
      }
    }
  }
}`;

const overwriteAngularJson = `{
  \"defaultProject\": \"pie-ka-chu\",
  \"projects\": {
    \"pie-ka-chu\": {
      \"projectType\": \"application\",
      \"root\": \"pirojok\",
      \"architect\": {
        \"build\": {
          \"options\": {
            \"outputPath\": \"dist/ikachu\"
          }
        },
        \"deploy\": {
          \"builder\": \"ngx-deploy-npm:deploy\",
          \"options\": {}
        }
      }
    },
    \"pi-catch-you\": {
      \"projectType\": \"application\",
      \"root\": \"pirojok\",
      \"architect\": {
        \"build\": {
          \"options\": {
            \"outputPath\": \"dist/ikachu\"
          }
        }
      }
    }
  }
}`;

const projectAngularJson = `{
  \"defaultProject\": \"pie-ka-chu\",
  \"projects\": {
    \"pie-ka-chu\": {
      \"projectType\": \"application\",
      \"root\": \"pirojok\",
      \"architect\": {
        \"build\": {
          \"options\": {
            \"outputPath\": \"dist/ikachu\"
          }
        },
        \"deploy\": {
          \"builder\": \"ngx-deploy-npm:deploy\",
          \"options\": {}
        }
      }
    },
    \"pi-catch-you\": {
      \"projectType\": \"application\",
      \"root\": \"pirojok\",
      \"architect\": {
        \"build\": {
          \"options\": {
            \"outputPath\": \"dist/ikachu\"
          }
        }
      }
    }
  }
}`;
