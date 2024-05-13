import { type TanaIntermediateNode } from './types';
export declare function getCodeIfCodeblock(name: string): string | undefined;
export declare function isIndexWithinBackticks(index: number, string?: string): boolean;
export declare function findGroups(stringToLookIn: string, startToken: string, endToken: string): Array<{
    start: number;
    end: number;
    content: string;
}>;
/**
 *
 * //Finds links in a string '[[hello world]] [[Let's say [[hello world]]]].
 * @param text
 * @param skipIfNotDirect Skip links that are only included since they are inside other links
 */
export declare function getBracketLinks(text: string, skipIfNotDirect: boolean): string[];
export declare function enrichRoam(nodeContent: string): string;
export declare function replaceTokenWithHtml(nodecontent: string, token: string, tagName: string): string;
export declare function hasImages(name: string): boolean;
export declare const replaceMoonJotSyntax: (nameToUse: string) => string;
export declare const DATE_REGEX: RegExp;
export declare const removeEmptyAtStart: (arrayOfObjects: Array<Partial<TanaIntermediateNode>>) => Partial<TanaIntermediateNode>[];
export declare const removeEmptyAtEnd: (arrayOfObjects: Array<Partial<TanaIntermediateNode>>) => Partial<TanaIntermediateNode>[];
export declare const handleCodeBlock: (markdown: string) => string;
export declare const isTextADate: (date: string) => boolean;
