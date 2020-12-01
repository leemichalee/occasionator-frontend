// APPLICATION STATE

let userEmail;
let userFirstName;
let userLastName;
let userId;
let currentUser;

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
const signupForm = document.querySelector('#signup-form')
const editUserForm = document.querySelector('#edit-user-form')
const deleteUserBtn = document.querySelector('#deleteUserBtn')
const mainDiv = document.querySelector('.main-div')
const reminderForm = document.querySelector('#reminder-form')
const reminderUl = document.querySelector('#reminderUl')

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
	} else if (event.target.matches('#signupBtn')) {
		renderSignUp()
	} else if (event.target.matches('#editUserBtn')) {
		renderEditUser()
	}
})

loginForm.addEventListener('submit', event => {
	event.preventDefault()
	console.log(event.target.email.value)
	userEmail = event.target.email.value
	fetchGetEmail()
})

signupForm.addEventListener('submit', event => {
	event.preventDefault()
	const data = {
		"first_name": event.target.first_name.value,
		"last_name": event.target.last_name.value,
		"email": event.target.email.value
	}
	fetchPostSignUp(data)
})

editUserForm.addEventListener('submit', event => {
	event.preventDefault()
	const data = {
		'id': userId,
		'first_name': event.target.first_name.value,
		'last_name': event.target.last_name.value,
		'email': event.target.email.value
	}
	fetchPatchUser(data)
})

reminderForm.addEventListener('submit', event => {
	event.preventDefault()
	const data = {
		text: event.target.text.value,
		user_id: parseInt(userId)
	}
	fetchPostReminders(data)
})

mainDiv.addEventListener('click', event => {
	if (event.target.matches('#deleteUserBtn')) {
		console.log(event.target)
		fetchDeleteUser(userId)
	}
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

function fetchPostSignUp(data) {
	fetch('http://localhost:3000/api/v1/users', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(data),
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			userEmail = data.email
			userFirstName = data.firstName
			userLastName = data.lastName
			userId = data.id
			renderSignedUp()
	})
}

function fetchPatchUser(data) {
	fetch(`http://localhost:3000/api/v1/users/${data.id}`, {
		  method: 'PATCH',
		  headers: {
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data), 
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
			userEmail = data.email
			userFirstName = data.firstName
			userLastName = data.lastName
			alert("Your user info has been updated successfully!")
	})
}

function fetchDeleteUser(id) {
	fetch(`http://localhost:3000/api/v1/users/${id}`, {
	  method: 'DELETE',
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			alert("Account Deleted")
			renderLoggedOut()
	})
}

function fetchPostReminders(data) {
	fetch('http://localhost:3000/api/v1/reminders', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(data),
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			currentUser.reminders.push(data)
			renderEditUser()
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
	loginForm.style.display = 'none'
	signupForm.style.display = 'none'
	cardImage.style.display = ''
	mainDivH1.style.display = ''
	if (userEmail) {
		emailForm.style.display = ''
		mainDivH3.style.display = 'none'
	} else {
		mainDivH3.style.display = ''
		emailForm.style.display = 'none'
	}
}

function renderLogin() {
	cardImage.style.display = 'none'
	mainDivH1.style.display = 'none'
	mainDivH3.style.display = 'none'
	loginForm.style.display = ''
	signupForm.style.display = 'none'
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
		currentUser = usersArray.find(user => user.email === userEmail)
		userFirstName = currentUser.firstName
		userLastName = currentUser.lastName
		userId = currentUser.id
	} else {
		const p = document.createElement("p")
		p.style.color = "red"
		p.textContent = "Email does not match an existing account. Please try again or sign up."
		loginForm.append(p)
		userEmail = ''
	}
}

function renderLoggedOut() {
	mainDivH1.style.display = ''
	mainDivH3.style.display = ''
	emailForm.style.display = 'none'
	loginBtn.style.display = ''
	singupBtn.style.display = ''
	logoutBtn.style.display = 'none'
	editUserForm.style.display = 'none'
	editUserBtn.style.display = 'none'
	deleteUserBtn.style.display = 'none'
	cardImage.style.display = ''
	userEmail = ''
	userFirstName = ''
	userLastName = ''
	userId = ''
	currentUser = ''
}

function renderSignUp() {
	signupForm.style.display = ''
	mainDivH1.style.display = 'none'
	mainDivH3.style.display = 'none'
	cardImage.style.display = 'none'
	loginForm.style.display = 'none'
}

function renderSignedUp() {
	signupForm.style.display = 'none'
	cardImage.style.display = ''
	mainDivH1.style.display = ''
	emailForm.style.display = ''
	loginBtn.style.display = 'none'
	singupBtn.style.display = 'none'
	logoutBtn.style.display = ''
	editUserBtn.style.display = ''
}

function renderEditUser() {
	cardImage.style.display = 'none'
	mainDivH1.style.display = 'none'
	emailForm.style.display = 'none'
	editUserForm.style.display = ''
	editUserForm.email.value = userEmail
	editUserForm.first_name.value = userFirstName
	editUserForm.last_name.value = userLastName
	deleteUserBtn.style.display = ''
	reminderForm.style.display = ''
	reminderUl.innerHTML = ''
	reminderUl.style.display = ''
	if (currentUser.reminders) {
			currentUser.reminders.forEach( reminder => {
			const li = document.createElement("li")
			li.textContent = reminder.text
			reminderUl.append(li)
		})
	}
}