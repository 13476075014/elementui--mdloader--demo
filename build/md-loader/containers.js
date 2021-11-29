/*
 * @Description:
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-06-29 13:45:48
 * @LastEditors: your name
 * @LastEditTime: 2021-11-29 16:41:28
 */
const mdContainer = require('markdown-it-container'); // 识别 markdown的:::转换成div

module.exports = md => {
  // 用在markdown-it里，识别 ::: demo
  md.use(mdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/); // *是匹配0次以上
    },
    /**
     * tokens 符合上面规则的所有内容
     * idx 某一条的id
     */
    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : ''; // 紧跟在demo后面的描述的内容
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''; // html的匹配内容
        // 返回把内容放到已经写好的组件demo-block里；把html的内容放到!--element-demo里，偏于后面处理抽取
        // demo-block组件已经是在entry.js里作为全局组件注册过了可以直接使用
        return `<demo-block>
        ${description ? `<div>${md.render(description)}</div>` : ''}
        <!--element-demo: ${content}:element-demo-->
        `;
      }
      return '</demo-block>';
    }
  });

  md.use(mdContainer, 'tip');
  md.use(mdContainer, 'warning');
};
