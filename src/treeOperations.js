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

// changes each individual branch width by id starting from the node in question and taking into account numChildren
exports.changeBranchWidth = function(width, nodeID, numChildren) {
	for (let x = nodeID + 1; x <= nodeID + numChildren; x++) {
		let id = '#tnt_tree_link_treeBox_' + x
		let branch = d3.select(id)
		branch.attr('stroke-width', width)
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
	tree.update()
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
