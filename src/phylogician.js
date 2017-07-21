/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick'),
	treeLayout = require('./treelayout.js'),
	utils = require('./utils.js')

let tree = tntTree()
let expandedNode = tntTree.node_display.circle()
let collapsedNode = tntTree.node_display.triangle()
let fontSizeOfTreeLeafs = 12
let nodeSize = 3
let nodeDisplay = tree.node_display()
	.size(nodeSize)
	.fill('black')
	.display(function(node) {
		if (node.is_collapsed())
			collapsedNode.display().call(this, node)
		else
			expandedNode.display().call(this, node)
	})
let storedTree = ''

exports.makeTree = function(newickString) {
	if (document.getElementsByClassName('tnt_groupDiv').length !== 0) {
		let existingTree = document.getElementsByClassName('tnt_groupDiv')[0]
		document.getElementById('treeBox').removeChild(existingTree)
	}

	let treeBox = document.getElementById('treeBox')

	let treeObj = parser.parse_newick(newickString),
		numOfLeaves = utils.countLeaves(treeObj)

	tree
		.data(treeObj)
		.node_display(nodeDisplay)
		.label(tntTree.label
			.text()
			.fontsize(fontSizeOfTreeLeafs)
			.height(window.innerHeight * 0.95 / (numOfLeaves + 2))
		)
		.layout(tntTree.layout.vertical()
			.width(window.innerWidth * 0.85)
			.scale(false)
		)
	tree(treeBox)

	let svgTree = d3.select('#treeBox').select('svg')

	svgTree.call(d3.zoom()
		.scaleExtent([0.1, 10])
		.on('zoom', function() {
			svgTree.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')')
		})
	)
	storedTree = tree
}

exports.updateVertical = function() {
	treeLayout.updateVertical(tree)
}

exports.updateRadial = function() {
	treeLayout.updateRadial(tree)
}

exports.fitScreen = function() {
}

function download() {
	let pngExporter = tnt.utils.png()
		.filename('treeSample.png')
	pngExporter(d3.select('svg'))
}

tree.on('click', function(node) {
	node.toggle()
	tree.update()
})

// module.exports = 'phylogician'
