let documentId = '';

const autosaveDelaySeconds = 30;
let saveTimeout;

document.addEventListener('DOMContentLoaded', () => {
	
	// Parse the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id)
	{
        // If we have a document ID, set it and load the character
        documentId = id;
        loadCharacter();
    }
	else
	{
        console.log('No document ID provided. Using local storage.');
    }
	
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', scheduleAutoSave);
    });
});

function scheduleAutoSave()
{
    clearTimeout(saveTimeout);
	
    saveTimeout = setTimeout(
		() => { saveCharacter(); }, 
		autosaveDelaySeconds * 1000
	);
}

async function fetchNPointJSON()
{
    try {
        const response = await fetch(`https://api.npoint.io/${documentId}`);
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
	const url = `https://api.npoint.io/${documentId}`;
	
	console.log('Using URL ', url);
	
    try {
        const response = await fetch(`https://api.npoint.io/${documentId}`, {
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
    localStorage.setItem(`coriolis_character_${documentId}`, jsonData);
}

function loadFromLocalStorage()
{
    const data = localStorage.getItem(`coriolis_character_${documentId}`);
    if (data) {
        processCharacterData(data);
    } else {
        alert('No character data found in local storage.');
    }
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

    // Experience
    character.experience = parseInt(safeGetValue('experience')) || 0;

	// Trauma
	character.trauma = {
		stamina: parseInt(safeGetValue('stamina')) || 0,
		fatigue: parseInt(safeGetValue('fatigue')) || 0,
		resolve: parseInt(safeGetValue('resolve')) || 0,
		stress: parseInt(safeGetValue('stress')) || 0,
		radiation: parseInt(safeGetValue('radiation')) || 0,
		criticalInjuries: safeGetValue('critical-injuries'),
	};

    // Inventory
	character.inventory = {
		carryingCapacity: parseFloat(safeGetValue('carrying-capacity')) || 1,
		totalWeight: parseFloat(safeGetValue('total-weight')) || 0,
		encumbrance: parseFloat(safeGetValue('encumbrance')) || 0,
		birr: parseInt(safeGetValue('birr')) || 0,
		weapons: [],
		gear: [],
		armor: [],
		tinyItems: safeGetValue('tiny-items')
	};

    // Weapons, Gear, Armor
    // ['weapons', 'gear', 'armor'].forEach(type => {
        // const table = document.getElementById(`${type}-table`);
        // if (table) {
            // character.inventory[type] = Array.from(table.rows).slice(1).map(row => {
                // const rowData = {};
                // Array.from(row.cells).slice(0, -1).forEach((cell, index) => {
                    // const input = cell.querySelector('input');
                    // if (input) {
                        // rowData[table.rows[0].cells[index].textContent.toLowerCase()] = input.type === 'number' ? parseFloat(input.value) || 0 : input.value;
                    // }
                // });
                // return rowData;
            // });
        // } else {
            // console.error(`${type} table not found`);
        // }
    // });

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
		document.getElementById('resolve').value = character.trauma.resolve;
		document.getElementById('stress').value = character.trauma.stress;
		document.getElementById('radiation').value = character.radiation;
		document.getElementById('critical-injuries').value = character.trauma.criticalInjuries;

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
		document.getElementById('carrying-capacity').value = character.inventory.carryingCapacity;
		document.getElementById('total-weight').value = character.inventory.totalWeight;
		document.getElementById('encumbrance').value = character.inventory.encumbrance;
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
		
	    // Set default values for attributes and skills if they're not present in the loaded data
        for (const [attribute, data] of Object.entries(character.attributesAndSkills)) {
            document.getElementById(`${attribute}-original`).value = data.original || 1;
            document.getElementById(`${attribute}-current`).value = data.current || 1;

            for (const [skillKey, skillValue] of Object.entries(data.skills)) {
                document.getElementById(skillKey).value = skillValue || 0;
            }
        }

        // Set default values for other fields
        document.getElementById('stamina').value = character.trauma.stamina || 1;
        document.getElementById('fatigue').value = character.trauma.fatigue || 0;
        document.getElementById('resolve').value = character.trauma.resolve || 1;
        document.getElementById('stress').value = character.trauma.stress || 0;
        document.getElementById('radiation').value = character.radiation || 0;
        document.getElementById('experience').value = character.experience || 0;
        document.getElementById('birr').value = character.inventory.birr || 0;
        document.getElementById('carrying-capacity').value = character.inventory.carryingCapacity || 1;
	
		
		initializeHP();
		initializeMP();
		initializeTables();
		updateEncumbrance();
	}
	else
	{
		alert('No saved character data found!');
	}
}