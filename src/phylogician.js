/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

let tree = tntTree()
let numCommas = 0
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
	console.log(document.getElementsByClassName('tnt_groupDiv'))
	if (document.getElementsByClassName('tnt_groupDiv').length !== 0) {
		let existingTree = document.getElementsByClassName('tnt_groupDiv')[0]
		document.getElementById('treeBox').removeChild(existingTree)
	}

	let treeBox = document.getElementById('treeBox')
	numCommas = 0
	for (let x = 0; x < newickString.length; x++) {
		if (newickString.charAt(x) === ',')
			numCommas++
	}

	tree
		.data(parser.parse_newick(newickString))
		.node_display(nodeDisplay)
		.label(tntTree.label
			.text()
			.fontsize(fontSizeOfTreeLeafs)
			.height(window.innerHeight * 0.69 / (numCommas + 1))
		)
		.layout(tntTree.layout.vertical()
			.width(window.innerWidth * 0.58)
			.scale(false)
		)
	tree(treeBox)
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

function updateVertical() {
	tree.layout(tree.layout.vertical().width(window.innerWidth * 0.58)
		.scale(false))
	tree.update()
}

function updateRadial() {
	tree.layout(tree.layout.radial().width(Math.min(window.innerWidth * 0.58, window.innerHeight * 0.58))
		.scale(false))
	tree.update()
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
			.height(window.innerHeight * 0.69/(numCommas + 1))
		)
		.layout(tree.layout.vertical().width(window.innerWidth * 0.58).scale(false))
	tree.update()
}

tree.on('click', function(node) {
	node.toggle()
	tree.update()
})

// module.exports = 'phylogician'
