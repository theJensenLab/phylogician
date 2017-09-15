/* eslint-env browser */
'use strict'

let	d3 = require('d3')

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
exports.changeBranchColor = function(newColor, nodeID, numChildren) {
	for (let x = nodeID + 1; x <= nodeID + numChildren; x++) {
		let id = '#tnt_tree_link_treeBox_' + x
		let branch = d3.select(id)
		branch.attr('style', 'stroke: ' + newColor.color)
	}
}

// changes each individual branch color in the given subtree by accessing the node property "branchColor"
function changeBranchColor(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 0; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + (x + 1)
		let branch = d3.select(id)
		branch.attr('style', 'stroke: ' + childrenArray[x].property('branchColor'))
	}
}

// changes each individual branch width by id starting from the node in question and taking into account length of subtree
exports.changeBranchWidth = function(width, selectedNode) {
	for (let x = selectedNode.id() + 1; x <= selectedNode.id() + selectedNode.get_all_nodes().length - 1; x++) {
		let id = '#tnt_tree_link_treeBox_' + x
		let branch = d3.select(id)
		branch.attr('stroke-width', width)
	}
}

// changes each individual branch width in the given subtree by accessing the node property "branchWidth"
function changeBranchWidth(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 0; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + (x + 1)
		let branch = d3.select(id)
		branch.attr('stroke-width', childrenArray[x].property('branchWidth'))
	}
}

// changes each individual branch opacity based on transparency support value by id starting from the node in question and taking into account numChildren
let toggledCertainty = 'false'
exports.toggleCertainty = function(nodeID, numChildren) {
	if (toggledCertainty !== 'true') {
		for (let x = nodeID + 1; x <= nodeID + numChildren; x++) {
			let branchID = '#tnt_tree_link_treeBox_' + x
			let nodeID = '#tnt_tree_node_treeBox_' + x
			let certainty = d3.select(nodeID)
				.select('text')
				.html()
			let opacity = certainty / 100 // converts certainty into decimal since opacity must be from 0 to 1
			let branch = d3.select(branchID)
			branch.attr('opacity', opacity)
		}
		toggledCertainty = 'true'
	}
	else if (toggledCertainty === 'true') {
		for (let x = nodeID + 1; x <= nodeID + numChildren; x++) {
			let branchID = '#tnt_tree_link_treeBox_' + x
			let branch = d3.select(branchID)
			branch.attr('opacity', 1)
		}
		toggledCertainty = 'false'
	}
}

exports.toggleNode = function(tree, node) {
	node.toggle()
	updateUserChanges(tree)
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
	tree.update()
}

// custom update function that uses the TNT update then also updates the branch color and width based on node properties
function updateUserChanges(tree) {
	tree.update()
	changeBranchColor(tree)
	changeBranchWidth(tree)
}
