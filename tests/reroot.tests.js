'use strict'

let expect = require('chai').expect,
	parser = require('tnt.newick'),
	tntTree = require('tnt.tree')

let utils = require('../src/utils.js'),
	tntExport = require('../src/tntExport.js'),
	reroot = require('../src/reroot.js')

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
		it('must return rooted tree internal node is picked as new root', function() {
			let originalTree = '(A,(B,(C,D)1)2)3;',
				expectedTree = '((C,D)1,(A,B)2)3',
				treeObj = parser.parse_newick(originalTree),
				treeObjExpected = parser.parse_newick(expectedTree)

			let tree = tntTree()
			tree.data(treeObj)

			//console.log(JSON.stringify(tntExport.tntObject(tree)))

			let customNode = tree.root().find_node_by_name('1')
			let newTree = reroot.newRoot(tree, customNode)

			let expectedTreeTnt = tntTree().data(treeObjExpected)
			console.log(JSON.stringify(tntExport.tntObject(expectedTreeTnt)))
			console.log(JSON.stringify(tntExport.tntObject(newTree)))
			expect(newTree).eql(expectedTreeTnt)
		})
	})
})
