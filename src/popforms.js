/* eslint-env browser */
'use strict'

require('bootstrap-colorpicker')

let d3 = require('d3'),
	$ = require('jquery'),
	treeOperations = require('./treeOperations.js')

/**
 * 1) Activates the form that allows the user to customize the branch width of a subtree.
 * 2) Also sets display of all other potentially-active forms to 'none'.
 * 3) Modifies the branch width of the tree and updates the visualization.
 *
 * @param {any} selectedNode The parent node of the subtree to be operated on.
 * @param {any} tree The full tree.
 */
function popFormBranchWidth(selectedNode, tree) {
	if (document.getElementById('fileFormLabel'))
		document.getElementById('fileFormLabel').style.display = 'none'
	if (document.getElementById('stringInput'))
		document.getElementById('stringInput').style.display = 'none'
	if (document.getElementById('colorPicker'))
		document.getElementById('colorPicker').style.display = 'none'
	if (document.getElementById('branchWidthInput'))
		$('#branchWidthInput').remove()
	let branchWidthForm = document.createElement('input')
	branchWidthForm.classList.add('form-control')
	branchWidthForm.id = 'branchWidthInput'
	branchWidthForm.style.display = 'block'
	branchWidthForm.addEventListener('keydown', function(e) {
		let enterKeyCode = 13
		if (e.keyCode === enterKeyCode) {
			let branchWidth = document.getElementById('branchWidthInput').value
			branchWidthForm.style.display = 'none'
			if (branchWidth !== '') {
				treeOperations.changeBranchWidthProperty(branchWidth, selectedNode)
				treeOperations.updateUserChanges(tree)
			}
		}
	})
	document.body.appendChild(branchWidthForm)
}

/**
 * 1) Activates a color picker that allows the user to customize the branch color of a subtree.
 * 2) Also sets display of all other potentially-active forms to 'none'.
 * 3) Modifies the branch color of the tree and updates the visualization.
 * 
 * @param {any} selectedNode The parent node of the subtree to be operated on.
 * @param {any} tree The full tree.
 */
function popColorPicker(selectedNode, tree) {
	if (document.getElementById('fileFormLabel'))
		document.getElementById('fileFormLabel').style.display = 'none'
	if (document.getElementById('stringInput'))
		document.getElementById('stringInput').style.display = 'none'
	if (document.getElementById('branchWidthInput'))
		document.getElementById('branchWidthInput').style.display = 'none'
	if (document.getElementById('colorPicker'))
		$('#colorPicker').remove()
	let colorPicker = document.createElement('input')
	colorPicker.classList.add('form-control')
	colorPicker.id = 'colorPicker'
	colorPicker.style.display = 'block'
	$(function() {
		$('#colorPicker').colorpicker()
			.on('changeColor', function(newColor) {
				treeOperations.changeBranchColorProperty(newColor, selectedNode)
				treeOperations.updateUserChanges(tree)
			})
			.on('hidePicker', function() {
				document.getElementById('colorPicker').style.display = 'none'
			})
	})
	document.body.appendChild(colorPicker)
}

exports.popFormBranchWidth = popFormBranchWidth
exports.popColorPicker = popColorPicker
