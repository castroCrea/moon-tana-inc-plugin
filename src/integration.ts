import { type Context } from '@moonjot/moon'
import { handleConditions, handleReplacingProperties, turnDate } from '@moonjot/moon-utils'
import { handleCodeBlock, isTextADate, removeEmptyAtEnd, removeEmptyAtStart } from './utils'
import { type TanaIntermediateNode } from './types'

export const tanaIntegration = ({ context, markdown, template, taskSuperTag, log }: {
  markdown: string
  template: string
  taskSuperTag: string
  log?: ((log: string) => void)
  context: Context
}) => {
  try {
    const handleDateContent = turnDate({ content: template })

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
          supertags: [{ id: taskSuperTag }]
        }
      } else if (name.startsWith('- [x]')) {
        // NOT WORKING missing the status
        return {
          name: node.name.replace('- [x]', '').trim(),
          type: 'node',
          supertags: [{ id: taskSuperTag }]
        }
      }
      return node
    })

    const tanaNodesTrimmed = removeEmptyAtStart(
      removeEmptyAtEnd(tanaNodes))

    const parentNode = tanaNodesTrimmed.shift()

    return parentNode?.dataType === 'file'
      ? [
          parentNode,
          ...tanaNodesTrimmed
        ]
      : [{
          ...parentNode,
          children: tanaNodesTrimmed
        }]
  } catch (err) {
    log?.(JSON.stringify({ err }))
    return []
  }
}
