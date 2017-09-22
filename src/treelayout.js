/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick'),
	currentState = 'vertical',
	scaled = false

exports.updateVertical = function(tree) {
	tree.layout(tntTree.layout.vertical().width(window.innerWidth * 0.85)
		.scale(false))
	currentState = 'vertical'
	tree.update()
}

exports.updateRadial = function(tree) {
	tree.layout(tntTree.layout.radial().width(Math.min(window.innerWidth * 0.85, window.innerHeight * 0.85))
		.scale(false))
	currentState = 'radial'
	tree.update()
}

exports.updateScale = function(tree) {
	let textUpdate = d3.select('.scalingOption')
	if (currentState === 'vertical' && scaled === false) {
		tree.layout(tntTree.layout.vertical().width(window.innerWidth * 0.85)
			.scale(true))
		tree.update()
		scaled = true
		textUpdate.text('Turn Off Scaling')
	}
	else if (currentState === 'radial' && scaled === false) {
		tree.layout(tntTree.layout.radial().width(Math.min(window.innerWidth * 0.85, window.innerHeight * 0.85))
			.scale(true))
		tree.update()
		scaled = true
		textUpdate.text('Turn Off Scaling')
	}
	else if (currentState === 'vertical' && scaled === true) {
		tree.layout(tntTree.layout.vertical().width(window.innerWidth * 0.85)
			.scale(false))
		tree.update()
		scaled = false
		textUpdate.text('Turn On Scaling')
	}
	else {
		tree.layout(tntTree.layout.radial().width(Math.min(window.innerWidth * 0.85, window.innerHeight * 0.85))
			.scale(false))
		tree.update()
		scaled = false
		textUpdate.text('Turn On Scaling')
	}
}

exports.checkScaled = function() {
	return scaled
}
