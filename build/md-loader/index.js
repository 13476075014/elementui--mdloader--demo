/*
 * @Description:
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-06-29 13:45:48
 * @LastEditors: your name
 * @LastEditTime: 2022-06-08 19:30:55
 */
const {
  stripScript,
  stripTemplate,
  genInlineComponentText
} = require('./util'); // 提取script内容和纯内容部分，以及拼接好模板的方法
const md = require('./config'); // 暴露出已经处理好markdownit插件的md

module.exports = function(source) {
  const content = md.render(source);
  // md插件对里面的内容放到了<!--element-demo里
  const startTag = '<!--element-demo:';
  const startTagLen = startTag.length;
  const endTag = ':element-demo-->';
  const endTagLen = endTag.length;

  let componenetsString = '';
  let id = 0; // demo 的 id
  let output = []; // 输出的内容
  let start = 0; // 字符串开始位置

  let commentStart = content.indexOf(startTag); // html开始的下标值
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen); // html结束的位置，从开始的标识结束的后面计算
  // 循环处理html的内容，必须是有开始和结尾标识的
  while (commentStart !== -1 && commentEnd !== -1) {
    output.push(content.slice(start, commentStart)); // 拿到前面非html内容的描述等文字部分

    const commentContent = content.slice(commentStart + startTagLen, commentEnd); // 拿到除去前后标识的html内容部分
    const html = stripTemplate(commentContent); // 拿到非script和style的内容部分
    const script = stripScript(commentContent); // 拿到script部分
    let demoComponentContent = genInlineComponentText(html, script); // 把md提取的内容拼接成vue的template编译的js
    const demoComponentName = `element-demo${id}`;
    output.push(`<template slot="source"><${demoComponentName} /></template>`); // 把内容放到demo-block的source的slot中
    componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`; // 把处理好的template都作为组件放到components里

    // 重新计算下一次的位置
    id++;
    start = commentEnd + endTagLen;
    commentStart = content.indexOf(startTag, start);
    commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  }

  // 仅允许在 demo 不存在时，才可以在 Markdown 中写 script 标签
  // todo: 优化这段逻辑
  let pageScript = '';
  if (componenetsString) {
    pageScript = `<script>
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        }
      }
    </script>`;
  } else if (content.indexOf('<script>') === 0) { // 硬编码，有待改善
    start = content.indexOf('</script>') + '</script>'.length;
    pageScript = content.slice(0, start);
  }

  output.push(content.slice(start));
  return `
    <template>
      <section class="content element-doc">
        ${output.join('')}
      </section>
    </template>
    ${pageScript}
  `;
};
