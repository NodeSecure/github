declare namespace Download {
    interface options {
        dest?: string;
        branch?: string;
        extract?: boolean;
    }
}

function Download(repo: string, options?: Download.options): Promise<string>;

export as namespace Download;
export = Download;
