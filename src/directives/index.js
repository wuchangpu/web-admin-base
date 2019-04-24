const files = require.context('./', true, /\.js$/)
let directives = {};
files.keys().map(item => {
  let name = item.replace(/\.\/(\w+)\.js/g, '$1')
  directives[name] = require(`${item}`).default;
})
export default directives