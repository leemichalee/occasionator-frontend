// APPLICATION STATE

let userEmail;
let userFirstName;
let userLastName;
let userId;
let currentUser;
let currentReminder;
let deletedRemindersArray = []
let deletedCardsArray = []

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
const cardUl = document.querySelector('#cardUl')
const reminderH3Div = document.querySelector('#reminderH3Div')
const editReminderForm = document.querySelector('#editReminderForm')
const deleteReminderBtn = document.querySelector('#deleteReminderBtn')
const cardH3Div = document.querySelector('#cardH3Div')

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
	event.target.reset()
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
	event.target.reset()
})

mainDiv.addEventListener('click', event => {
	if (event.target.matches('#deleteUserBtn')) {
		console.log(event.target)
		fetchDeleteUser(userId)
	}
})

reminderUl.addEventListener('click', event => {
	if (event.target.matches('li')) {
		currentReminder = event.target.dataset.id
		editReminderForm.text.value = event.target.textContent
		renderReminderOptions()
	}
})

editReminderForm.addEventListener('submit', event => {
	event.preventDefault()
	data = {
		"text": event.target.text.value
	}
	fetchPatchReminder(data)
	event.target.reset()
})

deleteReminderBtn.addEventListener('click', event => {
	fetchDeleteReminder()
})

emailForm.addEventListener('submit', event => {
	event.preventDefault()
	const data = {
		'user_id': userId,
		'recipient_email': event.target.recipient.value,
		'message': event.target.note.value,
		'image_url': cardImage.src
	}
	fetchPostCard(data)
	event.target.reset()
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

function fetchPatchReminder(data) {
	fetch(`http://localhost:3000/api/v1/reminders/${currentReminder}`, {
		  method: 'PATCH',
		  headers: {
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data), 
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
			document.querySelector(`li[data-id="${currentReminder}"]`).textContent = data.text
	})
}

function fetchDeleteReminder() {
	fetch(`http://localhost:3000/api/v1/reminders/${currentReminder}`, {
	  method: 'DELETE',
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			document.querySelector(`li[data-id="${currentReminder}"]`).remove()
			deletedRemindersArray.push(currentUser.reminders.find(reminder => reminder.id == currentReminder))
	})
}

function fetchPostCard(data) {
	fetch('http://localhost:3000/api/v1/cards', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(data),
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			currentUser.cards.push(data)
			renderEditUser()
	})
}

function fetchDeleteCard(id) {
	fetch(`http://localhost:3000/api/v1/cards/${id}`, {
	  method: 'DELETE',
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			document.querySelector(`li[data-cardid="${id}"]`).closest('ul').closest('li').remove()
			deletedCardsArray.push(currentUser.cards.find(card => card.id == id))
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
	editReminderForm.style.display = 'none'	
	deleteReminderBtn.style.display = 'none'
	reminderH3Div.style.display = 'none'
	reminderUl.style.display = 'none'
	reminderForm.style.display = 'none'
	deleteUserBtn.style.display = 'none'
	cardUl.style.display = 'none'
	editUserForm.style.display = 'none'
	cardH3Div.style.display = 'none'
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
	editReminderForm.style.display = 'none'	
	deleteReminderBtn.style.display = 'none'
	reminderH3Div.style.display = 'none'
	reminderUl.style.display = 'none'
	reminderForm.style.display = 'none'
	editUserBtn.style.display = 'none'
	deleteUserBtn.style.display = 'none'
	cardUl.style.display = 'none'
	userEmail = ''
	userFirstName = ''
	userLastName = ''
	userId = ''
	currentUser = ''
	cardH3Div.style.display = 'none'
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
			reminderH3Div.style.display = ''
			reminderH3Div.innerHTML = ''
			const reminderH3 = document.createElement('h3')
			reminderH3.textContent = "Your Reminders: Click a reminder to edit or delete"
			reminderH3Div.append(reminderH3)
			currentUser.reminders.forEach( reminder => {
				if (!deletedRemindersArray.includes(reminder)) {
				const li = document.createElement("li")
				li.dataset.id = reminder.id
				li.textContent = reminder.text
				reminderUl.append(li)
				}
		})
	}

	if (currentUser.cards) {
		cardH3Div.style.display = ''
			cardH3Div.innerHTML = ''
			const cardH3 = document.createElement('h3')
			cardH3.textContent = "Your Sent Cards: Click on a card to delete"
			cardH3Div.append(cardH3)
		cardUl.style.display = ''
			cardUl.innerHTML = ''
			currentUser.cards.forEach( card => {
				if (!deletedCardsArray.includes(card)) {
					const firstLi = document.createElement("li")
					const secondUl = document.createElement("ul")
					const innerLiOne = document.createElement("li")
					const innerLiTwo = document.createElement("li")
					const innerLiThree = document.createElement("li")
						if (card.imageUrl) {
							innerLiOne.innerHTML = `
								<div class="container">
									<img class="image" src=${card.imageUrl} alt="Greeting Card">
									<div class="middle">
										<div class="text">Delete</div>
									</div>
								</div>
							`
							innerLiOne.classList.add('cardListImg')
							innerLiOne.dataset.cardid = card.id
							innerLiOne.addEventListener ('click', event => {
								fetchDeleteCard(card.id)
							})
							innerLiTwo.textContent = `${card.recipientEmail}`
							innerLiThree.textContent = `${card.message}`
						} else if (card.image_url) {
							innerLiOne.innerHTML = `
							<div class="container">
								<img class="image" src=${card.image_url} alt="Greeting Card">
								<div class="middle">
									<div class="text">Delete</div>
								</div>
							</div>
							`
							innerLiOne.classList.add('cardListImg')
							innerLiOne.dataset.cardid = card.id
							innerLiOne.addEventListener ('click', event => {
								fetchDeleteCard(card.id)
							})
							innerLiTwo.textContent = `${card.recipient_email}`
							innerLiThree.textContent = `${card.message}`
						}
					secondUl.append(innerLiOne)
					secondUl.append(innerLiTwo)
					secondUl.append(innerLiThree)
					firstLi.append(secondUl)
					cardUl.append(firstLi)
				}
			})
	}
}

function renderReminderOptions() {
	editReminderForm.style.display = ''
	deleteReminderBtn.style.display = ''
}