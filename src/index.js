// APPLICATION STATE



// DOM ELEMENTS

const occasionSelect = document.querySelector("#occasion-select")
const cardDiv = document.querySelector(".card-div")

// EVENT HANDLERS

occasionSelect.addEventListener("change", event => {
	console.log(event.target.value)
	renderOccasion(event.target.value)
})

// FETCHERS



// RENDERERS

function renderOccasion(occasion) {
	cardDiv.innerHTML = `
		<img src="./assets/occasions/${occasion}/${occasion}01.jpg" alt="${occasion} Card" />
		<img src="./assets/occasions/${occasion}/${occasion}02.jpg" alt="${occasion} Card" />
		<img src="./assets/occasions/${occasion}/${occasion}03.jpg" alt="${occasion} Card" />
		<img src="./assets/occasions/${occasion}/${occasion}04.jpg" alt="${occasion} Card" />
		<img src="./assets/occasions/${occasion}/${occasion}05.jpg" alt="${occasion} Card" />
		<img src="./assets/occasions/${occasion}/${occasion}06.jpg" alt="${occasion} Card" />
		<img src="./assets/occasions/${occasion}/${occasion}07.jpg" alt="${occasion} Card" />
		<img src="./assets/occasions/${occasion}/${occasion}08.jpg" alt="${occasion} Card" />
	`
}

// INITIALIZERS