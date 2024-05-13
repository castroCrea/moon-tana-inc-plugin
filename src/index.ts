import { type Context, MoonPlugin, type MoonPluginConstructorProps, type MoonPluginSettings, type PluginSettingsDescription } from '@moonjot/moon'
import { handleConditions, handleReplacingProperties, turnDate } from '@moonjot/moon-utils'
import { DEFAULT_TEMPLATE } from './template'
import { handleCodeBlock, isTextADate, removeEmptyAtEnd, removeEmptyAtStart } from './utils'
import { type TanaIntermediateNode } from './types'

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
      description: 'Format your note result inside Tana.inc. [documentation](https://github.com/castroCrea/moon-tana-inc-plugin/blob/main/README.md)',
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
  }

  integration = {
    callback: async ({ context, markdown }: {
      html: string
      markdown: string
      context: Context
    }
    ) => {
      try {
        const handleDateContent = turnDate({ content: this.settings.template })

        const searchObj = {
          content: markdown,
          ...context
        }

        const handlePropertiesContent = handleReplacingProperties({ content: handleDateContent, searchObj }) ?? ''

        const handleConditionContent = handleConditions({ content: handlePropertiesContent, searchObj })?.trim() ?? ''

        const handleCodeBlockContent = handleCodeBlock(handleConditionContent)

        const lines = handleCodeBlockContent.split('\n')

        const tanaNodes: Array<Partial<TanaIntermediateNode>> = lines.map((name) => {
          const node = {
            name
          }

          if (isTextADate(name)) {
            return {
              dataType: 'date',
              name
            }
          } else if (name.startsWith('![](data:image')) {
            const base64WithType = name.split('![](data:').pop()?.replace(')', '')
            const base64Details = base64WithType?.split(';base64,')
            return {
              dataType: 'file',
              file: base64Details?.pop(),
              contentType: base64Details?.[0],
              filename: Date.now() + '.' + base64Details?.[0]?.split('/').pop()
            }
          } else if (name.startsWith('- [ ]')) {
            return {
              name: node.name.replace('- [ ]', '').trim(),
              type: 'node',
              supertags: [{ id: this.settings.task_super_tag }]
            }
          } else if (name.startsWith('- [x]')) {
            // NOT WORKING missing the status
            return {
              name: node.name.replace('- [x]', '').trim(),
              type: 'node',
              supertags: [{ id: this.settings.task_super_tag }]
            }
          }
          return node
        })

        const tanaNodesTrimmed = removeEmptyAtStart(
          removeEmptyAtEnd(tanaNodes))

        const parentNode = tanaNodesTrimmed.shift()

        const payload = parentNode?.dataType === 'file'
          ? {
              targetNodeId: 'INBOX',
              nodes: [
                parentNode,
                ...tanaNodesTrimmed
              ]
            }
          : {
              targetNodeId: 'INBOX',
              nodes: [{
                ...parentNode,
                children: tanaNodesTrimmed
              }]
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
