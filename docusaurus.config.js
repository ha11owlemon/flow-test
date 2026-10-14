// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';
import legacyHtml from './scripts/rehype-document-html.cjs';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'FYSETC 文档链路测试',
  tagline: '产品资料与使用指南 · GitHub 文档管理测试',
  favicon: 'images/favicon.ico',
  url: 'https://ha11owlemon.github.io',
  baseUrl: '/flow-test/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    format: 'md',
    hooks: {onBrokenMarkdownLinks: 'throw', onBrokenMarkdownImages: 'throw'},
  },
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {label: '简体中文'},
      en: {label: 'English'},
    },
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/ha11owlemon/flow-test/edit/main/',
          editLocalizedFiles: true,
          rehypePlugins: [[legacyHtml, {baseUrl: '/flow-test/'}]],
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {respectPrefersColorScheme: true},
      navbar: {
        logo: {alt: 'FYSETC 文档链路测试', src: 'images/fysetc-navbar-white.svg'},
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: '产品文档',
          },
          {to: '/docs/edit-content-test', label: '编辑与发布测试', position: 'left'},
          {type: 'localeDropdown', position: 'right'},
          {href: 'https://github.com/ha11owlemon/flow-test', label: 'GitHub', position: 'right'},
        ],
      },
      footer: {
        style: 'light',
        links: [
          {title: '产品资料', items: [
            {label: '控制板', to: '/docs/category/controllers/'},
            {label: '步进驱动', to: '/docs/category/drivers/'},
            {label: '显示面板', to: '/docs/category/displays/'},
            {label: '扩展模块', to: '/docs/category/modules/'},
          ]},
          {title: '链路测试', items: [
            {label: '内容编辑', to: '/docs/edit-content-test'},
            {label: '发布验证', to: '/docs/publish-verification-test'},
            {label: '测试仓库', href: 'https://github.com/ha11owlemon/flow-test'},
          ]},
          {title: '资料来源', items: [
            {label: 'FYSETC Wiki', href: 'https://wiki.fysetc.com/'},
            {label: 'FYSETC 源仓库', href: 'https://github.com/FYSETC/wiki.fysetc'},
          ]},
        ],
        copyright: '产品资料与图片来源：FYSETC Wiki · 文档链路测试站',
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'ini', 'diff', 'json', 'python', 'c', 'cpp'],
      },
    }),
};

export default config;
