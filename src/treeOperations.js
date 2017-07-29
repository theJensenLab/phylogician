/* eslint-env browser */
'use strict'

let	d3 = require('d3')

exports.toggleSupport = function() {
	let text = d3.select('.nodes')
		.selectAll('.inner')
		.select('text')
	if (text.attr('display') === 'none')
		text.attr('display', 'block')
	else
		text.attr('display', 'none')
}

exports.changeBranchColor = function() {
	let branches = d3.select('.links')
		.selectAll('path')
	if (branches.attr('style') === 'stroke: black')
		branches.attr('style', 'stroke: red')
	else
		branches.attr('style', 'stroke: black')
}

exports.changeBranchWidth = function(width) {
	let branches = d3.select('.links')
		.selectAll('path')
	branches.attr('stroke-width', width)
}
