/* Michael Bruchal
   12 SEP2012
   MIU 1209
   Project 3
*/

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
	
});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.

//getElementById function
var id = function (x){
	var theElement = document.getElementById(x);
	return theElement;
}

var autoFillData = function (){
	 for(var n in json) {
			var id = Math.floor(Math.random()*10000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
	};
}

var getData = function (){
	toggleControls("on");
		if(localStorage.length === 0) {
			alert("There are no Workouts to display in Local Storage so default type is displayed");
			autoFillData();
		}
		//Write data from Local Storage to the browser.
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement("ul");
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$("items").toggle("show");
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
			//getImage(obj.group[1], makeSubList);
			for (var n in obj) {
				var makeSubli = document.createElement("li");
				makeSubList.appendChild(makeSubli);
				var optSubText = obj[n][0]+ " "+obj[n][1];
				makeSubli.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi); //create our edit/delete buttons for each item in local storage
		}
};

//make item links
//create the edit and delete links for each stored item when displayed
var makeItemLinks = function(key, linksLi) {
	//add edit single item link
	var editLink = document.createElement("a");
	editLink.href = "#";
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
	deleteLink.href = "#";
	deleteLink.key = key;
	var deleteText = "Delete Workout";
	deleteLink.addEventListener("click", deleteItem);
	deleteLink.innerHTML = deleteText;
	linksLi.appendChild(deleteLink);
};


var storeData = function (key){
	//If there is no key, this means this is a brand new item and we need a new key.
		if(!key) {
		var id 					= Math.floor(Math.random()*10000001);
		} else {
			//Set the id to the existing key we're editing so that it will save over the data
			//The key is the same key thats been passed along from the editSubmit event handler
			//to the validate function, and then passed here, into the saveData function
			id = key;
		}
		getSelectedRadio();
		var item                = {};
			item.date           = ["Date Added: ", $("dateAdded").value];
			item.group          = ["Workout Type: ", $("groups").value];
			item.intensity      = ["Intensity: ", $("intensity").value];
			item.NumOfDays      = ["Day# ", $("NumOfDays").value];
			item.mins           = ["Duration of Exercise=", minValue];
			item.notes          = ["Notes: ", $("notes").value];
			item.bmi            = ["BMI: ", $("bmi").value];
			item.BodyFat        = ["Body Fat ", $("BodyFat").value + "%"];
			item.CurrentWeight  = ["Current Weight ", $("CurrentWeight").value + " Ibs."];
			item.TargetWeight   = ["Target Weight ", $("TargetWeight").value + " Ibs."];
		localStorage.setItem(id, JSON.stringify(item));
		alert("Info Saved!");
};

var editItem = function (){
	//Grab the data from our item from Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//show the form
		toggleControls("off");

		//populate the form fields with current localStorage values.
		$("groups").value = item.group[1];
		$("notes").value = item.notes[1];
		$("BodyFat").value = item.BodyFat[1];
		$("CurrentWeight").value = item.CurrentWeight[1];
		$("TargetWeight").value = item.TargetWeight[1];
		var radios = document.forms[0].mins;
		for(var i=0; i<radios.length; i++) {
			if(radios[i].value == "15mins" && item.mins[1] == "15mins") {
				radios[i].setAttribute("checked", "checked");
			} else if(radios[i].value == "30mins" && item.mins[1] == "30mins") {
				radios[i].setAttribute("checked", "checked");
			  } else if(radios[i].value == "45mins" && item.mins[1] == "45mins") {
			  	radios[i].setAttribute("checked", "checked");
			    };
		};
		$("dateAdded").value = item.date[1];
		$("bmi").value = item.bmi[1];
		$("intensity").value = item.intensity[1];
		$("rangevalue").value = item.intensity[1];
		$("NumOfDays").value = item.NumOfDays[1];

		//Remove the initial listener from the input "save workout" button.
		save.removeEventListener("click", saveData);
		//Change submit button value to edit button
		$("submit").value = "Edit Workout";
		var editSubmit = $("submit");
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
};

var toggleControls = function (n) {
		switch(n) {
			case "on":
				$("workoutForm").toggle("hide");
				$("clearData").toggle("inline");
				$("displayData").toggle("none");
				$("addNew").removeClass("ui-disabled");
				break;
			case "off":
				$("workoutForm").toggle("show");
				$("clearData").toggle("show");
				$("displayData").toggle("show");
				$("addNew").addClass("ui-disabled");
				break;
			default:
				return false;
		}
};

var deleteItem = function () {
		var ask = confirm("Are you sure you want to delete this Workout?");
		if(ask) {
			localStorage.removeItem(this.key);
			alert("Workout was deleted");
			window.location.reload();
		} else {
			alert("Workout was deleted!");
		  }
};
					
var clearLocal = function(){
	if (localStorage.length === 0) {
			alert("There is no data to clear!");
		} else {
			localStorage.clear();
			alert("All Workouts are deleted!");
			window.location.reload();
			return false;
		  };
};

//Set Link and Submit Click Events.
var windowReload = function (){
	window.location.reload();
	return false;
};

	$( '#displayData' ).on( 'click', getData );
	$( '#clearData'    ).on( 'click', clearLocal );
	$( '#submit'      ).on( 'click', windowReload );



