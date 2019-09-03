import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { experimental, JsonParseMode, parseJson } from '@angular-devkit/core';

import { npmAccess } from './engine/defaults';

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
interface NgAddOptions {
  project?: string;
}

interface DeployOptions {
  project: string;
}

export const ngAdd = ({ project: DeployOptions }) => (
  tree: Tree,
  options: NgAddOptions // TODO, specify which library set the deployer
) => {
  const { path: workspacePath, workspace } = getWorkspace(tree);

  const libraries = getLibraries(workspace);

  // If there is no libraries to install throw an exception
  if (libraries.length === 0) {
    throw new SchematicsException('There is no libraries to add this deployer');
  }

  libraries.forEach(lib => {
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
 * TODO get only publishable libraries (nx case)
 * Get the libraries present in the workspace
 * @param workspace
 */
function getLibraries({
  projects
}: experimental.workspace.WorkspaceSchema): experimental.workspace.WorkspaceProject[] {
  return Object.keys(projects)
    .map(projectKey => projects[projectKey])
    .filter(proj => proj.projectType === 'library');
}
