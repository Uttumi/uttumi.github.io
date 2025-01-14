const rangeValues = {
	'0': '2,5m [1]',
	'1': '5m [2]',
	'2': '25m [10]',
	'3': '50m [20]',
	'4': '100m [40]',
	'5': '1000m [400]',
	'6': '2000m [800]',
	'7': '3000m [1200]',
	'8': '4000m [1600]'
};

function addWeapon()
{
	const weaponsList = document.getElementById('weapon-list');
    const weaponCard = document.createElement('div');
    weaponCard.className = 'weapon-card';

    weaponCard.innerHTML = `
		<div class="weapon-header">
			<input type="text" class="weapon-name" placeholder="Name"></input>
			<button type="button" class="remove-btn" onclick="removeWeapon(this)">close</button>
		</div>
		
		<div class="weapon-stats">
			<div class="weapon-stat-group">
				<label class="weapon-stat-label">+/-<input type="number" value=0 /></label>
				<label class="weapon-stat-label">AP<input type="number" value=0 /></label>
			</div>

			<div class="weapon-stat-group">
				<label class="weapon-stat-label">Dmg<input type="number" value=0 /></label>
				<label class="weapon-stat-label">Crit<input type="number" value=0 /></label>
			</div>
			
			<div class="weapon-stat-group">
				<label class="weapon-stat-label">Shots<input type="number" value=0 /></label>
				<label class="weapon-stat-label">Size<input type="number" value="1" min="0" step="0.5" oninput="calculateTotalLoad()" /></label>
			</div>

			<div class="range-container">
				<select class="range-selector" onchange="updateRangeValue(this)">
					<option value="0">MELEE</option>
					<option value="1">CLOSE</option>
					<option value="2" selected>SHORT</option>
					<option value="3">MEDIUM</option>
					<option value="4">LONG</option>
					<option value="5">EXTREME</option>
					<option value="6">EXTREME+</option>
					<option value="7">EXTREME++</option>
					<option value="8">EXTREME+++</option>
				</select>
				<label class="range-value">
			</div>
		</div>

		<textarea placeholder="Features" rows="1" onkeyup="textAreaAdjust(this)"></textarea>
    `;

    weaponsList.appendChild(weaponCard);

    updateRangeValue(weaponCard.querySelector('select'));

    calculateTotalLoad();

    addChangeListeners(weaponCard);

    weaponCard.querySelectorAll('textarea').forEach(textarea => {
        textAreaAdjust(textarea);
    });

    return weaponCard;
}

function removeWeapon(button)
{
    const weaponCard = button.closest('.weapon-card');
    weaponCard.remove();
}

function getWeaponSizeElement(card)
{
    return card.querySelector('.weapon-stat-group:nth-child(3) .weapon-stat-label:last-child input');
}

function updateRangeValue(selectElement)
{
    const valueLabel = selectElement.parentNode.querySelector('.range-value');
    valueLabel.innerText = rangeValues[selectElement.value];
}

function getWeaponData()
{
    const weapons = [];
    document.querySelectorAll('.weapon-card').forEach(card => {
        const weapon = {
            name: card.querySelector('.weapon-name').value,
            modifier: card.querySelector('.weapon-stat-group:nth-child(1) .weapon-stat-label:first-child input').value,
            ap: card.querySelector('.weapon-stat-group:nth-child(1) .weapon-stat-label:last-child input').value,
            damage: card.querySelector('.weapon-stat-group:nth-child(2) .weapon-stat-label:first-child input').value,
            crit: card.querySelector('.weapon-stat-group:nth-child(2) .weapon-stat-label:last-child input').value,
            shots: card.querySelector('.weapon-stat-group:nth-child(3) .weapon-stat-label:first-child input').value,
            size: card.querySelector('.weapon-stat-group:nth-child(3) .weapon-stat-label:last-child input').value,
            range: card.querySelector('.range-selector').value,   
            features: card.querySelector('textarea').value,
        };
        weapons.push(weapon);
    });
    return weapons;
}

function loadWeaponData(weapons)
{
    const weaponsList = document.getElementById('weapon-list');
    weaponsList.innerHTML = '';

    weapons.forEach(weapon => {
        const card = addWeapon();

        card.querySelector('.weapon-name').value = weapon.name;
        card.querySelector('.weapon-stat-group:nth-child(1) .weapon-stat-label:first-child input').value = weapon.modifier;
        card.querySelector('.weapon-stat-group:nth-child(1) .weapon-stat-label:last-child input').value = weapon.ap;
        card.querySelector('.weapon-stat-group:nth-child(2) .weapon-stat-label:first-child input').value = weapon.damage;
        card.querySelector('.weapon-stat-group:nth-child(2) .weapon-stat-label:last-child input').value = weapon.crit;
        card.querySelector('.weapon-stat-group:nth-child(3) .weapon-stat-label:first-child input').value = weapon.shots;
        card.querySelector('.weapon-stat-group:nth-child(3) .weapon-stat-label:last-child input').value = weapon.size;
        card.querySelector('.range-selector').value = weapon.range;
        card.querySelector('textarea').value = weapon.features;
        
        card.querySelectorAll('textarea').forEach(textarea => {
            textAreaAdjust(textarea);
        });

        updateRangeValue(card.querySelector('.range-selector'));
    });
}