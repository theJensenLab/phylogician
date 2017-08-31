/* eslint-env browser */
'use strict'

require('bootstrap-colorpicker')

let d3 = require('d3'),
	$ = require('jquery'),
	phylogician = require('./phylogician.js')

exports.popColorPicker = function(nodeID, numChildren) {
	if (document.getElementById('fileFormLabel'))
		document.getElementById('fileFormLabel').style.display = 'none'
	if (document.getElementById('stringInput'))
		document.getElementById('stringInput').style.display = 'none'
	if (document.getElementById('branchWidthInput'))
		document.getElementById('branchWidthInput').style.display = 'none'
	if (document.getElementById('colorPicker')) {
		document.getElementById('colorPicker').style.display = 'block'
	}
	else {
		let colorPicker = document.createElement('input')
		colorPicker.classList.add('form-control')
		colorPicker.id = 'colorPicker'
		colorPicker.style.display = 'block'
		$(function() {
			$('#colorPicker').colorpicker()
				.on('changeColor', function(e) {
					phylogician.changeBranchColor(e, nodeID, numChildren)
				})
				.on('hidePicker', function() {
					document.getElementById('colorPicker').style.display = 'none'
				})
		})
		document.body.appendChild(colorPicker)
	}
}
