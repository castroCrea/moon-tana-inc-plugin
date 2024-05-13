"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTextADate = exports.handleCodeBlock = exports.removeEmptyAtEnd = exports.removeEmptyAtStart = exports.DATE_REGEX = exports.replaceMoonJotSyntax = exports.hasImages = exports.replaceTokenWithHtml = exports.enrichRoam = exports.getBracketLinks = exports.findGroups = exports.isIndexWithinBackticks = exports.getCodeIfCodeblock = void 0;
function getCodeIfCodeblock(name) {
    if ((name === null || name === void 0 ? void 0 : name.trim().startsWith('```')) && name.endsWith('```')) {
        return name.substring(3, name.length - 3).substring(0, 100);
    }
    // Starts and ends with backticks, and no more backticks present. ie `hello world`
    if ((name === null || name === void 0 ? void 0 : name.trim().startsWith('`')) && name.endsWith('`') && name.trim().split('`').length === 3) {
        return name.substring(1, name.length - 1).substring(0, 100);
    }
    if (name.startsWith('<%J:```') && name.endsWith('```%>')) {
        return name.substring('<%J:```'.length, name.length - '```%>'.length).substring(0, 100);
    }
    return undefined;
}
exports.getCodeIfCodeblock = getCodeIfCodeblock;
// Checks if the supplied index is within a pair of single or triple backticks, like ```foo``` and `bar`
function isIndexWithinBackticks(index, string) {
    if (string && index !== undefined && index !== -1) {
        if (((string === null || string === void 0 ? void 0 : string.substring(0, index).split('```').length) - 1) % 2 === 1) {
            return true;
        }
        else if (((string === null || string === void 0 ? void 0 : string.substring(0, index).split('`').length) - 1) % 2 === 1) {
            return true;
        }
    }
    return false;
}
exports.isIndexWithinBackticks = isIndexWithinBackticks;
// Finds content between start and end tokens, like ((xxxxx))
function findGroups(stringToLookIn, startToken, endToken) {
    const matches = [];
    for (let i = 0; i < stringToLookIn.length; i++) {
        if (stringToLookIn.substring(i, i + startToken.length) === startToken) {
            const start = i;
            i += startToken.length;
            while (stringToLookIn.substring(i, i + endToken.length) !== endToken && i < stringToLookIn.length) {
                i += 1;
            }
            const end = i;
            const content = stringToLookIn.substring(start + startToken.length, end);
            matches.push({
                start,
                end,
                content
            });
        }
    }
    return matches;
}
exports.findGroups = findGroups;
/**
 *
 * //Finds links in a string '[[hello world]] [[Let's say [[hello world]]]].
 * @param text
 * @param skipIfNotDirect Skip links that are only included since they are inside other links
 */
function getBracketLinks(text, skipIfNotDirect) {
    const links = [];
    let state = 'normal';
    let counter = 0;
    const currentLinks = [];
    text.split('').forEach((char) => {
        currentLinks.forEach((x, i) => (currentLinks[i] += char));
        if (state === 'seenOne' && char !== '[') {
            state = 'normal';
        }
        if (state === 'seenOneOut' && char !== ']') {
            state = 'normal';
        }
        if (char === '[') {
            counter += 1;
            if (state === 'seenOne') {
                currentLinks.push('');
                state = 'normal';
            }
            else if (state === 'normal') {
                state = 'seenOne';
            }
        }
        if (char === ']' && counter > 0) {
            counter -= 1;
            if (state === 'seenOneOut') {
                const l = currentLinks.pop();
                if (l) {
                    if (!skipIfNotDirect || currentLinks.length === 0) {
                        links.push(l.slice(0, -2));
                    }
                }
                state = 'normal';
            }
            else if (state === 'normal') {
                state = 'seenOneOut';
            }
            if (counter === 0) {
                state = 'normal';
            }
        }
    });
    return links;
}
exports.getBracketLinks = getBracketLinks;
// Note: This is a very rudimentary enrichment. We should move to markdown at some point
function enrichRoam(nodeContent) {
    var _a;
    if (!nodeContent) {
        return nodeContent;
    }
    while (nodeContent.endsWith('\n') || nodeContent.endsWith('\r') || nodeContent.endsWith('\t')) {
        nodeContent = nodeContent.substring(0, nodeContent.length - 1);
    }
    if (nodeContent.includes('://')) {
        let parsedUpToIndex = 0;
        let restOfString = nodeContent;
        while (parsedUpToIndex !== -1 && parsedUpToIndex < nodeContent.length) {
            // look for link further down the string
            restOfString = nodeContent.substring(parsedUpToIndex);
            const nextLinkSplitPoint = restOfString.indexOf('://');
            if (nextLinkSplitPoint === -1) {
                break;
            }
            const tmp = restOfString.split('://');
            const protocol = (_a = tmp[0].split(' ').pop()) !== null && _a !== void 0 ? _a : '';
            const restOfLink = tmp[1].split(' ').shift();
            const url = `${protocol}://${restOfLink}`;
            const anchor = `<a href="${url}">${url}</a>`;
            const wasMarkLink = nodeContent[parsedUpToIndex + nextLinkSplitPoint - protocol.length] === '[';
            if (!(protocol === null || protocol === void 0 ? void 0 : protocol.includes('href')) && !protocol.includes(']') && !wasMarkLink) {
                try {
                    nodeContent = nodeContent.replace(url, anchor);
                }
                catch (error) {
                    console.error(error, nodeContent, url);
                }
            }
            parsedUpToIndex = parsedUpToIndex + nextLinkSplitPoint - ((protocol === null || protocol === void 0 ? void 0 : protocol.length) || 0) + anchor.length;
        }
    }
    nodeContent = replaceTokenWithHtml(nodeContent, '**', 'b');
    nodeContent = replaceTokenWithHtml(nodeContent, '__', 'i');
    nodeContent = replaceTokenWithHtml(nodeContent, '^^', 'mark');
    nodeContent = replaceTokenWithHtml(nodeContent, '~~', 'del');
    // quicker than regex
    if (nodeContent.includes('](')) {
        return nodeContent.replace(/\[([^[\]]*)\]\((.*?)\)/g, (fullMatch, alias, link) => {
            if (link === null || link === void 0 ? void 0 : link.includes('://')) {
                return `<a href="${link}">${alias}</a>`;
            }
            return fullMatch !== null && fullMatch !== void 0 ? fullMatch : '';
        });
    }
    return nodeContent;
}
exports.enrichRoam = enrichRoam;
// Replaces a token like **foo** with <b>foo</b>
function replaceTokenWithHtml(nodecontent, token, tagName) {
    for (let i = 0; i < nodecontent.length; i++) {
        if (nodecontent.substring(i, i + token.length) === token) {
            const start = i;
            i += token.length;
            while (nodecontent.substring(i, i + token.length) !== token && i < nodecontent.length) {
                i += 1;
            }
            const end = i;
            const content = nodecontent.substring(start + 2, end);
            nodecontent = nodecontent.replace(`${token}${content}${token}`, `<${tagName}>${content}</${tagName}>`);
        }
    }
    return nodecontent;
}
exports.replaceTokenWithHtml = replaceTokenWithHtml;
function hasImages(name) {
    return name.includes('![](https://');
}
exports.hasImages = hasImages;
const replaceMoonJotSyntax = (nameToUse) => {
    if (nameToUse.includes('{{embed')) {
        // Replace {embed:((id))} with ((id))
        nameToUse = nameToUse.replace(/\{\{embed\s?\(\((.+)\)\)\}\}/, function (match, contents) {
            return `((${contents}))`;
        });
        // Replace {embed:[[name]]} with [[name]]
        nameToUse = nameToUse.replace(/\{\{embed\s?\[\[(.+)\]\]\}\}/, function (match, contents) {
            return `[[${contents}]]`;
        });
    }
    return nameToUse;
};
exports.replaceMoonJotSyntax = replaceMoonJotSyntax;
exports.DATE_REGEX = /^\w+\s\d{1,2}\w{2},\s\d+$/;
const removeEmptyAtStart = (arrayOfObjects) => {
    if (arrayOfObjects.length === 0)
        return arrayOfObjects;
    const newArray = [...arrayOfObjects];
    const element = newArray[0];
    if ('name' in element && element.name === '') {
        newArray.shift();
        (0, exports.removeEmptyAtStart)(newArray);
    }
    return newArray;
};
exports.removeEmptyAtStart = removeEmptyAtStart;
const removeEmptyAtEnd = (arrayOfObjects) => {
    if (arrayOfObjects.length === 0)
        return arrayOfObjects;
    const newArray = [...arrayOfObjects];
    const element = newArray[newArray.length - 1];
    if ('name' in element && element.name === '') {
        newArray.pop();
        (0, exports.removeEmptyAtStart)(newArray);
    }
    return newArray;
};
exports.removeEmptyAtEnd = removeEmptyAtEnd;
const handleCodeBlock = (markdown) => {
    // Regular expression to match content inside triple backticks
    const regex = /```([\s\S]+?)```/g;
    // Replace content inside triple backticks with wrapped content
    const processedMarkdown = markdown.replace(regex, (_match, p1) => {
        // Split the content into lines
        const lines = p1.split('\n');
        // Filter out empty lines and wrap non-empty lines with backticks
        const wrappedLines = lines.filter((line) => line.trim() !== '').map((line) => '^^' + line.trim() + '^^');
        // Join the wrapped lines with newlines
        return wrappedLines.join('\n');
    });
    return processedMarkdown;
};
exports.handleCodeBlock = handleCodeBlock;
const isTextADate = (date) => {
    try {
        return !isNaN(Date.parse(date));
    }
    catch (err) {
        return false;
    }
};
exports.isTextADate = isTextADate;
//# sourceMappingURL=utils.js.map