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
	return simpleObject // returns cleaned up JSON
}
