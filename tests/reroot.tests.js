'use strict'

let expect = require('chai').expect,
	parser = require('tnt.newick'),
	tntTree = require('tnt.tree')

let utils = require('../src/utils.js'),
	reroot = require('../src/reroot.js')

describe('Test suit for reroot.js', function() {
	describe('newroot', function() {
		it('must return same tree if root is picked as new root', function() {
			let originalTree = '((C,D)1,(A,(B,X)3)2,E)R;',
				treeObj = parser.parse_newick(originalTree)

			let tree = tntTree()
			tree.data(treeObj)

			let rootNode = tree.root()

			let newTree = reroot.newroot(tree, rootNode)
			console.log(newTree)
		})
	})
})
