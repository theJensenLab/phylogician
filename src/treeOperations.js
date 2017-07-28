/* eslint-env browser */
'use strict'

let	d3 = require('d3')

exports.toggleSupport = function(tree) {
	console.log('hello')
	let text = d3.select('.nodes')
		.selectAll('.inner')
		.select('text')
	if (text.attr('display') === 'none')
		text.attr('display', 'block')
	else
		text.attr('display', 'none')
}
