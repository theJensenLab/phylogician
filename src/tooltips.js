/* eslint-env browser */
'use strict'

let d3 = require('d3')
let $ = require('jquery')
let phylogician = require('./phylogician.js')
let tntTree = require('tnt.tree')
let controlBar = require('./controlBar.js')
let popforms = require('./popforms.js')

let tree = tntTree()

let tooltipContainer = d3.select('body').append('div')
	.attr('id', 'tooltipContainer')
	.attr('class', 'tooltipContainer')
	.style('display', 'block')

let tooltip = d3.select('body').select('div')
	.append('div')
	.attr('id', 'tooltip1')
	.attr('class', 'btn-group-vertical')
	.style('display', 'none')

let tooltipDiv = document.getElementById('tooltip1')

let changeBranchColor = document.createElement('button')
changeBranchColor.setAttribute('type', 'button')
changeBranchColor.classList.add('btn')
changeBranchColor.classList.add('btn-sm')
changeBranchColor.innerHTML = 'Change Branch Color'
changeBranchColor.addEventListener('click', popforms.popColorPicker)
tooltipDiv.appendChild(changeBranchColor)

let collapseNode = document.createElement('button')
collapseNode.setAttribute('type', 'button')
collapseNode.classList.add('btn')
collapseNode.classList.add('btn-sm')
collapseNode.innerHTML = 'Collapse Node'
collapseNode.addEventListener('click', function(node) {
	// this needs to be fixed without using TNT
	node.toggle()
	tree.update()
})
tooltipDiv.appendChild(collapseNode)

let closeMenu = document.createElement('button')
closeMenu.setAttribute('type', 'button')
closeMenu.classList.add('btn')
closeMenu.classList.add('btn-sm')
closeMenu.innerHTML = 'Close'
closeMenu.addEventListener('click', closeTooltip)
tooltipDiv.appendChild(closeMenu)

exports.mouseovernodes = function() {
	d3.select('.nodes')
		.selectAll('g')
		.select('circle')
		.on('click', function() {
			document.getElementById('tooltip1').style.display = 'block'				
			document.getElementById('tooltip1').style.transform = 'translate(' + (d3.event.pageX + 10) + 'px,' + (d3.event.pageY + 10) + 'px)'
		})
}


function closeTooltip() {
	document.getElementById('tooltip1').style.display = 'none'
}


/* nodes.on('mouseover', function() {
	if (document.getElementById('tooltip1').style.display === 'none') {
		document.getElementById('tooltip1').style.display = 'block'
		document.getElementById('tooltip1').style.left = (d3.event.pageX + 30) + 'px'
		document.getElementById('tooltip1').style.top = (d3.event.pageY + 30) + 'px'	
		console.log('Tooltip display is now set as "block"')
	}
	else {
		document.getElementById('tooltip1').style.display = 'none'
	}
	// can add html here or append
}) */
