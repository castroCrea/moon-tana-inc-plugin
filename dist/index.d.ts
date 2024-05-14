import { type Context, MoonPlugin, type MoonPluginConstructorProps, type MoonPluginSettings, type PluginSettingsDescription, type EndpointCallbackItem } from '@moonjot/moon';
interface TanaIncSettingsDescription extends PluginSettingsDescription {
    token: {
        type: 'string';
        required: boolean;
        label: string;
        description: string;
    };
    task_super_tag: {
        type: 'string';
        required: boolean;
        label: string;
        description: string;
    };
    template: {
        type: 'text';
        required: boolean;
        label: string;
        description: string;
        default: string;
    };
}
interface TanaIncSettings extends MoonPluginSettings {
    token: string;
    task_super_tag: string;
    template: string;
}
export default class extends MoonPlugin {
    name: string;
    logo: string;
    settingsDescription: TanaIncSettingsDescription;
    settings: TanaIncSettings;
    log: ((log: string) => void) | undefined;
    constructor(props?: MoonPluginConstructorProps<TanaIncSettings>);
    endpointCallbacks: EndpointCallbackItem[];
    integration: {
        callback: ({ context, markdown }: {
            html: string;
            markdown: string;
            context: Context;
        }) => Promise<boolean>;
        buttonIconUrl: string;
    };
}
export {};
