export const DEFAULT_TEMPLATE =
`{{content}}
{{DATE}}YYYY-MM-DD{{END_DATE}}
{{IF people.0.name}}Author: {{people.0.name}}{{END_IF people.0.name}}
{{IF source.url}}Source: {{source.url}}{{END_IF source.url}}
`
