const attributes = {
	constitution: { label: 'Constitution' },
	grace: { label: 'Grace' },
	empathy: { label: 'Empathy' },
	wits: { label: 'Wits' }
};

const skillsByAttribute = {
	constitution: {
		melee: { label: 'Melee' },
		strength: { label: 'Strength' },
		endurance: { label: 'Endurance' }
	},
	grace: {
		ranged: { label: 'Ranged' },
		dexterity: { label: 'Dexterity' },
		agility: { label: 'Agility' },
		pilot: { label: 'Pilot' },
		infiltration: { label: 'Infiltration' }
	},
	empathy: {
		observation: { label: 'Observation' },
		influence: { label: 'Influence' },
		insight: { label: 'Insight' },
		culture: { label: 'Culture' },
		fortitude: { label: 'Fortitude' }
//		mysticPowers: { label: 'Mystic Powers' }
	},
	wits: {
		survival: { label: 'Survival' },
		dataDjinn: { label: 'Data Djinn' },
		medicurgy: { label: 'Medicurgy' },
		science: { label: 'Science' },
		technology: { label: 'Technology' }
	}
};

document.addEventListener(
	'DOMContentLoaded',
	function()
	{
		generateAttributeSkillHTML();

		initializeHP();
		initializeMP();

		// initializeTables();

		// Add event listeners for weight calculation
		document.getElementById('weapons-table').addEventListener('input', calculateTotalWeight);
		document.getElementById('gear-table').addEventListener('input', calculateTotalWeight);
		document.getElementById('armor-table').addEventListener('input', calculateTotalWeight);
	}
);

function initializeTables()
{
    initializeTable('weapons-table', ['Name', 'Bonus', 'Damage', 'Crit', 'Range', 'Comments', 'Reloads', 'Weight']);
    initializeTable('gear-table', ['Item', 'Bonus', 'Weight']);
    initializeTable('armor-table', ['Name', 'Rating', 'Comment', 'Weight']);
    initializeTable('talents-table', ['Talent', 'Description']);
}

function initializeTable(tableId, headers)
{
    const table = document.getElementById(tableId);
	table.textContent = '';
    const headerRow = table.insertRow(0);
    headers.forEach(
	header => 
		{
			const th = document.createElement('th');
			th.textContent = header;
			headerRow.appendChild(th);
		}
	);
    const removeHeader = document.createElement('th');
    headerRow.appendChild(removeHeader);
}

function addRow(tableId, inputTypes) {
    const table = document.getElementById(tableId);
    const row = table.insertRow(-1);
    inputTypes.forEach((type, index) => {
        const cell = row.insertCell();
        const input = document.createElement('input');
        input.type = type;
        input.name = table.rows[0].cells[index].textContent.toLowerCase();
        if (type === 'number') {
            input.min = 0;
            input.value = 0;
        }
        cell.appendChild(input);
    });
    addRemoveButton(row);
    return row;
}

// function addRow(tableId, inputTypes) {
    // const table = document.getElementById(tableId);
    // const row = table.insertRow(-1);
    // inputTypes.forEach(
		// (type, index) => {
			// const cell = row.insertCell();
			// const input = document.createElement('input');
			// input.type = type;
			// input.name = table.rows[0].cells[index].textContent.toLowerCase();
			// if (type === 'number') {
				// input.step = '0.1';
				// input.min = '0';
			// }
			// cell.appendChild(input);
		// }
	// );
    // addRemoveButton(row);
    // if (tableId !== 'talents-table')
	// {
        // calculateTotalWeight();
    // }
// }

function addTalent() {
    addRow('talents-table', ['text', 'text']);
}

function removeTalent(button)
{
	const row = button.parentNode.parentNode;
	row.parentNode.removeChild(row);
}

function addWeapon() {
    const row = addRow('weapons-table', ['text', 'text', 'number', 'number', 'text', 'text', 'text', 'number']);
    row.cells[2].querySelector('input').min = 0; // Damage
    row.cells[2].querySelector('input').value = 0;
    row.cells[3].querySelector('input').min = 0; // Crit
    row.cells[3].querySelector('input').value = 0;
    row.cells[7].querySelector('input').min = 0; // Weight
    row.cells[7].querySelector('input').value = 0;
    row.cells[7].querySelector('input').step = 0.1;
    calculateTotalWeight();
}

function addGear() {
    const row = addRow('gear-table', ['text', 'text', 'number']);
    row.cells[2].querySelector('input').min = 0; // Weight
    row.cells[2].querySelector('input').value = 0;
    row.cells[2].querySelector('input').step = 0.1;
    calculateTotalWeight();
}

function addArmor() {
    const row = addRow('armor-table', ['text', 'number', 'text', 'number']);
    row.cells[1].querySelector('input').min = 0; // Rating
    row.cells[1].querySelector('input').value = 0;
    row.cells[3].querySelector('input').min = 0; // Weight
    row.cells[3].querySelector('input').value = 0;
    row.cells[3].querySelector('input').step = 0.1;
    calculateTotalWeight();
}

function removeWeapon(button)
{
	const row = button.parentNode.parentNode;
	row.parentNode.removeChild(row);
	calculateTotalWeight();
}

function removeGear(button)
{
	const row = button.parentNode.parentNode;
	row.parentNode.removeChild(row);
	calculateTotalWeight();
}

function removeArmor(button)
{
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateTotalWeight();
}

function addRemoveButton(row) {
    const cell = row.insertCell();
    const button = document.createElement('button');
    button.innerHTML = '×';
    button.className = 'remove-btn';
    button.onclick = function() {
        row.parentNode.removeChild(row);
        calculateTotalWeight();
    };
    cell.appendChild(button);
}

function calculateTotalWeight()
{
    let totalWeight = 0;

    // Calculate weapons weight
    const weaponsTable = document.getElementById("weapons-table");
    Array.from(weaponsTable.rows).slice(1).forEach(row => {
        totalWeight += parseFloat(row.cells[7].querySelector('input').value) || 0;
    });

    // Calculate gear weight
    const gearTable = document.getElementById("gear-table");
    Array.from(gearTable.rows).slice(1).forEach(row => {
        totalWeight += parseFloat(row.cells[2].querySelector('input').value) || 0;
    });

    // Calculate armor weight
    const armorTable = document.getElementById("armor-table");
    Array.from(armorTable.rows).slice(1).forEach(row => {
        totalWeight += parseFloat(row.cells[3].querySelector('input').value) || 0;
    });

    document.getElementById('total-weight').value = totalWeight.toFixed(1);
	updateEncumbrance();
}

function updateEncumbrance() {
    const totalWeight = parseFloat(document.getElementById('total-weight').value) || 0;
    const carryingCapacity = Math.max(1, parseFloat(document.getElementById('carrying-capacity').value) || 1);
    const encumbrance = Math.max(0, Math.ceil(totalWeight / carryingCapacity) - 1); //.toFixed(0);
    document.getElementById('encumbrance').value = encumbrance;
}


function generateAttributeSkillHTML() {
    const container = document.getElementById('attributes-skills-container');
    let html = '';

    for (const [attribute, skills] of Object.entries(skillsByAttribute)) {
        html += `
            <div class="attribute-section">
                <div class="attribute-header">
                    <h3>${attribute.charAt(0).toUpperCase() + attribute.slice(1)}</h3>
                    <div class="attribute-values">
                        <input type="number" id="${attribute}-original" name="${attribute}-original" min="1" value="1">
                        <input type="number" id="${attribute}-current" name="${attribute}-current" min="1" value="1">
                    </div>
                </div>
                <div class="skills-subsection">
                    ${Object.entries(skills).map(([key, value]) => `
                        <div class="skill-row">
                            <label for="${key}">${value.label}</label>
                            <input type="number" id="${key}" name="${key}" min="0" value="0">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

function generateSkillHTML(container, items)
{
	let html = '';
	for (const [key, value] of Object.entries(items)) {
		html += `
			<div class="skill-row">
				<label for="${key}">${value.label}:</label>
				<input type="number" id="${key}" name="${key}" min="0" value="0">
			</div>
		`;
	}
	document.getElementById(container).innerHTML = html;
}

function getAttributeSkillValues(items)
{
	const values = {};
	for (const key of Object.keys(items)) {
		values[key] = {
			original: parseInt(document.getElementById(`${key}-original`).value) || 0,
			current: parseInt(document.getElementById(`${key}-current`).value) || 0
		};
	}
	return values;
}

function setAttributeSkillValues(items, values)
{
	for (const key of Object.keys(items)) {
		document.getElementById(`${key}-original`).value = values[key].original;
		document.getElementById(`${key}-current`).value = values[key].current;
	}
}

function textAreaAdjust(element)
{
	element.style.height = "1px";
	element.style.height = element.scrollHeight+"px";
}

function initializeHP() {
    createHPBoxes();
    updateHPBoxes();
}

function createHPBoxes() {
    const container = document.getElementById('hp-boxes');
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {  // Create 4 groups
        const group = document.createElement('div');
        group.className = 'box-group';
        for (let j = 0; j < 5; j++) {  // 5 boxes per group
            const box = document.createElement('div');
            box.className = 'box';
            group.appendChild(box);
        }
        container.appendChild(group);
    }
}		

function updateHPBoxes() {
    const originalHP = parseInt(document.getElementById('stamina').value) || 0;
    const fatigue = parseInt(document.getElementById('fatigue').value) || 0;
    const boxes = document.getElementById('hp-boxes').querySelectorAll('.box');

    let remainingHP = originalHP - (fatigue % originalHP);
    let exhaustion = Math.floor(fatigue / originalHP);

    document.getElementById('exhaustion').value = exhaustion;

    boxes.forEach((box, index) => {
        if (index < originalHP) {
            if (index < remainingHP) {
                box.className = 'box full-box';
            } else {
                box.className = 'box empty-box';
            }
        } else {
            box.className = 'box';
        }
    });
}

function initializeMP() {
    createMPBoxes();
    updateMPBoxes();
}

function createMPBoxes() {
    const container = document.getElementById('mp-boxes');
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const group = document.createElement('div');
        group.className = 'box-group ';
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.className = 'box';
            group.appendChild(box);
        }
        container.appendChild(group);
    }
}

function updateMPBoxes() {
    const originalMP = parseInt(document.getElementById('resolve').value) || 0;
    const stress = parseInt(document.getElementById('stress').value) || 0;
    const boxes = document.getElementById('mp-boxes').querySelectorAll('.box'); // document.querySelectorAll('.mp-box');

    let remainingMP = originalMP - (stress % originalMP);
    let panic = Math.floor(stress / originalMP);

    document.getElementById('panic').value = panic;

    boxes.forEach((box, index) => {
        if (index < originalMP) {
            if (index < remainingMP) {
                box.className = 'box full-box';
            } else {
                box.className = 'box empty-box';
            }
        } else {
            box.className = 'box';
        }
    });
}