/* eslint-env browser */
'use strict'

let d3 = require('d3')
let $ = require('jquery')
let phylogician = require('./phylogician.js')
let tntTree = require('tnt.tree')

tntTree.on('mouseover', function(node) {
	tooltip.style('display', 'block')
	//can add html here or append
})

let tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('display', 'none')
	.style('left', (d3.event.pageX + 30) + 'px')
	.style('top', (d3.event.pageY + 30) + 'px')