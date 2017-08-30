
let d3 = require('d3')
let apijs = require('tnt.api')


let tooltip = function () {
	'use strict'

	let drag = d3.drag()
	let tooltip_div

	let conf = {
		container: undefined,
		position : 'right',
		allow_drag : true,
		show_closer : true,
		fill : function () { throw 'fill is not defined in the base object' },
		width : 180,
		id : 1
	}

	let t = function (data, event) {
		drag
			.subject(function(){
				return {
					x : parseInt(d3.select(this).style('left')),
					y : parseInt(d3.select(this).style('top'))
				}
			})
			.on('drag', function() {
				if (conf.allow_drag) {
					d3.select(this)
						.style('left', d3.event.x + 'px')
						.style('top', d3.event.y + 'px')
				}
			})

		// TODO: Why do we need the div element?
		// It looks like if we anchor the tooltip in the 'body'
		// The tooltip is not located in the right place (appears at the bottom)
		// See clients/tooltips_test.html for an example
		let containerElem = conf.container
		if (!containerElem) {
			containerElem = selectAncestor(this, 'div')
			if (containerElem === undefined) {
				// We require a div element at some point to anchor the tooltip
				return
			}
		}

		tooltip_div = d3.select(containerElem)
			.append('div')
			.attr('class', 'tnt_tooltip')
			.classed('tnt_tooltip_active', true)  // TODO: Is this needed/used???
			.call(drag)

		// prev tooltips with the same header
		d3.select('#tnt_tooltip_' + conf.id).remove()

		if ((d3.event === null) && (event)) {
			d3.event = event
		}
		let d3mouse = d3.mouse(containerElem)
		d3.event = null

		let xoffset = -10
		if (conf.position === 'left') {
			xoffset = conf.width
		}

		tooltip_div.attr('id', 'tnt_tooltip_' + conf.id)

		// We place the tooltip
		tooltip_div
			.style('left', (d3mouse[0] - xoffset) + 'px')
			.style('top', (d3mouse[1]) + 'px')

		// Close
		if (conf.show_closer) {
			tooltip_div
				.append('div')
				.attr('class', 'tnt_tooltip_closer')
				.on ('click', function () {
					t.close()
				})
		}

		conf.fill.call(tooltip_div.node(), data)

		// return this here?
		return t
	}

	// gets the first ancestor of elem having tagname 'type'
	// example : let mydiv = selectAncestor(myelem, 'div')
	function selectAncestor (elem, type) {
		type = type.toLowerCase()
		if (elem.parentNode === null) {
			console.log('No more parents')
			return undefined
		}
		let tagName = elem.parentNode.tagName

		if ((tagName !== undefined) && (tagName.toLowerCase() === type)) {
			return elem.parentNode
		} else {
			return selectAncestor (elem.parentNode, type)
		}
	}

	let api = apijs(t)
		.getset(conf)

	api.check('position', function (val) {
		return (val === 'left') || (val === 'right')
	}, 'Only \'left\' or \'right\' values are allowed for position')

	api.method('close', function () {
		if (tooltip_div) {
			tooltip_div.remove()
		}
	})

	return t
}

tooltip.list = function () {
	// list tooltip is based on general tooltips
	let t = tooltip()
	let width = 180

	t.fill (function (obj) {
		let tooltip_div = d3.select(this)
		let obj_info_list = tooltip_div
			.append('table')
			.attr('class', 'tnt_zmenu')
			.attr('border', 'solid')
			.style('width', '200px')
			//.style('width', t.width() + 'px')

		// Tooltip header
		if (obj.header) {
			obj_info_list
				.append('tr')
				.attr('class', 'tnt_zmenu_header')
				.append('th')
				.text(obj.header)
		}

		// Tooltip rows
		let table_rows = obj_info_list.selectAll('.tnt_zmenu_row')
			.data(obj.rows)
			.enter()
			.append('tr')
			.attr('class', 'tnt_zmenu_row')

		table_rows
			.append('td')
			.style('text-align', 'center')
			.html(function(d,i) {
				return obj.rows[i].value
			})
			.each(function (d) {
				if (d.link === undefined) {
					return
				}
				d3.select(this)
					.classed('link', 1)
					.on('click', function (d) {
						d.link(d.obj)
						t.close.call(this)
					})
			})
	})
	return t
}

tooltip.table = function () {
	// table tooltips are based on general tooltips
	let t = tooltip()

	let width = 180

	t.fill (function (obj) {
		let tooltip_div = d3.select(this)

		let obj_info_table = tooltip_div
			.append('table')
			.attr('class', 'tnt_zmenu')
			.attr('border', 'solid')
			.style('width', '200px')
			//.style('width', t.width() + 'px')

		// Tooltip header
		if (obj.header) {
			obj_info_table
				.append('tr')
				.attr('class', 'tnt_zmenu_header')
				.append('th')
				.attr('colspan', 2)
				.text(obj.header)
				.style('text-align', 'center')
		}

		/* let table_rows = obj_info_table.selectAll('.tnt_zmenu_row')
			.data(obj.rows)
			.enter()
			.append('tr')
			.attr('class', 'tnt_zmenu_row')

		table_rows
			.append('th')
			.style('text-align', 'center')
			.attr('colspan', function (d, i) {
				if (d.value === '') {
					return 2
				}
				return 1
			})
			.attr('class', function (d) {
				if (d.value === '') {
					return 'tnt_zmenu_inner_header'
				}
				return 'tnt_zmenu_cell'
			})
			.html(function(d,i) {
				return obj.rows[i].label
			})

		table_rows
			.append('td')
			.style('text-align', 'center')
			.html(function(d, i) {
				if (typeof obj.rows[i].value === 'function')
					obj.rows[i].value.call(this, d)
				return obj.rows[i].value
			})
			.each(function (d) {
				if (d.value === '')
					d3.select(this).remove()
			})
			.each(function (d) {
				if (d.link === undefined) {
					return
				}
				d3.select(this)
					.classed('link', 1)
					.on('click', function (f) {
						f.link(f.obj)
						t.close.call(this)
					})
			}) */
		
		//THIS IS WHERE TOOLTIP ADDITIONS ARE MADE
		let table_clickable_1 = obj_info_table
			.append('tr')
			.attr('class', 'tnt_zmenu_clickable')
			.append('td')
			.attr('colspan', 2)
			.text('Change Branch Color')
			.style('text-align', 'center')

		let table_clickable_2 = obj_info_table
			.append('tr')
			.attr('class', 'tnt_zmenu_clickable')
			.append('td')
			.attr('colspan', 2)
			.text('Collapse Node')
			.style('text-align', 'center')
	})

	return t
}

tooltip.plain = function () {
	// plain tooltips are based on general tooltips
	let t = tooltip()

	t.fill (function (obj) {
		let tooltip_div = d3.select(this)

		let obj_info_table = tooltip_div
			.append('table')
			.attr('class', 'tnt_zmenu')
			.attr('border', 'solid')
			.style('width', '200px')
			//DEFAULT BY TNT.style('width', t.width() + 'px')

		if (obj.header) {
			obj_info_table
				.append('tr')
				.attr('class', 'tnt_zmenu_header')
				.append('th')
				.text(obj.header)
		}

		if (obj.body) {
			obj_info_table
				.append('tr')
				.attr('class', 'tnt_zmenu_row')
				.append('td')
				.style('text-align', 'center')
				.html(obj.body)
		}
	})

	return t
}

module.exports = exports = tooltip
