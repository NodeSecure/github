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

export function download(repo: string, options?: DownloadOptions): Promise<DownloadResult>;
export function downloadAndExtract(repo: string, options?: ExtractOptions): Promise<DownloadResult>;
export function setToken(githubToken: string): void;
