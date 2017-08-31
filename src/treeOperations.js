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

exports.changeBranchColor = function(newColor, nodeID, numChildren) {
	for (let x = nodeID + 1; x <= nodeID + numChildren; x++) {
		let id = '#tnt_tree_link_treeBox_' + x
		let branch = d3.select(id)
		branch.attr('style', 'stroke: ' + newColor.color)
	}
	/* let branches = d3.select('.links')
		.selectAll('path')
	branches.attr('style', 'stroke: ' + newColor.color) */
}

exports.changeBranchWidth = function(width) {
	let branches = d3.select('.links')
		.selectAll('path')
	branches.attr('stroke-width', width)
}

exports.toggleNode = function(tree, node) {
	node.toggle()
	tree.update()
}
