import { type TanaIntermediateNode } from './types'

export const removeEmptyAtStart = (arrayOfObjects: Array<Partial<TanaIntermediateNode>>) => {
  if (arrayOfObjects.length === 0) return arrayOfObjects

  const newArray = [...arrayOfObjects]
  const element = newArray[0]
  if ('name' in element && element.name === '') {
    newArray.shift()
    removeEmptyAtStart(newArray)
  }
  return newArray
}

export const removeEmptyAtEnd = (arrayOfObjects: Array<Partial<TanaIntermediateNode>>) => {
  if (arrayOfObjects.length === 0) return arrayOfObjects

  const newArray = [...arrayOfObjects]
  const element = newArray[newArray.length - 1]
  if ('name' in element && element.name === '') {
    newArray.pop()
    removeEmptyAtStart(newArray)
  }
  return newArray
}

export const handleCodeBlock = (markdown: string) => {
  // Regular expression to match content inside triple backticks
  const regex = /```([\s\S]+?)```/g

  // Replace content inside triple backticks with wrapped content
  const processedMarkdown = markdown.replace(regex, (_match, p1) => {
    // Split the content into lines
    const lines = p1.split('\n')
    // Filter out empty lines and wrap non-empty lines with backticks
    const wrappedLines = lines.filter((line: string) => line.trim() !== '').map((line: string) => '^^' + line.trim() + '^^')
    // Join the wrapped lines with newlines
    return wrappedLines.join('\n')
  })

  return processedMarkdown
}

export const isTextADate = (date: string) => {
  try {
    return !isNaN(Date.parse(date))
  } catch (err) {
    return false
  }
}
