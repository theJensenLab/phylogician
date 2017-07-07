'use strict'

exports.countLeaves = function(treeObj) {
	let numOfLeaves = 0
	if (Array.isArray(treeObj)) {
		treeObj.forEach(function(element) {
			if (element.children)
				numOfLeaves += exports.countLeaves(element.children)
			else
				numOfLeaves += 1
		})
	}
	else if (treeObj.children) {
		numOfLeaves += exports.countLeaves(treeObj.children)
	}
	else if (treeObj.name) {
		numOfLeaves += 1
	}
	return numOfLeaves
}
