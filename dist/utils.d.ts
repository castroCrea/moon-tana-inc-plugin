import { type TanaIntermediateNode } from './types';
export declare const removeEmptyAtStart: (arrayOfObjects: Array<Partial<TanaIntermediateNode>>) => Partial<TanaIntermediateNode>[];
export declare const removeEmptyAtEnd: (arrayOfObjects: Array<Partial<TanaIntermediateNode>>) => Partial<TanaIntermediateNode>[];
export declare const handleCodeBlock: (markdown: string) => string;
export declare const isTextADate: (date: string) => boolean;
