function killMenu(){
	let contextMenus = document.getElementsByClassName('context');
	for(let menu of contextMenus){
		menu.remove()
	}
}
function addMenus(){
let items = document.getElementsByClassName('item')

for(let item of items){
	item.oncontextmenu = e => {
  		e.preventDefault()

		killMenu()
		let context = document.createElement('div')
		context.className = 'context'
		Object.assign(context.style, {
			left: `${e.pageX}px`,
			top: `${e.pageY}px`,
			display: 'block'
		})
		let parts = {
			'Open': () => {
				window.open(`/uploads/${item.id}`)
			},
			'Copy': () => {
				copy(`https://${window.location.hostname}/uploads/${item.id}`)
			},
			'Delete': () => {
				fetch_xml('/delete',{
					method: 'POST',
					body: {
						target: item.id
					}
				})
				.then(() => {
					item.remove()
				})
				.catch(e => {
					console.log(e)
				})
				
			}
 		}
		for(let key in parts){
			let div = document.createElement('div')
			div.textContent = key
			div.onclick = () => {
				parts[key]()
			}
			context.appendChild(div)
		}
		document.body.appendChild(context)
		return false
	}
}
}
function copy(text){
	let input = document.createElement('textarea');
	input.value = text;
	document.body.appendChild(input)
	input.select();
	input.setSelectionRange(0, 99999); 
	document.execCommand("copy");
	input.remove()
}
document.addEventListener('click', killMenu)
