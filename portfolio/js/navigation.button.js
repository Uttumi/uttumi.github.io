"use strict";

(function($)
{
    $.NavigationButton = function(parentElement, groupId, title, level, hidable = true, checked = false)
	{
        this.checked = checked;
        this.hidable = hidable;

        this.parent = parentElement;

        this.group = $.NavigationButton.groups[groupId];

        if(!this.group)
        {
            this.group = $.NavigationButton.groups[groupId] = [];
        }

        this.group.push(this);

        const inputId = title +'_input';

        this.label = document.createElement('LABEL');
        this.input = document.createElement('INPUT');
        this.labelText = document.createTextNode(title.replace(/_/g, ' '));

        this.label.setAttribute('for', inputId);
        this.label.appendChild(this.labelText);

        this.input.setAttribute('id', inputId);
        this.input.setAttribute('type', 'radio');
        this.input.setAttribute('name', groupId);

        this.input.addEventListener('click', this.checkClick.bind(this));

        this.parent.appendChild(this.label);
        this.parent.appendChild(this.input);
	};

    $.NavigationButton.prototype.checkClick = function(event)
    {
        const myState = !this.checked;
        this.resetGroup();
        this.setState(myState);
        this.checkHide(myState);
    };

    $.NavigationButton.prototype.setState = function(state)
    {
        this.checked = state;
        this.input.checked = state;
    };

    $.NavigationButton.prototype.resetGroup = function()
    {
        for(let button of this.group)
        {
            button.setState(false);
        }
    };

    $.NavigationButton.prototype.checkHide = function()
    {
        for(let button of this.group)
        {
            if(this.checked)
            {
                if(!button.checked) button.hide();
            }
            else
            {
                button.unhide();
            }
        }
    };

    $.NavigationButton.prototype.hide = function()
    {
        if(this.hidable) this.parent.classList.add('hidden');
    };

    $.NavigationButton.prototype.unhide = function()
    {
        this.parent.classList.remove('hidden');
    };

    $.NavigationButton.groups = {};

}(project));
