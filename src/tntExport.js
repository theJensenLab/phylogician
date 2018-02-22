'use strict'

let parser = require('tnt.newick'),
	tntTree = require('tnt.tree')

let keys = [
	'name',
	'branch_label',
	'branch_length'
]

function _processTreeData(treeObj) {
	let simpleTree = {}

	for (let prop in treeObj) {
		if (prop === 'children') {
			simpleTree['children'] = []
			treeObj.children.forEach(function(node) {
				simpleTree.children.push(_processTreeData(node))
			})
		}
		if (keys.indexOf(prop) !== -1)
			simpleTree[prop] = treeObj[prop]
	}
	return simpleTree
}

exports.tntObject = function(tree) {
	let tntObj = {}
	let treeObj = tree.root().data()
	let extractedTree = _processTreeData(treeObj)
	return extractedTree
}
