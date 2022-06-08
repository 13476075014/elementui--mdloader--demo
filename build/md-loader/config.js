/*
 * @Description:
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-06-29 13:45:48
 * @LastEditors: your name
 * @LastEditTime: 2022-05-30 19:55:13
 */
const Config = require('markdown-it-chain'); // 支持链式调用 markdown-it
const anchorPlugin = require('markdown-it-anchor'); // 配置标题目录跳转的插件
const slugify = require('transliteration').slugify; // 把中文翻译成拼音的插件
const containers = require('./containers'); // 内容块容器化处理插件
const overWriteFenceRule = require('./fence'); //修改默认的fence规则的渲染函数，加上展开的源码的部分

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

  .plugin('containers').use(containers).end(); // 主要是这个插件里处理md里写的elementui组件的渲染的代码

const md = config.toMd();
overWriteFenceRule(md);

module.exports = md;
