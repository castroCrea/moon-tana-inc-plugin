export const DEFAULT_TEMPLATE = `
{{content}}

{{IF source.url}}
{{IF source.title}}{{source.title}}{{END_IF source.title}}
{{IF source.url}}<a href="{{source.url}}">{{source.title}}</a>{{END_IF source.url}}
{{IF source.description}}{{source.description}}{{END_IF source.description}}
{{IF source.timestamp}}
Timestamp: <a href="{{source.timestamp.0.url}}">{{source.timestamp.0.timestamp}}</a>
{{END_IF source.timestamp}}
{{END_IF source.url}}

{{IF people.0.name}}
{{IF people.0.name}}{{people.0.name}}{{END_IF people.0.name}}
{{IF people.0.job}}{{people.0.job}}{{END_IF people.0.job}}
{{IF people.0.email}}<a href="mailto:{{people.0.email}}">{{people.0.email}}</a>{{END_IF people.0.email}}
{{IF people.0.about}}{{people.0.about}}{{END_IF people.0.about}}
{{IF people.0.linkedin.0}}linkedin: <a href="{{people.0.linkedin.0}}">{{people.0.linkedin.0}}</a>{{END_IF people.0.linkedin.0}}
{{IF people.0.twitter.0}}twitter: <a href="{{people.0.twitter.0}}">{{people.0.twitter.0}}</a>{{END_IF people.0.twitter.0}}
{{IF people.0.tiktok.0}}tiktok: <a href="{{people.0.tiktok.0}}">{{people.0.tiktok.0}}</a>{{END_IF people.0.tiktok.0}}
{{IF people.0.instagram.0}}instagram: <a href="{{people.0.instagram.0}}">{{people.0.instagram.0}}</a>{{END_IF people.0.instagram.0}}
{{IF people.0.substack.0}}substack: <a href="{{people.0.substack.0}}">{{people.0.substack.0}}</a>{{END_IF people.0.substack.0}}
{{IF people.0.github.0}}github: <a href="{{people.0.github.0}}">{{people.0.github.0}}</a>{{END_IF people.0.github.0}}
{{IF people.0.mastodon.0}}mastodon: <a href="{{people.0.mastodon.0}}">{{people.0.mastodon.0}}</a>{{END_IF people.0.mastodon.0}}
{{IF people.0.youtube.0}}youtube: <a href="{{people.0.youtube.0}}">{{people.0.youtube.0}}</a>{{END_IF people.0.youtube.0}}
{{IF people.0.website.0}}website: <a href="{{people.0.website.0}}">{{people.0.website.0}}</a>{{END_IF people.0.website.0}}
{{END_IF people.0}}
`
