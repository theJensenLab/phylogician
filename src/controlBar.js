/* eslint-env browser */
'use strict'

require('bootstrap-colorpicker')

let d3 = require('d3'),
	$ = require('jquery')

let phylogician = require('./phylogician.js')

let NavBarShow = false,
	maxWidth = document.body.clientWidth,
	barWidthOffset = 50,
	barWidth = maxWidth - barWidthOffset

let navBar = d3.select('body').append('div')
	.attr('id', 'controlBar')
	.attr('class', 'navbar')
	.attr('width', barWidth + 'px')

navBar.style('right', function() {
	let navBarPosition = barWidth + 'px'
	if (NavBarShow)
		navBarPosition = barWidthOffset + 'px'
	return navBarPosition
})

d3.xml('./src/navbrand.svg')
	.mimeType('image/svg+xml')
	.get(function(error, xml) {
		if (error) throw error
		xml.documentElement.id = 'brand'
		xml.documentElement.style.width = '30px'
		xml.documentElement.style.height = '30px'
		xml.documentElement.addEventListener('click', () => {
			toggleNavBar()
		})
		document.getElementById('controlBar').appendChild(xml.documentElement)
	})

function toggleNavBar() {
	if (navBar.node().getBoundingClientRect().right === barWidth)
		retractNavBar()
	else
		expandNavBar()
}

function expandNavBar() {
	let duration = 1000
	if (navBar.node().getBoundingClientRect().right !== barWidth) {
		let navBarPosition = barWidthOffset + 'px'
		navBar.transition()
			.duration(duration)
			.style('right', navBarPosition)

		d3.select('#brand').selectAll('path, polygon')
			.transition()
			.duration(duration)
			.attr('fill', '#FF6A13')
	}
}

function retractNavBar() {
	let duration = 1000
	if (navBar.node().getBoundingClientRect().right !== barWidthOffset) {
		let navBarPosition = barWidth + 'px'
		navBar.transition()
			.duration(duration)
			.style('right', navBarPosition)

		d3.select('#brand').selectAll('path, polygon')
			.transition()
			.duration(duration)
			.attr('fill', '#91DC5A')
	}
}

function popFormString() {
	turnOffOtherForms()
	if (document.getElementById('stringInput')) {
		document.getElementById('stringInput').style.display = 'block'
	}
	else {
		let myStringForm = document.createElement('input')
		myStringForm.classList.add('form-control')
		myStringForm.id = 'stringInput'
		myStringForm.style.display = 'block'
		myStringForm.addEventListener('keydown', function(e) {
			let enterKeyCode = 13
			if (e.keyCode === enterKeyCode) {
				let newick = document.getElementById('stringInput').value
				myStringForm.style.display = 'none'
				if (newick !== '') {
					phylogician.makeTree(newick)
					retractNavBar()
				}
			}
		})
		document.body.appendChild(myStringForm)
	}
}

function popFormFile() {
	turnOffOtherForms()
	if (document.getElementById('fileFormLabel')) {
		document.getElementById('fileFormLabel').style.display = 'block'
	}
	else {
		let fileFormLabel = document.createElement('label')
		fileFormLabel.classList.add('btn', 'btn-primary')
		fileFormLabel.id = 'fileFormLabel'
		fileFormLabel.setAttribute('for', 'fileInput')

		let fileForm = document.createElement('input')
		fileForm.id = 'fileInput'
		fileForm.type = 'file'
		fileForm.style.display = 'none'
		fileForm.addEventListener('change', function() {
			let fileInput = document.getElementById('fileInput'),
				newick = '',
				file = fileInput.files[0]
			let reader = new FileReader()

			reader.onload = function(err) {
				newick = reader.result
				fileFormLabel.style.display = 'none'
				phylogician.makeTree(newick)
				fileInput.value = null
				retractNavBar()
			}
			reader.readAsText(file)
		})
		fileFormLabel.innerHTML = 'Browse'
		fileFormLabel.appendChild(fileForm)
		document.body.appendChild(fileFormLabel)
	}
}

// pops the div that allows user to select node shape
function popFormNodeShape() {
	turnOffOtherForms()
	if (document.getElementById('changeNodeShapeForm')) {
		document.getElementById('changeNodeShapeForm').style.display = 'block'
	}
	else {
		let changeNodeShapeForm = document.createElement('div')
		changeNodeShapeForm.id = 'changeNodeShapeForm'
		document.body.appendChild(changeNodeShapeForm)

		let expandedNodeText = document.createElement('div')
		expandedNodeText.id = 'expandedNodeText'
		expandedNodeText.innerHTML = 'Select Expanded Node Shape:'
		changeNodeShapeForm.appendChild(expandedNodeText)

		let expandedNodeButtons = document.createElement('div')
		expandedNodeButtons.id = 'expandedNodeButtons'
		changeNodeShapeForm.appendChild(expandedNodeButtons)

		let collapsedNodeText = document.createElement('div')
		collapsedNodeText.id = 'collapsedNodeText'
		collapsedNodeText.innerHTML = 'Select Collapsed Node Shape:'
		changeNodeShapeForm.appendChild(collapsedNodeText)

		let collapsedNodeButtons = document.createElement('div')
		collapsedNodeButtons.id = 'collapsedNodeButtons'
		changeNodeShapeForm.appendChild(collapsedNodeButtons)

		let circleButtonExpanded = document.createElement('label')
		circleButtonExpanded.classList.add('btn', 'expanded-collapsed-buttons')
		circleButtonExpanded.id = 'circleButtonExpanded'
		circleButtonExpanded.onclick = function() {phylogician.changeExpandedNodeShape('circle')}
		circleButtonExpanded.innerHTML = 'Circle'
		expandedNodeButtons.appendChild(circleButtonExpanded)

		let squareButtonExpanded = document.createElement('label')
		squareButtonExpanded.classList.add('btn', 'expanded-collapsed-buttons')
		squareButtonExpanded.id = 'squareButtonExpanded'
		squareButtonExpanded.onclick = function() {phylogician.changeExpandedNodeShape('square')}
		squareButtonExpanded.innerHTML = 'Square'
		expandedNodeButtons.appendChild(squareButtonExpanded)

		let triangleButtonExpanded = document.createElement('label')
		triangleButtonExpanded.classList.add('btn', 'expanded-collapsed-buttons')
		triangleButtonExpanded.id = 'triangleButtonExpanded'
		triangleButtonExpanded.onclick = function() {phylogician.changeExpandedNodeShape('triangle')}
		triangleButtonExpanded.innerHTML = 'Triangle'
		expandedNodeButtons.appendChild(triangleButtonExpanded)

		let circleButtonCollapsed = document.createElement('label')
		circleButtonCollapsed.classList.add('btn', 'expanded-collapsed-buttons')
		circleButtonCollapsed.id = 'circleButtonCollapsed'
		circleButtonCollapsed.onclick = function() {phylogician.changeCollapsedNodeShape('circle')}
		circleButtonCollapsed.innerHTML = 'Circle'
		collapsedNodeButtons.appendChild(circleButtonCollapsed)

		let squareButtonCollapsed = document.createElement('label')
		squareButtonCollapsed.classList.add('btn', 'expanded-collapsed-buttons')
		squareButtonCollapsed.id = 'squareButtonCollapsed'
		squareButtonCollapsed.onclick = function() {phylogician.changeCollapsedNodeShape('square')}
		squareButtonCollapsed.innerHTML = 'Square'
		collapsedNodeButtons.appendChild(squareButtonCollapsed)

		let triangleButtonCollapsed = document.createElement('label')
		triangleButtonCollapsed.classList.add('btn', 'expanded-collapsed-buttons')
		triangleButtonCollapsed.id = 'triangleButtonCollapsed'
		triangleButtonCollapsed.onclick = function() {phylogician.changeCollapsedNodeShape('triangle')}
		triangleButtonCollapsed.innerHTML = 'Triangle'
		collapsedNodeButtons.appendChild(triangleButtonCollapsed)

		let turnOffNodeShape = document.createElement('label')
		turnOffNodeShape.classList.add('btn')
		turnOffNodeShape.id = 'turnOffNodeShape'
		turnOffNodeShape.onclick = function() {phylogician.changeExpandedNodeShape('none')}
		turnOffNodeShape.innerHTML = 'Turn Off Node Shape'
		changeNodeShapeForm.appendChild(turnOffNodeShape)

		let closeNodeShape = document.createElement('label')
		closeNodeShape.classList.add('btn')
		closeNodeShape.id = 'closeNodeShape'
		closeNodeShape.onclick = function() {document.getElementById('changeNodeShapeForm').style.display = 'none'}
		closeNodeShape.innerHTML = 'Close'
		changeNodeShapeForm.appendChild(closeNodeShape)
	}
}

function popFormNodeSize() {
	turnOffOtherForms()
	if (document.getElementById('nodeSizeInput')) {
		document.getElementById('nodeSizeInput').style.display = 'block'
	}
	else {
		let myNodeSizeForm = document.createElement('input')
		myNodeSizeForm.classList.add('form-control')
		myNodeSizeForm.id = 'nodeSizeInput'
		myNodeSizeForm.style.display = 'block'
		myNodeSizeForm.addEventListener('keydown', function(e) {
			let enterKeyCode = 13
			if (e.keyCode === enterKeyCode) {
				let newNodeSize = document.getElementById('nodeSizeInput').value
				myNodeSizeForm.style.display = 'none'
				if (newNodeSize !== '') {
					phylogician.changeNodeSize(newNodeSize)
					retractNavBar()
				}
			}
		})
		document.body.appendChild(myNodeSizeForm)
	}
}

// turns off all active forms so that new form can open unobstructed
function turnOffOtherForms() {
	if (document.getElementById('stringInput'))
		document.getElementById('stringInput').style.display = 'none'
	if (document.getElementById('branchWidthInput'))
		document.getElementById('branchWidthInput').style.display = 'none'
	if (document.getElementById('colorPicker'))
		document.getElementById('colorPicker').style.display = 'none'
	if (document.getElementById('fileFormLabel'))
		document.getElementById('fileFormLabel').style.display = 'none'
	if (document.getElementById('changeNodeShapeForm'))
		document.getElementById('changeNodeShapeForm').style.display = 'none'
	if (document.getElementById('nodeSizeInput'))
		document.getElementById('nodeSizeInput').style.display = 'none'
}

let navBarDOM = document.getElementById('controlBar')

let buttonGroup = document.createElement('div')
buttonGroup.classList.add('btn-group')
buttonGroup.setAttribute('data-toggle', 'buttons')
buttonGroup.style = 'margin-left: 60px;'

// input string or file via menu bar
let inputDiv = document.createElement('div')
inputDiv.classList.add('dropdown')
buttonGroup.appendChild(inputDiv)

let inputMenu = document.createElement('button')
inputMenu.classList.add('btn', 'dropdown-toggle')
inputMenu.setAttribute('data-toggle', 'dropdown')
inputMenu.type = 'button'
inputMenu.innerHTML = 'Load Data'
inputDiv.appendChild(inputMenu)

let inputOptions = document.createElement('div')
inputOptions.classList.add('dropdown-menu')
inputDiv.appendChild(inputOptions)

// button that allows user to input a newick string
let submitNwkString = document.createElement('a')
submitNwkString.classList.add('dropdown-item')
submitNwkString.innerHTML = 'Input Text'
submitNwkString.addEventListener('click', popFormString)
inputOptions.appendChild(submitNwkString)

// button that allows the user to upload a newick file
let submitNwkFile = document.createElement('a')
submitNwkFile.classList.add('dropdown-item')
submitNwkFile.innerHTML = 'Upload File'
submitNwkFile.addEventListener('click', popFormFile)
inputOptions.appendChild(submitNwkFile)

// change tree layout via menu bar
let treeLayoutDiv = document.createElement('div')
treeLayoutDiv.classList.add('dropdown')
buttonGroup.appendChild(treeLayoutDiv)

let treeLayoutMenu = document.createElement('button')
treeLayoutMenu.classList.add('btn', 'dropdown-toggle')
treeLayoutMenu.setAttribute('data-toggle', 'dropdown')
treeLayoutMenu.type = 'button'
treeLayoutMenu.innerHTML = 'Tree Layout'
treeLayoutMenu.style = 'left: 100px;'
treeLayoutDiv.appendChild(treeLayoutMenu)

let displayOptions = document.createElement('div')
displayOptions.classList.add('dropdown-menu')
treeLayoutDiv.appendChild(displayOptions)

// dropdown option to change the layout to Vertical
let makeVertical = document.createElement('a')
makeVertical.classList.add('dropdown-item')
makeVertical.innerHTML = 'Vertical'
makeVertical.addEventListener('click', (e) => {
	phylogician.updateVertical(e)
	retractNavBar()
})
displayOptions.appendChild(makeVertical)

// dropdown option to change the layout to Radial
let makeRadial = document.createElement('a')
makeRadial.classList.add('dropdown-item')
makeRadial.innerHTML = 'Radial'
makeRadial.addEventListener('click', (e) => {
	phylogician.updateRadial(e)
	retractNavBar()
})
displayOptions.appendChild(makeRadial)

// conduct tree operations via menu bar
let operationsDiv = document.createElement('div')
operationsDiv.classList.add('dropdown')
buttonGroup.appendChild(operationsDiv)

let operationsMenu = document.createElement('button')
operationsMenu.classList.add('btn', 'dropdown-toggle')
operationsMenu.setAttribute('data-toggle', 'dropdown')
operationsMenu.type = 'button'
operationsMenu.innerHTML = 'Tree Display'
operationsMenu.style = 'left: 100px;'
operationsDiv.appendChild(operationsMenu)

let operationsOptions = document.createElement('div')
operationsOptions.classList.add('dropdown-menu')
operationsDiv.appendChild(operationsOptions)

// button that causes the tree to resize to fit the viewing window
let fit2screen = document.createElement('a')
fit2screen.classList.add('dropdown-item')
fit2screen.innerHTML = 'Fit To Screen'
fit2screen.addEventListener('click', (e) => {
	phylogician.fitScreen(e)
	retractNavBar()
})
operationsOptions.appendChild(fit2screen)

// button that causes the tree to resize to fit the viewing window
let toggleScale = document.createElement('a')
toggleScale.classList.add('dropdown-item', 'scalingOption')
toggleScale.innerHTML = 'Turn On Scaling'
toggleScale.addEventListener('click', () => {
	phylogician.scaleTree()
	retractNavBar()
})
operationsOptions.appendChild(toggleScale)

// button that toggles the node support values on and off
let toggleSupport = document.createElement('a')
toggleSupport.classList.add('dropdown-item')
toggleSupport.innerHTML = 'Toggle Support Values'
toggleSupport.addEventListener('click', () => {
	phylogician.toggleSupport()
	retractNavBar()
})
operationsOptions.appendChild(toggleSupport)

// button that ladderizes the tree
let ladderizeTree = document.createElement('a')
ladderizeTree.classList.add('dropdown-item')
ladderizeTree.innerHTML = 'Ladderize Tree'
ladderizeTree.addEventListener('click', () => {
	phylogician.ladderizeTree()
	retractNavBar()
})
operationsOptions.appendChild(ladderizeTree)

// button that allows the user to change/turn off expanded and collapsed node shapes
let changeNodeShape = document.createElement('a')
changeNodeShape.classList.add('dropdown-item')
changeNodeShape.innerHTML = 'Change Node Shape'
changeNodeShape.addEventListener('click', () => {
	popFormNodeShape()
	retractNavBar()
})
operationsOptions.appendChild(changeNodeShape)

// button that allows the user to change/turn off expanded and collapsed node shapes
let changeNodeSize = document.createElement('a')
changeNodeSize.classList.add('dropdown-item')
changeNodeSize.innerHTML = 'Change Node Size'
changeNodeSize.addEventListener('click', () => {
	popFormNodeSize()
	retractNavBar()
})
operationsOptions.appendChild(changeNodeSize)

// export tree in various formats via menu bar
let exportDiv = document.createElement('div')
exportDiv.classList.add('dropdown')
buttonGroup.appendChild(exportDiv)

let exportMenu = document.createElement('button')
exportMenu.classList.add('btn', 'dropdown-toggle')
exportMenu.setAttribute('data-toggle', 'dropdown')
exportMenu.type = 'button'
exportMenu.innerHTML = 'Export'
exportMenu.style = 'left: 100px;'
exportDiv.appendChild(exportMenu)

let exportOptions = document.createElement('div')
exportOptions.classList.add('dropdown-menu')
exportDiv.appendChild(exportOptions)

// button that exports the current state of the SVG
let exportCurrentState = document.createElement('a')
exportCurrentState.classList.add('dropdown-item')
exportCurrentState.innerHTML = 'Current State'
exportCurrentState.addEventListener('click', (e) => {
	phylogician.exportCurrentState(e)
	retractNavBar()
})
exportOptions.appendChild(exportCurrentState)

// end section

navBarDOM.appendChild(buttonGroup)

function navBarShortcut(e) {
	let z = 90
	if (e.ctrlKey && e.keyCode === z)
		toggleNavBar()
}
document.addEventListener('keyup', navBarShortcut, false)
