$('#home').on('pageinit', function(){
	//code needed for home page goes here
});	
		
$('#additem').on('pageinit', function(){

		var myForm = $('#workoutForm');
			errorslink = $('#errors');
		    myForm.validate({
			invalidHandler: function(form, validator) {
				errorslink.click();
			},
			submitHandler: function() {
		var data = myForm.serializeArray();
			storeData(data);
		}
	});
	
	//any other code needed for addItem page goes here
	var myid = function(x){
		var theElement = document.getElementById(x);
		return theElement;
	};

	
//The functions below can go inside or outside the pageinit function for the page in which it is needed.

//Create set field element and populate with options
	var makeWorkoutTypes = function() {
		var formTag = document.getElementsByTagName("form"),	//Form tag is an array of all the form tags
			selectLi = $("select"),
			makeSelect = document.createElement("select");
			makeSelect.setAttribute("id", "groups");
		for (var i=0, j=workOutType.length; i<j; i++) {
			var makeOption = document.createElement("option");
			var optText = workOutType[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		};
		//selectLi.appendChild(makeSelect);
	};
	//Find value of selected radio
	var getSelectedRadio = function() {
		var radios = document.forms[0].mins;
		for (var i=0; i<radios.length; i++) {
			if(radios[i].checked) {
				minValue = radios[i].value;
			};
		};
	};

	var toggleControls = function(n) {
		switch(n) {
			case "on":
				myid("workoutForm").style.display = "none";
				myid("clearData").style.display = "inline";
				myid("displayData").style.display = "none";
				myid("addNew").style.display = "inline";
				break;
			case "off":
				myid("workoutForm").style.display = "block";
				myid("clearData").style.display = "inline";
				myid("displayData").style.display = "inline";
				myid("addNew").style.display = "none";
				myid("items").style.display = "none";
				break;
			default:
				return false;
		};
	};

	var validate = function(e) {
		//Define the elements we want to check
		var getGroup = myid("groups");
		var getdateAdded = myid("dateAdded");
		var getCurrentWeight = myid("CurrentWeight");
		var getTargetWeight = myid("TargetWeight");

		//Reset Error Messages
		/*errMsg.innerHTML = "";
		getGroup.style.border = "1px solid black";
		getdateAdded.style.border = "1px solid black";
		getCurrentWeight.style.border = "1px solid black";
		getTargetWeight.style.border = "1px solid black";*/

		//Get error message
		var messageAry = [];
		//Group validation
		if(getGroup.value === "--Choose a Workout--") {
			var groupError = "Please Choose a Workout!";
			getGroup.style.border = "1px solid yellow";
			messageAry.push(groupError);
		}

		//Date validation
		if(getdateAdded.value === "") {
			var dateAddedError = "Please add a date!";
			getdateAdded.style.border = "1px solid yellow";
			messageAry.push(dateAddedError);
		}

		//Current Weight
		if(getCurrentWeight.value === "") {
			var currentWeightError = "Please add Current Weight!";
			getCurrentWeight.style.border = "1px solid yellow";
			messageAry.push(currentWeightError);
		}

		//Target Weight
		if(getTargetWeight.value === "") {
			var targetWeightError = "Please add Target Weight!";
			getTargetWeight.style.border = "1px solid yellow";
			messageAry.push(targetWeightError);
		}

		//If there were errors, display them on the screen.
		if(messageAry.length >=1) {
			for(var i=0, j=messageAry.length; i < j; i++) {
				var txt = document.createElement("li");
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		} else {
		  //If all is OK save our data. Send the key value (which came from the editData function)
		  //Remember this key value passed through the editSubmit event listener as a property.
		    saveData(this.key);
		  }; 
	};

var autofillData = function (){
	 //Auto Populate Local Storage.
		//The actual JSON object data required for this to work is comiung from our json.js file
		//Store the JSON object into Local Storage.
	for(var n in json) {
		var id = Math.floor(Math.random()*10000001);
		localStorage.setItem(id, JSON.stringify(json[n]));
	};
};


var getData = function(){
		toggleControls("on");
			if(localStorage.length === 0) {
				alert("There are no Workouts to display in Local Storage so default type is displayed");
				autofillData();
			};
			//Write data from Local Storage to the browser.
			var makeDiv = document.createElement("div");
			//makeDiv.setAttribute("id", "items");
			var makeList = document.createElement("ul");
			//myid("items").appendChild(makeList);
			//makeDiv.appendChild(makeList);
			document.body.appendChild(makeDiv);
			//myid("items").style.display = "display";
			for (var i=0, len=localStorage.length; i<len; i++) {
				var makeLi = document.createElement("li");
				var linksLi = document.createElement("li");
				makeList.appendChild(makeLi);
				var key = localStorage.key(i);
				var value = localStorage.getItem(key);
				//Convert the string from local storage value back to an object by using JSON
				var obj = JSON.parse(value);
				var makeSubList = document.createElement("ul");
				makeLi.appendChild(makeSubList);
				getImage(obj.group[1], makeSubList);
				for (var n in obj) {
					var makeSubli = document.createElement("li");
					makeSubList.appendChild(makeSubli);
					var optSubText = obj[n][0]+ " "+obj[n][1];
					makeSubli.innerHTML = optSubText;
					makeSubList.appendChild(linksLi);
				};
				makeItemLinks(localStorage.key(i), linksLi); //create our edit/delete buttons for each item in local storage
			};
};

//Get the image for the right category.
	var getImage = function(iconName, makeSubList) {
		var imageLi = document.createElement("li");
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement("img");
		var setSrc = newImg.setAttribute("src", "img/" + iconName + ".png");
		imageLi.appendChild(newImg);
	};

	//make item links
	//create the edit and delete links for each stored item when displayed
	var makeItemLinks = function(key, linksLi) {
		//add edit single item link
		var editLink = document.createElement("a");
		editLink.href = "#additem";
		editLink.key = key;
		var editText = "Edit Workout";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);

		//add line break
		var breakTag = document.createElement("br");
		linksLi.appendChild(breakTag);

		//add delete single item link
		var deleteLink = document.createElement("a");
		deleteLink.href = "#additem";
		deleteLink.key = key;
		var deleteText = "Delete Workout";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	};

	//Edit single item
	var editItem = function() {
		//Grab the data from our item from Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//show the form
		toggleControls("off");

		//populate the form fields with current localStorage values.
		myid("groups").value = item.group[1];
		myid("notes").value = item.notes[1];
		myid("BodyFat").value = item.BodyFat[1];
		myid("CurrentWeight").value = item.CurrentWeight[1];
		myid("TargetWeight").value = item.TargetWeight[1];
		var radios = document.forms[0].mins;
		for(var i=0; i<radios.length; i++) {
			if(radios[i].value == "15mins" && item.mins[1] == "15mins") {
				radios[i].setAttribute("checked", "checked");
			} else if(radios[i].value == "30mins" && item.mins[1] == "30mins") {
				radios[i].setAttribute("checked", "checked");
			  } else if(radios[i].value == "45mins" && item.mins[1] == "45mins") {
			  	radios[i].setAttribute("checked", "checked");
			    }
		}
		myid("dateAdded").value = item.date[1];
		myid("bmi").value = item.bmi[1];
		myid("intensity").value = item.intensity[1];
		myid("rangevalue").value = item.intensity[1];
		myid("NumOfDays").value = item.NumOfDays[1];

		//Remove the initial listener from the input "save workout" button.
		save.removeEventListener("click", saveData);
		//Change submit button value to edit button
		myid("submit").value = "Edit Workout";
		var editSubmit = myid("submit");
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	};

	var saveData = function(key) {
		//If there is no key, this means this is a brand new item and we need a new key.
		if(!key) {
		var id 					= Math.floor(Math.random()*10000001);
		} else {
			//Set the id to the existing key we're editing so that it will save over the data
			//The key is the same key thats been passed along from the editSubmit event handler
			//to the validate function, and then passed here, into the saveData function
			id = key;
		};
		getSelectedRadio();
		var item                = {};
			item.date           = ["Date Added: ", myid("dateAdded").value];
			item.group          = ["Workout Type: ", myid("groups").value];
			item.intensity      = ["Intensity: ", myid("intensity").value];
			item.NumOfDays      = ["Day# ", myid("NumOfDays").value];
			item.mins           = ["Duration of Exercise=", minValue];
			item.notes          = ["Notes: ", myid("notes").value];
			item.bmi            = ["BMI: ", myid("bmi").value];
			item.BodyFat        = ["Body Fat ", myid("BodyFat").value + "%"];
			item.CurrentWeight  = ["Current Weight ", myid("CurrentWeight").value + " Ibs."];
			item.TargetWeight   = ["Target Weight ", myid("TargetWeight").value + " Ibs."];
		localStorage.setItem(id, JSON.stringify(item));
		alert("Info Saved!");
	};

	var deleteItem = function() {
		var ask = confirm("Are you sure you want to delete this Workout?");
		if(ask) {
			localStorage.removeItem(this.key);
			alert("Workout was deleted");
			window.location.reload();
		} else {
			alert("Workout was deleted!");
		  };
	};

	var clearLocal = function() {
		if (localStorage.length === 0) {
			alert("There is no data to clear!");
		} else {
			localStorage.clear();
			alert("All Workouts are deleted!");
			window.location.reload();
			return false;
		  };
	};

//Variable Defaults
	var workOutType = ["--Choose a Workout--", "Chest", "Legs", "Shoulders", "Back", "Arms", "Cardio", "BattleRopes", "JumpRope", "StationaryBike"],
		minValue;
	makeWorkoutTypes();
	errMsg = myid("errors");

	//Set Link and Submit Click Events.
	var displayLink = myid("displayData");
	displayLink.addEventListener("click", getData);
	var clearLink = myid("clearData");
	clearLink.addEventListener("click", clearLocal);
	var save = myid("submit");
	save.addEventListener("click", validate);

});
/*
var storeData = function(data){
	
}; 

var	deleteItem = function (){
			
};
					
var clearLocal = function(){

};*/


