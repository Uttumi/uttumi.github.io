let documentId = '';

const autosaveDelaySeconds = 30;
let saveTimeout;

document.addEventListener('DOMContentLoaded', () => {
	
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id)
	{
        documentId = id;
        loadCharacter();
    }
	else
	{
        console.log('No document ID provided. Using local storage.');
		loadFromLocalStorage();
    }
	
	addChangeListeners(document);
});

function addChangeListeners(element)
{
	const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', scheduleAutoSave);
    });	
}

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
		const url = `https://api.npoint.io/${documentId}`;

		console.log(`Trying to get json from ${url}`);
		
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        processCharacterData(data);
    } catch (error) {
        console.log('Error fetching JSON:', error);
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
        console.log('Error updating JSON:', error);
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
        inventory: {
            weapons: [],
            gear: [],
            armor: [],
        },
        notes: {},
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
	character.basicInfo = {
		name: safeGetValue('name'),
		background: safeGetValue('background'),
		concept: safeGetValue('concept'),
		icon: safeGetValue('icon'),
		groupConcept: safeGetValue('group-concept'),
		reputation: safeGetValue('reputation'),
		personalProblem: safeGetValue('personal-problem'),
		appearance: safeGetValue('appearance'),
		notes: safeGetValue('character-notes')
	};	

    // Attributes and Skills
    for (const [attribute, skills] of Object.entries(skillsByAttribute)) {
        console.log(`Processing attribute: ${attribute}`);
        character.attributesAndSkills[attribute] = {
            base: parseInt(safeGetValue(`${attribute}-base`)) || 0,
            modifier: parseInt(safeGetValue(`${attribute}-mod1`)) || 0,
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
            name: row.cells[0].querySelector('textarea').value,
            description: row.cells[1].querySelector('textarea').value
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
		radiation: {
			current:  parseInt(safeGetValue('current-radiation')) || 0,
			permanent:  parseInt(safeGetValue('permanent-radiation')) || 0
		},
		criticalInjuries: safeGetValue('critical-injuries'),
	};

    // Inventory
	character.inventory = {
		carryingCapacity: parseFloat(safeGetValue('carrying-capacity')) || 1,
		totalLoad: parseFloat(safeGetValue('total-load')) || 0,
		encumbrance: parseFloat(safeGetValue('encumbrance')) || 0,
		birr: parseInt(safeGetValue('birr')) || 0,
		weapons: [],
		gear: [],
		armor: [],
		tinyItems: safeGetValue('tiny-items')
	};

	// Weapons
	const weaponsTable = document.getElementById('weapons-table');
	character.inventory.weapons = Array.from(weaponsTable.rows).slice(1).map(row => ({
		// name: row.cells[0].querySelector('div[contenteditable]').textContent,
		name: row.cells[0].querySelector('textarea').value,
		bonus: row.cells[1].querySelectorAll('input')[0].value,
		ap: row.cells[1].querySelectorAll('input')[1].value,
		damage: row.cells[2].querySelectorAll('input')[0].value,
		crit: row.cells[2].querySelectorAll('input')[1].value,
		range: row.cells[3].querySelector('select').value,
		rangeValue: row.cells[3].querySelector('input[type="text"]').value,
		notes: row.cells[4].querySelector('textarea').value,
		weight: parseFloat(row.cells[5].querySelector('input').value) || 0
	}));

    // Gear
	const gearTable = document.getElementById('gear-table');
	character.inventory.gear = Array.from(gearTable.rows).slice(1).map(row => ({
		name: row.cells[0].querySelector('textarea').value,
		bonus: parseInt(row.cells[1].querySelector('input').value) || 0,
		notes: row.cells[2].querySelector('textarea').value,
		size: parseFloat(row.cells[3].querySelector('input').value) || 0
	}));
	
	// Armor
	const armorTable = document.getElementById('armor-table');
	character.inventory.armor = Array.from(armorTable.rows).slice(1).map(row => ({
		name: row.cells[0].querySelector('textarea').value,
		ar: parseInt(row.cells[1].querySelector('input').value) || 0,
		cover: parseInt(row.cells[2].querySelector('input').value) || 0,
		notes: row.cells[3].querySelector('textarea').value,
		size: parseFloat(row.cells[4].querySelector('input').value) || 0
	}));
	
    // ['armor'].forEach(type => {
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
	character.notes = {
		general: safeGetValue('general-notes'),
		people: safeGetValue('people-notes'),
		places: safeGetValue('place-notes')
	};
	
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
			document.getElementById(`${attribute}-base`).value = data.base;
			document.getElementById(`${attribute}-mod1`).value = data.modifier;

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
		document.getElementById('current-radiation').value = character.trauma.radiation.current;
		document.getElementById('permanent-radiation').value = character.trauma.radiation.permanent;
		document.getElementById('critical-injuries').value = character.trauma.criticalInjuries;

		// Load experience
		document.getElementById('experience').value = character.experience;				
		
		// Load talents
        const talentsTable = document.getElementById('talents-table');
        // Clear existing rows except the header
        while (talentsTable.rows.length > 1) {
            talentsTable.deleteRow(1);
        }
        character.talents.forEach(talent => {
            addTalent();
            const lastRow = talentsTable.rows[talentsTable.rows.length - 1];
            lastRow.cells[0].querySelector('textarea').value = talent.name;
            lastRow.cells[1].querySelector('textarea').value = talent.description;
        });

		// Load inventory
		document.getElementById('carrying-capacity').value = character.inventory.carryingCapacity;
		document.getElementById('total-load').value = character.inventory.totalLoad;
		document.getElementById('encumbrance').value = character.inventory.encumbrance;
		document.getElementById('birr').value = character.inventory.birr;
		document.getElementById('tiny-items').value = character.inventory.tinyItems;

		// Load weapons
		const weaponsTable = document.getElementById('weapons-table');
		// Clear existing rows except the header
		while (weaponsTable.rows.length > 1) {
			weaponsTable.deleteRow(1);
		}
		character.inventory.weapons.forEach(weapon => {
			addWeapon();
			const lastRow = weaponsTable.rows[weaponsTable.rows.length - 1];
			lastRow.cells[0].querySelector('textarea').textContent = weapon.name;
			lastRow.cells[1].querySelectorAll('input')[0].value = weapon.bonus;
			lastRow.cells[1].querySelectorAll('input')[1].value = weapon.ap;
			lastRow.cells[2].querySelectorAll('input')[0].value = weapon.damage;
			lastRow.cells[2].querySelectorAll('input')[1].value = weapon.crit;
			lastRow.cells[3].querySelector('select').value = weapon.range;
			updateRangeValue(lastRow.cells[3].querySelector('select'));
			lastRow.cells[4].querySelector('textarea').value = weapon.notes;
			lastRow.cells[5].querySelector('input').value = weapon.weight;
		});

		// Load gear
		const gearTable = document.getElementById('gear-table');
		// Clear existing rows except the header
		while (gearTable.rows.length > 1) {
			gearTable.deleteRow(1);
		}
		character.inventory.gear.forEach(item => {
			addGear();
			const lastRow = gearTable.rows[gearTable.rows.length - 1];
			lastRow.cells[0].querySelector('textarea').value = item.name;
			lastRow.cells[1].querySelector('input').value = item.bonus;
			lastRow.cells[2].querySelector('textarea').value = item.notes;
			lastRow.cells[3].querySelector('input').value = item.size;
		});

        // Load armor
        const armorTable = document.getElementById('armor-table');
        // Clear existing rows except the header
        while (armorTable.rows.length > 1) {
            armorTable.deleteRow(1);
        }
        character.inventory.armor.forEach(armor => {
            addArmor();
            const lastRow = armorTable.rows[armorTable.rows.length - 1];
            lastRow.cells[0].querySelector('textarea').value = armor.name;
            lastRow.cells[1].querySelector('input').value = armor.ar;
            lastRow.cells[2].querySelector('input').value = armor.cover;
            lastRow.cells[3].querySelector('textarea').value = armor.notes;
            lastRow.cells[4].querySelector('input').value = armor.size;
        });

		// Load notes and other text areas
		document.getElementById('general-notes').value = character.notes.general;
		document.getElementById('people-notes').value = character.notes.people;
		document.getElementById('place-notes').value = character.notes.places;
		document.getElementById('cabin-description').value = character.cabin.description;
		document.getElementById('cabin-gear').value = character.cabin.gear;
		document.getElementById('cabin-other').value = character.cabin.other;
		
	    // Set default values for attributes and skills if they're not present in the loaded data
        for (const [attribute, data] of Object.entries(character.attributesAndSkills)) {
            document.getElementById(`${attribute}-base`).value = data.base || 1;
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
        document.getElementById('current-radiation').value = character.trauma.radiation.current || 0;
		document.getElementById('permanent-radiation').value = character.trauma.radiation.permanent || 0;
        document.getElementById('experience').value = character.experience || 0;
        document.getElementById('birr').value = character.inventory.birr || 0;
        document.getElementById('carrying-capacity').value = character.inventory.carryingCapacity || 1;
	
		
		initializeHP();
		initializeMP();
		initializeRadiation();

		calculateTotalLoad();
		
		updateAttributeModifiers();
		
		updateTextAreas();
	}
	else
	{
		alert('No saved character data found!');
	}
}