'use strict'

let tntTree = require('tnt.tree')

/*
 * Counts the number of leaves associated with the given tree object.
 * 
 * @param {any} treeObj A tree object. 
 * @returns The number of leaves in the tree.
 */
exports.countLeaves = function(treeObj) {
	let tree = tntTree().data(treeObj),
		numOfLeaves = 0
	if (tree.root().get_all_nodes().length !== tree.root().get_all_leaves().length)
		numOfLeaves = tree.root().get_all_leaves().length
	return numOfLeaves
}

/**
 * Custom stringify function that cleans up a JSON object so that it can be stringified
 * by JSON.stringify().
 * 
 * @param {any} object Object that will be operated on (should be JSON).
 * @returns The simpleStringified object.
 */
exports.simpleStringify = function(object) {
	let simpleObject = {}
	if (object.children) {
		for (let i = 0; i < object.children.length; i++)
			object.children[i] = exports.simpleStringify(object.children[i])
	}
	for (let prop in object) {
		if (!object.hasOwnProperty(prop))
			continue
		if (typeof (object[prop]) == 'object' && prop !== 'children')
			continue
		simpleObject[prop] = object[prop]
	}
	return simpleObject
}
