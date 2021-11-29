/*
 * @Description:
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-06-29 13:45:48
 * @LastEditors: your name
 * @LastEditTime: 2021-07-08 15:43:21
 */
const Config = require('markdown-it-chain'); // 支持链式调用 markdown-it
const anchorPlugin = require('markdown-it-anchor'); // 配置标题目录跳转的插件
const slugify = require('transliteration').slugify; // 把中文翻译成拼音的插件
const containers = require('./containers');
const overWriteFenceRule = require('./fence');

const config = new Config();

config
  .options.html(true).end()

  .plugin('anchor').use(anchorPlugin, [
    {
      level: 2,
      slugify: slugify,
      permalink: true,
      permalinkBefore: true
    }
  ]).end()

  .plugin('containers').use(containers).end();

const md = config.toMd();
overWriteFenceRule(md);

module.exports = md;
