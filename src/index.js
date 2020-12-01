// APPLICATION STATE

let userEmail;

// DOM ELEMENTS

const occasionSelect = document.querySelector("#occasion-select")
const cardDiv = document.querySelector(".card-div")
const cardImage = document.querySelector('#card-image')
const navDiv = document.querySelector('.nav-div')
const mainDivH1 = document.querySelector('#mainDivH1')
const mainDivH3 = document.querySelector('#mainDivH3')
const loginForm = document.querySelector('#login-form')
const emailForm = document.querySelector('#email-form')
const loginBtn = document.querySelector('#loginBtn')
const singupBtn = document.querySelector('#signupBtn')
const logoutBtn = document.querySelector('#logoutBtn')
const editUserBtn = document.querySelector('#editUserBtn')

// EVENT HANDLERS

occasionSelect.addEventListener("change", event => {
	console.log(event.target.value)
	renderOccasion(event.target.value)
})

cardDiv.addEventListener('click', event => {
	if (event.target.matches("img")) {
		console.log(event.target.src)
		renderCardImage(event.target.src, event.target.alt)
	}
})

navDiv.addEventListener('click', event => {
	if (event.target.matches('#loginBtn')) {
		console.log(event.target)
		renderLogin()
	} else if (event.target.matches('#logoutBtn')) {
		renderLoggedOut()
	}
})

loginForm.addEventListener('submit', event => {
	event.preventDefault()
	console.log(event.target.email.value)
	userEmail = event.target.email.value
	fetchGetEmail()
})

// FETCHERS

function fetchGetEmail() {
	fetch("http://localhost:3000/api/v1/users")
		.then(response => response.json())
		.then(usersArray => {
			console.log(usersArray)
			renderLoggedIn(usersArray)
		})
}

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

function renderCardImage(src, alt) {
	cardImage.src = src
	cardImage.alt = alt
}

function renderLogin() {
	cardImage.style.display = 'none'
	mainDivH1.style.display = 'none'
	mainDivH3.style.display = 'none'
	loginForm.style.display = ''
}

function renderLoggedIn(usersArray) {
	const emailArray = []
	usersArray.forEach(user => {
		emailArray.push(user.email)
	})

	if (emailArray.includes(userEmail)) {
		loginForm.style.display = 'none'
		cardImage.style.display = ''
		mainDivH1.style.display = ''
		emailForm.style.display = ''
		loginBtn.style.display = 'none'
		singupBtn.style.display = 'none'
		logoutBtn.style.display = ''
		editUserBtn.style.display = ''
	} else {
		const p = document.createElement("p")
		p.style.color = "red"
		p.textContent = "Email does not match an existing account. Please try again or sign up."
		loginForm.append(p)
	}
}

function renderLoggedOut() {
	mainDivH1.style.display = ''
	mainDivH3.style.display = ''
	emailForm.style.display = 'none'
	loginBtn.style.display = ''
	singupBtn.style.display = ''
	logoutBtn.style.display = 'none'
	editUserBtn.style.display = 'none'
}

// INITIALIZERS