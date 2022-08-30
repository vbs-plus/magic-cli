import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const Components = [
]
const Guides = [
  { text: "Getting Started", link: "/guide/index.md" },
  { text: "Basic", link: "/guide/useage.md" },
];

const nav = [
  { text: "Guide", link: "/guide/" },
  { text: "contribute", link: "/contribute/commands" },
  {
    text: `v${version}`,
    items: [
      {
        text: "Release Notes",
        link: "https://github.com/vbs-plus/magic-cli/releases",
      },
    ],
  },
];

const sidebar = {
  "/guide": [
    {
      text: "Guide",
      items: Guides,
    },
  ],
  "/contribute": [
    {
      text: "Components",
      items: Components,
    },
  ],
};

export default defineConfig({
  title: 'Magic CLI',
  description: 'Monorepo Enterprise level CLI tools by Rush',
  head: [
    ['meta', { property: 'og:title', content: 'Onu-UI' }],
    ['meta', { property: 'og:description', content: 'Monorepo Enterprise level CLI tools by Rush' }],
    ['meta', { property: 'og:url', content: 'https://github.com/vbs-plus/magic-cli' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;400;600&display=swap', rel: 'stylesheet' },
    ],
  ],
  themeConfig: {
    logo: '/logo.png',
    editLink: {
      pattern: 'https://github.com/vbs-plus/magic-cli/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    nav,
    socialLinks: [{ icon: 'github', link: 'https://github.com/vbs-plus/magic-cli' }],
    sidebar,
    algolia: {
      appId: '',
      apiKey: '',
      indexName: '',
    },
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2022-present @vbs & Magic CLI Contributors',
    },
  },
})
