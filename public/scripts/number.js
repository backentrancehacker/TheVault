let password = ''
let circles = document.getElementsByClassName('field')[0].getElementsByClassName('circles')
function init(){
	let pad = document.getElementById('pad').querySelectorAll('div')

	for(let num of pad){
		num.addEventListener('click', e => {
			change(num.innerHTML)
		})
	}
}
init()

async function change(num){
	password += num
	circles[password.length - 1].style.background = '#fff'

	if(password.length == circles.length){
		fetch_xml('/login', {
			method: 'POST',
			body: {
				password
			}
		})
		.then(response => {
			window.location = response.success
		})
		.catch(e => {
			console.log(e)
			setTimeout(() => {
				for(let circle of circles){
					circle.style.background = '#000'
				}
				password = ''
			}, 300)
		})
		
	}
}

const fetch_xml = (route, {method, body}) => {
	let xhr = new XMLHttpRequest()
	xhr.open(method || 'GET', route)
	xhr.setRequestHeader('Content-Type', 'application/json')
	xhr.send(JSON.stringify(body))

	return new Promise((resolve, reject) => {
		xhr.onload = () => {
			if(xhr.status === 200){
				let response = JSON.parse(xhr.responseText)
				if(response.hasOwnProperty('error')) reject(response)
				
				else resolve(response)
			}
			else if(xhr.status) reject(xhr.responseText)
		}
	})
}