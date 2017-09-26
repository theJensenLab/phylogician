/* eslint-env browser */
'use strict'

let d3 = require('d3')

let url = 'https://api.github.com/repos/theJensenLab/phylogician/releases'
let animationDelayMultiFactor = 50000

d3.select('body').append('div')
	.attr('id', 'backDrop')

d3.xml('./src/navbrand.svg').mimeType('image/svg+xml')
	.get(function(error, xml) {
		if (error) throw error
		xml.documentElement.id = 'brandBackDrop'
		xml.documentElement.style.width = '400px'
		xml.documentElement.style.height = '400px'
		document.getElementById('backDrop').appendChild(xml.documentElement)
	})

let req = new XMLHttpRequest()


function reqListener() {
	if (this.readyState === 4 && this.status === 200) {
		let tag = JSON.parse(this.responseText)[0].tag_name
		d3.select('#backDrop').append('div')
			.attr('id', 'startTitle')
			.append('b')
			.text('Phylogician ' + tag)

		d3.select('#startTitle').append('p')
			.append('a')
			.attr('href', 'https://github.com/theJensenLab/phylogician')
			.append('img')
			.attr('src', 'src/GitHub-Mark-32px.png')

		let initialColor = '#91DC5A'
		animate(initialColor)
	}
}

req.addEventListener('load', reqListener)
req.open('GET', url, true)
req.send()

function animate(color) {
	let nextAnimationIn = Math.random() * animationDelayMultiFactor
	if (color === '#91DC5A')
		color = '#FF6A13'
	else
		color = '#91DC5A'
	changeColor(nextAnimationIn, color)
}

function changeColor(nextAnimationIn, color) {
	d3.select('#brandBackDrop').selectAll('path, polygon')
		.transition()
		.duration(nextAnimationIn)
		.attr('fill', color)

	if (document.getElementById('backDrop').style.opacity !== '0') {
		setTimeout(function() {
			animate(color)
		}, nextAnimationIn)
	}
}
