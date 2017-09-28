/* eslint-env browser */
'use strict'

let tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

let utils = require('./utils.js'),
	tntExport = require('./tntExport.js')

function getTheOtherBranches(tree, node) {
	let nodeParent = node.parent()
	let newTree = tntTree()
	let otherBranches = ''
	if (nodeParent) {
		newTree.data(nodeParent.data())
		let childrenOfNodeParent = nodeParent.children()
		childrenOfNodeParent.forEach(function(child) {
			if (child.data() !== node.data())
				otherBranches = child.subtree(child.get_all_leaves())
		})
		let subtree1 = getTheOtherBranches(tree, nodeParent)
		if (subtree1 !== false) {
			newTree.root().property('children', [subtree1.data(), otherBranches.data()])
		}
		else {
			newTree = tntTree()
			newTree.data(otherBranches.data())
		}
	}
	else {
		newTree = false
	}
	return newTree
}

exports.newRoot = function(tree, node) {
	let newTree = tntTree().data(parser.parse_newick('()' + node.node_name()))

	let subTree1 = node.subtree(node.get_all_leaves())
	let subTree2 = getTheOtherBranches(tree, node)
	//newTree.data(node.data())
	if (subTree2)
		newTree.root().property('children', [subTree1.data(), subTree2.data()])
	else
		newTree = tree
	//console.log(JSON.stringify(tntExport.tntObject(newTree)))
	return newTree
}
