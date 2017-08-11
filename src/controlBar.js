/* eslint-env browser */
'use strict'

let d3 = require('d3')
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
	if (document.getElementById('fileFormLabel'))
		document.getElementById('fileFormLabel').style.display = 'none'
	if (document.getElementById('branchWidthInput'))
		document.getElementById('branchWidthInput').style.display = 'none'
	if (document.getElementById('colorPicker'))
		document.getElementById('colorPicker').style.display = 'none'
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
	if (document.getElementById('stringInput'))
		document.getElementById('stringInput').style.display = 'none'
	if (document.getElementById('branchWidthInput'))
		document.getElementById('branchWidthInput').style.display = 'none'
	if (document.getElementById('colorPicker'))
		document.getElementById('colorPicker').style.display = 'none'
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

let submitNwkString = document.createElement('a')
submitNwkString.classList.add('dropdown-item')
submitNwkString.innerHTML = 'Input Text'
submitNwkString.addEventListener('click', popFormString)
inputOptions.appendChild(submitNwkString)

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

let makeVertical = document.createElement('a')
makeVertical.classList.add('dropdown-item')
makeVertical.innerHTML = 'Vertical'
makeVertical.addEventListener('click', (e) => {
	phylogician.updateVertical(e)
	retractNavBar()
})
displayOptions.appendChild(makeVertical)

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
operationsMenu.innerHTML = 'Tree Operations'
operationsMenu.style = 'left: 100px;'
operationsDiv.appendChild(operationsMenu)

let operationsOptions = document.createElement('div')
operationsOptions.classList.add('dropdown-menu')
operationsDiv.appendChild(operationsOptions)

let fit2screen = document.createElement('a')
fit2screen.classList.add('dropdown-item')
fit2screen.innerHTML = 'Fit to screen'
fit2screen.addEventListener('click', (e) => {
	phylogician.fitScreen(e)
	retractNavBar()
})
operationsOptions.appendChild(fit2screen)

let toggleSupport = document.createElement('a')
toggleSupport.classList.add('dropdown-item')
toggleSupport.innerHTML = 'Toggle Support Values'
toggleSupport.addEventListener('click', () => {
	phylogician.toggleSupport()
	retractNavBar()
})
operationsOptions.appendChild(toggleSupport)

let changeBranchColor = document.createElement('button')
changeBranchColor.classList.add('dropdown-item')
changeBranchColor.innerHTML = 'Change Branch Color'
changeBranchColor.addEventListener('click', popColorPicker)
operationsOptions.appendChild(changeBranchColor)

function popColorPicker() {
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
		let colorPicker = document.createElement('button')
		colorPicker.classList.add('jscolor')
		colorPicker.id = 'colorPicker'
		colorPicker.style.display = 'block'
		document.body.appendChild(colorPicker)
	}
}

let changeBranchWidth = document.createElement('a')
changeBranchWidth.classList.add('dropdown-item')
changeBranchWidth.innerHTML = 'Change Branch Width'
changeBranchWidth.addEventListener('click', popFormBranchWidth)
operationsOptions.appendChild(changeBranchWidth)

function popFormBranchWidth() {
	if (document.getElementById('fileFormLabel'))
		document.getElementById('fileFormLabel').style.display = 'none'
	if (document.getElementById('stringInput'))
		document.getElementById('stringInput').style.display = 'none'
	if (document.getElementById('colorPicker'))
		document.getElementById('colorPicker').style.display = 'none'
	if (document.getElementById('branchWidthInput')) {
		document.getElementById('branchWidthInput').style.display = 'block'
	}
	else {
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
					phylogician.changeBranchWidth(branchWidth)
					retractNavBar()
				}
			}
		})
		document.body.appendChild(branchWidthForm)
	}
}

navBarDOM.appendChild(buttonGroup)

function navBarShortcut(e) {
	let z = 90
	if (e.ctrlKey && e.keyCode === z)
		toggleNavBar()
}
document.addEventListener('keyup', navBarShortcut, false)
