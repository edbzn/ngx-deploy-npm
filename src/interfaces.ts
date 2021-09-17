export interface WorkspaceProject {
  projectType?: string;
  architect?: Record<
    string,
    {
      builder: string;
      options?: Record<string, any>;
      configurations?: Record<string, Record<string, any>>;
    }
  >;
  targets?: Record<
    string,
    {
      executor: string;
      options?: Record<string, any>;
      configurations?: Record<string, Record<string, any>>;
    }
  >;
}

export interface Workspace {
  defaultProject?: string;
  projects: Record<string, WorkspaceProject>;
}

export interface BuildTarget {
  name: string;
  options?: { [name: string]: any };
}
