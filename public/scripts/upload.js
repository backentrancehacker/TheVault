

let file = document.getElementById('file')
document.querySelector('button').onclick = () => {
	file.click()
}

file.addEventListener("change", e => {
    let file = e.target.files[0]
	if(!file) return
    let formData = new FormData()
    formData.append("file", file)
    
	fetch_form('/upload', {
		method: 'POST',
		form: formData
	})
	.then(response => {
		let gallery = document.getElementById('gallery')
		let div = document.createElement('div')
		div.className = 'item'
		div.id = response.file
		
		div.innerHTML = 
		`
		<div class="wrap">
			<img src="/uploads/${response.file}" alt="${response.file}" />
		</div>
		`
		gallery.appendChild(div)
		addMenus()
	})
	.catch(e => {
		console.log(e)
	})
})

const fetch_form = (route, {method, form}) => {
	let xhr = new XMLHttpRequest()
	xhr.open(method || 'GET', route)
	xhr.send(form)

	return new Promise((resolve, reject) => {
		xhr.onload = () => {
			if(xhr.status === 200){
				let response = JSON.parse(xhr.responseText)
				if(response.hasOwnProperty('error')) reject(response)
				
				else resolve(response)
			}
		}
	})
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
		}
	})
}

addMenus()
