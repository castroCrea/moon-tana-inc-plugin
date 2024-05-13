"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TEMPLATE = void 0;
exports.DEFAULT_TEMPLATE = `{{content}}
{{IF source.url}}Source: <a href="{{source.url}}">{{source.title}}</a>{{END_IF source.url}}
{{IF people.0.name}}Author: {{people.0.name}}{{END_IF people.0.name}}
`;
//# sourceMappingURL=template.js.map