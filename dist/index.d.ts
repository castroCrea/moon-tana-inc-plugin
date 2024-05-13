import { type Context, MoonPlugin, type MoonPluginConstructorProps, type MoonPluginSettings, type PluginSettingsDescription } from '@moonjot/moon';
interface TanaIncSettingsDescription extends PluginSettingsDescription {
    token: {
        type: 'string';
        required: boolean;
        label: string;
        description: string;
    };
}
interface TanaIncSettings extends MoonPluginSettings {
    token: string;
}
export default class extends MoonPlugin {
    name: string;
    logo: string;
    settingsDescription: TanaIncSettingsDescription;
    settings: TanaIncSettings;
    log: ((log: string) => void) | undefined;
    constructor(props?: MoonPluginConstructorProps<TanaIncSettings>);
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
