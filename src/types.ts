export interface TanaIntermediateFile {
  // version flag for the import format.
  version: 'TanaIntermediateFile V0.1'

  // summary of the contents in the file
  summary: TanaIntermediateSummary

  // all nodes
  nodes: TanaIntermediateNode[]

  // all attributes
  attributes?: TanaIntermediateAttribute[]

  // all attributes
  supertags?: TanaIntermediateSupertag[]
}

export interface TanaIntermediateSummary {
  // the number of leaf nodes
  leafNodes: number

  // the number of root level nodes (will go into Library)
  topLevelNodes: number

  // the total number of nodes found
  totalNodes: number

  // number of nodes that will end up as day nodes in the calendar
  calendarNodes: number

  // the number of fields
  fields: number

  // number of broken references
  brokenRefs: number
}

export interface TanaIntermediateAttribute {
  name: string
  values: string[]
  count: number
  // will default to any
  dataType?: 'any' | 'url' | 'email' | 'number' | 'date' | 'checkbox'
}

export interface TanaIntermediateSupertag {
  uid: string
  name: string
}

export type NodeType = 'field' | 'image' | 'codeblock' | 'node' | 'date' | 'boolean' | 'checkbox'

export type TanaIntermediateNode = {

  /**
   * Contents of the node.
   *
   * For type=date this must contain the date : "MM-DD-YYYY"
   *
   * Supported text formatting: **bold** __italic__ ~~striked~~ ^^highlighted^^
   *
   * Link formats:
   * - external content: [See Tana](https://wwww.tana.inc)
   * - internal: [[uid]]
   * - internal with alias: [test page]([[uid]])
   */
  name: string

  // Description of the node
  description?: string

  // children
  children?: TanaIntermediateNode[]

  // reference uids
  refs?: string[]

  // created at timestamp
  createdAt: number

  // edited at timestamp
  editedAt: number

  // the various types of nodes we support
  dataType: NodeType

  // used for media url
  mediaUrl?: string

  // for code blocks
  codeLanguage?: string

  supertags?: string[]
} | {
  filenames: string
  file: string
  contentType: string
  dataType: 'file'
}
