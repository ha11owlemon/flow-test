// Preserve source HTML and make its static image URLs work on GitHub project Pages.
module.exports = function documentHtml({baseUrl = '/'} = {}) {
  return function transform(tree) {
    function visit(node) {
      if (node.type === 'element') {
        if (node.tagName === 'p' && node.children?.some(child => child.tagName === 'driver-calculator')) node.tagName = 'div';
        if (node.tagName === 'span' && node.properties?.id) node.tagName = 'legacy-anchor';
        const properties = node.properties || {};
        if (typeof properties.src === 'string' && properties.src.startsWith('/images/')) {
          properties.src = baseUrl.replace(/\/$/, '') + properties.src;
        }
        for (const key of Object.keys(properties)) {
          if (/^on/i.test(key)) delete properties[key];
        }
        if (node.tagName === 'script') {
          node.tagName = 'span';
          node.children = [];
        }
      }
      for (const child of node.children || []) visit(child);
    }
    visit(tree);
  };
};
