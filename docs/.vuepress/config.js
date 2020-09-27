module.exports = {
  base: '/easy4j-doc/',
  title: 'Easy4j',
  description: '简单，美。',
  head: [
      ['link', {
          rel: 'icon',
          href: `/favicon.ico`
      }]
  ],
  evergreen: true,
  themeConfig: {
    logo: '/favicon.ico',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/' },
      { text: '服务端', link: '/server/' },
      { text: '客户端', link: '/client/' }
    ],
    lastUpdated: 'Last Updated',
    repo: 'yang-cruise/easy4j',
    docsRepo: 'vuejs/vuepress',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '帮助我们改善此页面！',
    sidebarDepth: 2,
    sidebar: {
      '/guide/': [
        {
          collapsable: false,
          children: ['']
        }
      ],
      '/server/': [
        {
          collapsable: false,
          children: ['', 'module', 'config', 'api', 'trick']
        }
      ],
      '/client/': [
        {
          collapsable: false,
          children: ['', 'components', 'api', 'trick']
        }
      ]
    }
  }
}