"use strict";

$(document).ready(function(){

    function loadOptions(options, selectedOption, dropdown) {
        const optionValues = options[selectedOption];
        dropdown.empty();
        optionValues.forEach(function(value) {
        const option = document.createElement('option');
        option.text = value;
        dropdown.append(option);
        })
    };

    const data = {
        "Rec 1": ["A1", "A2", "A3", "A4", "A5"],
        "Rec 2": ["B1", "B2", "B3", "B4", "B5"],
    }
    const location = $("#location")
    const shelf = $("#shelf")

    loadOptions(data, location.val(), shelf);
    location.change(function() {
        loadOptions(data, location.val(), shelf);
    });

});