/* eslint-env browser */
'use strict'

let tntTree = require('tnt.tree'),
	parser = require('tnt.newick')

let utils = require('./utils.js'),
	tntExport = require('./tntExport.js')

function getOtherBranches(tree, nodeParent, excludedNodes) {
	////console.log('actual node: ' + excludedNodes.node_name())
	let xfurcation = []
	let newNodeParent = nodeParent
	nodeParent.children().forEach(function(child) {
		////console.log('--children nodes: ' + child.node_name())
		if (child.data() !== excludedNodes.data()) {
			////console.log(child.node_name())
			let realChild = child
/*			while (!(realChild.is_leaf()) && realChild.children().length < 2) {
				////console.log('fixing things')
				////console.log(realChild.node_name())
				realChild = realChild.children()[0]
			}*/
			xfurcation.push(realChild.data())
		}
	})

	if (nodeParent.parent()) {
		////console.log('--parent nodes: ' + nodeParent.parent().node_name())
		let otherBranch = getOtherBranches(tree, nodeParent.parent(), nodeParent)
		xfurcation.push(otherBranch.data())
	}

	nodeParent.property('children', xfurcation)


	return newNodeParent
}

exports.newRoot = function(tree, node) {
	let newTree = tntTree().data(parser.parse_newick("()R'"))
	//////console.log(JSON.stringify(tntExport.tntObject(tree)))
	newTree.root().property('_id', tree.root().get_all_nodes().length + 1)
	let subTree1 = node.subtree(node.get_all_leaves())
	//////console.log(utils.simpleStringify(subTree1.data()))
	//////console.log(node.node_name())
	//newTree.data(node.data())
	////////console.log(utils.simpleStringify(subTree2.data()))
	if (node.parent()) {
		let subTree2 = getOtherBranches(tree, node.parent(), node)
		newTree.root().property('children', [subTree1.data(), subTree2.data()])
	}
	else {
		newTree = tree
	}

	//let trick = tntExport.tntObject(newTree)
	//let finalTree = tntTree().data(trick)
	////console.log(utils.countLeaves(newTree.data()))
	////console.log(tntExport.tntObject(newTree))

	let nodesWithOneChild = newTree.root().find_all(function(n) {
		////console.log(n.node_name() + ' - ' + (n.children() ? n.children().length === 1 : false))
		//console.log(n.node_name() + ' - ' + n.property('_id') + ' - ' + (n.children() ? n.children().length === 1 : false))
		return (n.children() ? n.children().length === 1 : false)
		// return (n.property('_id') === 1 && n.parent())
	})

	nodesWithOneChild.forEach(function(n) {
		let newChildren = []
		//console.log('delete old root')
		//console.log(JSON.stringify(utils.simpleStringify(n.data())))
		//console.log('all children from parent')
		//console.log(n.parent())

		if (!(n.parent()))
			n.property('_parent', newTree.root().data())

		n.parent().children().forEach(function(child) {
			if (child.data() !== n.data())
				newChildren.push(child.data())
		})
		newChildren.push(n.children()[0].data())
		n.parent().property('children', newChildren)
	})

	////console.log(changes[0])


	////console.log('final tree')

	//console.log(newTree.data())
	return newTree //finalTree
}
