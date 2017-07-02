/* eslint-env browser */
'use strict'

let d3 = require('d3')

let maxWidth = document.body.innerWidth

let navBar = d3.select('body').append('div')
	.attr('id', 'controlBar')
	.attr('class', 'navbar')

navBar.style('left', function() {
	let barWidth = navBar.node().offsetWidth,
		apparent = 50
	console.log(JSON.stringify(barWidth - apparent))
	return '-' + (barWidth - apparent) + 'px'
})

let navBarBrand = d3.select('#controlBar').append('img')
	.attr('id', 'brand')
	.attr('src', './src/navbrand.svg')
	.style('width', '30px')
	.style('border-color', 'white')
	.style('border', '5')

navBarBrand.on('click', () => {
	console.log('hey')
	let barLeftPos = navBar.node().offsetLeft,
		barWidth = navBar.node().offsetWidth,
		apparent = 50,
		newpos = '-50px',
		newText = '-',
		duration = 1000

	if (barLeftPos === parseInt(newpos)) {
		newpos = '-' + (barWidth - apparent) + 'px'
		newText = '+'
	}

	navBar.transition()
		.duration(duration)
		.style('left', newpos)

	navBarBrand.transition()
		.duration(duration)
		.text(newText)
})

function popForm(form, button) {
	if (document.getElementById('stringInput')) {
		document.getElementById('stringInput').style.display = 'block'
		document.getElementById('stringSubButton').style.display = 'block'
	}
	else {
		let myForm = document.createElement('input')
		myForm.classList.add('form-control')
		myForm.id = 'stringInput'
		myForm.style = 'width: 300px; display: block;'
		myForm.addEventListener('submit', function() {
			console.log('dasad')
			console.log(this)
		})
		document.body.appendChild(myForm)

		let subButton = document.createElement('button')
		subButton.classList.add('btn')
		subButton.type = 'button'
		subButton.id = 'stringSubButton'
		subButton.style = 'width: 300px; display: block;'
		subButton.addEventListener('click', function() {
			console.log('submitting')
			myForm.style.display = 'none'
			subButton.style.display = 'none'
		})
		document.body.appendChild(subButton)
	}
}


let navBarDOM = document.getElementById('controlBar')

let buttonGroup = document.createElement('div')
buttonGroup.classList.add('btn-group')
buttonGroup.setAttribute('data-toggle', 'buttons')
buttonGroup.style = 'margin-left: 60px;'

let inputDiv = document.createElement('div')
inputDiv.classList.add('dropdown')
buttonGroup.appendChild(inputDiv)

let inputMenu = document.createElement('button')
inputMenu.classList.add('btn', 'dropdown-toggle')
inputMenu.setAttribute('data-toggle', 'dropdown')
inputMenu.type = 'button'
inputMenu.innerHTML = 'Load data'
inputDiv.appendChild(inputMenu)

let inputOptions = document.createElement('div')
inputOptions.classList.add('dropdown-menu')
inputDiv.appendChild(inputOptions)

let submitNwkString = document.createElement('a')
submitNwkString.classList.add('dropdown-item')
submitNwkString.innerHTML = 'Input newick string'

inputOptions.appendChild(submitNwkString)

submitNwkString.addEventListener('click', popForm)




let submitNwkFile = document.createElement('a')
submitNwkFile.classList.add('dropdown-item')
submitNwkFile.innerHTML = 'Input newick file'
inputOptions.appendChild(submitNwkFile)

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

/* 
let subButton = document.createElement('input')
myForm.classList.add('form-control')
myForm.id = 'userInput'
myForm.style = 'width: 300px'
inputMenu.appendChild(myForm)

let submitFileButton = document.createElement('button')
submitFileButton.innerHTML = 'Submit Newick'
submitFileButton.type = 'button'
submitFileButton.classList.add('btn')
submitFileButton.classList.add('btn-success')
submitFileButton.addEventListener('click', submitNewick)

navBarDOM.appendChild(submitFileButton)
 */