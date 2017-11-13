/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tnt = require('tnt.utils'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick'),
	treeLayout = require('./treeLayout.js'),
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
	backDrop.remove()
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
			childrenArray[i].property('branchWidth', 3)
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

exports.fitScreen = function() {
	/* Resets the zoom and transform properties of the "treeBox" div to its original state.

	Args:
	(none)

	Returns:
	(none)
	
	*/
	let svgTree = d3.select('#treeBox').select('svg'),
		g = svgTree.select('g')

	svgTree.call(d3.zoom().transform, d3.zoomIdentity)
	g.attr('transform', {k: 1, x: 0, y: 0})
}

function updateVertical() {
	/* Calls the function in treeLayout.js that updates the layout of the tree to vertical view.

	Args:
	(none)

	Returns:
	(none)
	
	*/
	treeLayout.updateVertical(tree)
	treeOperations.updateUserChanges(tree)
}

function updateRadial() {
	/* Calls the function in treeLayout.js that updates the layout of the tree to radial view.

	Args:
	(none)

	Returns:
	(none)
	
	*/
	treeLayout.updateRadial(tree)
	treeOperations.updateUserChanges(tree)
}

/**
 * Calls the function in treeOperations.js that toggles on/off the opacity of branches based on support values.
 * 
 */
function toggleSupport() {
	treeOperations.toggleSupport()
}

/**
 * Calls the function in treeLayout.js that toggles on/off the scaling of the SVG tree.
 * 
 */
function scaleTree() {
	treeLayout.updateScale(tree)
}

/*
 * Checks if the tree is currently scaled.
 * 
 * @returns True if tree is scaled, otherwise False
 */
function checkScaled() {
	return treeLayout.checkScaled()
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
function restoreState(data) {
	tree.data(JSON.parse(data))
	treeOperations.updateUserChanges(tree)
}

// calls the function that export the current state of the svg
function getCurrentState() {
	let exportState = tree.root().data()
	exportState = utils.simpleStringify(exportState)
	exportFile('tree.phy', JSON.stringify(exportState))
	return exportState
}

/**
 * Creates a file with the given filename and desired text, and exports it locally.
 * Source: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
 * 
 * @param {any} filename The desired filename of the export.
 * @param {any} text The desired contents of the file (in our case, a stringified JSON).
 */
function exportFile(filename, text) {
	let element = document.createElement('a')
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
	element.setAttribute('download', filename)
	element.style.display = 'none'
	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
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

/**
 * Changes the collapsed node shape of the tree (circle, triangle, or square).
 * 
 * @param {any} shape Should be 'circle', 'triangle', or 'square', as desired.
 */
function changeCollapsedNodeShape(shape) {
	if (shape === 'circle')
		collapsedNode = tntTree.node_display.circle()
	else if (shape === 'triangle')
		collapsedNode = tntTree.node_display.triangle()
	else if (shape === 'square')
		collapsedNode = tntTree.node_display.square()
	tree.node_display(nodeDisplay)
	tree.update_nodes()
}

// Installs a listener at each node that displays a tooltip upon click.
tree.on('click', function(node) {
	// Resets color of all nodes to black.
	d3.selectAll('.tnt_tree_node')
		.selectAll('.tnt_node_display_elem')
		.attr('fill', 'black')

	// Generates a tooltip for selected node.
	tntTooltip.table(tree, node)
		.width(120)
		.call(this, {
			// header: 'Node #' + node.id() + ' :: ' + node.property('name')
			header: 'Node: ' + node.property('_id')
		})
})

// module.exports = 'phylogician'

// Deals with tree layout:
exports.updateRadial = updateRadial
exports.updateVertical = updateVertical

// Deals with custom tree operations:
exports.toggleSupport = toggleSupport
exports.scaleTree = scaleTree
exports.changeCollapsedNodeShape = changeCollapsedNodeShape

// Deals with importing/exporting states:
exports.restoreState = restoreState
exports.getCurrentState = getCurrentState

// Miscellaneous:
exports.checkScaled = checkScaled
