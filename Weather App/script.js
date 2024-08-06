//Below are all the variables that I have selected from the html document.
let searchInput = document.querySelector("#searchinput");
let searchBtn = document.querySelector("#searchbtn");
let weatherInfo = document.querySelector(".weather-info")
let undefinedError = document.querySelector("#undefined")
let city = document.querySelector("#city");
let degree = document.querySelector("#degree");
let icon = document.querySelector("#icon");
let weatherConditionText = document.querySelector("#weather-condition");
let humidity = document.querySelector("#humidity");
let windSpeed = document.querySelector("#wind-speed");



/*
	The lines below adds an event listener to the input field and it will check
	if either of the predefined options are clicked or not, if one of them get cliked
	then the event will add that option's value to the input field and it will click the
	search Btn, and so the weather of the location will be visible for the user. 
*/
searchInput.addEventListener('change', function() {
	let options = this.list.options;
	for (let i = 0; i < options.length; i++) {
		if (options[i].value === this.value) {
			searchBtn.click();
			break;
		}
	}
});


/*  
	Below is a keydown Event listener that is used when the Enter key is pressed.
	It will click the search button once the enter key is pressed.
*/
searchInput.addEventListener('keydown', function(event) {
	if (event.key == "Enter") {
		searchBtn.click();
	}
});

/*
	In the code snippet below, I’ve added a click event listener to the search button. 
	When the user clicks this button, it retrieves the value entered in the input field. 
	Subsequently, the button sends this value to an API. To handle the API response, 
	I’ve implemented an asynchronous function. After receiving the response, 
	I check whether the response or the city name is undefined. If it is undefined, 
	the function stops execution, and an error div becomes visible to the user. 
	This div indicates that the inputted city was not found. On the other hand, 
	if the city is found, the subsequent part of the code is interpreted. In the following lines, 
	I extract weather-related values from the API response and update the innerHTML of 
	specific HTML elements and at last if the city was found the input field will be cleared.
*/
searchBtn.addEventListener("click", function() {
	let cityName = searchInput.value;
	let apiKey = "05b4c7f5123c2ac55ec2d051488d3a0a";
	let apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

	async function fetchData() {
		try {
			let response = await fetch(apiLink);
			let data = await response.json();
			if (data.cod == 404 || searchInput.value.trim() === "") {
					weatherInfo.style.display = "none"
					undefinedError.style.display = "block";
			} else {
				weatherInfo.style.display = "block"
				undefinedError.style.display = "none";
				
				city.innerHTML = `Weather in ${data.name}`
				
				degree.innerHTML = `${data.main.temp}°C`
				
				let weatherIcons = {
					"clouds": "./images/clouds.png",
					"clear": "./images/clear.png",
					"drizzle": "./images/drizzle.png",
					"mist": "./images/mist.png",
					"rain": "./images/rain.png",
					"snow": "./images/snow.png"
				};
				let weatherCondition = data.weather[0].main.toLowerCase();
				let iconSrc = weatherIcons[weatherCondition];
				if (iconSrc) {
					icon.innerHTML = `<img src="${iconSrc}" alt="${weatherCondition} weather" id="icon" width="30px" height="30px">`;
				}
				weatherConditionText.innerHTML = data.weather[0].description;

				humidity.innerHTML = `Humidity: ${data.main.humidity}%`
				windSpeed.innerHTML = `Wind speed: ${data.wind.speed} km/h`
				
				searchInput.value = '';
			}
		} catch (error){
			console.log(error);
		}
	}
	fetchData();
})



