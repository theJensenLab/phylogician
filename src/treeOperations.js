/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

let utils = require('./utils.js'),
	reroot = require('./reroot.js')

exports.toggleSupport = function() {
	let text = d3.select('.nodes')
		.selectAll('.inner')
		.select('text')
	if (text.attr('display') === 'none')
		text.attr('display', 'block')
	else
		text.attr('display', 'none')
}

// changes each individual branch color by id starting from the node in question and taking into account numChildren
function changeBranchColorProperty(newColor, selectedNode) {
	let childrenArray = selectedNode.get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++)
		childrenArray[x].property('branchColor', '' + newColor.color)
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

/**
 * Updates the branch width of every branch in a given tree based on its 'branchWidth' property.
 * 
 * @param {any} tree - A TNT treeObj
 */
function changeBranchWidth(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('stroke-width', childrenArray[x].property('branchWidth'))
	}
}

// changes each individual branch opacity based on transparency support value by id starting from the node in question and taking into account numChildren
let toggledCertainty = 'false'
exports.toggleCertainty = function(selectedNode) {
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

// changes each individual branch opacity in the given subtree by accessing the node property 'certaintyOnOff'
function toggleCertainty(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('opacity', childrenArray[x].property('certaintyOnOff'))
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

// ladderizes a subtree
let ladderized = 'false'
exports.ladderizeSubtree = function(tree, node) {
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
	return tree
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
	changeBranchWidth(tree)
	toggleCertainty(tree)
}

exports.reroot = function(tree, node) {
	let newRoot = reroot.newRoot(tree, node)
	tree.data(newRoot.data())
	updateUserChanges(tree)
}


exports.changeBranchColorProperty = changeBranchColorProperty
exports.changeBranchWidthProperty = changeBranchWidthProperty
exports.updateUserChanges = updateUserChanges
exports.toggleNode = toggleNode

