"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moon_1 = require("@moonjot/moon");
const moon_utils_1 = require("@moonjot/moon-utils");
const template_1 = require("./template");
const utils_1 = require("./utils");
class default_1 extends moon_1.MoonPlugin {
    constructor(props) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        super(props);
        this.name = 'Tana Inc';
        this.logo = 'https://pbs.twimg.com/profile_images/1483023821485613058/m2jmm4id_400x400.jpg';
        this.settingsDescription = {
            token: {
                type: 'string',
                required: true,
                label: 'Token',
                description: 'The Tana inc plugin token. [Documentation](https://tana.inc/docs/input-api#how-to-get-a-tana-api-token)'
            }
        };
        this.settings = {
            token: ''
        };
        this.integration = {
            callback: ({ context, markdown }) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f;
                try {
                    console.log('Tana Inc integration');
                    const handleDateContent = (0, moon_utils_1.turnDate)({ content: template_1.DEFAULT_TEMPLATE });
                    (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, handleDateContent);
                    const searchObj = Object.assign({ content: markdown }, context);
                    const handlePropertiesContent = (_b = (0, moon_utils_1.handleReplacingProperties)({ content: handleDateContent, searchObj })) !== null && _b !== void 0 ? _b : '';
                    const handleConditionContent = (_d = (_c = (0, moon_utils_1.handleConditions)({ content: handlePropertiesContent, searchObj })) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
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
                            // NOT WORKING
                            return {
                                name: node.name,
                                type: 'node'
                            };
                        }
                        else if (name.startsWith('- [x]')) {
                            // NOT WORKING
                            return Object.assign(Object.assign({}, node), { type: 'node' });
                        }
                        return node;
                    });
                    const parentNode = tanaNodes.shift();
                    const payload = (parentNode === null || parentNode === void 0 ? void 0 : parentNode.dataType) === 'file'
                        ? {
                            targetNodeId: 'INBOX',
                            nodes: [
                                parentNode,
                                ...(0, utils_1.removeEmptyAtStart)((0, utils_1.removeEmptyAtEnd)(tanaNodes))
                            ]
                        }
                        : {
                            targetNodeId: 'INBOX',
                            nodes: [Object.assign(Object.assign({}, parentNode), { children: (0, utils_1.removeEmptyAtStart)((0, utils_1.removeEmptyAtEnd)(tanaNodes)) })]
                        };
                    (_e = this.log) === null || _e === void 0 ? void 0 : _e.call(this, JSON.stringify({ payload }));
                    yield fetch('https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2', {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + this.settings.token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    return true;
                }
                catch (err) {
                    (_f = this.log) === null || _f === void 0 ? void 0 : _f.call(this, JSON.stringify({ err }));
                    return false;
                }
            }),
            buttonIconUrl: 'https://pbs.twimg.com/profile_images/1483023821485613058/m2jmm4id_400x400.jpg'
        };
        if (!props)
            return;
        if (props.settings)
            this.settings = props.settings;
        this.log = props.helpers.moonLog;
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map