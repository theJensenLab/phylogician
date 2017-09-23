/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tnt = require('tnt.utils'),
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

// creates the tree and renders it to the div 'treeBox'
exports.makeTree = function(newickString) {
	if (document.getElementsByClassName('tnt_groupDiv').length !== 0) {
		let existingTree = document.getElementsByClassName('tnt_groupDiv')[0]
		document.getElementById('treeBox').removeChild(existingTree)
	}

	let backDrop = d3.select('#backDrop')
	backDrop.attr('display', 'none')
	let startTitle = d3.select('#startTitle')
	startTitle.attr('display', 'none')
	// necessary so that the backdrop + startTitle div is gone once tree is created

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
	let childrenArray = tree.root().get_all_nodes()
	for (let i = 0; i < childrenArray.length; i++) {
		if (!(childrenArray[i].property('branchWidth')))
			childrenArray[i].property('branchWidth', 1)
		if (!(childrenArray[i].property('branchColor')))
			childrenArray[i].property('branchColor', 'black')
		if (!(childrenArray[i].property('certaintyOnOff')))
			childrenArray[i].property('certaintyOnOff', 'off')
	}

	let svgTree = d3.select('#treeBox').select('svg'),
		g = svgTree.select('g')

	svgTree.call(d3.zoom()
		.on('zoom', () => {
			g.attr('transform', d3.event.transform)
		})
	)
	treeOperations.updateUserChanges(tree)
}

// resets the zoom and transform of tree to original
exports.fitScreen = function() {
	let svgTree = d3.select('#treeBox').select('svg'),
		g = svgTree.select('g')

	svgTree.call(d3.zoom().transform, d3.zoomIdentity)
	g.attr('transform', {k: 1, x: 0, y: 0})
}

// calls the function to update the layout of the tree to vertical view
exports.updateVertical = function() {
	treeLayout.updateVertical(tree)
}

// calls the function to update the layout of the tree to radial view
exports.updateRadial = function() {
	treeLayout.updateRadial(tree)
}

// calls the function to toggle support values displayed at individual nodes
exports.toggleSupport = function() {
	treeOperations.toggleSupport()
}

// calls the function to toggle scaling of the tree
exports.scaleTree = function() {
	treeLayout.updateScale(tree)
}

// returns whether or not the tree is currently scaled
exports.checkScaled = function() {
	return treeLayout.checkScaled()
}

// calls the function to change the branch color of the subtree of the node #[nodeID]
exports.changeBranchColor = function(newColor, selectedNode) {
	treeOperations.changeBranchColor(newColor, selectedNode)
}

// calls the function to change the branch width of the subtree of the node #[nodeID]
exports.changeBranchWidth = function(newWidth, selectedNode) {
	treeOperations.changeBranchWidth(newWidth, selectedNode)
}

// changes the node size for the tree
exports.changeNodeSize = function(size) {
	/* nodeSize = size
	tree.node_display()
		.size(nodeSize)
	tree.update_nodes() */

	let nodes = d3.selectAll('.tnt_tree_node')
		.select('.tnt_node_display_elem')

	nodes.attr('r', size)
	nodes.attr('width', size)
	nodes.attr('height', size)
	nodes.attr('x', -1 * size / 2)
	nodes.attr('y', -1 * size / 2)
	nodes.attr('points', '-' + size + ',0 ' + size + ',-' + size + ' ' + size + ',' + size)
}

// overrides the data in current tree with the passed data
exports.restoreState = function(data) {
	tree.data(JSON.parse(data))
	treeOperations.updateUserChanges(tree)
}

function simpleStringify(object) {
	let simpleObject = {}
	if (object.children) {
		for (let i = 0; i < object.children.length; i++)
			object.children[i] = simpleStringify(object.children[i])
	}
	for (let prop in object) {
		if (!object.hasOwnProperty(prop))
			continue
		if (typeof (object[prop]) == 'object' && prop !== 'children')
			continue
		simpleObject[prop] = object[prop]
	}
	return simpleObject // returns cleaned up JSON
}

// calls the function that export the current state of the svg
exports.exportCurrentState = function() {
	let exportState = tree.root().data()
	exportState = simpleStringify(exportState)
	_exportCurrentState('tree.phy', JSON.stringify(exportState))
	return exportState
}

// function from: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function _exportCurrentState(filename, text) {
	let element = document.createElement('a')
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
	element.setAttribute('download', filename)
	element.style.display = 'none'
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}

// ladderizes the tree and toggles if already ladderized
let ladderized = 'false'
exports.ladderizeTree = function() {
	if (ladderized !== 'true') {
		tree.root().sort(function(node1, node2) {
			return node1.get_all_leaves().length - node2.get_all_leaves().length
		})
		ladderized = 'true'
	}
	else if (ladderized === 'true') {
		tree.root().sort(function(node1, node2) {
			return node2.get_all_leaves().length - node1.get_all_leaves().length
		})
		ladderized = 'false'
	}
	tree.update()
}

// changes the expanded node shape of the tree
exports.changeExpandedNodeShape = function(shape) {
	if (shape === 'none') {
		expandedNode = tntTree.node_display.circle()
		tree.update()
		let allNodes = d3.selectAll('.tnt_tree_node')
			.select('.tnt_node_display_elem')

		allNodes.attr('r', '0')
	}
	else if (shape === 'circle') {
		expandedNode = tntTree.node_display.circle()
		tree.node_display(nodeDisplay)
		tree.update_nodes()
	}
	else if (shape === 'triangle') {
		expandedNode = tntTree.node_display.triangle()
		tree.node_display(nodeDisplay)
		tree.update_nodes()
	}
	else if (shape === 'square') {
		expandedNode = tntTree.node_display.square()
		tree.node_display(nodeDisplay)
		tree.update_nodes()
	}	
}

// changes the collapsed node shape of the tree -- TO BE COMPLETED
exports.changeCollapsedNodeShape = function(shape) {
	if (shape === 'circle') {
		collapsedNode = tntTree.node_display.circle()
	}
	else if (shape === 'triangle') {
		collapsedNode = tntTree.node_display.triangle()
	}
	else if (shape === 'square') {
		collapsedNode = tntTree.node_display.square()
	}
	tree.node_display(nodeDisplay)
	tree.update_nodes()
}


// installs a listener at each node that displays a tooltip upon click
tree.on('click', function(node) {
	// resets color of all nodes to black
	d3.selectAll('.tnt_tree_node')
		.selectAll('.tnt_node_display_elem')
		.attr('fill', 'black')

	// generates tooltip for selected node
	tntTooltip.table(tree, node)
		.width(120)
		.call(this, {
			// header: 'Node #' + node.id() + ' :: ' + node.property('name')
			header: 'Node: ' + node.property('name')
		})
})

// module.exports = 'phylogician'
