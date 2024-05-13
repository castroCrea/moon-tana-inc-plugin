export interface TanaIntermediateFile {
    version: 'TanaIntermediateFile V0.1';
    summary: TanaIntermediateSummary;
    nodes: TanaIntermediateNode[];
    attributes?: TanaIntermediateAttribute[];
    supertags?: TanaIntermediateSupertag[];
}
export interface TanaIntermediateSummary {
    leafNodes: number;
    topLevelNodes: number;
    totalNodes: number;
    calendarNodes: number;
    fields: number;
    brokenRefs: number;
}
export interface TanaIntermediateAttribute {
    name: string;
    values: string[];
    count: number;
    dataType?: 'any' | 'url' | 'email' | 'number' | 'date' | 'checkbox';
}
export interface TanaIntermediateSupertag {
    uid: string;
    name: string;
}
export type NodeType = 'field' | 'image' | 'codeblock' | 'node' | 'date' | 'boolean' | 'checkbox';
export type TanaIntermediateNode = {
    /**
     * Contents of the node.
     *
     * For type=date this must contain the date : "MM-DD-YYYY"
     *
     * Supported text formatting: **bold** __italic__ ~~striked~~ ^^highlighted^^
     *
     * Link formats:
     * - external content: [See Tana](https://wwww.tana.inc)
     * - internal: [[uid]]
     * - internal with alias: [test page]([[uid]])
     */
    name: string;
    description?: string;
    children?: TanaIntermediateNode[];
    refs?: string[];
    createdAt: number;
    editedAt: number;
    dataType: NodeType;
    mediaUrl?: string;
    codeLanguage?: string;
    supertags?: string[];
} | {
    filenames: string;
    file: string;
    contentType: string;
    dataType: 'file';
};
