/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

exports.updateVertical = function(tree) {
	tree.layout(tntTree.layout.vertical().width(window.innerWidth * 0.85)
		.scale(false))
	tree.update()
}

exports.updateRadial = function(tree) {
	tree.layout(tntTree.layout.radial().width(Math.min(window.innerWidth * 0.85, window.innerHeight * 0.85))
		.scale(false))
	tree.update()
}
