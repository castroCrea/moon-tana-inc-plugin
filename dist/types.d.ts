export type NodeType = 'field' | 'image' | 'codeblock' | 'node' | 'date' | 'boolean';
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
     */
    name: string;
    description?: string;
    children?: TanaIntermediateNode[];
    createdAt: number;
    editedAt: number;
    dataType: NodeType;
    supertags?: string[];
} | {
    filenames: string;
    file: string;
    contentType: string;
    dataType: 'file';
};
