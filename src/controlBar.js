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

navBar.on('click', () => {
	console.log('click')
	let barLeftPos = navBar.node().offsetLeft,
		barWidth = navBar.node().offsetWidth,
		apparent = 50,
		newpos = '0px'

	if (barLeftPos === 0)
		newpos = '-' + (barWidth - apparent) + 'px'

	console.log(barLeftPos)
	navBar.transition()
		.duration(1000)
		.style('left', newpos)
})


function division(myClass, text = '') {
	let element = document.createElement('div')
	if (text !== '')
		element.innerHTML = text
	element.classList.add(myClass)
	return element
}


let navBarDOM = document.getElementById('controlBar')

let inputMenu = document.createElement('button')
inputMenu.classList.add('btn', 'btn-primary', 'dropdown-toggle')
inputMenu.type = 'button'
inputMenu.innerHTML = 'Inputs'

navBarDOM.appendChild(inputMenu)

let myForm = document.createElement('input')
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
