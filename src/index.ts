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
}

interface TanaIncSettings extends MoonPluginSettings {
  token: string
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
    }
  }

  settings: TanaIncSettings = {
    token: ''
  }

  log: ((log: string) => void) | undefined

  constructor (props?: MoonPluginConstructorProps<TanaIncSettings>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super(props)
    if (!props) return
    if (props.settings) this.settings = props.settings
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
        console.log('Tana Inc integration')

        const handleDateContent = turnDate({ content: DEFAULT_TEMPLATE })

        this.log?.(handleDateContent)

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
            // NOT WORKING
            return {
              name: node.name,
              type: 'node'
            }
          } else if (name.startsWith('- [x]')) {
            // NOT WORKING
            return {
              ...node,
              type: 'node'
            }
          }
          return node
        })

        const parentNode = tanaNodes.shift()

        const payload = parentNode?.dataType === 'file'
          ? {
              targetNodeId: 'INBOX',
              nodes: [
                parentNode,
                ...removeEmptyAtStart(
                  removeEmptyAtEnd(tanaNodes))
              ]
            }
          : {
              targetNodeId: 'INBOX',
              nodes: [{
                ...parentNode,
                children: removeEmptyAtStart(
                  removeEmptyAtEnd(tanaNodes))
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
