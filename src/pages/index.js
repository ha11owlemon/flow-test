import React, {useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

// Portal layout copied from the local FYSETC Docusaurus reference project.
// This repository tests CMS publishing; it is not the official FYSETC wiki.
const categories = [
  {id: 'controllers', title: '控制板', icon: 'board', slug: 'category/controllers'},
  {id: 'drivers', title: '步进电机驱动', icon: 'driver', slug: 'category/drivers'},
  {id: 'displays', title: '显示面板', icon: 'screen', slug: 'category/displays'},
  {id: 'modules', title: '通信模块', icon: 'module', slug: 'category/modules'},
  {id: 'editing', title: 'CMS 内容编辑测试', icon: 'code', slug: 'edit-content-test'},
  {id: 'publishing', title: 'GitHub Actions 发布验证', icon: 'book', slug: 'publish-verification-test'},
];
const products = [
  {slug: 'Cheetah_Board_V20', title: 'Cheetah v2.0', category: 'controllers', image: 'Cheetah_v20.jpg', description: '32 位控制板 · 硬件接口与配置'},
  {slug: 'Silent2209', title: 'Silent2209', category: 'drivers', image: '2209v3.0.png', description: '静音步进驱动 · UART 与引脚定义'},
  {slug: 'HV5160', title: 'HV5160', category: 'drivers', image: 'HV5160%20with%20heatsink.png', description: '高压步进驱动 · SPI 与电流设置'},
  {slug: 'Mini12864_Panel', title: 'Mini12864', category: 'displays', image: 'Mini12864.png', description: '显示面板 · 接线与 RGB 背光'},
  {slug: 'UCAN', title: 'UCAN', category: 'modules', image: 'UCAN-TOP.png', description: 'USB 转 CAN · 连接与固件配置'},
];
const guides = [
  {slug: 'Cheetah_Board_V20', icon: 'board', title: 'Cheetah 控制板入门', description: '认识控制板接口、接线与固件配置，验证长篇硬件文档的编辑体验。', tag: '硬件接线'},
  {slug: 'Silent2209', icon: 'driver', title: 'Silent2209 驱动配置', description: '查看驱动特性、UART 接线和电流设置，测试图片与参数表的管理。', tag: '驱动配置'},
  {slug: 'HV5160', icon: 'driver', title: 'HV5160 高压驱动参考', description: '浏览高压驱动的规格、引脚和使用说明，查阅硬件参考资料。', tag: '驱动配置'},
  {slug: 'Mini12864_Panel', icon: 'screen', title: 'Mini12864 面板连接', description: '根据显示面板的接口说明连接硬件，了解屏幕与背光配置。', tag: '面板连接'},
  {slug: 'UCAN', icon: 'cable', title: 'UCAN 通信模块设置', description: '查阅 USB 转 CAN 模块的接线、固件与使用步骤。', tag: 'CAN 通信'},
  {slug: 'publish-verification-test', icon: 'code', title: '验证编辑到发布链路', description: '保存 CMS 内容并提交远程仓库，检查 GitHub Actions 与文档站的更新。', tag: '发布测试'},
];
const resources = [
  {slug: 'edit-content-test', icon: 'code', title: '内容编辑测试', description: '修改标题、正文和图片，检查 CMS 保存后的 Git 变更。'},
  {slug: 'publish-verification-test', icon: 'book', title: '发布验证测试', description: '检查远程提交、构建工作流与 GitHub Pages 的发布结果。'},
  {slug: 'Cheetah_Board_V20', icon: 'folder', title: 'FYSETC 示例文档', description: '五篇文章和配图来自本地 FYSETC 文档项目，用于测试内容管理。'},
];

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
    <Layout title="FYSETC 文档 · CMS 链路测试" description="使用 FYSETC 示例文档测试 Sveltia CMS、GitHub 与 GitHub Actions 的文档发布链路。">
      <main className={styles.home}>
        <section className={styles.introSection} aria-labelledby="wiki-title">
          <div className={styles.container}>
            <div className={styles.welcomeHeading}><span className={styles.brandLabel}>FYSETC DOCUMENTATION · CMS TEST</span><span className={styles.testBadge}><span />文档链路测试站</span></div>
            <h1 id="wiki-title">产品资料与使用指南</h1>
            <p className={styles.intro}>找到你的硬件，查阅规格、接线和配置说明。首页布局、示例文章与图片来自 FYSETC 文档项目，用于 CMS 测试。</p>
          </div>
        </section>

        <div className={styles.container}>
          <section className={styles.categoriesSection} aria-labelledby="categories-title">
            <div className={styles.sectionHeading}><div><h2 id="categories-title">按类别浏览</h2><p>从硬件类别进入示例文档，或验证编辑与发布流程。</p></div><Link className={styles.textLink} to={`${docsBase}Cheetah_Board_V20/`}>浏览文档<Arrow /></Link></div>
            <div className={styles.categoryGrid}>{categories.map(category => <Link key={category.id} className={styles.categoryCard} to={`${docsBase}${category.slug}/`}><Icon kind={category.icon}/><span>{category.title}</span><Arrow className={styles.categoryArrow}/></Link>)}</div>
          </section>

          <section className={styles.browserSection} aria-label="文档浏览方式">
            <div className={styles.tabBar} role="tablist" aria-label="文档浏览方式">
              {['products', 'guides'].map((tab, index) => <button key={tab} id={`tab-${tab}`} ref={element => {tabRefs.current[index] = element;}} className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`} type="button" role="tab" aria-selected={activeTab === tab} aria-controls={`panel-${tab}`} tabIndex={activeTab === tab ? 0 : -1} onClick={() => setActiveTab(tab)} onKeyDown={event => handleTabKey(event, index)}><Icon kind={tab === 'products' ? 'module' : 'book'}/>{tab === 'products' ? '产品目录' : '使用指南'}</button>)}
            </div>

            <div id="panel-products" className={styles.panel} role="tabpanel" aria-labelledby="tab-products" hidden={activeTab !== 'products'} tabIndex={0}>
              <div className={styles.panelIntro}><p>五款产品的说明、引脚与配置资料。</p><span aria-live="polite">{visibleProducts.length} 个产品</span></div>
              <div className={styles.filterBar}><div className={styles.filterButtons} role="group" aria-label="筛选产品类别">{[{id: 'all', title: '全部推荐'}, ...productCategories].map(category => <button key={category.id} className={activeCategory === category.id ? styles.activeFilter : ''} type="button" aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>{category.title}</button>)}</div>{selectedCategory && <Link className={styles.textLink} to={`${docsBase}${selectedCategory.slug}/`}>查看分类文档<Arrow /></Link>}</div>
              <div className={styles.productGrid}>{visibleProducts.map(product => <Link key={product.slug} className={styles.productCard} to={`${docsBase}${product.slug}/`}><div className={styles.productImage}><img src={`${imageBase}${product.image}`} alt={`FYSETC ${product.title}`} loading="lazy" /></div><div className={styles.productBody}><span className={styles.productCategory}>{categories.find(category => category.id === product.category).title}</span><h3>{product.title}</h3><p>{product.description}</p><Arrow className={styles.productArrow}/></div></Link>)}</div>
            </div>

            <div id="panel-guides" className={styles.panel} role="tabpanel" aria-labelledby="tab-guides" hidden={activeTab !== 'guides'} tabIndex={0}>
              <div className={styles.panelIntro}><p>按任务查找接线、通信和固件配置说明。</p><Link className={styles.textLink} to={`${docsBase}publish-verification-test/`}>发布验证<Arrow /></Link></div>
              <div className={styles.guideGrid}>{guides.map(guide => <Link key={guide.slug} className={styles.guideCard} to={`${docsBase}${guide.slug}/`}><span className={styles.guideIcon}><Icon kind={guide.icon}/></span><span className={styles.guideTag}>{guide.tag}</span><h3>{guide.title}</h3><p>{guide.description}</p><span className={styles.guideLink}>查看指南<Arrow /></span></Link>)}</div>
            </div>
          </section>

          <section className={styles.resourcesSection} aria-labelledby="resources-title"><h2 id="resources-title">更多文档资源</h2><div className={styles.resourceGrid}>{resources.map(resource => <Link className={styles.resourceCard} key={resource.slug} to={`${docsBase}${resource.slug}/`}><Icon kind={resource.icon}/><div><h3>{resource.title}</h3><p>{resource.description}</p></div><Arrow className={styles.resourceArrow}/></Link>)}</div></section>
        </div>
      </main>
    </Layout>
  );
}
