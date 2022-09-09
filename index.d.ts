export interface DownloadOptions {
  /**
   * The destination (location) to extract the tar.gz
   *
   * @default process.cwd()
   */
  dest?: string;
  /**
   * The default github branch name (master, main ...)
   *
   * @default main
   */
  branch?: string;
  /**
   * Authentication token for private repositories
   *
   * @default process.env.GITHUB_TOKEN
   */
  token?: string;
}

export type ExtractOptions = DownloadOptions & {
  /**
   * Remove the tar.gz archive after a succesfull extraction
   *
   * @default true
   */
  removeArchive?: boolean;
}

export interface DownloadResult {
  /** Archive or repository location on disk */
  location: string;
  /** Github repository name */
  repository: string;
  /** Github organization name */
  organization: string;
}

export interface GetContributorLastActivitiesOptions {
  /** Owner of the github repository "nodesecure/github" => "nodesecure" */
  owner: string,
  /** Name of the repository "nodesecure/github" => "github" */
  repository: string;
  /** Audited user */
  contributor: string;
  /**
   * Authentication token for Github API
   *
   * @default process.env.GITHUB_TOKEN
   */
  token?: string;
}

export type Activity = Record<string, {
  repository: string;
  actualRepo: boolean,
  lastActivity: string;
}>;

export type GetContributorLastActivitiesResult = [Activity, Activity];

export function download(repo: string, options?: DownloadOptions): Promise<DownloadResult>;
export function downloadAndExtract(repo: string, options?: ExtractOptions): Promise<DownloadResult>;
export function getContributorLastActivities(options: GetContributorLastActivitiesOptions): Promise<GetContributorLastActivitiesResult | null>;
export function setToken(githubToken: string): void;
