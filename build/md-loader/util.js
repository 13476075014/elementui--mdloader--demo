/*
 * @Description:
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-06-29 13:45:48
 * @LastEditors: your name
 * @LastEditTime: 2021-11-29 16:35:20
 */
const { compileTemplate } = require('@vue/component-compiler-utils'); // 用来编译 Vue 单文件组件的底层实用工具  https://gitee.com/mirrors_vuejs/vue-docs-zh-cn/blob/master/vue-component-compiler-utils/README.md
const compiler = require('vue-template-compiler');// 上面的工具在实际的编译器 (vue-template-compiler) 必须通过 compiler 选项被传入，这样具体的版本号就可以被最终用户指定

// 拿到script标签里面的内容
function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/); // ([\s\S]+) 这个匹配所有字符，\s---表示，只要出现空白就匹配;\S---表示，非空白就匹配；\1匹配前面第一个匹配上的规则script
  return result && result[2] ? result[2].trim() : '';
}

// 拿到style标签里面的内容
function stripStyle(content) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
function stripTemplate(content) {
  content = content.trim();
  if (!content) {
    return content;
  }
  // [\s\S] 匹配所有字符，下面就是去掉所有的script|style这些标签和里面的内容
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim();
}

function pad(source) {
  return source
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n');
}

function genInlineComponentText(template, script) {
  // https://github.com/vuejs/vue-loader/blob/423b8341ab368c2117931e909e2da9af74503635/lib/loaders/templateLoader.js#L46
  const finalOptions = {
    source: `<div>${template}</div>`,
    filename: 'inline-component', // TODO：这里有待调整
    compiler
  };
  const compiled = compileTemplate(finalOptions);
  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      console.warn(tip);
    });
  }
  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n` +
        compiled.errors.map(e => `  - ${e}`).join('\n') +
        '\n'
    );
  }
  // 编译后的最后内容部分
  let demoComponentContent = `
    ${compiled.code}
  `;
  // todo: 这里采用了硬编码有待改进
  script = script.trim();
  if (script) {
    script = script.replace(/export\s+default/, 'const democomponentExport =');
  } else {
    script = 'const democomponentExport = {}';
  }
  demoComponentContent = `(function() {
    ${demoComponentContent}
    ${script}
    return {
      render,
      staticRenderFns,
      ...democomponentExport
    }
  })()`;
  return demoComponentContent;
}

module.exports = {
  stripScript,
  stripStyle,
  stripTemplate,
  genInlineComponentText
};
