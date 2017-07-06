/* eslint-env browser */
'use strict'

let d3 = require('d3')
let phylogician = require('./phylogician.js')

let NavBarShow = false

let maxWidth = document.body.innerWidth

let navBar = d3.select('body').append('div')
	.attr('id', 'controlBar')
	.attr('class', 'navbar')

navBar.style('left', function() {
	let barWidth = navBar.node().offsetWidth,
		apparent = 50

	let NavBarPosition = '-' + (barWidth - apparent) + 'px'

	if (NavBarShow)
		NavBarPosition = '-50px'

	return NavBarPosition
})

let navBarBrand = d3.select('#controlBar').append('img')
	.attr('id', 'brand')
	.attr('src', './src/navbrand.svg')
	.style('width', '30px')
	.style('border-color', 'white')
	.style('border', '5')

navBarBrand.on('click', () => {
	let barLeftPos = navBar.node().offsetLeft,
		barWidth = navBar.node().offsetWidth,
		apparent = 50,
		newpos = '-50px',
		newText = '-',
		duration = 1000

	if (barLeftPos === parseInt(newpos))
		newpos = '-' + (barWidth - apparent) + 'px'

	navBar.transition()
		.duration(duration)
		.style('left', newpos)

	navBarBrand.transition()
		.duration(duration)
		.text(newText)
})

function popForm() {
	if (document.getElementById('stringInput')) {
		document.getElementById('stringInput').style.display = 'block'
	}
	else {
		let myForm = document.createElement('input')
		myForm.classList.add('form-control')
		myForm.id = 'stringInput'
		myForm.style.display = 'block'
		myForm.addEventListener('keydown', function(e) {
			let enterKeyCode = 13
			if (e.keyCode === enterKeyCode) {
				let newick = document.getElementById('stringInput').value
				myForm.style.display = 'none'
				phylogician.makeTree(newick)
			}
		})
		document.body.appendChild(myForm)
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
submitNwkString.addEventListener('click', popForm)
inputOptions.appendChild(submitNwkString)

let submitNwkFile = document.createElement('a')
submitNwkFile.classList.add('dropdown-item')
submitNwkFile.innerHTML = 'Upload File'
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
makeVertical.addEventListener('click', phylogician.updateVertical)
displayOptions.appendChild(makeVertical)

let makeRadial = document.createElement('a')
makeRadial.classList.add('dropdown-item')
makeRadial.innerHTML = 'Radial'
makeRadial.addEventListener('click', phylogician.updateRadial)
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
operationsOptions.appendChild(fit2screen)


navBarDOM.appendChild(buttonGroup)
