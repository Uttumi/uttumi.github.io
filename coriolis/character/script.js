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
		initializeRadiation();

		// Add event listeners for weight calculation
		document.getElementById('weapons-table').addEventListener('input', calculateTotalLoad);
		document.getElementById('gear-table').addEventListener('input', calculateTotalLoad);
		document.getElementById('armor-table').addEventListener('input', calculateTotalLoad);
	}
);

function addRow(tableId, inputTypes) {
    const table = document.getElementById(tableId);
    const row = table.insertRow(-1);
    inputTypes.forEach((type, index) => {
        const cell = row.insertCell();
		
		if(type === 'textarea')
		{
			cell.innerHTML = '<textarea placeholder="Name" rows="1" onkeyup="textAreaAdjust(this)"></textarea>';
		}
		else
		{
	        const input = document.createElement('input');
			input.type = type;
			input.name = table.rows[0].cells[index].textContent.toLowerCase();
			if (type === 'number') {
				input.min = 0;
				input.value = 0;
			}

			input.addEventListener('change', scheduleAutoSave);

			cell.appendChild(input);
		} 
    });
    addRemoveButton(row);
    return row;
}

function addTalent() {
    const row = addRow('talents-table', ['textarea', 'textarea']);
	
	addChangeListeners(row);
}

function removeTalent(button)
{
	const row = button.parentNode.parentNode;
	row.parentNode.removeChild(row);
}

function addWeapon() {
    const row = addRow('weapons-table', ['textarea', 'text', 'text', 'text', 'textarea', 'number']);
    
    // Modifiers cell
    row.cells[1].innerHTML = `
        <div class="weapon-stat">
            <span class="stat-label">+/-</span>
            <input type="number" placeholder=0>
        </div>
        <div class="weapon-stat">
            <span class="stat-label">AP</span>
            <input type="number" placeholder="0">
        </div>
    `;

    // Damage cell
    row.cells[2].innerHTML = `
        <div class="weapon-stat">
            <span class="stat-label">Dmg</span>
            <input type="number" placeholder=0>
        </div>
        <div class="weapon-stat">
            <span class="stat-label">Crit</span>
            <input type="number" placeholder=0>
        </div>
    `;

    // Range cell
	row.cells[3].innerHTML = `
		<div class="range-container">
			<select onchange="updateRangeValue(this)">
				<option value="engaged">ENGAGED</option>
				<option value="short">SHORT</option>
				<option value="medium" selected>MEDIUM</option>
				<option value="long">LONG</option>
				<option value="far">FAR</option>
				<option value="extreme">EXTREME</option>
				<option value="extreme+">EXTREME+</option>
				<option value="extreme++">EXTREME++</option>
				<option value="extreme+++">EXTREME+++</option>
			</select>
			<input type="text" class="range-value" readonly>
		</div>
	`;

    // Size cell
    row.cells[5].querySelector('input').step = 0.5;
	row.cells[5].querySelector('input').value = 1;
    row.cells[5].querySelector('input').min = 0;

    // Initialize the range value
    updateRangeValue(row.cells[3].querySelector('select'));

    calculateTotalLoad();
	
	addChangeListeners(row);
}

function updateRangeValue(selectElement) {
    const rangeValues = {
        'engaged': '2,5m [1]',
        'short': '5m [2]',
        'medium': '25m [10]',
        'long': '50m [20]',
        'far': '100m [40]',
        'extreme': '1000m [400]',
		'extreme+': '2000m [800]',
		'extreme++': '3000m [1200]',
		'extreme+++': '4000m [1600]'
    };
    const valueInput = selectElement.parentNode.querySelector('.range-value');
    valueInput.value = rangeValues[selectElement.value];
}

function addGear() {
    const row = addRow('gear-table', ['textarea', 'number', 'textarea', 'number']);
	
    row.cells[3].querySelector('input').min = 0; // Size
    row.cells[3].querySelector('input').value = 1;
    row.cells[3].querySelector('input').step = 0.5;
	
    calculateTotalLoad();
	
	addChangeListeners(row);
}

function addArmor() {
    const row = addRow('armor-table', ['textarea', 'number', 'number', 'textarea', 'number']);
	
    row.cells[1].querySelector('input').min = 0; // AR
    row.cells[1].querySelector('input').value = 0;
	
    row.cells[2].querySelector('input').min = 0; // Cover
    row.cells[2].querySelector('input').value = 6;	
	
    row.cells[4].querySelector('input').min = 0; // Size
    row.cells[4].querySelector('input').value = 1;
    row.cells[4].querySelector('input').step = 0.5;
	
    calculateTotalLoad();
	
	addChangeListeners(row);
}

function removeWeapon(button)
{
	const row = button.parentNode.parentNode;
	row.parentNode.removeChild(row);
	calculateTotalLoad();
}

function removeGear(button)
{
	const row = button.parentNode.parentNode;
	row.parentNode.removeChild(row);
	calculateTotalLoad();
}

function removeArmor(button)
{
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    calculateTotalLoad();
}

function addRemoveButton(row) {
    const cell = row.insertCell();
    const button = document.createElement('button');
    button.innerHTML = '×';
    button.className = 'remove-btn';
    button.onclick = function() {
        row.parentNode.removeChild(row);
        calculateTotalLoad();
    };
    cell.appendChild(button);
}

function calculateTotalLoad()
{
    let totalLoad = 0;

    // Calculate weapons weight
    const weaponsTable = document.getElementById("weapons-table");
    Array.from(weaponsTable.rows).slice(1).forEach(row => {
        totalLoad += parseFloat(row.cells[5].querySelector('input').value) || 0;
    });

    // Calculate gear weight
    const gearTable = document.getElementById("gear-table");
    Array.from(gearTable.rows).slice(1).forEach(row => {
        totalLoad += parseFloat(row.cells[3].querySelector('input').value) || 0;
    });

    // Calculate armor weight
    const armorTable = document.getElementById("armor-table");
    Array.from(armorTable.rows).slice(1).forEach(row => {
        totalLoad += parseFloat(row.cells[4].querySelector('input').value) || 0;
    });

    document.getElementById('total-load').value = totalLoad.toFixed(1);
	updateEncumbrance();
}

function updateEncumbrance() {
    const totalLoad = parseFloat(document.getElementById('total-load').value) || 0;
    const carryingCapacity = Math.max(1, parseFloat(document.getElementById('carrying-capacity').value) || 1);
    const encumbrance = Math.max(0, Math.ceil(totalLoad / carryingCapacity) - 1); //.toFixed(0);
    document.getElementById('encumbrance').value = encumbrance;
	
	updateAttributeModifiers();
}

function generateAttributeSkillHTML() {
    const container = document.getElementById('attributes-skills-container');
    let html = '';

    for (const [attribute, skills] of Object.entries(skillsByAttribute)) {
        html += `
            <div class="attribute-section">
                <div class="attribute-header">
                    <h3>${attribute.charAt(0).toUpperCase() + attribute.slice(1)}</h3>
                    <div class="attribute-base">
                        <input type="number" id="${attribute}-base" name="${attribute}-base" min="0" value="0">
                    </div>
                </div>
				<div class="attribute-values">
					<div class="attribute-modifiers">
						<span class="modifiers-label">Modifiers</span>
						<div class="modifiers-inputs">
							<input type="number" id="${attribute}-mod1" name="${attribute}-mod1" value="0">
							<input type="number" id="${attribute}-mod2" name="${attribute}-mod2" value="0" readonly>
						</div>
					</div>
					<div class="attribute-current">
						<span>Current</span>
						<input type="number" id="${attribute}-current" name="${attribute}-current" value="0" readonly>
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

    // Add event listeners to update current value
    for (const attribute of Object.keys(skillsByAttribute)) {
        const base = document.getElementById(`${attribute}-base`);
        const mod1 = document.getElementById(`${attribute}-mod1`);
        const mod2 = document.getElementById(`${attribute}-mod2`);
        const current = document.getElementById(`${attribute}-current`);

        function updateCurrent() {
            const baseValue = Math.max(0, parseInt(base.value) || 0);
            const mod1Value = parseInt(mod1.value) || 0;
            const mod2Value = parseInt(mod2.value) || 0;
            current.value = Math.max(0, baseValue + mod1Value + mod2Value);
        }

        base.addEventListener('input', updateCurrent);
        mod1.addEventListener('input', updateCurrent);

        // Initial update
        updateCurrent();
    }

	document.getElementById('strength').addEventListener('input', updateCarryingCapacity);
	document.getElementById('constitution-base').addEventListener('input', updateCarryingCapacity);

    // Add event listeners for exhaustion, encumbrance, and panic
    document.getElementById('exhaustion').addEventListener('input', updateAttributeModifiers);
    document.getElementById('encumbrance').addEventListener('input', updateAttributeModifiers);
    document.getElementById('panic').addEventListener('input', updateAttributeModifiers);

    updateAttributeModifiers();
}

function updateCarryingCapacity() {
	const strength = parseInt(document.getElementById('strength').value) || 0;
	const constitution = parseInt(document.getElementById('constitution-base').value) || 0;

	document.getElementById('carrying-capacity').value = strength + constitution;
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
	
	updateAttributeModifiers();
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
	
	updateAttributeModifiers();
}

function initializeRadiation() {
    createRadiationBoxes();
    updateRadiationBoxes();
}

function createRadiationBoxes() {
    const container = document.getElementById('radiation-boxes');
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

function updateRadiationBoxes()
{
    let current = parseInt(document.getElementById('current-radiation').value);
    const permanent = parseInt(document.getElementById('permanent-radiation').value) || 0;
    const boxes = document.getElementById('radiation-boxes').querySelectorAll('.box');

	if(current == NaN)
	{
		current = permanent;
	}
		
	if(current < permanent)
	{		
		current = permanent;
		document.getElementById('current-radiation').value = permanent;
	}

    boxes.forEach((box, index) => {
        if (index < current) {
            if (index < permanent) {
                box.className = 'box radiation-box full-box';
            } else {
                box.className = 'box radiation-box empty-box';
            }
        } else {
            box.className = 'box';
        }
    });
}

function updateAttributeModifiers()
{
	const constitution = document.getElementById('constitution-mod2');
	const grace = document.getElementById('grace-mod2');
	const empathy = document.getElementById('empathy-mod2');
	const wits = document.getElementById('wits-mod2');
	
	const exhaustion = parseInt(document.getElementById('exhaustion').value) || 0;
	const panic = parseInt(document.getElementById('panic').value) || 0;
	const encumbrance = parseInt(document.getElementById('encumbrance').value) || 0;
	
	constitution.value = -(exhaustion + encumbrance);
	grace.value = -(exhaustion + encumbrance);
	empathy.value = -(panic);
	wits.value = -(panic);
	
	updateAttributeCurrentValues();
}

function updateAttributeCurrentValues()
{
    for (const attribute of Object.keys(skillsByAttribute))
	{
        const base = document.getElementById(`${attribute}-base`);
        const mod1 = document.getElementById(`${attribute}-mod1`);
        const mod2 = document.getElementById(`${attribute}-mod2`);
        const current = document.getElementById(`${attribute}-current`);

        const baseValue = Math.max(0, parseInt(base.value) || 0);
        const mod1Value = parseInt(mod1.value) || 0;
        const mod2Value = parseInt(mod2.value) || 0;
        current.value = Math.max(0, baseValue + mod1Value + mod2Value);
    }
}

function centerScroll(e)
{
	const target = e.currentTarget;
	target.scrollTo(0, (target.scrollHeight - target.offsetHeight) / 2);
}

function updateTextAreas()
{
	const textAreas = document.querySelectorAll('textarea');
	
	textAreas.forEach(textArea => {
		textAreaAdjust(textArea);
	});
}