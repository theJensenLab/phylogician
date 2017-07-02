/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

require('./style.css')
require('../node_modules/bootstrap/dist/js/bootstrap.min.js')
require('../node_modules/bootstrap/dist/css/bootstrap.min.css')
require('./controlBar.js')

let treeBox = document.createElement('div')
treeBox.id = 'treeBox'
document.body.appendChild(treeBox)


//let	inputForm = maindiv.appendChild(division('fileInput', 'Input your tree as Newick text or upload a file:')),

