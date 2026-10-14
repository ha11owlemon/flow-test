import React, {useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

// Portal layout copied from the local FYSETC Docusaurus reference project.
// This repository tests CMS publishing; it is not the official FYSETC wiki.
const categories = [
  {id: 'controllers', title: {zh: '控制板', en: 'Controllers'}, icon: 'board', slug: 'category/controllers'},
  {id: 'drivers', title: {zh: '步进电机驱动', en: 'Stepper Drivers'}, icon: 'driver', slug: 'category/drivers'},
  {id: 'displays', title: {zh: '显示面板', en: 'Displays'}, icon: 'screen', slug: 'category/displays'},
  {id: 'modules', title: {zh: '通信模块', en: 'Communication Modules'}, icon: 'module', slug: 'category/modules'},
  {id: 'editing', title: {zh: 'CMS 内容编辑测试', en: 'CMS Content Editing Test'}, icon: 'code', slug: 'edit-content-test'},
  {id: 'publishing', title: {zh: 'GitHub Actions 发布验证', en: 'GitHub Actions Publishing Test'}, icon: 'book', slug: 'publish-verification-test'},
];
const products = [
  {slug: 'Cheetah_Board_V20', title: 'Cheetah v2.0', category: 'controllers', image: 'Cheetah_v20.jpg', description: {zh: '32 位控制板 · 硬件接口与配置', en: '32-bit controller · Interfaces & configuration'}},
  {slug: 'Silent2209', title: 'Silent2209', category: 'drivers', image: '2209v3.0.png', description: {zh: '静音步进驱动 · UART 与引脚定义', en: 'Quiet stepper driver · UART & pinout'}},
  {slug: 'HV5160', title: 'HV5160', category: 'drivers', image: 'HV5160%20with%20heatsink.png', description: {zh: '高压步进驱动 · SPI 与电流设置', en: 'High-voltage stepper driver · SPI & current settings'}},
  {slug: 'Mini12864_Panel', title: 'Mini12864', category: 'displays', image: 'Mini12864.png', description: {zh: '显示面板 · 接线与 RGB 背光', en: 'Display panel · Wiring & RGB backlight'}},
  {slug: 'UCAN', title: 'UCAN', category: 'modules', image: 'UCAN-TOP.png', description: {zh: 'USB 转 CAN · 连接与固件配置', en: 'USB to CAN · Connections & firmware setup'}},
];
const guides = [
  {slug: 'Cheetah_Board_V20', icon: 'board', title: {zh: 'Cheetah 控制板入门', en: 'Getting Started with Cheetah'}, description: {zh: '认识控制板接口、接线与固件配置，验证长篇硬件文档的编辑体验。', en: 'Explore the board interfaces, wiring, and firmware setup, and test editing a detailed hardware document.'}, tag: {zh: '硬件接线', en: 'Hardware'}},
  {slug: 'Silent2209', icon: 'driver', title: {zh: 'Silent2209 驱动配置', en: 'Silent2209 Driver Setup'}, description: {zh: '查看驱动特性、UART 接线和电流设置，测试图片与参数表的管理。', en: 'Review driver features, UART wiring, and current settings, and test managing images and specification tables.'}, tag: {zh: '驱动配置', en: 'Driver Setup'}},
  {slug: 'HV5160', icon: 'driver', title: {zh: 'HV5160 高压驱动参考', en: 'HV5160 High-Voltage Driver Reference'}, description: {zh: '浏览高压驱动的规格、引脚和使用说明，查阅硬件参考资料。', en: 'Browse the high-voltage driver specifications, pinout, and instructions for hardware reference.'}, tag: {zh: '驱动配置', en: 'Driver Setup'}},
  {slug: 'Mini12864_Panel', icon: 'screen', title: {zh: 'Mini12864 面板连接', en: 'Connecting a Mini12864 Panel'}, description: {zh: '根据显示面板的接口说明连接硬件，了解屏幕与背光配置。', en: 'Use the panel interface reference to connect the hardware and configure the display and backlight.'}, tag: {zh: '面板连接', en: 'Display Setup'}},
  {slug: 'UCAN', icon: 'cable', title: {zh: 'UCAN 通信模块设置', en: 'UCAN Communication Module Setup'}, description: {zh: '查阅 USB 转 CAN 模块的接线、固件与使用步骤。', en: 'Find wiring, firmware, and usage instructions for the USB-to-CAN module.'}, tag: {zh: 'CAN 通信', en: 'CAN Bus'}},
  {slug: 'publish-verification-test', icon: 'code', title: {zh: '验证编辑到发布链路', en: 'Verify the Editing-to-Publishing Flow'}, description: {zh: '保存 CMS 内容并提交远程仓库，检查 GitHub Actions 与文档站的更新。', en: 'Save CMS content to the remote repository, then check GitHub Actions and the updated documentation site.'}, tag: {zh: '发布测试', en: 'Publishing Test'}},
];
const resources = [
  {slug: 'edit-content-test', icon: 'code', title: {zh: '内容编辑测试', en: 'Content Editing Test'}, description: {zh: '修改标题、正文和图片，检查 CMS 保存后的 Git 变更。', en: 'Edit titles, content, and images, then inspect the Git changes saved by the CMS.'}},
  {slug: 'publish-verification-test', icon: 'book', title: {zh: '发布验证测试', en: 'Publishing Verification Test'}, description: {zh: '检查远程提交、构建工作流与 GitHub Pages 的发布结果。', en: 'Check remote commits, the build workflow, and the resulting GitHub Pages deployment.'}},
  {slug: 'Cheetah_Board_V20', icon: 'folder', title: {zh: 'FYSETC 示例文档', en: 'FYSETC Sample Documentation'}, description: {zh: '五篇文章和配图来自本地 FYSETC 文档项目，用于测试内容管理。', en: 'Five articles and their images come from the local FYSETC documentation project for content management tests.'}},
];

const copy = {
  zh: {
    title: 'FYSETC 文档 · CMS 链路测试',
    description: '使用 FYSETC 示例文档测试 Sveltia CMS、GitHub 与 GitHub Actions 的文档发布链路。',
    testBadge: '文档链路测试站',
    heading: '产品资料与使用指南',
    intro: '找到你的硬件，查阅规格、接线和配置说明。首页布局、示例文章与图片来自 FYSETC 文档项目，用于 CMS 测试。',
    categoriesTitle: '按类别浏览',
    categoriesIntro: '从硬件类别进入示例文档，或验证编辑与发布流程。',
    browseDocs: '浏览文档',
    tabsLabel: '文档浏览方式',
    productsTab: '产品目录',
    guidesTab: '使用指南',
    catalogIntro: '五款产品的说明、引脚与配置资料。',
    productSingular: '个产品',
    productPlural: '个产品',
    filtersLabel: '筛选产品类别',
    allProducts: '全部推荐',
    categoryLink: '查看分类文档',
    guidesIntro: '按任务查找接线、通信和固件配置说明。',
    publishingLink: '发布验证',
    readGuide: '查看指南',
    resourcesTitle: '更多文档资源',
  },
  en: {
    title: 'FYSETC Documentation · CMS Flow Test',
    description: 'Test the documentation publishing flow from Sveltia CMS through GitHub and GitHub Actions with FYSETC sample documentation.',
    testBadge: 'Documentation Test Site',
    heading: 'Product Documentation & Guides',
    intro: 'Find your hardware and explore specifications, wiring, and configuration. The homepage layout, sample articles, and images come from the FYSETC documentation project for CMS tests.',
    categoriesTitle: 'Browse by Category',
    categoriesIntro: 'Explore sample hardware documentation or verify the editing and publishing flow.',
    browseDocs: 'Browse Documentation',
    tabsLabel: 'Documentation View',
    productsTab: 'Product Catalog',
    guidesTab: 'How-to Guides',
    catalogIntro: 'Specifications, pinouts, and configuration for five products.',
    productSingular: 'product',
    productPlural: 'products',
    filtersLabel: 'Filter Product Categories',
    allProducts: 'All Featured',
    categoryLink: 'Explore the Category',
    guidesIntro: 'Find instructions for wiring, communication, and firmware setup by task.',
    publishingLink: 'Verify Publishing',
    readGuide: 'Read the Guide',
    resourcesTitle: 'More Documentation Resources',
  },
};

function Arrow({className}) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>;
}
function Icon({kind, className}) {
  const paths = {
    board: <><rect x="5" y="5" width="22" height="22" rx="3"/><rect x="11" y="11" width="10" height="10" rx="1"/><path d="M11 1v4m10-4v4M11 27v4m10-4v4M1 11h4m-4 10h4m22-10h4m-4 10h4"/></>,
    driver: <><rect x="7" y="7" width="18" height="18" rx="2"/><path d="M11 2v5m5-5v5m5-5v5M11 25v5m5-5v5m5-5v5M15 11l-4 6h5l-1 5 6-8h-6z"/></>,
    screen: <><rect x="3" y="5" width="26" height="20" rx="3"/><path d="M3 20h26m-16 5v4m6-4v4M9 29h14M8 10h12m-12 5h7"/></>,
    module: <><rect x="4" y="4" width="10" height="10" rx="2"/><rect x="18" y="4" width="10" height="10" rx="2"/><rect x="4" y="18" width="10" height="10" rx="2"/><path d="M23 18v10m-5-5h10"/></>,
    cable: <path d="M7 3v5m6-5v5M5 8h10v5a5 5 0 01-10 0V8zm5 10v4a6 6 0 006 6h1a6 6 0 006-6v-4M18 12h10v3a5 5 0 01-10 0v-3zm3-5v5m4-5v5"/>,
    book: <><path d="M16 8v20M3 5h6a7 7 0 017 4 7 7 0 017-4h6v21h-6a9 9 0 00-7 2 9 9 0 00-7-2H3V5zM7 10h4m-4 5h4m10-5h4m-4 5h4"/></>,
    code: <><rect x="3" y="5" width="26" height="22" rx="3"/><path d="M11 11l-5 5 5 5m10-10l5 5-5 5m-3-11l-4 12"/></>,
    folder: <><path d="M3 10V6a2 2 0 012-2h7l3 4h12a2 2 0 012 2v15a3 3 0 01-3 3H6a3 3 0 01-3-3V10zm0 2h26M11 18h10m-10 5h6"/></>,
  };
  return <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

export default function Home() {
  const {i18n} = useDocusaurusContext();
  const language = i18n.currentLocale.startsWith('en') ? 'en' : 'zh';
  const text = copy[language];
  const docsBase = useBaseUrl('/docs/');
  const imageBase = useBaseUrl('/images/');
  const [activeTab, setActiveTab] = useState('products');
  const [activeCategory, setActiveCategory] = useState('all');
  const tabRefs = useRef([]);
  const visibleProducts = products.filter(product => activeCategory === 'all' || product.category === activeCategory);
  const productCategories = categories.filter(category => products.some(product => product.category === category.id));
  const selectedCategory = categories.find(category => category.id === activeCategory);

  function handleTabKey(event, index) {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 1;
    else return;
    event.preventDefault();
    setActiveTab(next === 0 ? 'products' : 'guides');
    tabRefs.current[next]?.focus();
  }

  return (
    <Layout title={text.title} description={text.description}>
      <main className={styles.home}>
        <section className={styles.introSection} aria-labelledby="wiki-title">
          <div className={styles.container}>
            <div className={styles.welcomeHeading}><span className={styles.brandLabel}>FYSETC DOCUMENTATION · CMS TEST</span><span className={styles.testBadge}><span />{text.testBadge}</span></div>
            <h1 id="wiki-title">{text.heading}</h1>
            <p className={styles.intro}>{text.intro}</p>
          </div>
        </section>

        <div className={styles.container}>
          <section className={styles.categoriesSection} aria-labelledby="categories-title">
            <div className={styles.sectionHeading}><div><h2 id="categories-title">{text.categoriesTitle}</h2><p>{text.categoriesIntro}</p></div><Link className={styles.textLink} to={`${docsBase}Cheetah_Board_V20/`}>{text.browseDocs}<Arrow /></Link></div>
            <div className={styles.categoryGrid}>{categories.map(category => <Link key={category.id} className={styles.categoryCard} to={`${docsBase}${category.slug}/`}><Icon kind={category.icon}/><span>{category.title[language]}</span><Arrow className={styles.categoryArrow}/></Link>)}</div>
          </section>

          <section className={styles.browserSection} aria-label={text.tabsLabel}>
            <div className={styles.tabBar} role="tablist" aria-label={text.tabsLabel}>
              {['products', 'guides'].map((tab, index) => <button key={tab} id={`tab-${tab}`} ref={element => {tabRefs.current[index] = element;}} className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`} type="button" role="tab" aria-selected={activeTab === tab} aria-controls={`panel-${tab}`} tabIndex={activeTab === tab ? 0 : -1} onClick={() => setActiveTab(tab)} onKeyDown={event => handleTabKey(event, index)}><Icon kind={tab === 'products' ? 'module' : 'book'}/>{tab === 'products' ? text.productsTab : text.guidesTab}</button>)}
            </div>

            <div id="panel-products" className={styles.panel} role="tabpanel" aria-labelledby="tab-products" hidden={activeTab !== 'products'} tabIndex={0}>
              <div className={styles.panelIntro}><p>{text.catalogIntro}</p><span aria-live="polite">{visibleProducts.length} {visibleProducts.length === 1 ? text.productSingular : text.productPlural}</span></div>
              <div className={styles.filterBar}><div className={styles.filterButtons} role="group" aria-label={text.filtersLabel}>{[{id: 'all', title: {[language]: text.allProducts}}, ...productCategories].map(category => <button key={category.id} className={activeCategory === category.id ? styles.activeFilter : ''} type="button" aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>{category.title[language]}</button>)}</div>{selectedCategory && <Link className={styles.textLink} to={`${docsBase}${selectedCategory.slug}/`}>{text.categoryLink}<Arrow /></Link>}</div>
              <div className={styles.productGrid}>{visibleProducts.map(product => <Link key={product.slug} className={styles.productCard} to={`${docsBase}${product.slug}/`}><div className={styles.productImage}><img src={`${imageBase}${product.image}`} alt={`FYSETC ${product.title}`} loading="lazy" /></div><div className={styles.productBody}><span className={styles.productCategory}>{categories.find(category => category.id === product.category).title[language]}</span><h3>{product.title}</h3><p>{product.description[language]}</p><Arrow className={styles.productArrow}/></div></Link>)}</div>
            </div>

            <div id="panel-guides" className={styles.panel} role="tabpanel" aria-labelledby="tab-guides" hidden={activeTab !== 'guides'} tabIndex={0}>
              <div className={styles.panelIntro}><p>{text.guidesIntro}</p><Link className={styles.textLink} to={`${docsBase}publish-verification-test/`}>{text.publishingLink}<Arrow /></Link></div>
              <div className={styles.guideGrid}>{guides.map(guide => <Link key={guide.slug} className={styles.guideCard} to={`${docsBase}${guide.slug}/`}><span className={styles.guideIcon}><Icon kind={guide.icon}/></span><span className={styles.guideTag}>{guide.tag[language]}</span><h3>{guide.title[language]}</h3><p>{guide.description[language]}</p><span className={styles.guideLink}>{text.readGuide}<Arrow /></span></Link>)}</div>
            </div>
          </section>

          <section className={styles.resourcesSection} aria-labelledby="resources-title"><h2 id="resources-title">{text.resourcesTitle}</h2><div className={styles.resourceGrid}>{resources.map(resource => <Link className={styles.resourceCard} key={resource.slug} to={`${docsBase}${resource.slug}/`}><Icon kind={resource.icon}/><div><h3>{resource.title[language]}</h3><p>{resource.description[language]}</p></div><Arrow className={styles.resourceArrow}/></Link>)}</div></section>
        </div>
      </main>
    </Layout>
  );
}
