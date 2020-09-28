module.exports = {
  base: '/',
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
      { text: '客户端', link: '/client/' },
      { text: '演示系统', link: 'http://admin.easy4j.cn' }
    ],
    lastUpdated: 'Last Updated',
    repo: 'yang-cruise/easy4j',
    docsRepo: 'yang-cruise/easy4j-doc',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '帮助我们改善此页面！',
    sidebarDepth: 2,
    sidebar: 'auto'
  }
}