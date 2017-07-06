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
}

exports.updateVertical = function() {
	treeLayout.updateVertical(tree)
}

exports.updateRadial = function() {
	treeLayout.updateRadial(tree)
}

function submitFile() {
	document.getElementById('errorspot').innerHTML = ''
	let fileInput = document.getElementById('fileInput')
	console.log(fileInput.files[0])
	let newick = ''

	let file = fileInput.files[0]
	let reader = new FileReader()

	reader.onload = function(e) {
		newick = reader.result
		makeTree(newick)
	}
	reader.readAsText(file)
}

function download() {
	let pngExporter = tnt.utils.png()
		.filename('treeSample.png')
	pngExporter(d3.select('svg'))
}

function fitscreen() {
	tree.node_display(nodeDisplay)
		.label(tree.label.text()
			.fontsize(fontSizeOfTreeLeafs)
			.height(window.innerHeight * 0.95/(numCommas + 2))
		)
		.layout(tree.layout.vertical().width(window.innerWidth * 0.85).scale(false))
	tree.update()
}

tree.on('click', function(node) {
	node.toggle()
	tree.update()
})

// module.exports = 'phylogician'
