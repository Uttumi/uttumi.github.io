let documentId = '';
let hasDocumentId = false;

const autosaveDelaySeconds = 30;
let saveTimeout;

document.addEventListener('DOMContentLoaded', () => {
	
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id)
	{
        documentId = id;
		hasDocumentId = true;
        loadCharacter();
    }
	else
	{
        console.log('No document ID provided. Using local storage.');
		//loadFromLocalStorage();
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

	character.talents = getTalentData();
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

	character.inventory.weapons = getWeaponData();
	character.inventory.gear = getGearData();
	character.inventory.armor = getArmorData();

	// const weaponList = document.getElementById('weapon-list');
	// character.inventory.weapons = Array.from(weaponList.children).map(card => ({
	// 	// name: row.cells[0].querySelector('div[contenteditable]').textContent,
	// 	name: getWeaponNameElement(card).value,
	// 	bonus: getWeaponModifierElement(card).value,
	// 	ap: getWeaponAPElement(card).value,
	// 	damage: getWeaponDamageElement(card).value,
	// 	crit: getWeaponCritElement(card).value,
	// 	range: getWeaponRangeElement(card).value,
	// 	notes: getWeaponFeaturesElement(card).value,
	// 	weight: parseFloat(getWeaponSizeElement(card).value) || 0
	// }));

    // // Gear
	// const gearTable = document.getElementById('gear-table');
	// character.inventory.gear = Array.from(gearTable.rows).slice(1).map(row => ({
	// 	name: row.cells[0].querySelector('textarea').value,
	// 	bonus: parseInt(row.cells[1].querySelector('input').value) || 0,
	// 	notes: row.cells[2].querySelector('textarea').value,
	// 	size: parseFloat(row.cells[3].querySelector('input').value) || 0
	// }));
	
	// // Armor
	// const armorTable = document.getElementById('armor-table');
	// character.inventory.armor = Array.from(armorTable.rows).slice(1).map(row => ({
	// 	name: row.cells[0].querySelector('textarea').value,
	// 	ar: parseInt(row.cells[1].querySelector('input').value) || 0,
	// 	cover: parseInt(row.cells[2].querySelector('input').value) || 0,
	// 	notes: row.cells[3].querySelector('textarea').value,
	// 	size: parseFloat(row.cells[4].querySelector('input').value) || 0
	// }));
	
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

	if(hasDocumentId)
		updateNPointJSON(jsonData);
	else
		saveToLocalStorage(jsonData);
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
			let baseElementName = `${attribute}-base`;
			let modElementName = `${attribute}-mod1`;

			// Support for name changes
			if(attribute === "constitution")
			{
				baseElementName = "vigor-base";
				modElementName = "vigor-mod1";
			}

			document.getElementById(baseElementName).value = data.base || 1;
			document.getElementById(modElementName).value = data.modifier || 1;

			for (const [skillKey, skillValue] of Object.entries(data.skills))
			{
				document.getElementById(skillKey).value = skillValue || 0;
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
		loadTalentData(character.talents);

		// Load inventory
		document.getElementById('carrying-capacity').value = character.inventory.carryingCapacity;
		document.getElementById('total-load').value = character.inventory.totalLoad;
		document.getElementById('encumbrance').value = character.inventory.encumbrance;
		document.getElementById('birr').value = character.inventory.birr;
		document.getElementById('tiny-items').value = character.inventory.tinyItems;

		loadWeaponData(character.inventory.weapons);
		loadGearData(character.inventory.gear);
		loadArmorData(character.inventory.armor);

		// Load notes and other text areas
		document.getElementById('general-notes').value = character.notes.general;
		document.getElementById('people-notes').value = character.notes.people;
		document.getElementById('place-notes').value = character.notes.places;
		document.getElementById('cabin-description').value = character.cabin.description;
		document.getElementById('cabin-gear').value = character.cabin.gear;
		document.getElementById('cabin-other').value = character.cabin.other;

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