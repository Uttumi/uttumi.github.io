// const attributes = {
// 	vigor: { label: 'Vigor' },
// 	grace: { label: 'Grace' },
// 	empathy: { label: 'Empathy' },
// 	wits: { label: 'Wits' }
// };

const skillsByAttribute = {
	vigor: {
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
		culture: { label: 'Culture' },
		fortitude: { label: 'Fortitude' }
		//mysticPowers: { label: 'Mystic Powers' }
	},
	wits: {
		survival: { label: 'Survival' },
		dataDjinn: { label: 'Data Djinn' },
		medicurgy: { label: 'Medicurgy' },
		science: { label: 'Science' },
		technology: { label: 'Technology' }
	}
};

let exhaustionTimer;
let panicTimer;
const typingInterval = 500;

document.addEventListener(
	'DOMContentLoaded',
	function()
	{
		generateAttributeSkillHTML();

		initializeHP();
		initializeMP();
		initializeRadiation();

		// Add event listeners for weight calculation
		// document.getElementById('weapons-table').addEventListener('input', calculateTotalLoad);
		// document.getElementById('gear-list').addEventListener('input', calculateTotalLoad);
		// document.getElementById('armor-list').addEventListener('input', calculateTotalLoad);
	}
);

// function addRow(tableId, inputTypes)
// {
//     const table = document.getElementById(tableId);
//     const row = table.insertRow(-1);
//     inputTypes.forEach((type, index) => {
//         const cell = row.insertCell();
		
// 		if(type === 'textarea')
// 		{
// 			cell.innerHTML = '<textarea placeholder="Name" rows="1" onkeyup="textAreaAdjust(this)"></textarea>';
// 		}
// 		else
// 		{
// 	        const input = document.createElement('input');
// 			input.type = type;
// 			input.name = table.rows[0].cells[index].textContent.toLowerCase();
// 			if (type === 'number') {
// 				input.min = 0;
// 				input.value = 0;
// 			}

// 			input.addEventListener('change', scheduleAutoSave);

// 			cell.appendChild(input);
// 		} 
//     });
//     addRemoveButton(row);
//     return row;
// }

// function addRemoveButton(row) {
//     const cell = row.insertCell();
//     const button = document.createElement('button');
//     button.innerHTML = '×';
//     button.className = 'remove-btn';
//     button.onclick = function() {
//         row.parentNode.removeChild(row);
//         calculateTotalLoad();
//     };
//     cell.appendChild(button);
// }

function calculateTotalLoad()
{
    let totalLoad = 0;

    // Calculate weapons weight
    const weaponList = document.getElementById("weapon-list");
    for (card of weaponList.children) 
    {
        totalLoad += parseFloat(getWeaponSizeElement(card).value) || 0;
    }

    // Calculate gear weight
    const gearList = document.getElementById("gear-list");
    for (card of gearList.children) 
    {
        totalLoad += parseFloat(getGearSizeElement(card).value) || 0;
    }

    // Calculate armor weight
    const armorList = document.getElementById("armor-list");
    for (card of armorList.children) 
    {
        totalLoad += parseFloat(getArmorSizeElement(card).value) || 0;
    }

    document.getElementById('total-load').value = totalLoad.toFixed(1);
	updateEncumbrance();
}

function updateEncumbrance()
{
    const totalLoad = parseFloat(document.getElementById('total-load').value) || 0;
    const carryingCapacity = Math.max(1, parseFloat(document.getElementById('carrying-capacity').value) || 1);
    const encumbrance = Math.max(0, Math.ceil(totalLoad / carryingCapacity) - 1); //.toFixed(0);
    document.getElementById('encumbrance').value = encumbrance;
	
	updateAttributeModifiers();
}

function generateAttributeSkillHTML()
{
    const container = document.getElementById('attributes-skills-container');
    let html = '';

    for (const [attribute, skills] of Object.entries(skillsByAttribute)) {
        html += `
            <div class="attribute-section">
                <div class="attribute-header">
                    <h3>${attribute.charAt(0).toUpperCase() + attribute.slice(1)}</h3>
                    <input type="number" id="${attribute}-base" name="${attribute}-base" min="0" value="0">
                </div>
                <hr>
				<div class="attribute-values">
					<div class="attribute-modifiers">
						<h4 class="modifiers-label">+/-</h4>
						<div class="modifiers-inputs">
							<input type="number" id="${attribute}-mod1" name="${attribute}-mod1" value="0">
							<input type="number" id="${attribute}-mod2" name="${attribute}-mod2" value="0" readonly>
						</div>
					</div>
					<div class="attribute-current">
						<h4 class="modifiers-label" for="${attribute}-current">Current</h4>
						<input type="number" id="${attribute}-current" name="${attribute}-current" value="0" readonly>
					</div>
				</div>
                <hr>
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
	document.getElementById('vigor-base').addEventListener('input', updateCarryingCapacity);

    // Add event listeners for exhaustion, encumbrance, and panic
    document.getElementById('exhaustion').addEventListener('input', updateAttributeModifiers);
    document.getElementById('encumbrance').addEventListener('input', updateAttributeModifiers);
    document.getElementById('panic').addEventListener('input', updateAttributeModifiers);

    updateAttributeModifiers();
}

function updateCarryingCapacity()
{
	const strength = parseInt(document.getElementById('strength').value) || 0;
	const vigor = parseInt(document.getElementById('vigor-base').value) || 0;

	document.getElementById('carrying-capacity').value = strength + vigor;
}

function textAreaAdjust(element)
{
    element.style.height = 'auto';
	element.style.height = element.scrollHeight+"px";
}

function initializeHP()
{
    createHPBoxes();
    updateHPBoxes();
}

function createHPBoxes()
{
    const container = document.getElementById('hp-boxes');
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {  // Create 4 groups
        const group = document.createElement('div');
        group.className = 'box-group';
        for (let j = 0; j < 5; j++) {  // 5 boxes per group
            const box = document.createElement('div');
            box.className = 'box inactive-box';
            group.appendChild(box);
        }
        container.appendChild(group);
    }
}		

function updateHPBoxes()
{
	const staminaStr = document.getElementById('stamina').value;
	const fatigueStr = document.getElementById('fatigue').value;
	
    const stamina = parseInt(staminaStr) || 0;
    const fatigue = parseInt(fatigueStr) || 0;
    const boxes = document.getElementById('hp-boxes').querySelectorAll('.box');

    clearTimeout(exhaustionTimer);
    if (staminaStr !== '' && fatigueStr !== '')
	{
        exhaustionTimer = setTimeout(
			() => {
				let exhaustion = Math.floor(fatigue / stamina);
				let exhaustionInput = document.getElementById('exhaustion');
				addChangeEffect(exhaustionInput, exhaustion);
				exhaustionInput.value = exhaustion;
				updateAttributeModifiers();
			}, 
			typingInterval
		);
    }

    let remainingHP = stamina - (fatigue % stamina);
    
    boxes.forEach((box, index) => {
        if (index < stamina) {
            if (index < remainingHP) {
                box.className = 'box full-box';
            } else {
                box.className = 'box empty-box';
            }
        } else {
            box.className = 'box inactive-box';
        }
    });
}


function initializeMP()
{
    createMPBoxes();
    updateMPBoxes();
}

function createMPBoxes()
{
    const container = document.getElementById('mp-boxes');
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const group = document.createElement('div');
        group.className = 'box-group ';
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.className = 'box inactive-box';
            group.appendChild(box);
        }
        container.appendChild(group);
    }
}

function updateMPBoxes()
{
	const resolveStr = document.getElementById('resolve').value;
	const stressStr = document.getElementById('stress').value;
	
    const resolve = parseInt(resolveStr) || 0;
    const stress = parseInt(stressStr) || 0;
    const boxes = document.getElementById('mp-boxes').querySelectorAll('.box');

    clearTimeout(panicTimer);
    if (resolveStr !== '' && stressStr !== '')
	{
        panicTimer = setTimeout(
			() => {
				let panic = Math.floor(stress / resolve);
				let panicInput = document.getElementById('panic');
				addChangeEffect(panicInput, panic);
				panicInput.value = panic;
				updateAttributeModifiers();
			}, 
			typingInterval
		);
    }

    let remainingMP = resolve - (stress % resolve);
    
    boxes.forEach((box, index) => {
        if (index < resolve) {
            if (index < remainingMP) {
                box.className = 'box full-box';
            } else {
                box.className = 'box empty-box';
            }
        } else {
            box.className = 'box inactive-box';
        }
    });
	
	updateAttributeModifiers();
}

function initializeRadiation()
{
    createRadiationBoxes();
    updateRadiationBoxes();
}

function createRadiationBoxes()
{
    const container = document.getElementById('radiation-boxes');
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const group = document.createElement('div');
        group.className = 'box-group ';
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.className = 'box inactive-box';
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
            box.className = 'box inactive-box';
        }
    });
}

function updateAttributeModifiers()
{
	const vigor = document.getElementById('vigor-mod2');
	const grace = document.getElementById('grace-mod2');
	const empathy = document.getElementById('empathy-mod2');
	const wits = document.getElementById('wits-mod2');
	
	const exhaustion = parseInt(document.getElementById('exhaustion').value) || 0;
	const panic = parseInt(document.getElementById('panic').value) || 0;
	const encumbrance = parseInt(document.getElementById('encumbrance').value) || 0;
	
	vigor.value = -(exhaustion + encumbrance);
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

function addChangeEffect(input, newValue)
{
	input.classList.remove('input-increase', 'input-decrease');
	
	const oldValue = parseInt(input.value);
	
	if (newValue > oldValue) {
		input.classList.add('input-increase');
	} else if (newValue < oldValue) {
		input.classList.add('input-decrease');
	}
	
	setTimeout(() => {
		input.classList.remove('input-increase', 'input-decrease');
	}, 1000);
}