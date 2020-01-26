import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { experimental, JsonParseMode, parseJson } from '@angular-devkit/core';

import { npmAccess } from './engine/defaults';

const publishableLibBuilder = '@angular-devkit/build-ng-packagr:build';

function getWorkspace(
  host: Tree
): { path: string; workspace: experimental.workspace.WorkspaceSchema } {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find angular.json`);
  }
  const content = configBuffer.toString();

  let workspace: experimental.workspace.WorkspaceSchema;
  try {
    workspace = (parseJson(
      content,
      JsonParseMode.Loose
    ) as {}) as experimental.workspace.WorkspaceSchema;
  } catch (e) {
    throw new SchematicsException(`Could not parse angular.json: ` + e.message);
  }

  return {
    path,
    workspace
  };
}

// TODO, specify which library set the deployer
export const ngAdd = () => (tree: Tree) => {
  const { path: workspacePath, workspace } = getWorkspace(tree);

  const libraries = getLibraries(workspace);

  // If there is no libraries to install throw an exception
  if (libraries.length === 0) {
    throw new SchematicsException('There is no libraries to add this deployer');
  }

  libraries.forEach(lib => {
    /* istanbul ignore else  */
    if (lib.architect) {
      lib.architect['deploy'] = {
        builder: 'ngx-deploy-npm:deploy',
        options: {
          access: npmAccess.public
        }
      };
    }
  });

  tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
  return tree;
};

/**
 * Get the libraries present in the workspace
 * @param workspace
 */
function getLibraries({
  projects
}: experimental.workspace.WorkspaceSchema): experimental.workspace.WorkspaceProject[] {
  return (
    Object.keys(projects)
      .map(projectKey => projects[projectKey])
      // Check if the library is a publishable library (nx compatibility)
      .filter(
        proj =>
          proj.projectType === 'library' &&
          proj.architect &&
          proj.architect.build &&
          proj.architect.build.builder === publishableLibBuilder
      )
  );
}
