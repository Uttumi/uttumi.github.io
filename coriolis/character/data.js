const API_KEY = 'AIzaSyAj85tNtqNMhdHnpa3k5b26t1bH7ifzPGc';

const CLIENT_ID = 'YOUR_CLIENT_ID';
const FILE_ID = 'YOUR_FILE_ID';


const dataDocumentID = '667da190acd3cb34a85e36c9';
const masterKey = '$2a$10$z7kTzBxBINyFZRqC7uYAp.uM2TiTXU7bsoBiW/thrMk.B/inT6eo.';

let NPOINT_ID = '';


const autosaveDelaySeconds = 30;
let saveTimeout;

document.addEventListener('DOMContentLoaded', () => {
	
	// Parse the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');
    
    if (documentId) {
        // If we have a document ID, set it and load the character
        NPOINT_ID = documentId;
        loadCharacter();
    } else {
        console.log('No document ID provided. Using local storage.');
    }
	
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', scheduleAutoSave);
    });
});

function scheduleAutoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveCharacter();
    }, autosaveDelaySeconds * 1000); // Check every 15 minutes
}



async function fetchNPointJSON()
{
    try {
        const response = await fetch(`https://api.npoint.io/${NPOINT_ID}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        processCharacterData(data);
    } catch (error) {
        console.error('Error fetching JSON:', error);
        alert('Failed to fetch character data. Loading from local storage.');
        loadFromLocalStorage();
    }
}

async function updateNPointJSON(jsonData)
{
	const url = `https://api.npoint.io/${NPOINT_ID}`;
	
	console.log('Using URL ', url);
	
    try {
        const response = await fetch(`https://api.npoint.io/${NPOINT_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ${response.status}');
        }
        console.log('Character saved successfully!');
        lastSaveTime = Date.now();
        saveToLocalStorage(jsonData);
    } catch (error) {
        console.error('Error updating JSON:', error);
        alert('Failed to save character data to npoint. Saved to local storage.');
        saveToLocalStorage(jsonData);
    }
}



function saveToLocalStorage(jsonData)
{
    localStorage.setItem(`coriolis_character_${NPOINT_ID}`, jsonData);
}

function loadFromLocalStorage()
{
    const data = localStorage.getItem(`coriolis_character_${NPOINT_ID}`);
    if (data) {
        processCharacterData(data);
    } else {
        alert('No character data found in local storage.');
    }
}




//loadGoogleAPIClient();

// Load the Google API client library
function loadGoogleAPIClient()
{
    gapi.load('client:auth2', initGoogleClient);
}

// Initialize the Google API client
function initGoogleClient()
{
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: 'https://www.googleapis.com/auth/drive.file'
    }).then(function () {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        console.error('Error initializing Google API client:', error);
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        // User is signed in, you can now make API calls
    } else {
        // User is not signed in, prompt for sign in
        gapi.auth2.getAuthInstance().signIn();
    }
}

function fetchJSONGoogle() {
    gapi.client.drive.files.get({
        fileId: FILE_ID,
        alt: 'media'
    }).then(function(response) {
        const jsonData = JSON.stringify(response.result, null, 2);
        document.getElementById('jsonContent').value = jsonData;
        loadCharacter(response.result);
    }, function(error) {
        console.error('Error fetching JSON:', error);
        alert('Failed to fetch character data. Please try again.');
    });
}

function updateJSONGoogle(jsonData) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';
    const metadata = {
        'mimeType': contentType
    };

    const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        jsonData +
        close_delim;

    const request = gapi.client.request({
        'path': '/upload/drive/v3/files/' + FILE_ID,
        'method': 'PATCH',
        'params': {'uploadType': 'multipart'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });

    request.execute(function(file) {
        console.log('File updated:', file);
        alert('Character saved successfully!');
    });
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


function fetchJSON()
{
	// let req = new XMLHttpRequest();

	// req.onreadystatechange = () => {
		// if (req.readyState == XMLHttpRequest.DONE)
		// {
			// const jsonData = req.responseText;
			// document.getElementById('jsonContent').value = JSON.stringify(jsonData, null, 2);
			// loadCharacter(jsonData)
		// }
	// };

	// req.open("GET", 'https://api.jsonbin.io/v3/b/'+dataDocumentID, true);
	// req.setRequestHeader("X-Master-Key", masterKey);
	// req.setRequestHeader("X-Bin-Meta", "false");
	// req.send();
	
	
    fetch(
		'https://api.jsonbin.io/v3/b/${dataDocumentID}', 
		{
			method: 'GET',
			headers: {
				'X-Master-Key': masterKey,
				'X-Bin-Meta': 'false'
			}
		}
	)
    .then(
		response => {
			if (!response.ok)
			{
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		}
	)
    .then(
		data => {
			document.getElementById('jsonContent').value = JSON.stringify(data, null, 2);
			processCharacterData(data);
		}
	)
    .catch(
		error => {
			console.error('Error fetching JSON:', error);
			alert('Failed to fetch character data. Please try again.');
		}
	);	
}

function updateJSON(jsonData)
{
	// let req = new XMLHttpRequest();

	// req.onreadystatechange = () => {
		// if (req.readyState == XMLHttpRequest.DONE)
		// {
			// console.log(req.responseText);
			// alert('Character saved successfully!');
		// }
	// };

	// req.open("PUT", 'https://api.jsonbin.io/v3/b/'+dataDocumentID, true);
	// req.setRequestHeader("X-Master-Key", masterKey);
	// req.setRequestHeader("Content-Type", "application/json");
	// req.send(jsonData);
	
	
	fetch(`https://api.jsonbin.io/v3/b/${dataDocumentID}`, {
        method: 'PUT',
        headers: {
            'X-Master-Key': masterKey,
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(result => {
        console.log(result);
        alert('Character saved successfully!');
    })
    .catch(error => {
        console.error('Error updating JSON:', error);
        alert('Failed to save character data. Please try again.');
    });	
}

function fetchJSONGoogle()
{
	const fileId = document.getElementById('fileId').value;
	gapi.client.drive.files.get(
		{
			fileId: fileId,
			alt: 'media'
		}
	).then(
		function(response)
		{
			document.getElementById('jsonContent').value = JSON.stringify(response.result, null, 2);
		},
		function(error)
		{
			console.error("Error fetching JSON:", error);
		}
	);
}

function updateJSONGoogle()
{
	const fileId = document.getElementById('fileId').value;
	const content = document.getElementById('jsonContent').value;

	const blob = new Blob([content], {type: 'application/json'});
	const metadata = {
		'mimeType': 'application/json',
	};

	const form = new FormData();
	form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
	form.append('file', blob);

	fetch(
		`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
		{
			method: 'PATCH',
			headers: new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token}),
			body: form
		}
	).then(response =>
		{
			console.log("File updated successfully");
		}
	).catch(error =>
		{
			console.error("Error updating file:", error);
		}
	);
}

function saveCharacter() {
    const character = {
        basicInfo: {},
        attributesAndSkills: {},
        talents: [],
        experience: 0,
        trauma: {},
        radiation: 0,
        inventory: {
            weapons: [],
            gear: [],
            armor: [],
        },
        notes: '',
        peopleMet: '',
        conceptNotes: '',
        cabin: {}
    };

    // Helper function to safely get element value
    function safeGetValue(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id '${id}' not found`);
            return '';
        }
        return element.value;
    }

    // Basic Info
    ['name', 'background', 'concept', 'icon', 'group-concept', 'reputation', 'personal-problem', 'appearance', 'character-notes'].forEach(id => {
        character.basicInfo[id.replace('-', '')] = safeGetValue(id);
    });

    // Attributes and Skills
    for (const [attribute, skills] of Object.entries(skillsByAttribute)) {
        console.log(`Processing attribute: ${attribute}`);
        character.attributesAndSkills[attribute] = {
            original: parseInt(safeGetValue(`${attribute}-original`)) || 0,
            current: parseInt(safeGetValue(`${attribute}-current`)) || 0,
            skills: {}
        };

        for (const skillKey of Object.keys(skills)) {
            console.log(`Processing skill: ${skillKey}`);
            character.attributesAndSkills[attribute].skills[skillKey] = parseInt(safeGetValue(skillKey)) || 0;
        }
    }

    // Talents
    const talentsTable = document.getElementById('talents-table');
    if (talentsTable) {
        character.talents = Array.from(talentsTable.rows).slice(1).map(row => ({
            name: row.cells[0].querySelector('input').value,
            description: row.cells[1].querySelector('input').value
        }));
    } else {
        console.error("Talents table not found");
    }

    // Experience, Trauma, Radiation
    character.experience = parseInt(safeGetValue('experience')) || 0;
    character.trauma = {
        stamina: parseInt(safeGetValue('stamina')) || 0,
        fatigue: parseInt(safeGetValue('fatigue')) || 0,
        mindPoints: parseInt(safeGetValue('mind-points')) || 0,
        criticalInjuries: safeGetValue('critical-injuries')
    };
    character.radiation = parseInt(safeGetValue('radiation')) || 0;

    // Inventory
    character.inventory.totalWeight = parseFloat(safeGetValue('total-weight')) || 0;
    character.inventory.birr = parseInt(safeGetValue('birr')) || 0;

    // Weapons, Gear, Armor
    ['weapons', 'gear', 'armor'].forEach(type => {
        const table = document.getElementById(`${type}-table`);
        if (table) {
            character.inventory[type] = Array.from(table.rows).slice(1).map(row => {
                const rowData = {};
                Array.from(row.cells).slice(0, -1).forEach((cell, index) => {
                    const input = cell.querySelector('input');
                    if (input) {
                        rowData[table.rows[0].cells[index].textContent.toLowerCase()] = input.type === 'number' ? parseFloat(input.value) || 0 : input.value;
                    }
                });
                return rowData;
            });
        } else {
            console.error(`${type} table not found`);
        }
    });

    character.inventory.tinyItems = safeGetValue('tiny-items');

    // Notes and other text areas
    character.notes = safeGetValue('notes');
    character.peopleMet = safeGetValue('people-met');
    character.conceptNotes = safeGetValue('concept-notes');
    character.cabin = {
        description: safeGetValue('cabin-description'),
        gear: safeGetValue('cabin-gear'),
        other: safeGetValue('cabin-other')
    };

    console.log("Character object:", character);

    const jsonData = JSON.stringify(character);
    console.log("JSON data:", jsonData);

    updateNPointJSON(jsonData);
}

/*
function saveCharacter()
{
	const character = {
		basicInfo: {
            name: document.getElementById('name').value,
            background: document.getElementById('background').value,
            concept: document.getElementById('concept').value,
            icon: document.getElementById('icon').value,
            groupConcept: document.getElementById('group-concept').value,
            reputation: document.getElementById('reputation').value,
            personalProblem: document.getElementById('personal-problem').value,
            appearance: document.getElementById('appearance').value,
            notes: document.getElementById('character-notes').value
        },
        attributesAndSkills: {},
		talents: Array.from(document.getElementById('talents-table').rows).slice(1).map(row => ({
			name: row.cells[0].querySelector('input').value,
			description: row.cells[1].querySelector('input').value
		})),
		experience: parseInt(document.getElementById('experience').value) || 0,
		trauma: {
			stamina: parseInt(document.getElementById('stamina').value) || 0,
			fatigue: parseInt(document.getElementById('fatigue').value) || 0,
			mindPoints: parseInt(document.getElementById('mind-points').value) || 0,
			criticalInjuries: document.getElementById('critical-injuries').value
		},
		radiation: parseInt(document.getElementById('radiation').value) || 0,
		inventory: {
			totalWeight: parseFloat(document.getElementById('total-weight').value) || 0,
			birr: parseInt(document.getElementById('birr').value) || 0,
			weapons: Array.from(document.getElementById('weapons-table').rows).slice(1).map(
				row => ({
					name: row.cells[0].querySelector('input').value,
					bonus: row.cells[1].querySelector('input').value,
					init: row.cells[2].querySelector('input').value,
					damage: row.cells[3].querySelector('input').value,
					crit: row.cells[4].querySelector('input').value,
					range: row.cells[5].querySelector('input').value,
					comments: row.cells[6].querySelector('input').value,
					reloads: row.cells[7].querySelector('input').value,
					weight: parseFloat(row.cells[8].querySelector('input').value) || 0
				})
			),
			gear: Array.from(document.getElementById('gear-table').rows).slice(1).map(
				row => ({
					item: row.cells[0].querySelector('input').value,
					bonus: row.cells[1].querySelector('input').value || 0,
					weight: parseFloat(row.cells[2].querySelector('input').value) || 0
				})
			),
			armor: Array.from(document.getElementById('armor-table').rows).slice(1).map(
				row => ({
					name: row.cells[0].querySelector('input').value,
					rating: parseInt(row.cells[1].querySelector('input').value) || 0,
					comment: row.cells[2].querySelector('input').value,
					weight: parseFloat(row.cells[3].querySelector('input').value) || 0
				})
			),
			tinyItems: document.getElementById('tiny-items').value
		},
		notes: document.getElementById('notes').value,
		peopleMet: document.getElementById('people-met').value,
		conceptNotes: document.getElementById('concept-notes').value,
		cabin: {
			description: document.getElementById('cabin-description').value,
			gear: document.getElementById('cabin-gear').value,
			other: document.getElementById('cabin-other').value
		}
	};

	console.log(skillsByAttribute);

	for (const [attribute, skills] of Object.entries(skillsByAttribute))
	{
		console.log(skills);
		console.log(attribute);
		
		character.attributesAndSkills[attribute] = {
			original: parseInt(document.getElementById('${attribute}-original').value) || 0,
			current: parseInt(document.getElementById('${attribute}-current').value) || 0,
			skills: {}
		};

		for (const skillKey of Object.keys(skills)) {
			character.attributesAndSkills[attribute].skills[skillKey] = parseInt(document.getElementById(skillKey).value) || 0;
		}
	}

	const jsonData = JSON.stringify(character);
	
	updateNPointJSON(jsonData);
}
*/


function loadCharacter()
{
	fetchNPointJSON();
}
	
function processCharacterData(jsonData)
{
	if (jsonData)
	{
		//const character = JSON.parse(jsonData);

		const character = jsonData;

		// Load basic info
		document.getElementById('name').value = character.basicInfo.name;
		document.getElementById('background').value = character.basicInfo.background;
		document.getElementById('concept').value = character.basicInfo.concept;
		document.getElementById('icon').value = character.basicInfo.icon;
		document.getElementById('group-concept').value = character.basicInfo.groupConcept;
		document.getElementById('reputation').value = character.basicInfo.reputation;
		document.getElementById('personal-problem').value = character.basicInfo.personalProblem;
		document.getElementById('appearance').value = character.basicInfo.appearance;
		document.getElementById('character-notes').value = character.basicInfo.notes;

		// Load attributes and skills
		for (const [attribute, data] of Object.entries(character.attributesAndSkills))
		{
			document.getElementById(`${attribute}-original`).value = data.original;
			document.getElementById(`${attribute}-current`).value = data.current;

			for (const [skillKey, skillValue] of Object.entries(data.skills))
			{
				document.getElementById(skillKey).value = skillValue;
			}
		}
		
		// Load trauma
		document.getElementById('stamina').value = character.trauma.stamina;
		document.getElementById('fatigue').value = character.trauma.fatigue;
		document.getElementById('mind-points').value = character.trauma.mindPoints;
		document.getElementById('critical-injuries').value = character.trauma.criticalInjuries;

		// Load radiation
		document.getElementById('radiation').value = character.radiation;
		
		// Load experience
		document.getElementById('experience').value = character.experience;				
		
		// Load talents
		const talentsTable = document.getElementById('talents-table');
		talentsTable.innerHTML = '<tr><th>Talent</th><th>Description</th><th>Action</th></tr>';
		character.talents.forEach(
			talent => {
				const row = talentsTable.insertRow(-1);
				const cell1 = row.insertCell(0);
				const cell2 = row.insertCell(1);
				const cell3 = row.insertCell(2);
				cell1.innerHTML = `<input type="text" value="${talent.name}">`;
				cell2.innerHTML = `<input type="text" value="${talent.description}">`;
				cell3.innerHTML = `<button onclick="removeTalent(this)">Remove</button>`;
			}
		);

		// Load inventory
		document.getElementById('total-weight').value = character.inventory.totalWeight;
		document.getElementById('birr').value = character.inventory.birr;

		// Load weapons
		const weaponsTable = document.getElementById('weapons-table');
		weaponsTable.innerHTML = '<tr><th>Name</th><th>Bonus</th><th>Damage</th><th>Crit</th><th>Range</th><th>Comments</th><th>Reloads</th><th>Weight</th></tr>';
		character.inventory.weapons.forEach(
			weapon => {
				const row = weaponsTable.insertRow(-1);
				Object.values(weapon).forEach(
					(value, index) => {
						const cell = row.insertCell(index);
						const input = document.createElement('input');
						input.type = index === 8 ? 'number' : 'text';
						input.value = value;
						input.step = index === 8 ? '0.1' : '1';
						input.min = '0';
						cell.appendChild(input);
					}
				);
			}
		);

		// Load gear
		const gearTable = document.getElementById('gear-table');
		gearTable.innerHTML = '<tr><th>Item</th><th>Bonus</th><th>Weight</th></tr>';
		character.inventory.gear.forEach(
			item => {
				const row = gearTable.insertRow(-1);
				const cell1 = row.insertCell(0);
				const cell2 = row.insertCell(1);
				const cell3 = row.insertCell(2);
				cell1.innerHTML = `<input type="text" value="${item.item}">`;
				cell2.innerHTML = `<input type="text" value="${item.bonus}">`;
				cell3.innerHTML = `<input type="number" value="${item.weight}" step="0.1" min="0">`;
			}
		);

		// Load armor
		const armorTable = document.getElementById('armor-table');
		armorTable.innerHTML = '<tr><th>Name</th><th>Rating</th><th>Comment</th><th>Weight</th><th></th></tr>';
		character.inventory.armor.forEach(armor => {
			const row = armorTable.insertRow(-1);
			Object.values(armor).forEach((value, index) => {
				const cell = row.insertCell(index);
				const input = document.createElement('input');
				input.type = index === 1 || index === 3 ? 'number' : 'text';
				input.value = value;
				input.step = index === 3 ? '0.1' : '1';
				input.min = '0';
				cell.appendChild(input);
			});
			const actionCell = row.insertCell(-1);
			actionCell.innerHTML = '<button onclick="removeArmor(this)">Remove</button>';
		});
		
		document.getElementById('tiny-items').value = character.tinyItems;

		// Load notes and other text areas
		document.getElementById('notes').value = character.notes;
		document.getElementById('people-met').value = character.peopleMet;
		document.getElementById('concept-notes').value = character.conceptNotes;
		document.getElementById('cabin-description').value = character.cabin.description;
		document.getElementById('cabin-gear').value = character.cabin.gear;
		document.getElementById('cabin-other').value = character.cabin.other;
		
		//alert('Character loaded successfully!');
		
		initializeHP();
		initializeTables();
	}
	else
	{
		alert('No saved character data found!');
	}
}