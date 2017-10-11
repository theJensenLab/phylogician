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
exports.changeBranchColor = function(newColor, selectedNode) {
	let childrenArray = selectedNode.get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		childrenArray[x].property('branchColor', '' + newColor.color)
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('style', 'stroke: ' + newColor.color)
	}
}

// changes each individual branch color in the given subtree by accessing the node property "branchColor"
function changeBranchColor(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('style', 'stroke: ' + childrenArray[x].property('branchColor'))
	}
}

// changes each individual branch width by id starting from the node in question and taking into account length of subtree
exports.changeBranchWidth = function(width, selectedNode) {
	let childrenArray = selectedNode.get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		childrenArray[x].property('branchWidth', Math.abs(width))
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('stroke-width', width)
	}
}

// changes each individual branch width in the given subtree by accessing the node property "branchWidth"
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

// changes each individual branch opacity in the given subtree by accessing the node property "certaintyOnOff"
function toggleCertainty(tree) {
	let childrenArray = tree.root().get_all_nodes()
	for (let x = 1; x < childrenArray.length; x++) {
		let id = '#tnt_tree_link_treeBox_' + childrenArray[x].id()
		let branch = d3.select(id)
		branch.attr('opacity', childrenArray[x].property('certaintyOnOff'))
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
	return tree
}

// custom update function that uses the TNT update then also updates the branch color and width based on node properties
function updateUserChanges(tree) {
	tree.update()
	changeBranchColor(tree)
	changeBranchWidth(tree)
	toggleCertainty(tree)
}

exports.updateUserChanges = function(tree) {
	let numOfLeaves = utils.countLeaves(tree.root().data()),
		fontSizeOfTreeLeafs = 12
	tree
		.label(tntTree.label
			.text()
			.fontsize(fontSizeOfTreeLeafs)
			.height(window.innerHeight / (numOfLeaves + 4))
		)
	tree.update()
	changeBranchColor(tree)
	changeBranchWidth(tree)
	toggleCertainty(tree)
	d3.selectAll('.tnt_tree_link').on('mouseover', function(link) {
		console.log(link.target.name + ' - ' + link.target.branch_length)
		//console.log(link.target.property('name') + ' - ' + link.target.property('branch_length'))
	})
}

exports.reroot = function(tree, node) {
	let newRoot = reroot.newRoot(tree, node)
	tree.data(newRoot.data())
	updateUserChanges(tree)
}
