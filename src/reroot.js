/* eslint-env browser */
'use strict'

let tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

let utils = require('./utils.js'),
	tntExport = require('./tntExport.js')

function getTheOtherBranches(tree, node, subTree) {
	let nodeParent = node.parent()
	let newTree = tntTree()
	let otherBranches = ''
	if (nodeParent) {
		console.log(nodeParent.node_name())
		newTree.data(nodeParent.data())
		let childrenOfNodeParent = nodeParent.children()
		childrenOfNodeParent.forEach(function(child) {
			if (child.data() !== node.data())
				otherBranches = child.subtree(child.get_all_leaves())
		})
		let subtree1 = getTheOtherBranches(tree, nodeParent, node)
		if (subtree1 !== false) {
			newTree.root().property('children', [subtree1.data(), otherBranches.data()])
		}
		else {
			newTree = tntTree()
			newTree.data(otherBranches.data())
		}
	}
	else if (subTree) {
		let childrenOfRoot = node.children()
		newTree = tntTree().data(parser.parse_newick("()R''"))
		childrenOfRoot.forEach(function(child) {
			if (child.data() !== subTree.data()) {
				console.log(child.data())
				otherBranches = child.subtree(child.get_all_leaves())
			}
		})
		console.log(otherBranches.data())
		console.log(node.data())

		newTree.root().property('children', [node.data(), otherBranches.data()])
	}
	else {
		newTree = false
	}
	return newTree
}

exports.newRoot = function(tree, node) {
	let newTree = tntTree().data(parser.parse_newick("()R'"))
	console.log(JSON.stringify(tntExport.tntObject(tree)))
	let subTree1 = node.subtree(node.get_all_leaves())
	console.log(utils.simpleStringify(subTree1.data()))

	let subTree2 = getTheOtherBranches(tree, node)
	//newTree.data(node.data())
	//console.log(utils.simpleStringify(subTree2.data()))
	if (subTree2)
		newTree.root().property('children', [subTree1.data(), subTree2.data()])
	else
		newTree = tree
	//console.log(JSON.stringify(tntExport.tntObject(newTree)))
	return newTree
}
