'use strict'


function makeButton(id, classList = [], width, height, innerHTML) {
    let newButton = document.createElement('button')
    newButton.classList.add('btn', 'btn-primary', 'dropdown-toggle')
    newButton.type = 'button'
    newButton.innerHTML = 'Inputs'
    newButton.style('width') = '100px'
}




