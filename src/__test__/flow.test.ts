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
})
