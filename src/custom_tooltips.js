/* eslint-env browser */
'use strict'

let tnt = require('tnt'),
	d3 = require('d3')

let customTooltip = tnt.tooltip()
	.width(150)
	.fill (function (data) {
	// The DOM element is passed as "this"
		var container = d3.select(this)

		var table = container
			.append('table')
			.attr('class', 'tnt_zmenu')
			.attr('border', 'solid')
			.style('width', customTooltip.width() + 'px')

		if (data.header) {
			table
				.append('tr')
				.attr('class', 'tnt_zmenu_header')
				.append('th')
				.text(data.header)
		}

		if (data.body) {
			table
				.append('tr')
				.attr('class', 'tnt_zmenu_row')
				.append('td')
				.style('text-align', 'center')
				.html(data.body)
		}
	})

d3.select('#container')
	.append('svg')
	.attr('width', 300)
	.attr('height', 300)
	.append('circle')
	.datum({
		header: 'this is the header',
		body: 'this is the body'
	})
	.attr('cx', 150)
	.attr('cy', 150)
	.attr('r', 50)
	.attr('fill', 'red')
	.on('click', function (d) {
		customTooltip.call(this, d)
	})
