"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tanaIntegration = void 0;
const moon_utils_1 = require("@moonjot/moon-utils");
const utils_1 = require("./utils");
const tanaIntegration = ({ context, markdown, template, taskSuperTag, log }) => {
    var _a, _b, _c;
    try {
        const handleDateContent = (0, moon_utils_1.turnDate)({ content: template });
        const searchObj = Object.assign({ content: markdown }, context);
        const handlePropertiesContent = (_a = (0, moon_utils_1.handleReplacingProperties)({ content: handleDateContent, searchObj })) !== null && _a !== void 0 ? _a : '';
        const handleConditionContent = (_c = (_b = (0, moon_utils_1.handleConditions)({ content: handlePropertiesContent, searchObj })) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
        const handleCodeBlockContent = (0, utils_1.handleCodeBlock)(handleConditionContent);
        const lines = handleCodeBlockContent.split('\n');
        const tanaNodes = lines.map((name) => {
            var _a, _b;
            const node = {
                name
            };
            if ((0, utils_1.isTextADate)(name)) {
                return {
                    dataType: 'date',
                    name
                };
            }
            else if (name.startsWith('![](data:image')) {
                const base64WithType = (_a = name.split('![](data:').pop()) === null || _a === void 0 ? void 0 : _a.replace(')', '');
                const base64Details = base64WithType === null || base64WithType === void 0 ? void 0 : base64WithType.split(';base64,');
                return {
                    dataType: 'file',
                    file: base64Details === null || base64Details === void 0 ? void 0 : base64Details.pop(),
                    contentType: base64Details === null || base64Details === void 0 ? void 0 : base64Details[0],
                    filename: Date.now() + '.' + ((_b = base64Details === null || base64Details === void 0 ? void 0 : base64Details[0]) === null || _b === void 0 ? void 0 : _b.split('/').pop())
                };
            }
            else if (name.startsWith('- [ ]')) {
                return {
                    name: node.name.replace('- [ ]', '').trim(),
                    type: 'node',
                    supertags: [{ id: taskSuperTag }]
                };
            }
            else if (name.startsWith('- [x]')) {
                // NOT WORKING missing the status
                return {
                    name: node.name.replace('- [x]', '').trim(),
                    type: 'node',
                    supertags: [{ id: taskSuperTag }]
                };
            }
            return node;
        });
        const tanaNodesTrimmed = (0, utils_1.removeEmptyAtStart)((0, utils_1.removeEmptyAtEnd)(tanaNodes));
        const parentNode = tanaNodesTrimmed.shift();
        return (parentNode === null || parentNode === void 0 ? void 0 : parentNode.dataType) === 'file'
            ? [
                parentNode,
                ...tanaNodesTrimmed
            ]
            : [Object.assign(Object.assign({}, parentNode), { children: tanaNodesTrimmed })];
    }
    catch (err) {
        log === null || log === void 0 ? void 0 : log(JSON.stringify({ err }));
        return [];
    }
};
exports.tanaIntegration = tanaIntegration;
//# sourceMappingURL=integration.js.map