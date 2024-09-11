import { type Context } from '@moonjot/moon'
import { handleConditions, handleReplacingProperties, turnDate } from '@moonjot/moon-utils'
import { handleCodeBlock, isTextADate, removeEmptyAtEnd, removeEmptyAtStart } from './utils'
import { type TanaIntermediateNode } from './types'

const REGEX_REMOVE_LIST = /^(\s*-|-)\s/gm
const REGEX_LINK_TO_IMAGE = /!\[\]\((http.*?)\)/gm
const REGEX_DATE_ANCHOR = /(\\|)\[(\\|)\[date:(.*?)(\\|)\](\\|)\]/gm
const REGEX_TAG_ANCHOR = /(\\|)\[(\\|)\[(.*?)(\\|)\](\\|)\]/gm
const REGEX_LOCAL_LINK_ANCHOR = /\#(.*?)/gm

export const tanaIntegration = ({ context, markdown, template, taskSuperTag, log }: {
  markdown: string
  template: string
  taskSuperTag: string
  log?: ((log: string) => void)
  context: Context
}) => {
  log?.(JSON.stringify(markdown))
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

    const tanaNodes: Array<Partial<TanaIntermediateNode>> = lines.filter(l => !!l).map((name) => {
      const node = {
        name
      }

      if (REGEX_DATE_ANCHOR.exec(name)) {
        return {
          name: name.replaceAll(REGEX_DATE_ANCHOR, '<span data-inlineref-date=\'{"dateTimeString":"$3"}\'></span>'),
          type: 'node'
        }
      } else if (REGEX_LOCAL_LINK_ANCHOR.exec(name)) {
        return {
          name: name.replaceAll(REGEX_LOCAL_LINK_ANCHOR, '<span data-inlineref-node=\'\'>$3</span>'),
          type: 'node'
        }
      } else if (REGEX_TAG_ANCHOR.exec(name)) {
        return {
          name: name.replaceAll(REGEX_DATE_ANCHOR, '<span data-tag=\'$3\'></span>'),
          type: 'node'
        }
      } else if (isTextADate(name)) {
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
      } else if (REGEX_LINK_TO_IMAGE.exec(name)) {
        return {
          name: node.name.replaceAll(REGEX_LINK_TO_IMAGE, '[$1]($1)').trim(),
          type: 'node'
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
      } else if (REGEX_REMOVE_LIST.exec(name)) {
        return {
          name: node.name.replace(REGEX_REMOVE_LIST, '').trim(),
          type: 'node'
        }
      }
      return node
    })

    const tanaNodesTrimmed = removeEmptyAtStart(
      removeEmptyAtEnd(tanaNodes))

    const parentNode = tanaNodesTrimmed.shift()

    return parentNode?.dataType && ['file', 'date'].includes(parentNode.dataType)
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
