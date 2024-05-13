export type NodeType = 'field' | 'image' | 'codeblock' | 'node' | 'date' | 'boolean'

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
   */
  name: string

  // Description of the node
  description?: string

  // children
  children?: TanaIntermediateNode[]

  // created at timestamp
  createdAt: number

  // edited at timestamp
  editedAt: number

  // the various types of nodes we support
  dataType: NodeType

  supertags?: string[]
} | {
  filenames: string
  file: string
  contentType: string
  dataType: 'file'
}
