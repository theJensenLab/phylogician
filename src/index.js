/* eslint-env browser */
'use strict'

require('./style.css')
require('../node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css')
require('../node_modules/bootstrap/dist/js/bootstrap.min.js')
require('../node_modules/bootstrap/dist/css/bootstrap.min.css')
require('./controlBar.js')
require('./tooltips.js')

let treeBox = document.createElement('div')
treeBox.id = 'treeBox'
document.body.appendChild(treeBox)
