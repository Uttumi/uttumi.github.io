function addArmor()
{
    const list = document.getElementById('armor-list');
    const card = document.createElement('div');
    card.className = 'armor-card';

    card.innerHTML = `
    <div class="armor-header">
        <input type="text" class="armor-name" placeholder="Name"></input>
        <button type="button" class="remove-btn" onclick="removeArmor(this)">close</button>
    </div>

    <div class="armor-content">
        <textarea placeholder="Features" rows="1" onkeyup="textAreaAdjust(this)"></textarea>

        <div class="armor-stats">
            <div class="armor-stat-group">
                <label class="armor-stat-label">Rating<input type="number" value=1 min="1" /></label>
                <label class="armor-stat-label">Cover<input type="number" value=6 min="1" /></label>
                <label class="armor-stat-label">Size<input type="number" value="1" min="0" step="0.5" /></label>
            </div>
        </div>
    </div>
    `;

    list.appendChild(card);

    // Add event listeners for weight calculation
    getArmorSizeElement(card).addEventListener('input', calculateTotalLoad);
    calculateTotalLoad();

    // Add event listeners for auto-save
    addChangeListeners(card);

    // Adjust textareas
    card.querySelectorAll('textarea').forEach(textarea => {
        textAreaAdjust(textarea);
    });

    return card;
}

function removeArmor(button)
{
	const card = button.closest('.armor-card');
	card.parentNode.removeChild(card);
}

function getArmorSizeElement(card)
{
    return card.querySelector('.armor-stat-group .armor-stat-label:nth-child(3) input');
}

function getArmorData()
{
    const armorItems = [];
    document.querySelectorAll('.armor-card').forEach(card => {
        const armorItem = {
            name: card.querySelector('.armor-name').value,
            rating: card.querySelector('.armor-stat-group .armor-stat-label:nth-child(1) input').value,
            cover: card.querySelector('.armor-stat-group .armor-stat-label:nth-child(2) input').value,
            size: card.querySelector('.armor-stat-group .armor-stat-label:nth-child(3) input').value,
            features: card.querySelector('textarea').value
        };
        armorItems.push(armorItem);
    });
    return armorItems;
}

function loadArmorData(armorItems)
{
    const armorList = document.getElementById('armor-list');
    armorList.innerHTML = '';

    armorItems.forEach(armorItem => {
        const card = addArmor();

        card.querySelector('.armor-name').value = armorItem.name;
        card.querySelector('.armor-stat-group .armor-stat-label:nth-child(1) input').value = armorItem.rating;
        card.querySelector('.armor-stat-group .armor-stat-label:nth-child(2) input').value = armorItem.cover;
        card.querySelector('.armor-stat-group .armor-stat-label:nth-child(3) input').value = armorItem.size;
        card.querySelector('textarea').value = armorItem.features;
        
        card.querySelectorAll('textarea').forEach(textarea => {
            textAreaAdjust(textarea);
        });
    });
}