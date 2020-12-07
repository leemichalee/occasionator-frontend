// URL

const baseUrl = "https://occasionator.herokuapp.com"

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
const reminderOl = document.querySelector('#reminderOl')
const reminderH3Div = document.querySelector('#reminderH3Div')
const editReminderForm = document.querySelector('#editReminderForm')
const deleteReminderBtn = document.querySelector('#deleteReminderBtn')
const cardH3Div = document.querySelector('#cardH3Div')
const userCardsDiv = document.querySelector('#userCardsDiv')

// EVENT HANDLERS

occasionSelect.addEventListener("change", event => {
	console.log(event.target.value)
	renderOccasion(event.target.value)
})

cardDiv.addEventListener('click', event => {
	const prevDiv = document.querySelector('#prev')
	const nextDiv = document.querySelector('#next')
	if (event.target.matches("img")) {
		console.log(event.target.src)
		renderCardImage(event.target.src, event.target.alt)
	} else if (event.target === prevDiv) {
		console.log(event.target)
		cardDiv.scrollLeft -= 300
	} else if (event.target === nextDiv) {
		console.log(event.target)
		cardDiv.scrollLeft += 300
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
	fetchCheckEmail(data)
	event.target.reset
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

reminderOl.addEventListener('click', event => {
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
		'sender_name': event.target.sender.value,
		'subject': event.target.subject.value,
		'recipient_email': event.target.recipient.value,
		'sender_email': event.target.sender_email.value,
		'message': event.target.note.value,
		'image_url': cardImage.src
	}
	fetchPostCard(data)
	event.target.reset()
})

// FETCHERS

function fetchCheckEmail(data) {
	fetch(`${baseUrl}/api/v1/users`)
		.then(response => response.json())
		.then(usersArray => {
			console.log(usersArray)
			if (!usersArray.map(user => user.email).includes(data.email)) {
				fetchPostSignUp(data)
			} else {
				alert("This account already exists. Please log in.")
				renderLogin()
			}
		})
}

function fetchGetEmail() {
	fetch(`${baseUrl}/api/v1/users`)
		.then(response => response.json())
		.then(usersArray => {
			console.log(usersArray)
			renderLoggedIn(usersArray)
		})
}

function fetchPostSignUp(data) {
	fetch(`${baseUrl}/api/v1/users`, {
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
			renderLogin()
		})
}

function fetchPatchUser(data) {
	fetch(`${baseUrl}/api/v1/users/${data.id}`, {
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
	fetch(`${baseUrl}/api/v1/users/${id}`, {
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
	fetch(`${baseUrl}/api/v1/reminders`, {
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
	fetch(`${baseUrl}/api/v1/reminders/${currentReminder}`, {
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
			currentUser.reminders.find(reminder => reminder.id == currentReminder).text = `${data.text}`
		})
}

function fetchDeleteReminder() {
	fetch(`${baseUrl}/api/v1/reminders/${currentReminder}`, {
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
	fetch(`${baseUrl}/api/v1/cards`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			emailCard(data)
		})
}

function emailCard(data) {
	var templateParams = {
		senderName: `${data.sender_name}`,
		message: `${data.message}`,
		subject: `${data.subject}`,
		recipientEmail: `${data.recipient_email}`,
		senderEmail: `${data.sender_email}`,
		greetingCard: `${data.image_url}`
	};
	emailjs.send('service_rjoa90u', 'template_n1vmcb1', templateParams)
		.then(function (response) {
			console.log('SUCCESS!', response.status, response.text);
			alert("Email Greeting Sent!")
			currentUser.cards.push(data)
			renderEditUser()
		}, function (error) {
			console.log('FAILED...', error);
			alert("There was a problem sending your email. Please try again.")
		});
}

function fetchDeleteCard(id) {
	fetch(`${baseUrl}/api/v1/cards/${id}`, {
		method: 'DELETE',
	})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data)
			document.querySelector(`tr[data-cardid="${id}"]`).closest('table').remove()
			deletedCardsArray.push(currentUser.cards.find(card => card.id == id))
		})
}

// RENDERERS

function renderOccasion(occasion) {
	if (occasion === "birthday") {
		cardDiv.innerHTML = `
			<div id="prev">&#10094;</div>
			<div id="next">&#10095;</div>
			<img src="https://i.ibb.co/6Z9sZdd/birthday01.jpg" alt="birthday01">
			<img src="https://i.ibb.co/cNx9R4V/birthday02.jpg" alt="birthday02">
			<img src="https://i.ibb.co/F8YcLvq/birthday03.jpg" alt="birthday03">
			<img src="https://i.ibb.co/kqk1CR9/birthday04.jpg" alt="birthday04">
			<img src="https://i.ibb.co/BKz2rZZ/birthday05.jpg" alt="birthday05">
			<img src="https://i.ibb.co/1QZFjbd/birthday06.jpg" alt="birthday06">
			<img src="https://i.ibb.co/Zfdd9wV/birthday07.jpg" alt="birthday07">
			<img src="https://i.ibb.co/xmcXw65/birthday08.jpg" alt="birthday08">
		`
	} else if (occasion === "christmas") {
		cardDiv.innerHTML = `
			<div id="prev">&#10094;</div>
			<div id="next">&#10095;</div>
			<img src="https://i.ibb.co/nDXkTtL/christmas01.jpg" alt="christmas01">
			<img src="https://i.ibb.co/6nVRWr0/christmas02.jpg" alt="christmas02">
			<img src="https://i.ibb.co/LrxsXMm/christmas03.jpg" alt="christmas03">
			<img src="https://i.ibb.co/CKrLhdX/christmas04.jpg" alt="christmas04">
			<img src="https://i.ibb.co/1nwSN0p/christmas05.jpg" alt="christmas05">
			<img src="https://i.ibb.co/Km5W9fG/christmas06.jpg" alt="christmas06">
			<img src="https://i.ibb.co/TtF9Y6z/christmas07.jpg" alt="christmas07">
			<img src="https://i.ibb.co/H4kL8b3/christmas08.jpg" alt="christmas08">
		`
	} else if (occasion === "fathers") {
		cardDiv.innerHTML = `
			<div id="prev">&#10094;</div>
			<div id="next">&#10095;</div>
			<img src="https://i.ibb.co/G36tSNY/fathers01.jpg" alt="fathers01">
			<img src="https://i.ibb.co/wrbY3Mn/fathers02.jpg" alt="fathers02">
			<img src="https://i.ibb.co/qRQQYxk/fathers03.jpg" alt="fathers03">
			<img src="https://i.ibb.co/vQV2dPj/fathers04.jpg" alt="fathers04">
			<img src="https://i.ibb.co/VQ5kg2k/fathers05.jpg" alt="fathers05">
			<img src="https://i.ibb.co/vXVZ82P/fathers06.jpg" alt="fathers06">
			<img src="https://i.ibb.co/QDsLYH3/fathers07.jpg" alt="fathers07">
			<img src="https://i.ibb.co/JdDYRSP/fathers08.jpg" alt="fathers08">
		`
	} else if (occasion === "hanukkah") {
		cardDiv.innerHTML = `
			<div id="prev">&#10094;</div>
			<div id="next">&#10095;</div>
			<img src="https://i.ibb.co/87F3dnf/hanukkah01.jpg" alt="hanukkah01">
			<img src="https://i.ibb.co/NTXbjrm/hanukkah02.jpg" alt="hanukkah02">
			<img src="https://i.ibb.co/kXFdDZy/hanukkah03.jpg" alt="hanukkah03">
			<img src="https://i.ibb.co/ThgFJ5V/hanukkah04.jpg" alt="hanukkah04">
			<img src="https://i.ibb.co/GP1JPpf/hanukkah05.jpg" alt="hanukkah05">
			<img src="https://i.ibb.co/HHKyThJ/hanukkah06.jpg" alt="hanukkah06">
			<img src="https://i.ibb.co/jR0kCcm/hanukkah07.jpg" alt="hanukkah07">
			<img src="https://i.ibb.co/tXRtd4T/hanukkah08.jpg" alt="hanukkah08">
		`
	} else if (occasion === "holidays") {
		cardDiv.innerHTML = `
			<div id="prev">&#10094;</div>
			<div id="next">&#10095;</div>
			<img src="https://i.ibb.co/tMvFC9k/holidays01.jpg" alt="holidays01">
			<img src="https://i.ibb.co/YcW6FSL/holidays02.jpg" alt="holidays02">
			<img src="https://i.ibb.co/ynbWpNd/holidays03.jpg" alt="holidays03">
			<img src="https://i.ibb.co/Fh8sVqg/holidays04.jpg" alt="holidays04">
			<img src="https://i.ibb.co/1mT2PXG/holidays05.jpg" alt="holidays05">
			<img src="https://i.ibb.co/bLsDHz4/holidays06.jpg" alt="holidays06">
			<img src="https://i.ibb.co/0tTTSSN/holidays07.jpg" alt="holidays07">
			<img src="https://i.ibb.co/7CnLVLg/holidays08.jpg" alt="holidays08">
		`
	} else if (occasion === "mothers") {
		cardDiv.innerHTML = `
			<div id="prev">&#10094;</div>
			<div id="next">&#10095;</div>
			<img src="https://i.ibb.co/5jdbQc2/mothers01.jpg" alt="mothers01">
			<img src="https://i.ibb.co/k9Z1ytr/mothers02.jpg" alt="mothers02">
			<img src="https://i.ibb.co/dt6SMVM/mothers03.jpg" alt="mothers03">
			<img src="https://i.ibb.co/b7j0bSL/mothers04.jpg" alt="mothers04">
			<img src="https://i.ibb.co/hHTZsR3/mothers05.jpg" alt="mothers05">
			<img src="https://i.ibb.co/YPGWLn0/mothers06.jpg" alt="mothers06">
			<img src="https://i.ibb.co/HFnqkS2/mothers07.jpg" alt="mothers07">
			<img src="https://i.ibb.co/L0ZTDQV/mothers08.jpg" alt="mothers08">
		`
	} else if (occasion === "valentines") {
		cardDiv.innerHTML = `
			<div id="prev">&#10094;</div>
			<div id="next">&#10095;</div>
			<img src="https://i.ibb.co/br2XnxZ/valentines01.jpg" alt="valentines01">
			<img src="https://i.ibb.co/WyV0hm9/valentines02.jpg" alt="valentines02">
			<img src="https://i.ibb.co/gvxXVty/valentines03.jpg" alt="valentines03">
			<img src="https://i.ibb.co/VjywZ75/valentines04.jpg" alt="valentines04">
			<img src="https://i.ibb.co/MBh8MdL/valentines05.jpg" alt="valentines05">
			<img src="https://i.ibb.co/hHxp2Sz/valentines06.jpg" alt="valentines06">
			<img src="https://i.ibb.co/D9VWx9c/valentines07.jpg" alt="valentines07">
			<img src="https://i.ibb.co/xj1Q7Lf/valentines08.jpg" alt="valentines08">
		`
	}
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
	reminderOl.style.display = 'none'
	reminderForm.style.display = 'none'
	deleteUserBtn.style.display = 'none'
	editUserForm.style.display = 'none'
	cardH3Div.style.display = 'none'
	userCardsDiv.style.display = 'none'
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
		alert("Email does not match an existing account. Please try again or sign up.")
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
	reminderOl.style.display = 'none'
	reminderForm.style.display = 'none'
	editUserBtn.style.display = 'none'
	deleteUserBtn.style.display = 'none'
	userEmail = ''
	userFirstName = ''
	userLastName = ''
	userId = ''
	currentUser = ''
	cardH3Div.style.display = 'none'
	userCardsDiv.style.display = 'none'
}

function renderSignUp() {
	signupForm.style.display = ''
	mainDivH1.style.display = 'none'
	mainDivH3.style.display = 'none'
	cardImage.style.display = 'none'
	loginForm.style.display = 'none'
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
	reminderOl.innerHTML = ''
	reminderOl.style.display = ''
	userCardsDiv.style.display = ''

	if (currentUser.reminders) {
		reminderH3Div.style.display = ''
		reminderH3Div.innerHTML = ''
		const reminderH3 = document.createElement('h3')
		reminderH3.textContent = "Your Reminders: Click a reminder to edit or delete"
		reminderH3Div.append(reminderH3)
		currentUser.reminders.forEach(reminder => {
			if (!deletedRemindersArray.includes(reminder)) {
				const li = document.createElement("li")
				li.dataset.id = reminder.id
				li.textContent = reminder.text
				reminderOl.append(li)
			}
		})
	}

	if (currentUser.cards) {
		cardH3Div.style.display = ''
		cardH3Div.innerHTML = ''
		userCardsDiv.innerHTML = ''
		const cardH3 = document.createElement('h3')
		cardH3.textContent = "Your Sent Cards: Click on a card to delete"
		cardH3Div.append(cardH3)

		currentUser.cards.forEach(card => {
			if (!deletedCardsArray.includes(card)) {
				if (card.imageUrl) {
					const table = document.createElement('table')
					table.classList.add("userCardsTable", "pink")
					table.innerHTML = `
						<tr data-cardid = ${card.id}>
							<td align="center">
								<div class="container">
									<img class="image" src=${card.imageUrl} alt="Greeting Card">
		 							<div class="middle">
		 								<div class="text">Delete</div>
		 							</div>
		 						</div>
							</td>
						</tr>
						<tr><td>Recipient Email: ${card.recipientEmail}</td></tr>
						<tr><td>Sender Email: ${card.senderEmail}</td></tr>
						<tr><td class="message">Message: ${card.message}</td></tr>
					`
					userCardsDiv.append(table)
				} else if (card.image_url) {
					const table = document.createElement('table')
					table.classList.add("userCardsTable", "pink")
					table.innerHTML = `
						<tr data-cardid = ${card.id}>
							<td align="center">
								<div class="container">
									<img class="image" src=${card.image_url} alt="Greeting Card">
		 							<div class="middle">
		 								<div class="text">Delete</div>
		 							</div>
		 						</div>
							</td>
						</tr>
						<tr><td>Recipient Email: ${card.recipient_email}</td></tr>
						<tr><td>Sender Email: ${card.sender_email}</td></tr>
						<tr><td class="message">Message: ${card.message}</td></tr>
					`
					userCardsDiv.append(table)
				}
			}
			document.querySelectorAll(".text").forEach( image => image.addEventListener('click', event => fetchDeleteCard(card.id)) )
		})
	}
}

function renderReminderOptions() {
	editReminderForm.style.display = ''
	deleteReminderBtn.style.display = ''
}