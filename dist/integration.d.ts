import { type Context } from '@moonjot/moon';
import { type TanaIntermediateNode } from './types';
export declare const tanaIntegration: ({ context, markdown, template, taskSuperTag, log }: {
    markdown: string;
    template: string;
    taskSuperTag: string;
    log?: ((log: string) => void) | undefined;
    context: Context;
}) => Partial<TanaIntermediateNode>[] | ({
    children: Partial<TanaIntermediateNode>[];
} | {
    children: Partial<TanaIntermediateNode>[];
    name?: string | undefined;
    description?: string | undefined;
    createdAt?: number | undefined;
    editedAt?: number | undefined;
    dataType?: import("./types").NodeType | undefined;
    supertags?: string[] | undefined;
} | {
    children: Partial<TanaIntermediateNode>[];
    filenames?: string | undefined;
    file?: string | undefined;
    contentType?: string | undefined;
    dataType?: "file" | undefined;
})[];
