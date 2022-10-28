var modalInstruction = document.getElementById("modalInstruction");
var btnInstruction = document.getElementById("instruction");
var closeInstructionButton = document.getElementById("closeInstructionButton");

btnInstruction.onclick = function() {
    modalInstruction.style.display = "block";
};

closeInstructionButton.onclick = function() {
    modalInstruction.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modalInstruction) {
    modalInstruction.style.display = "none";
  }
};

async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries());
	const formDataJsonString = JSON.stringify(plainFormData);

	const fetchOptions = {
    method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: formDataJsonString,
	};

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	return response.json();
}

async function handleFormSubmit(event) {
	event.preventDefault();
	const form = event.currentTarget;
	const url = form.action;
	try {
		const formData = new FormData(form);
		const responseData = await postFormDataAsJson({ url, formData });
		await setUserFullAmount(responseData.msg[0].fullAmount);
		await showPage(responseData);

	} catch (error) {
		console.error(error);
	}
}

async function setUserFullAmount (fullAmount) {
	let balance = document.getElementById('balanceAmount');
	balance.innerText = fullAmount;
}

function isAuthorized (resolve) {
	if(resolve.hasOwnProperty('isAuthorized') && resolve['isAuthorized'] == true) {
		return true
	}
	return false
}

async function showPage (resolve) {
	if (isAuthorized(resolve)) {
		let root = document.getElementById('root');
		let authForm = document.getElementById('authForm');
		authForm.style.display = 'none'
		root.style.display = 'flex';
	}
}

const authForm = document.getElementById("authForm")
authForm.addEventListener("submit", handleFormSubmit);