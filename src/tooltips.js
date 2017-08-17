/* eslint-env browser */
'use strict'

let d3 = require('d3')
let $ = require('jquery')
let phylogician = require('./phylogician.js')
let tntTree = require('tnt.tree')

let tooltip = d3.select('body').append('div')
	.attri('id', 'tooltip1')
	.attr('class', 'tooltip')
	.style('display', 'none')
	.style('left', (d3.event.pageX + 30) + 'px')
	.style('top', (d3.event.pageY + 30) + 'px')

tntTree.on('mouseover', function(node) {
	if (document.getElementById('tooltip1').style.display === 'none') {
		tooltip.style('display', 'block')
		console.log('Tooltip display is now set as "block"')
	}
	else {
		tooltip.style('display', 'none')
	}
	// can add html here or append
})
