'use strict'

let expect = require('chai').expect,
	parser = require('tnt.newick'),
	tntTree = require('tnt.tree')

let utils = require('../src/utils.js'),
	tntExport = require('../src/tntExport.js'),
	reroot = require('../src/reroot.js'),
	treeOperations = require('../src/treeOperations.js')

describe('Test suit for reroot.js', function() {
	describe('newroot', function() {
		it('must return same tree if root is picked as new root', function() {
			let originalTree = '((C,D)1,(A,(B,X)3)2,E)R;',
				treeObj = parser.parse_newick(originalTree)

			let tree = tntTree()
			tree.data(treeObj)

			let rootNode = tree.root()
			let newTree = reroot.newRoot(tree, rootNode)

			expect(newTree).eql(tree)
		})
		it('must return same number of leafs after reroot', function() {
			let originalTree = '((C,D)1,(A,(B,X)3)2,E)R;',
				treeObj = parser.parse_newick(originalTree)

			let tree = tntTree()
			tree.data(treeObj)

			let expectedNumberOfLeaves = utils.countLeaves(tree.data())

			let rootNode = tree.root().find_node_by_name('X')
			let newTree = reroot.newRoot(tree, rootNode)

			let numberOfLeaves = utils.countLeaves(newTree.data())

			expect(numberOfLeaves).eq(expectedNumberOfLeaves)
		})
		it('must return same number of leafs after 10 random reroots', function() {
			let originalTree = '((C,D)1,(A,(B,X)3)2,E)R;',
				treeObj = parser.parse_newick(originalTree),
				numberOfReRoot = 10

			let tree = tntTree()
			tree.data(treeObj)

			let expectedNumberOfLeaves = utils.countLeaves(tree.data())

			for (let i = 0; i < numberOfReRoot; i++) {
				let nodes = tree.root().get_all_nodes()
				let node = nodes[Math.floor(Math.random() * nodes.length)]
				//console.log(node.node_name())
				tree = reroot.newRoot(tree, node)

				let numberOfLeaves = utils.countLeaves(tree.data())
				expect(numberOfLeaves).eq(expectedNumberOfLeaves)
			}
		})
		it('Must not have node with only one child', function() {
			let originalTree = '(A,(B,(C,D)1)2)3;',
				minNumOfChildrenForInternalNodes = 2,
				treeObj = parser.parse_newick(originalTree)

			let tree = tntTree()
			tree.data(treeObj)

			////console.log(JSON.stringify(tntExport.tntObject(tree)))

			let customNode = tree.root().find_node_by_name('1')
			let newTree = reroot.newRoot(tree, customNode)

			newTree.root().get_all_nodes().forEach(function(node) {
				if (!(node.is_leaf()))
					expect(node.children().length).gte(minNumOfChildrenForInternalNodes)
			})
		})
		it('Must not have node with only one child, even when pick a node adjacent to root', function() {
			let originalTree = '(A,(B,(C,D)1)2)3;',
				minNumOfChildrenForInternalNodes = 2,
				treeObj = parser.parse_newick(originalTree)

			let tree = tntTree()
			tree.data(treeObj)

			////console.log(JSON.stringify(tntExport.tntObject(tree)))

			let customNode = tree.root().find_node_by_name('2')
			let newTree = reroot.newRoot(tree, customNode)

			newTree.root().get_all_nodes().forEach(function(node) {
				if (!(node.is_leaf()))
					expect(node.children().length).gte(minNumOfChildrenForInternalNodes)
			})
		})
		it('must not break when rooted on a node adjascent to root', function() {
			let originalTree = '(A,(B,(C,D)1)2)3;',
				treeObj = parser.parse_newick(originalTree)

			let tree = tntTree()
			tree.data(treeObj)

			let customNode = tree.root().find_node_by_name('2')
			let newTree = reroot.newRoot(tree, customNode)
			let itWorks = false
			if (newTree)
				itWorks = true
			expect(itWorks).eql(true)
		})
		it('must return rooted tree internal node is picked as new root', function() {
			let originalTree = '(A,(B,(C,D)1)2)3;',
				expectedTree = "((C,D)1,(B,A)2)R'",
				treeObj = parser.parse_newick(originalTree),
				treeObjExpected = parser.parse_newick(expectedTree)

			let tree = tntTree()
			tree.data(treeObj)

			////console.log(JSON.stringify(tntExport.tntObject(tree)))

			let customNode = tree.root().find_node_by_name('1')
			let newTree = reroot.newRoot(tree, customNode)

			let expectedTreeTnt = tntTree().data(treeObjExpected)
			expect(tntExport.tntObject(newTree)).eql(tntExport.tntObject(expectedTreeTnt))
		})
		it('must return execute with two consecutive reroots on the same node', function() {
			let originalTree = '((C,D)1,(A,(B,X)3)2,E)R;',
				treeObj = parser.parse_newick(originalTree),
				numberOfReRoot = 2

			let tree = tntTree()
			tree.data(treeObj)

			let expectedNumberOfLeaves = utils.countLeaves(tree.data())

			for (let i = 0; i < numberOfReRoot; i++) {
				//console.log(' --- ')
				let node = tree.root().find_node_by_name('2')
				////console.log(JSON.stringify(utils.simpleStringify(node.data())))
				tree = reroot.newRoot(tree, node)

				let numberOfLeaves = utils.countLeaves(tree.data())
				expect(numberOfLeaves).eq(expectedNumberOfLeaves)
			}
		})
		it('bug with re-root to old root', function() {
			let originalTree = '((C,D)1,(A,(B,X)3)2,E)R;',
				treeObj = parser.parse_newick(originalTree)

			let tree = tntTree()
			tree.data(treeObj)

			let customNode = tree.root().find_node_by_name('2')
			tree = reroot.newRoot(tree, customNode)
			let oldRoot = tree.root().find_node_by_name('R')
			tree = reroot.newRoot(tree, oldRoot)

			////console.log(JSON.stringify(tntExport.tntObject(tree)))
		})
		it.only('it returns the right branch lengths after reroot', function() {
			let originalTree = '((C:0.5,D:0.5)1:1,(A:2,(B:0.3,X:0.4)3:3)2:4,E:0.8)R;',
				expectedTree = '(X:0.38,(B:0.3,(A:2.0,(E:0.8,(C:0.5,D:0.5)1:1.0)R:4.0)2:3.0)3:0.02)R\';',
				treeObj = parser.parse_newick(originalTree)

			let treeObjOriginal = JSON.parse(JSON.stringify(treeObj))

			let tree = tntTree()
			tree.data(treeObj)

			let treeExpected = tntTree()
			treeExpected.data(parser.parse_newick(expectedTree))

			let expected = tntExport.tntObject(treeExpected)

			let Xnode = tree.root().find_node(function(node) {
				return (node.property('_id') === 9)
			})

			tree = reroot.newRoot(tree, Xnode)
			tree = treeOperations.ladderizeSubtree(tree, tree.root())
			let sameTree = tntExport.tntObject(tree)

			//console.log(JSON.stringify(sameTree, null, ' '))
			expect(sameTree).eql(expected)
		})
	})
})
