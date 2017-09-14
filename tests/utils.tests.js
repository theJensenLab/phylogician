'use strict'

let expect = require('chai').expect,
	utils = require('../src/utils.js')

describe('Test suit for utils.js', function() {
	describe('countLeaves', function() {
		it('must return 0 for empty treeObj', function() {
			let treeObj = {},
				realNumOfLeaves = 0,
				numOfLeaves = utils.countLeaves(treeObj)
			expect(numOfLeaves).eql(realNumOfLeaves)
		})
		it('must return 1 for single leaf in treeObj', function() {
			// (a)
			let treeObj = {children: [{name: 'a'}], name: ''},
				realNumOfLeaves = 1,
				numOfLeaves = utils.countLeaves(treeObj)
			expect(numOfLeaves).eql(realNumOfLeaves)
		})
		it('must return 3 for three leaves in treeObj', function() {
			// (a, (b, c))
			let treeObj = {children: [{name: 'a'}, {name: '', children: [{name: 'b'}, {name: 'c'}]}], name: ''},
				realNumOfLeaves = 3,
				numOfLeaves = utils.countLeaves(treeObj)
			expect(numOfLeaves).eql(realNumOfLeaves)
		})
		it('must return 3 for three leaves in treeObj with polytomy', function() {
			// (a, b, c)
			let treeObj = {children: [{name: 'a'}, {name: 'b'}, {name: 'c'}], name: ''},
				realNumOfLeaves = 3,
				numOfLeaves = utils.countLeaves(treeObj)
			expect(numOfLeaves).eql(realNumOfLeaves)
		})
		it('must return 9 for 9 leaves in treeObj with and without polytomy', function() {
			// (a,b,(c,d,(e,f,g,(r,d))))
			let treeObj = {children: [{name: 'a'}, {name: 'b'}, {name: '', children: [{name: 'c'}, {name: 'd'}, {name: '', children: [{name: 'e'}, {name: 'f'}, {name: 'g'}, {name: '', children: [{name: 'r'}, {name: 'd'}]}]}]}], name: ''},
				realNumOfLeaves = 9,
				numOfLeaves = utils.countLeaves(treeObj)
			expect(numOfLeaves).eql(realNumOfLeaves)
		})
	})
})
