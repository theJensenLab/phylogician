/* eslint-env browser */
'use strict'

let	d3 = require('d3')

/**
 * Sets the width and height of a class of divs and the svg within to the document body's height and width.
 *
 * @param {any} divClass The target div class.
 */
function makeDivFullScreen(divClass) {
	d3.select(divClass)
		.attr('style', 'width:' + document.body.clientWidth + 'px, height:' + document.body.clientHeight + 'px')

	d3.selectAll(divClass)
		.select('svg')
		.attr('width', document.body.clientWidth + 'px')
		.attr('height', document.body.clientHeight + 'px')
}

// Exporting the following functions for use in parent files:

exports.makeDivFullScreen = makeDivFullScreen
