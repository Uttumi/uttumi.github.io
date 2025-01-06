function addTalent()
{
    const list = document.getElementById('talent-list');
    const card = document.createElement('div');
    card.className = 'talent-card';

    card.innerHTML = `
    <div class="talent-header">
        <input type="text" class="talent-name" placeholder="Name"></input>
        <input type="number" class="talent-level" value="1" min="1"></input>
        <button type="button" class="remove-btn" onclick="removeTalent(this)">close</button>
    </div>

    <textarea placeholder="Features" rows="1" onkeyup="textAreaAdjust(this)"></textarea>
    `;

    list.appendChild(card);

    // Add event listeners for auto-save
    addChangeListeners(card);

    // Adjust textareas
    card.querySelectorAll('textarea').forEach(textarea => {
        textAreaAdjust(textarea);
    });

    return card;
}

function removeTalent(button)
{
	const card = button.closest('.talent-card');
	card.parentNode.removeChild(card);
}

function getTalentData()
{
    const talents = [];
    document.querySelectorAll('.talent-card').forEach(card => {
        const talent = {
            name: card.querySelector('.talent-name').value,
            level: card.querySelector('.talent-level').value,
            features: card.querySelector('textarea').value
        };
        talents.push(talent);
    });
    return talents;
}

function loadTalentData(talents)
{
    const talentList = document.getElementById('talent-list');
    talentList.innerHTML = '';

    talents.forEach(talent => {
        const card = addTalent();

        card.querySelector('.talent-name').value = talent.name;
        card.querySelector('.talent-level').value = talent.level;
        card.querySelector('textarea').value = talent.features;
        
        card.querySelectorAll('textarea').forEach(textarea => {
            textAreaAdjust(textarea);
        });
    });
}