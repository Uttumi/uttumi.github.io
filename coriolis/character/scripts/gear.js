function addGear()
{
    const list = document.getElementById('gear-list');
    const card = document.createElement('div');
    card.className = 'gear-card';

    card.innerHTML = `
    <div class="gear-header">
        <input type="text" class="gear-name" placeholder="Name"></input>
        <button type="button" class="remove-btn" onclick="removeGear(this)">close</button>
    </div>

    <div class="gear-content">
        <textarea placeholder="Features" rows="1" onkeyup="textAreaAdjust(this)"></textarea>

        <div class="gear-stats">
            <div class="gear-stat-group">
                <label class="gear-stat-label">+/-<input type="number" value=0 /></label>
                <label class="gear-stat-label">Size<input type="number" value="1" min="0" step="0.5" /></label>
            </div>
        </div>
    </div>
    `;

    list.appendChild(card);

    // Add event listeners for weight calculation
    getGearSizeElement(card).addEventListener('input', calculateTotalLoad);
    calculateTotalLoad();

    // Add event listeners for auto-save
    addChangeListeners(card);

    // Adjust textareas
    card.querySelectorAll('textarea').forEach(textarea => {
        textAreaAdjust(textarea);
    });

    return card;
}

function removeGear(button)
{
	const card = button.closest('.gear-card');
	card.parentNode.removeChild(card);
}

function getGearSizeElement(card)
{
    return card.querySelector('.gear-stat-group .gear-stat-label:last-child input');
}

function getGearData()
{
    const gearItems = [];
    document.querySelectorAll('.gear-card').forEach(card => {
        const gearItem = {
            name: card.querySelector('.gear-name').value,
            modifier: card.querySelector('.gear-stat-group .gear-stat-label:first-child input').value,
            size: card.querySelector('.gear-stat-group .gear-stat-label:last-child input').value,
            features: card.querySelector('textarea').value
        };
        gearItems.push(gearItem);
    });
    return gearItems;
}

function loadGearData(gearItems)
{
    const gearList = document.getElementById('gear-list');
    gearList.innerHTML = '';

    gearItems.forEach(gearItem => {
        const card = addGear();

        card.querySelector('.gear-name').value = gearItem.name;
        card.querySelector('.gear-stat-group .gear-stat-label:first-child input').value = gearItem.modifier;
        card.querySelector('.gear-stat-group .gear-stat-label:last-child input').value = gearItem.size;
        card.querySelector('textarea').value = gearItem.features;
        
        card.querySelectorAll('textarea').forEach(textarea => {
            textAreaAdjust(textarea);
        });
    });
}