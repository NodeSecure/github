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
  /** Authentication token for private repositories */
  auth?: string;
}

export type ExtractOptions = DownloadOptions & {
  /**
   * Remove the tar.gz archive after a succesfull extraction
   *
   * @default true
   */
  removeArchive?: boolean;
}

export type FileSystemPath = string;

export function download(repo: string, options?: DownloadOptions): Promise<FileSystemPath>;
export function downloadAndExtract(repo: string, options?: ExtractOptions): Promise<FileSystemPath>;
