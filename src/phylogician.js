/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick'),
	treeLayout = require('./treelayout.js'),
	utils = require('./utils.js'),
	treeOperations = require('./treeOperations.js'),
	tntTooltip = require('./tnt_tooltip.js')

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
			.height(window.innerHeight / (numOfLeaves + 4))
		)
		.layout(tntTree.layout.vertical()
			.width(window.innerWidth)
			.scale(false)
		)
	tree(treeBox)

	let svgTree = d3.select('#treeBox').select('svg'),
		g = svgTree.select('g')

	svgTree.call(d3.zoom()
		.on('zoom', () => {
			g.attr('transform', d3.event.transform)
		})
	)
}

exports.fitScreen = function() {
	let svgTree = d3.select('#treeBox').select('svg'),
		g = svgTree.select('g')

	svgTree.call(d3.zoom().transform, d3.zoomIdentity)
	g.attr('transform', {k: 1, x: 0, y: 0})
}

exports.updateVertical = function() {
	treeLayout.updateVertical(tree)
}

exports.updateRadial = function() {
	treeLayout.updateRadial(tree)
}

exports.toggleSupport = function() {
	treeOperations.toggleSupport()
}

exports.changeBranchColor = function(e) {
	treeOperations.changeBranchColor(e)
}

exports.changeBranchWidth = function(e) {
	treeOperations.changeBranchWidth(e)
}

function download() {
	let pngExporter = tnt.utils.png()
		.filename('treeSample.png')
	pngExporter(d3.select('svg'))
}

tree.on('click', function(node) {
	//node.toggle()
	//tree.update()
	tntTooltip.table()
		.width(120)
		.call(this, {
			"header" : "Node",
			"rows" : [
				{"label": "ID", "value": node.id()}
			]
		})
})

// module.exports = 'phylogician'
