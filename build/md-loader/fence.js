/*
 * @Description:
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-06-29 13:45:48
 * @LastEditors: your name
 * @LastEditTime: 2022-05-23 21:53:27
 */
// 覆盖默认的 fence 渲染策略,fence处理代码块
module.exports = md => {
  const defaultRender = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    // 判断该 fence 是否在 :::demo 内
    const prevToken = tokens[idx - 1];
    const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/);
    if (token.info === 'html' && isInDemoContainer) {
      // html的加上高亮标签,展开的源码
      return `<template slot="highlight"><pre v-pre><code class="html">${md.utils.escapeHtml(token.content)}</code></pre></template>`;
    }
    return defaultRender(tokens, idx, options, env, self);
  };
};
