import { type Context, MoonPlugin, type MoonPluginConstructorProps, type MoonPluginSettings, type PluginSettingsDescription, type EndpointCallbackItem } from '@moonjot/moon'
import { DEFAULT_TEMPLATE } from './template'
import { tanaIntegration } from './integration'

interface TanaIncSettingsDescription extends PluginSettingsDescription {
  token: {
    type: 'string'
    required: boolean
    label: string
    description: string
  }
  task_super_tag: {
    type: 'string'
    required: boolean
    label: string
    description: string
  }
  template: {
    type: 'text'
    required: boolean
    label: string
    description: string
    default: string
  }
}

interface TanaIncSettings extends MoonPluginSettings {
  token: string
  task_super_tag: string
  template: string
}

export default class extends MoonPlugin {
  name: string = 'Tana Inc'
  logo: string = 'https://pbs.twimg.com/profile_images/1483023821485613058/m2jmm4id_400x400.jpg'

  settingsDescription: TanaIncSettingsDescription = {
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
      default: DEFAULT_TEMPLATE
    }
  }

  settings: TanaIncSettings = {
    token: '',
    task_super_tag: '',
    template: DEFAULT_TEMPLATE
  }

  log: ((log: string) => void) | undefined

  constructor (props?: MoonPluginConstructorProps<TanaIncSettings>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super(props)
    if (!props) return
    if (props.settings) this.settings = { ...this.settings, ...props.settings }
    this.log = props.helpers.moonLog

    this.settingsButtons = [
      {
        type: 'button',
        callback: () => {
          window.open('https://youtu.be/0c8MZ93wCzI?si=-86WglYv2bad6Tnh', '_blank')
        },
        label: 'Open Tana.inc Plugin Demo',
        description: ''
      },
      {
        type: 'button',
        callback: () => {
          window.open('moonjot://moon-tana-inc-plugin/settings', '_blank')
        },
        label: 'Reset template or update with last version',
        description: ''
      }
    ]
  }

  endpointCallbacks = [{
    endpoint: 'moon-tana-inc-plugin/settings',
    callback: ({ saveSettings }) => {
      saveSettings({ key: 'template', value: DEFAULT_TEMPLATE })
    }
  }] as EndpointCallbackItem[]

  integration = {
    callback: async ({ context, markdown }: {
      html: string
      markdown: string
      context: Context
    }
    ) => {
      try {
        const nodes = tanaIntegration({ markdown, context, template: this.settings.template, taskSuperTag: this.settings.task_super_tag, log: this.log })

        if (!nodes.length) return false

        const payload = {
          targetNodeId: 'INBOX',
          nodes
        }

        this.log?.(JSON.stringify({ payload }))

        await fetch('https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + this.settings.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        return true
      } catch (err) {
        this.log?.(JSON.stringify({ err }))
        return false
      }
    },
    buttonIconUrl: 'https://pbs.twimg.com/profile_images/1483023821485613058/m2jmm4id_400x400.jpg'
  }
}
