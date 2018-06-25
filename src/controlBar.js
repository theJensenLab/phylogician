/* eslint-env browser */
'use strict'

require('bootstrap-colorpicker')

let d3 = require('d3'),
	$ = require('jquery')

let phylogician = require('./phylogician.js'),
	frontEndOperations = require('./frontEndOperations.js')

let navBarShow = false,
	maxWidth = document.body.clientWidth,
	barWidthOffset = 50,
	barWidth = maxWidth - barWidthOffset

let navBar = d3.select('body').append('div')
	.attr('id', 'controlBar')
	.attr('class', 'navbar')
	.attr('width', barWidth + 'px')

navBar.style('right', function() {
	let navBarPosition = barWidth + 'px'
	if (navBarShow)
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

		d3.select('#backDrop').transition()
			.duration(duration)
			.style('opacity', '0')
	}
	navBarShow = true
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

		if (document.getElementsByClassName('tnt_groupDiv').length === 0) {
			d3.select('#backDrop').transition()
				.duration(duration)
				.style('opacity', '1')
		}
	}
	navBarShow = false
}

// Reacts accordingly when window is resized
$(window).resize(function() {
	maxWidth = document.body.clientWidth
	barWidth = maxWidth - barWidthOffset
	let navBarPosition = 0
	if (navBarShow)
		navBarPosition = barWidthOffset + 'px'
	else
		navBarPosition = barWidth + 'px'
	navBar.transition()
		.style('right', navBarPosition)

	frontEndOperations.makeDivFullScreen('.tnt_groupDiv') // Manually set SVG height to window height.
})

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

function popFormPreviousState() {
	turnOffOtherForms()
	if (document.getElementById('filePreviousState')) {
		document.getElementById('filePreviousState').style.display = 'block'
	}
	else {
		let filePreviousState = document.createElement('label')
		filePreviousState.classList.add('btn', 'btn-primary')
		filePreviousState.id = 'filePreviousState'
		filePreviousState.setAttribute('for', 'previousStateInput')

		let previousStateForm = document.createElement('input')
		previousStateForm.id = 'previousStateInput'
		previousStateForm.type = 'file'
		previousStateForm.style.display = 'none'
		previousStateForm.addEventListener('change', function() {
			let previousStateInput = document.getElementById('previousStateInput'),
				data = '',
				tempNewick = 'A', // temporary newick needed to help create tree that will be modified with uplaoded data
				file = previousStateInput.files[0]
			let thisReader = new FileReader()

			thisReader.onload = function(err) {
				data = thisReader.result
				filePreviousState.style.display = 'none'
				phylogician.makeTree(tempNewick) // creates temporary tree
				phylogician.restoreState(data)
				previousStateInput.value = null
				retractNavBar()
			}
			thisReader.readAsText(file)
		})
		filePreviousState.innerHTML = 'Browse'
		filePreviousState.appendChild(previousStateForm)
		document.body.appendChild(filePreviousState)
	}
}

// pops the div that allows user to select node shape
/**
 * Activates the buttons/form that allows the user to select preferences regarding node shape.
 * Installs a listener on each node shape button that when clicked, calls the function(s) that will
 * make the desired modification to the tree.
 *
 */
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

/**
 * Activates the form that allows user to input a node size, then calls function(s) that will make
 * the desired modification.
 *
 */
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

/**
 * Activates the form that allows user to change the text size in the SVG.
 *
 */
function popFormTextSize() {
	turnOffOtherForms()
	if (document.getElementById('textSizeInput')) {
		document.getElementById('textSizeInput').style.display = 'block'
	}
	else {
		let myTextSizeForm = document.createElement('input')
		myTextSizeForm.classList.add('form-control')
		myTextSizeForm.id = 'textSizeInput'
		myTextSizeForm.style.display = 'block'
		myTextSizeForm.addEventListener('keydown', function(e) {
			let enterKeyCode = 13
			if (e.keyCode === enterKeyCode) {
				let newTextSize = document.getElementById('textSizeInput').value
				myTextSizeForm.style.display = 'none'
				if (newTextSize !== '') {
					phylogician.changeTextSize(newTextSize)
					retractNavBar()
				}
			}
		})
		document.body.appendChild(myTextSizeForm)
	}
}

/**
 * Helper function that sets display of all active forms to 'none'. Allows new form to open unopstructed.
 *
 */
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
	if (document.getElementById('textSizeInput'))
		document.getElementById('textSizeInput').style.display = 'none'
	if (document.getElementById('filePreviousState'))
		document.getElementById('filePreviousState').style.display = 'none'
}

let navBarDOM = document.getElementById('controlBar')

let buttonGroup = document.createElement('div')
buttonGroup.classList.add('btn-group')
buttonGroup.setAttribute('data-toggle', 'buttons')
buttonGroup.style = 'margin-left: 60px;'


/**
 * Creates and appends a new menu dropdown to the desired parent with the provided specifications.
 *
 * @param {any} innerHTML The text on the button.
 * @param {any} clickEvent The event that will occur when the button is clicked.
 * @param {any} classes The class(es) that the button should be attributed to.
 * @param {any} parent The parent to which this button will become a 'child'.
 * @returns The dropdown button.
 */
const makeNewMenuChild = (innerHTML, clickEvent, classes, parent) => {
	const newMenuChild = document.createElement('a')
	newMenuChild.classList.add(classes) // this is wrong, but you get the idea.
	if (innerHTML)
		newMenuChild.innerHTML = innerHTML
	if (clickEvent)
		newMenuChild.addEventListener('click', clickEvent) // this might give you problems, but there is a way to do it.
	parent.appendChild(newMenuChild)
	return newMenuChild
}

// input string or file via menu bar
let inputDiv = document.createElement('div')
inputDiv.classList.add('dropdown')
buttonGroup.appendChild(inputDiv)

let inputMenu = document.createElement('button')
inputMenu.classList.add('btn', 'dropdown-toggle')
inputMenu.setAttribute('data-toggle', 'dropdown')
inputMenu.type = 'button'
inputMenu.innerHTML = 'Load'
inputDiv.appendChild(inputMenu)

let inputOptions = document.createElement('div')
inputOptions.classList.add('dropdown-menu')
inputDiv.appendChild(inputOptions)

// Dropdown item that allows user to input a Newick string.
makeNewMenuChild('Newick Input', popFormString, 'dropdown-item', inputOptions)

// Dropdown item that allows the user to upload a Newick file.
makeNewMenuChild('Newick File', popFormFile, 'dropdown-item', inputOptions)

// Dropdown item that allows the user to upload an exported Phylogician project.
makeNewMenuChild('Previous State', popFormPreviousState, 'dropdown-item', inputOptions)

// Change tree layout via menu bar
let treeLayoutDiv = document.createElement('div')
treeLayoutDiv.classList.add('dropdown')
buttonGroup.appendChild(treeLayoutDiv)

let treeLayoutMenu = document.createElement('button')
treeLayoutMenu.classList.add('btn', 'dropdown-toggle')
treeLayoutMenu.setAttribute('data-toggle', 'dropdown')
treeLayoutMenu.type = 'button'
treeLayoutMenu.innerHTML = 'Layout'
treeLayoutMenu.style = 'left: 100px;'
treeLayoutDiv.appendChild(treeLayoutMenu)

let displayOptions = document.createElement('div')
displayOptions.classList.add('dropdown-menu')
treeLayoutDiv.appendChild(displayOptions)

// Dropdown item that changes the tree layout to Rertical.
makeNewMenuChild('Vertical', () => {
	phylogician.updateVertical()
	retractNavBar()
}, 'dropdown-item', displayOptions)

// Dropdown item that changes the tree layout to Radial
makeNewMenuChild('Radial', () => {
	phylogician.updateRadial()
	retractNavBar()
}, 'dropdown-item', displayOptions)

// conduct tree operations via menu bar
let operationsDiv = document.createElement('div')
operationsDiv.classList.add('dropdown')
buttonGroup.appendChild(operationsDiv)

let operationsMenu = document.createElement('button')
operationsMenu.classList.add('btn', 'dropdown-toggle')
operationsMenu.setAttribute('data-toggle', 'dropdown')
operationsMenu.type = 'button'
operationsMenu.innerHTML = 'Settings'
operationsMenu.style = 'left: 100px;'
operationsDiv.appendChild(operationsMenu)

let operationsOptions = document.createElement('div')
operationsOptions.classList.add('dropdown-menu')
operationsDiv.appendChild(operationsOptions)

// Dropdown item that causes the tree to resize to fit the viewing window.
makeNewMenuChild('Fit to Screen', () => {
	phylogician.fitScreen()
	retractNavBar()
}, 'dropdown-item', operationsOptions)

// button that causes the tree to resize to fit the viewing window
let toggleScale = document.createElement('a')
toggleScale.classList.add('dropdown-item', 'scalingOption')
toggleScale.innerHTML = 'Turn Off Scaling'
toggleScale.addEventListener('click', () => {
	phylogician.scaleTree()
	retractNavBar()
})
operationsOptions.appendChild(toggleScale)

// Dropdown item that toggles the node support values on and off (Default: On).
makeNewMenuChild('Toggle Support Values', () => {
	phylogician.toggleSupport()
	retractNavBar()
}, 'dropdown-item', operationsOptions)

// Dropdown item that allows the user to customize expanded and collapsed node shapes.
makeNewMenuChild('Change Node Shape', () => {
	popFormNodeShape()
	retractNavBar()
}, 'dropdown-item', operationsOptions)

// Dropdown item that allows the user to change the node size.
makeNewMenuChild('Change Node Size', () => {
	popFormNodeSize()
	retractNavBar()
}, 'dropdown-item', operationsOptions)

// Dropdown item that allows the user to change the text size (Default: 12pt).
makeNewMenuChild('Change Text Size', () => {
	popFormTextSize()
	retractNavBar()
}, 'dropdown-item', operationsOptions)

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

// Dropdown item that exports the current state of the SVG.
makeNewMenuChild('Current State', () => {
	let currentState = phylogician.getCurrentState()
	phylogician.exportFile('tree.phylo', JSON.stringify(currentState))
	retractNavBar()
}, 'dropdown-item', exportOptions)

// creates 'Help' dropdown in the menu bar
let helpDiv = document.createElement('div')
helpDiv.classList.add('dropdown')
buttonGroup.appendChild(helpDiv)

let helpMenu = document.createElement('button')
helpMenu.classList.add('btn', 'dropdown-toggle')
helpMenu.setAttribute('data-toggle', 'dropdown')
helpMenu.type = 'button'
helpMenu.innerHTML = 'Help'
helpMenu.style = 'left: 500px;'
helpDiv.appendChild(helpMenu)

let helpOptions = document.createElement('div')
helpOptions.classList.add('dropdown-menu')
helpDiv.appendChild(helpOptions)

makeNewMenuChild('Report a Bug', null, 'dropdown-item', helpOptions) // 2nd arg should be onClick

// creates 'About' dropdown in the menu bar
let aboutDiv = document.createElement('div')
aboutDiv.classList.add('dropdown')
buttonGroup.appendChild(aboutDiv)

let aboutMenu = document.createElement('button')
aboutMenu.classList.add('btn', 'dropdown-toggle')
aboutMenu.setAttribute('data-toggle', 'dropdown')
aboutMenu.type = 'button'
aboutMenu.innerHTML = 'About'
aboutMenu.style = 'left: 500px;'
aboutDiv.appendChild(aboutMenu)

let aboutOptions = document.createElement('div')
aboutOptions.classList.add('dropdown-menu')
aboutDiv.appendChild(aboutOptions)

makeNewMenuChild('Learn More', null, 'dropdown-item', aboutOptions) // 2nd arg should be onClick

// end section


// custom shortcuts
navBarDOM.appendChild(buttonGroup)

function navBarShortcut(e) {
	let z = 90
	if (e.ctrlKey && e.keyCode === z)
		toggleNavBar()
}
document.addEventListener('keyup', navBarShortcut, false)
