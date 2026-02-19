import template from './src/main.pug'
import data from './src/data.js'

let html = template({data:data})
document.querySelector('body').innerHTML = html