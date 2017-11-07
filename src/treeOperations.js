/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

let utils = require('./utils.js'),
	reroot = require('./reroot.js')

/**
 * Modifies the 'branchColor' property of all branches in the subtree of a given node to a given color.
 * 
 * @param {any} newColor - Desired color of the subtree's branches.
 * @param {any} selectedNode - The root node of the subtree.
 */
function changeBranchColorProperty(newColor, selectedNode) {
	let childrenArray = selectedNode.get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++)
		childrenArray[x].property('branchColor', '' + newColor.color)
}

/**
 * Modifies the 'branchWidth' property of all nodes in the subtree of a given node to a given width.
 * 
 * @param {any} width - Desired branch width of subtree.
 * @param {any} selectedNode - The root node of the subtree.
 */
function changeBranchWidthProperty(width, selectedNode) {
	let childrenArray = selectedNode.get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++)
		childrenArray[x].property('branchWidth', Math.abs(width))
}

// changes each individual branch opacity based on transparency support value by id starting from the node in question and taking into account numChildren
let toggledCertainty = 'false'
function changeCertaintyProperty(selectedNode) {
	let childrenArray = selectedNode.get_all_nodes()
	if (toggledCertainty !== 'true') {
		for (let x = 1; x < childrenArray.length; x++) {
			let branchID = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
			let nodeID = '#tnt_tree_node_treeBox_' + childrenArray[x].id()
			let certainty = d3.select(nodeID)
				.select('text')
				.html()
			let opacity = certainty / 100 // converts certainty into decimal since opacity must be from 0 to 1
			let branch = d3.select(branchID)
			branch.attr('opacity', opacity)
			childrenArray[x].property('certaintyOnOff', opacity)
		}
		toggledCertainty = 'true'
	}
	else if (toggledCertainty === 'true') {
		for (let x = 1; x < childrenArray.length; x++) {
			childrenArray[x].property('certaintyOnOff', 'off')
			let branchID = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
			let branch = d3.select(branchID)
			branch.attr('opacity', 1)
		}
		toggledCertainty = 'false'
	}
}

/**
 * Toggles the collapsing/uncollapsing of a given node in the treeObj.
 * 
 * @param {any} node - The node to be collapsed/uncollapsed.
 */
function toggleNode(node) {
	node.toggle()
}

/**
 * Toggles on/off the support values in the tree visualization.
 * 
 */
function toggleSupport() {
	let text = d3.select('.nodes')
		.selectAll('.inner')
		.select('text')
	if (text.attr('display') === 'none')
		text.attr('display', 'block')
	else
		text.attr('display', 'none')
}


let ladderized = 'false'
/**
 * Ladderizes a specified subtree. If already ladderized, then reverses the direction of ladderization.
 * 
 * @param {any} node - The root node of the subtree.
 */
function ladderizeSubtree(node) {
	if (ladderized !== 'true') {
		node.sort(function(node1, node2) {
			return node1.get_all_leaves().length - node2.get_all_leaves().length
		})
		ladderized = 'true'
	}
	else if (ladderized === 'true') {
		node.sort(function(node1, node2) {
			return node2.get_all_leaves().length - node1.get_all_leaves().length
		})
		ladderized = 'false'
	}
}

/**
 * Re-roots the tree by setting the passed node as the new root.
 * 
 * @param {any} tree - Tree that will be re-rooted
 * @param {any} node - Node that will be the new root.
 */
function rerootTree(tree, node) {
	let newRoot = reroot.newRoot(tree, node)
	tree.data(newRoot.data())
}

/**
 * Updates the branch color of every branch in a given tree based on its 'branchColor' property.
 * 
 * @param {any} tree - A TNT treeObj
 */
function updateBranchColor(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('style', 'stroke: ' + childrenArray[x].property('branchColor'))
	}
}

/**
 * Updates the branch width of every branch in a given tree based on its 'branchWidth' property.
 * 
 * @param {any} tree - A TNT treeObj
 */
function updateBranchWidth(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('stroke-width', childrenArray[x].property('branchWidth'))
	}
}

/**
 * Updates the branch opacity of every branch in a given tree based on its 'certaintyOnOff' property.
 * 
 * @param {any} tree - A TNT treeObj
 */
function updateCertainty(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('opacity', childrenArray[x].property('certaintyOnOff'))
	}
}

/**
 * Custom update function that first uses TNT's update, then also updates the SVG based on the following properties:
	'branchColor,' 'branchWidth,' and 'certaintyOnOff.'
 * 
 * @param {any} tree - A TNT treeObj
 */
function updateUserChanges(tree) {
	tree.update()
	updateBranchColor(tree)
	updateBranchWidth(tree)
	updateCertainty(tree)
}

// Exporting the following functions to be accessible globally:
exports.changeBranchColorProperty = changeBranchColorProperty
exports.changeBranchWidthProperty = changeBranchWidthProperty
exports.changeCertaintyProperty = changeCertaintyProperty
exports.toggleNode = toggleNode
exports.toggleSupport = toggleSupport
exports.ladderizeSubtree = ladderizeSubtree
exports.rerootTree = rerootTree
exports.updateUserChanges = updateUserChanges


