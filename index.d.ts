declare namespace Download {
    interface options {
        dest?: string;
        branch?: string;
        extract?: boolean;
        auth?: string;
    }
}

declare function Download(repo: string, options?: Download.options): Promise<string>;

export as namespace Download;
export = Download;
