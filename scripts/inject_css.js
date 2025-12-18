// scripts/inject_css.js
hexo.extend.injector.register('head_end', `
  <link rel="stylesheet" href="/css/custom.css" />
`);