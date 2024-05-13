"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTextADate = exports.handleCodeBlock = exports.removeEmptyAtEnd = exports.removeEmptyAtStart = void 0;
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