export const DEFAULT_TEMPLATE =
`{{content}}
{{IF source.url}}Source: <a href="{{source.url}}">{{source.title}}</a>{{END_IF source.url}}
{{IF people.0.twitter.0}}Author: <a href="{{people.0.twitter.0}}">{{people.0.name}}</a>{{END_IF people.0.name}}`
