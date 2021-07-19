const addButton = document.getElementById("plus");
const background = document.querySelector(".background");
const checks = document.getElementsByClassName("check");
const edits = document.getElementsByClassName("edit");
const confirmAddButton = document.querySelector(".menu-right button");
const inputFields = document.querySelectorAll(".form input");
const container = document.querySelector("#container");
const logoutButton = document.querySelector("#logout");

var uid;

let currentCard = null;

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		uid = user.uid;
	} else {
		window.location = "../";
	}
});

logoutButton.addEventListener("click", () => {
	firebase
		.auth()
		.signOut()
		.then(() => {
			window.location = "../";
		});
});

addButton.addEventListener("click", toggleDisplay);

background.addEventListener("click", (event) => {
	if (event.target != background) return;
	toggleDisplay();
});

for (let i = 0; i < checks.length; i++) {
	const check = checks.item(i);
	check.addEventListener("click", () => {
		handleCardClick(check);
	});
}

for (let i = 0; i < edits.length; i++) {
	const edit = edits.item(i);
	edit.addEventListener("click", () => {
		handleEdit(edit);
	});
}

confirmAddButton.addEventListener("click", () => {
	let inputs = [];
	for (let i = 0; i < inputFields.length; i++) {
		const val = inputFields.item(i).value;

		if (val === undefined || val.trim() == "") {
			alert("Invalid card!");
			return;
		}

		inputs.push(inputFields.item(i).value);
		inputFields.item(i).value = "";
	}

	if (currentCard == null) {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = justKillMeAlready();

		const textDiv = card.querySelector(".card-text");

		textDiv.querySelector(".course").innerText = inputs[0];
		textDiv.querySelector("h3").innerText = inputs[1];

		const date = new Date(inputs[2]);

		textDiv.querySelector(".due").innerText = date.toLocaleTimeString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

		const check = card.querySelector(".check");
		check.addEventListener("click", () => {
			handleCardClick(check);
		});

		const edit = card.querySelector(".edit");
		edit.addEventListener("click", () => {
			handleEdit(edit);
		});
		firebase
			.database()
			.ref("tasks/" + uid)
			.push({
				course: inputs[0],
				name: inputs[1],
				due: date.getTime(),
			})
			.then((snap) => {
				card.id = snap.key;
			});

		container.append(card);
	} else {
		const textDiv = currentCard.querySelector(".card-text");
		textDiv.querySelector(".course").innerText = inputs[0];
		textDiv.querySelector("h3").innerText = inputs[1];

		const date = new Date(inputs[2]);

		textDiv.querySelector(".due").innerText = date.toLocaleTimeString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		tasksRef.child(currentCard.id).set({
			course: inputs[0],
			name: inputs[1],
			due: date.getTime(),
		});
	}

	toggleDisplay();
});

function handleEdit(edit) {
	const card = edit.parentElement.parentElement;
	currentCard = card;

	const textDiv = card.querySelector(".card-text");

	toggleDisplay();

	inputFields.item(0).value = textDiv.querySelector(".course").innerText;
	inputFields.item(1).value = textDiv.querySelector("h3").innerText;

	const date = new Date(textDiv.querySelector(".due").innerText);

	inputFields.item(2).value = new Date(
		date.getTime() - date.getTimezoneOffset() * 60000
	)
		.toISOString()
		.substring(0, 16);
}

function toggleDisplay() {
	inputFields.forEach((field) => {
		field.value = "";
	});
	if (background.style.display != "none") {
		currentCard = null;
		background.style.display = "none";
	} else {
		if (currentCard == null) {
			confirmAddButton.innerText = "Add";
		} else {
			confirmAddButton.innerText = "Edit";
		}

		background.style.display = "flex";
	}
}

function handleCardClick(check) {
	const card = check.parentElement.parentElement;
	const style = card.style;
	style.transition = "opacity 1s";
	style.opacity = "0";
	setTimeout(() => {
		card.remove();
	}, 1000);
}

function justKillMeAlready() {
	return `<div class="card-text">
					<p class="course"></p>
					<h3></h3>
					<p class="due"></p>
				</div>
				<div class="card-icons">
					<svg
						class="edit"
						width="40"
						height="40"
						viewBox="0 0 40 40"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<mask id="path-1-inside-1" fill="white">
							<path
								d="M19.5 1C9.28273 1 1 9.28273 1 19.5C1 29.7173 9.28273 38 19.5 38C29.7173 38 38 29.7173 38 19.5C38 9.28273 29.7173 1 19.5 1ZM19.5 35.6875C10.5599 35.6875 3.3125 28.4401 3.3125 19.5C3.3125 10.5599 10.5599 3.3125 19.5 3.3125C28.4401 3.3125 35.6875 10.5599 35.6875 19.5C35.6875 28.4401 28.4401 35.6875 19.5 35.6875Z"
							/>
						</mask>
						<path
							d="M19.5 1C9.28273 1 1 9.28273 1 19.5C1 29.7173 9.28273 38 19.5 38C29.7173 38 38 29.7173 38 19.5C38 9.28273 29.7173 1 19.5 1ZM19.5 35.6875C10.5599 35.6875 3.3125 28.4401 3.3125 19.5C3.3125 10.5599 10.5599 3.3125 19.5 3.3125C28.4401 3.3125 35.6875 10.5599 35.6875 19.5C35.6875 28.4401 28.4401 35.6875 19.5 35.6875Z"
							fill="#1B1B1B"
						/>
						<path
							d="M19.5 -2C7.62587 -2 -2 7.62587 -2 19.5H4C4 10.9396 10.9396 4 19.5 4V-2ZM-2 19.5C-2 31.3741 7.62587 41 19.5 41V35C10.9396 35 4 28.0604 4 19.5H-2ZM19.5 41C31.3741 41 41 31.3741 41 19.5H35C35 28.0604 28.0604 35 19.5 35V41ZM41 19.5C41 7.62587 31.3741 -2 19.5 -2V4C28.0604 4 35 10.9396 35 19.5H41ZM19.5 32.6875C12.2167 32.6875 6.3125 26.7833 6.3125 19.5H0.3125C0.3125 30.097 8.90302 38.6875 19.5 38.6875V32.6875ZM6.3125 19.5C6.3125 12.2167 12.2167 6.3125 19.5 6.3125V0.3125C8.90302 0.3125 0.3125 8.90302 0.3125 19.5H6.3125ZM19.5 6.3125C26.7833 6.3125 32.6875 12.2167 32.6875 19.5H38.6875C38.6875 8.90302 30.097 0.3125 19.5 0.3125V6.3125ZM32.6875 19.5C32.6875 26.7833 26.7833 32.6875 19.5 32.6875V38.6875C30.097 38.6875 38.6875 30.097 38.6875 19.5H32.6875Z"
							fill="#1B1B1B"
							mask="url(#path-1-inside-1)"
						/>
						<path
							d="M20 22.5C21.3807 22.5 22.5 21.3807 22.5 20C22.5 18.6193 21.3807 17.5 20 17.5C18.6193 17.5 17.5 18.6193 17.5 20C17.5 21.3807 18.6193 22.5 20 22.5Z"
							fill="#1B1B1B"
						/>
						<path
							d="M28.75 22.5C30.1307 22.5 31.25 21.3807 31.25 20C31.25 18.6193 30.1307 17.5 28.75 17.5C27.3693 17.5 26.25 18.6193 26.25 20C26.25 21.3807 27.3693 22.5 28.75 22.5Z"
							fill="#1B1B1B"
						/>
						<path
							d="M11.25 22.5C12.6307 22.5 13.75 21.3807 13.75 20C13.75 18.6193 12.6307 17.5 11.25 17.5C9.86929 17.5 8.75 18.6193 8.75 20C8.75 21.3807 9.86929 22.5 11.25 22.5Z"
							fill="#1B1B1B"
						/>
					</svg>

					<svg
						class="check"
						width="40"
						height="40"
						viewBox="0 0 37 37"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M0 18.5C0 8.28273 8.28273 0 18.5 0C28.7173 0 37 8.28273 37 18.5C37 28.7173 28.7173 37 18.5 37C8.28273 37 0 28.7173 0 18.5ZM2.3125 18.5C2.3125 27.4401 9.55988 34.6875 18.5 34.6875C27.4401 34.6875 34.6875 27.4401 34.6875 18.5C34.6875 9.55988 27.4401 2.3125 18.5 2.3125C9.55988 2.3125 2.3125 9.55988 2.3125 18.5ZM25.5381 12.7654L16.6364 21.667L12.7802 17.8108L10.4017 20.1893L16.6364 26.4239L27.9165 15.1438L25.5381 12.7654Z"
							fill="#1B1B1B"
						/>
					</svg>
				</div>`;
}
