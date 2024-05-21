import { tanaIntegration } from '../integration'

jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-01-01'))

const template = `
{{content}}
{{IF source.url}}
{{IF source.title}}{{source.title}}{{END_IF source.title}}
{{IF source.url}}<a href="{{source.url}}">{{source.title}}</a>{{END_IF source.url}}
{{IF source.type === Tweet }}{{source.text}}{{END_IF source.type}}
{{IF source.description}}{{source.description}}{{END_IF source.description}}
{{IF source.image}}![]({{source.image}}){{END_IF source.image}}
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

const markdown = 'This is a tweet'

describe('Flow', () => {
  it('Flow with youtube', () => {
    const context = {
      source: {
        url: 'https://www.youtube.com/watch?v=OtEfVc6U5DQ&list=PLmTKOO83vuwUZxmzkBjBwEt3hgDGsupXT&index=7&ab_channel=PaoCas',
        title: 'Obsidian - Moon Jot : Add Task',
        appName: 'Arc',
        icon: 'https://www.youtube.com/s/desktop/3725d26e/img/favicon.ico',
        image: 'https://i.ytimg.com/vi_webp/OtEfVc6U5DQ/hqdefault.webp',
        timestamp: [
          {
            timestamp: '0.790997',
            url: 'https://www.youtube.com/watch?v=OtEfVc6U5DQ&list=PLmTKOO83vuwUZxmzkBjBwEt3hgDGsupXT&index=7&ab_channel=PaoCas&t=0.790997s'
          }
        ],
        type: 'Youtube'
      },
      people: [
        {
          name: 'Pao Cas',
          picture: 'https://yt3.ggpht.com/ytc/AIdro_mxFNvj788VRxuGLmtqWjr6b5ijTgVoOgaa2L1jOOEJ-Q=s88-c-k-c0x00ffffff-no-rj',
          youtube: [
            'https://www.youtube.com/@paocto'
          ]
        }
      ],
      keywords: {
        organizations: [],
        places: [],
        people: [],
        collections: [],
        hashTags: [
          '#capture',
          '#obsidian',
          '#moonJot'
        ],
        subject: [],
        emails: [],
        atMentions: [],
        urls: [],
        phoneNumbers: [],
        acronyms: [],
        quotations: []
      },
      other: {
        duration: 40.001
      },
      clipContent: false
    }

    const result = tanaIntegration({ markdown, context, template, taskSuperTag: 'SUPER_TAG' })

    expect(result).toEqual([{ children: [{ name: 'Obsidian - Moon Jot : Add Task' }, { name: '<a href="https://www.youtube.com/watch?v=OtEfVc6U5DQ&list=PLmTKOO83vuwUZxmzkBjBwEt3hgDGsupXT&index=7&ab_channel=PaoCas">Obsidian - Moon Jot : Add Task</a>' }, { name: '![](https://i.ytimg.com/vi_webp/OtEfVc6U5DQ/hqdefault.webp)' }, { name: 'Timestamp: <a href="https://www.youtube.com/watch?v=OtEfVc6U5DQ&list=PLmTKOO83vuwUZxmzkBjBwEt3hgDGsupXT&index=7&ab_channel=PaoCas&t=0.790997s">0.790997</a>' }, { name: 'Pao Cas' }, { name: 'youtube: <a href="https://www.youtube.com/@paocto">https://www.youtube.com/@paocto</a>' }], name: 'This is a tweet' }])
  })

  it('Flow with twitter', () => {
    const context = {
      source: {
        url: 'https://twitter.com/gracedigitalsco/status/1790625791480594493',
        title: 'My bundle made its first sale!...',
        appName: 'Arc',
        content: "TypeError: undefined is not an object (evaluating 'c[e].item.itemContent.tweet_results.result')",
        icon: 'https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png',
        type: 'Tweet',
        specificResult: {
          keywords: {},
          people: [
            {
              name: 'Grace | Notion Creator ',
              picture: 'https://pbs.twimg.com/profile_images/1788110681050578946/6jOQYypv_400x400.jpg',
              twitter: [
                'https://twitter.com/gracedigitalsco'
              ]
            }
          ],
          source: {
            content: "<div dir=\"auto\" lang=\"en\" class=\"css-146c3p1 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-bnwqim\" id=\"id__r03hikwg3pn\" data-testid=\"tweetText\" style=\"-webkit-line-clamp: 10; text-overflow: unset; color: rgb(231, 233, 234);\"><span class=\"css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3\" style=\"text-overflow: unset;\">My bundle made its first sale!</span><img alt=\"💰\" draggable=\"false\" src=\"https://abs-0.twimg.com/emoji/v2/svg/1f4b0.svg\" title=\"Sac d'argent\" class=\"r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl\"><span class=\"css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3\" style=\"text-overflow: unset;\">\n\nI couldn’t believe it! \n\nMy jaw dropped and I squeaked upon checking my </span><div class=\"css-175oi2r r-xoduu5\"><span class=\"r-18u37iz\"><a dir=\"ltr\" href=\"/gumroad\" role=\"link\" class=\"css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3 r-1loqt21\" style=\"text-overflow: unset; color: rgb(29, 155, 240);\">@gumroad</a></span></div><span class=\"css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3\" style=\"text-overflow: unset;\"> acc on my phone.\n\nThis is the highest amount I earned in a day from digital products! </span><img alt=\"🥺\" draggable=\"false\" src=\"https://abs-0.twimg.com/emoji/v2/svg/1f97a.svg\" title=\"Visage suppliant\" class=\"r-4qtqp9 r-dflpy8 r-k4bwe5 r-1kpi4qh r-pp5qcn r-h9hxbl\"></div><img alt=\"Image\" draggable=\"true\" src=\"https://pbs.twimg.com/media/GNmUqhnbgAAgE36?format=jpg&amp;name=medium\" class=\"css-9pa8cd\">",
            icon: 'https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png',
            title: 'My bundle made its first sale!...',
            type: 'Tweet',
            url: 'https://twitter.com/gracedigitalsco/status/1790625791480594493'
          }
        },
        text: "TypeError: undefined is not an object (evaluating\n'c[e].item.itemContent.tweet_results.result')"
      },
      people: [
        {
          name: 'Grace | Notion Creator ',
          picture: 'https://pbs.twimg.com/profile_images/1788110681050578946/6jOQYypv_400x400.jpg',
          twitter: [
            'https://twitter.com/gracedigitalsco'
          ]
        }
      ],
      keywords: {
        organizations: [],
        places: [],
        people: [],
        collections: [],
        hashTags: [],
        subject: [],
        emails: [],
        atMentions: [],
        urls: [],
        phoneNumbers: [],
        acronyms: [],
        quotations: []
      },
      clipContent: true
    }

    const result = tanaIntegration({ markdown, context, template, taskSuperTag: 'SUPER_TAG' })

    expect(result).toEqual([
      {
        children: [{ name: 'My bundle made its first sale!...' },
          { name: '<a href="https://twitter.com/gracedigitalsco/status/1790625791480594493">My bundle made its first sale!...</a>' },
          { name: 'TypeError: undefined is not an object (evaluating' },
          { name: "'c[e].item.itemContent.tweet_results.result')" },
          { name: 'Grace | Notion Creator' },
          { name: 'twitter: <a href="https://twitter.com/gracedigitalsco">https://twitter.com/gracedigitalsco</a>' }],
        name: 'This is a tweet'
      }])
  })

  it('Flow with list and link', () => {
    const context = {
      source: {
        url: 'https://regex101.com/codegen?language=javascript',
        title: 'regex101: build, test, and debug regex',
        appName: 'Arc',
        canonical: '',
        content: '',
        description: 'Regular expression tester with syntax highlighting, explanation, cheat sheet for PHP/PCRE, Python, GO, JavaScript, Java, C#/.NET, Rust.',
        icon: 'https://regex101.com/static/assets/icon-57.png',
        image: 'https://regex101.com/preview/',
        published: '',
        type: 'website',
        text: "REGULAR EXPRESSIONS 101 [/]\n\nSocialDonateInfo\nRegex Editor [/]Community Patterns [/library]Account [/account/mine]Regex Quiz\n[/quiz]Settings [/settings/general]\n\n\nSAVE & SHARE\n\n * Save new Regex\n   ⌘+s\n * Add to Community Library\n\n\nFLAVOR\n\n * PCRE2 (PHP >=7.3)\n * PCRE (PHP <7.3)\n * ECMAScript (JavaScript)\n * Python\n * Golang\n * Java 8\n * .NET 7.0 (C#)\n * Rust\n * Regex Flavor Guide\n\n\nFUNCTION\n\n * Match\n * Substitution\n * List\n * Unit Tests\n\n\nTOOLS\n\n * Code Generator\n   [/codegen?language=javascript]\n * Regex Debugger\n   [/debugger]\n * Export Matches\n\nSponsors\nThere are currently no sponsors. Become a sponsor today!\n[https://digidib.dev/docs/regex101/sponsors/]\nDesign and Development tips in your inbox. Every weekday.\n[https://srv.buysellads.com/static/30242/4f7f59796c5dda8f5dfc63a40583dfde7cebb050]\nDesign and Development tips in your inbox. Every weekday.\n[//srv.buysellads.com/ads/click/x/GTND427JCY7I6KQWCEYLYKQUC6BI52QYF67DTZ3JCAYIP53NCTYD4KJKCY7IE5QUCW7DVKJJC67D52QMCWSITKQKC6SI42JLCABDEK3EHJNCLSIZ?segment=placement:regex101com]Ads\nvia Carbon\n[https://discover.buysellads.com/carbon?utm_source=regex101-com-carbon&utm_medium=ad_via_link&utm_campaign=in_unit&utm_term=carbon]\n\n\nEXPLANATION\n\n\n/\n!\\[\\]\\((http.*?\\))\n/\ngm\n! matches the character ! with index 3310 (2116 or 418) literally (case\nsensitive)\n\\[ matches the character [ with index 9110 (5B16 or 1338) literally (case\nsensitive)\n\\] matches the character ] with index 9310 (5D16 or 1358) literally (case\nsensitive)\n\\( matches the character ( with index 4010 (2816 or 508) literally (case\nsensitive)\n\n1st Capturing Group\n(http.*?\\))\nhttp\nmatches the characters http literally (case sensitive)\n.\nmatches any character (except for line terminators)\n\n*? matches the previous token between zero and unlimited times, as few times as\npossible, expanding as needed (lazy)\n\\) matches the character ) with index 4110 (2916 or 518) literally (case\nsensitive)\n\nGlobal pattern flags\ng modifier: global. All matches (don't return after first match)\nm modifier: multi line. Causes ^ and $ to match the begin/end of each line (not\nonly begin/end of string)\n\n\nMATCH INFORMATION\n\n\nExport Matches\n\nMatch 129-63![](https://regex101.com/preview/)Group\n133-63https://regex101.com/preview/)\n\n\nQUICK REFERENCE\n\n\nSearch reference\n\n * All Tokens\n * Common Tokens\n * General Tokens\n * Anchors\n * Meta Sequences\n * Quantifiers\n * Group Constructs\n * Character Classes\n * Flags/Modifiers\n * Substitution\n\n\n * A single character of: a, b or c\n   [abc]\n * A character except: a, b or c\n   [^abc]\n * A character in the range: a-z\n   [a-z]\n * A character not in the range: a-z\n   [^a-z]\n * A character in the range: a-z or A-Z\n   [a-zA-Z]\n * Any single character\n   .\n * Alternate - match either a or b\n   a|b\n * Any whitespace character\n   \\s\n * Any non-whitespace character\n   \\S\n * Any digit\n   \\d\n * Any non-digit\n   \\D\n * Any word character\n   \\w\n * Any non-word character\n   \\W\n * Match everything enclosed\n   (?:...)\n * Capture everything enclosed\n   (...)\n * Zero or one of a\n   a?\n * Zero or more of a\n   a*\n * One or more of a\n   a+\n * Exactly 3 of a\n   a{3}\n * 3 or more of a\n   a{3,}\n * Between 3 and 6 of a\n   a{3,6}\n * Start of string\n   ^\n * End of string\n   $\n * A word boundary\n   \\b\n * Non-word boundary\n   \\B\n\n\nREGULAR EXPRESSION\n1 MATCH (0.0MS)\n\n/\nSelection deleted\n!\\[\\]\\((http.*?\\))\n\n\n/\ngm\n\n\nTEST STRING\n\n- sddsdsds↵\n\n- sdsdddsdsds↵\n\n↵\n\n↵\n\n![](https://regex101.com/preview/)dsfsdfsdf\n![](ht://regex101.com/preview/)dsfsdfsdf\n\n\n2:16\n\n\nSUBSTITUTION\n\nSuccess (0.0ms)\n- sddsdsds↵\n\n- sdsdddsdsds↵\n\n↵\n\n↵\n\n[https://regex101.com/preview/)](https://regex101.com/preview/))dsfsdfsdf\n![](ht://regex101.com/preview/)dsfsdfsdf\n\n\n1:1\n[$1]($1)\n\n\n\n\nCODE GENERATOR\n\n\nLANGUAGE\n\n * AutoIt\n   [/codegen?language=autoit]\n * C#\n   [/codegen?language=csharp]\n * Golang\n   [/codegen?language=golang]\n * Java\n   [/codegen?language=java]\n * JavaScript\n   [/codegen?language=javascript]\n * Perl\n   [/codegen?language=perl]\n * PHP\n   [/codegen?language=php]\n * Python\n   [/codegen?language=python]\n * Ruby\n   [/codegen?language=ruby]\n * Rust\n   [/codegen?language=rust]\n * SED\n   [/codegen?language=SED]\n * Swift 5.2\n   [/codegen?language=swift5_2]\n\n\nGENERATED CODE\n\nconst regex = /!\\[\\]\\((http.*?\\))/gm; // Alternative syntax using RegExp\nconstructor // const regex = new RegExp('!\\\\[\\\\]\\\\((http.*?\\\\))', 'gm') const\nstr = `- sddsdsds - sdsdddsdsds ![](https://regex101.com/preview/)dsfsdfsdf\n![](ht://regex101.com/preview/)dsfsdfsdf`; const subst = `[$1]($1)`; // The\nsubstituted value will be contained in the result variable const result =\nstr.replace(regex, subst); console.log('Substitution result: ', result);\n\n\nPlease keep in mind that these code samples are automatically generated and are\nnot guaranteed to work. If you find any syntax errors, feel free to submit a bug\nreport. For a full regex reference for JavaScript, please visit:\nhttps://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions\n[https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions]\n\n\n"
      },
      people: [
        {
          name: 'regex101',
          twitter: ['@regex101']
        }
      ],
      keywords: {
        organizations: [],
        places: [],
        people: [],
        collections: [],
        hashTags: [],
        subject: [],
        emails: [],
        atMentions: [],
        urls: [],
        phoneNumbers: [],
        acronyms: [],
        quotations: []
      },
      clipContent: false
    }
    const markdown = `
- sdsdds
  - sddsds
  - dsdsds
  `

    const result = tanaIntegration({ markdown, context, template, taskSuperTag: 'SUPER_TAG' })

    expect(result).toEqual([{
      name: 'sdsdds',
      type: 'node',
      children:
        [{ name: 'sddsds', type: 'node' },
          { name: 'dsdsds', type: 'node' },
          { name: '  ' },
          { name: 'regex101: build, test, and debug regex' },
          { name: '<a href="https://regex101.com/codegen?language=javascript">regex101: build, test, and debug regex</a>' },
          { name: 'Regular expression tester with syntax highlighting, explanation, cheat sheet for PHP/PCRE, Python, GO, JavaScript, Java, C#/.NET, Rust.' },
          { name: '[https://regex101.com/preview/](https://regex101.com/preview/)', type: 'node' },
          { name: 'regex101' }, { name: 'twitter: <a href="@regex101">@regex101</a>' }]
    }])
  })

  it('Flow with tana anchors', () => {
    const context = {
      source: {
      },
      people: [
      ],
      keywords: {
        organizations: [],
        places: [],
        people: [],
        collections: [],
        hashTags: [],
        subject: [],
        emails: [],
        atMentions: [],
        urls: [],
        phoneNumbers: [],
        acronyms: [],
        quotations: []
      },
      clipContent: false
    }
    const markdown = '[[date:2021-02]]'

    const result = tanaIntegration({ markdown, context, template, taskSuperTag: 'SUPER_TAG' })

    expect(result).toEqual([{ children: [], name: "<span data-inlineref-date='{\"dateTimeString\":\"2021-02\"}'></span>", type: 'node' }])
  })
})
