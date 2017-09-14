/* eslint-env browser */
'use strict'

let	d3 = require('d3'),
	tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

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

function getTheOtherBranch(tree, node) {
	let nodeParent = node.parent()
	let otherBranches = ''
	if (nodeParent) {
		let childrenOfNodeParent = nodeParent.children()
		childrenOfNodeParent.forEach(function(child) {
			if (child.data() !== node.data())
				otherBranches = child.subtree(child.get_all_leaves())
		})
	}
	return otherBranches
}

exports.reroot = function(tree, node) {
	let newTree = tntTree()

	let subTree1 = node.subtree(node.get_all_leaves())
	let subTree2 = getTheOtherBranch(tree, node)

	newTree.data(tree.root().data())
	console.log(subTree1.data())
	console.log(subTree2.data())
	newTree.root().property('children', [subTree1.data(), subTree2.data()])
	console.log(newTree.data())
	tree.data(newTree.data())
	tree.update()
}
