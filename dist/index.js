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
const template_1 = require("./template");
const integration_1 = require("./integration");
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
            },
            task_super_tag: {
                type: 'string',
                required: true,
                label: 'Task Super Tag',
                description: 'Copy your task Tana link and get the super tag id https://app.tana.inc?nodeid=HERE_WILL_BE_THE_ID'
            },
            template: {
                type: 'text',
                required: true,
                label: 'Template of capture',
                description: 'Format your note result inside Tana.inc. [Documentation](https://github.com/castroCrea/moon-tana-inc-plugin/blob/main/README.md)',
                default: template_1.DEFAULT_TEMPLATE
            }
        };
        this.settings = {
            token: '',
            task_super_tag: '',
            template: template_1.DEFAULT_TEMPLATE
        };
        this.endpointCallbacks = [{
                endpoint: 'moon-tana-inc-plugin/settings',
                callback: ({ saveSettings }) => {
                    saveSettings({ key: 'template', value: template_1.DEFAULT_TEMPLATE });
                }
            }];
        this.integration = {
            callback: ({ context, markdown }) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const nodes = (0, integration_1.tanaIntegration)({ markdown, context, template: this.settings.template, taskSuperTag: this.settings.task_super_tag, log: this.log });
                    if (!nodes.length)
                        return false;
                    const payload = {
                        targetNodeId: 'INBOX',
                        nodes
                    };
                    (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, JSON.stringify({ payload }));
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
                    (_b = this.log) === null || _b === void 0 ? void 0 : _b.call(this, JSON.stringify({ err }));
                    return false;
                }
            }),
            buttonIconUrl: 'https://pbs.twimg.com/profile_images/1483023821485613058/m2jmm4id_400x400.jpg'
        };
        if (!props)
            return;
        if (props.settings)
            this.settings = Object.assign(Object.assign({}, this.settings), props.settings);
        this.log = props.helpers.moonLog;
        this.settingsButtons = [
            {
                type: 'button',
                callback: () => {
                    window.open('https://youtu.be/0c8MZ93wCzI?si=-86WglYv2bad6Tnh', '_blank');
                },
                label: 'Open Tana.inc Plugin Demo',
                description: ''
            },
            {
                type: 'button',
                callback: () => {
                    window.open('moonjot://moon-tana-inc-plugin/settings', '_blank');
                },
                label: 'Reset template or update with last version',
                description: ''
            }
        ];
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map