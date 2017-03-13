
var dataList = document.getElementById('json-datalist');
var input = document.getElementById('ajax');


var request = new XMLHttpRequest();


request.onreadystatechange = function(response) {
    if (request.readyState === 4) {
        if (request.status === 200) {

            // Parse the JSON
            var jsonOptions = JSON.parse(request.responseText);

            // Loop over the JSON array.
            jsonOptions.forEach(function(item) {

                var option = document.createElement('option');

                option.value = item.City;
                // Add the <option> element to the <datalist>.
                dataList.appendChild(option);
            });

            // Update the placeholder text.
            input.placeholder = "Введите или выберите из списка";
        } else {
            //  Error
            input.placeholder = "Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз :( :(";
        }
    }
};

// Update the placeholder text.
input.placeholder = "Загрузка ...";


request.open('GET', '../assets/kladr.json', true);
request.send();