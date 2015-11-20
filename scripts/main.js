(function() {
	var copyTmp = "";
	var generate = function(option, limit) {
		document.getElementById("ipsum").innerHTML = "";
		var ipsum = new forcem(option, limit);
		//Insert Elements into page
		if ( option == 'vader' || option == 'deathstar' ) {
			var ul = document.createElement("ul");
			for (i = 0; i < limit; i++) {
				var li = document.createElement("li");
				var content = document.createTextNode(ipsum[i]);
				li.appendChild(content);
				ul.appendChild(li);
			}
			document.getElementById("ipsum").appendChild(ul);
		} else {
			for (i = 0; i < limit; i++) {
				var p = document.createElement("p");
				var content = document.createTextNode(ipsum[i]);
				p.appendChild(content);
				document.getElementById("ipsum").appendChild(p);
			}
		}
		copyTmp = document.getElementById("ipsum").innerHTML;
		if (config.copy == 'plain' ) {
			copyTmp = copyTmp.replace(/<[^>]*>/g, "\n");
		}
	};
	//Set up inital settings
	if(!getCookie('forcem')){
		var initialConfig = { option: 'e4', limit: 5, copy: 'plain'};
		setCookie('forcem', JSON.stringify(initialConfig), 30);
	}
	//Load Config
	var config = JSON.parse(getCookie('forcem'));
	//Set Current Limit Field
	document.getElementById("limit").value = config.limit;
	//Set Current Option Button
	document.getElementById(config.option).parentElement.parentElement.className = "toggle-option active";
	//Set Copy Type
	if (config.copy == 'html' ) {
		document.getElementById('toggle-html').className = "pull-right active";
	} else if (config.copy == 'plain' ) {
		document.getElementById('toggle-plain').className = "pull-right active";
	}
	//Create Initial Ipsum
	generate(config.option, config.limit);
	//Event Listeners
	//Toggle Options
	var toggleOption = document.getElementsByClassName("toggle-option");
	var toggleOptionFunction = function() {
		var id = this.firstChild.firstChild.id;
		if ( id == 'vader') {
			id = 'characters';
		}
		if ( id == 'deathstar' ) {
			id = 'planets';
		} 
		//Analytics
		ga('send', 'event', "Navigation", "Click", "Option", id);
		var newConfig = { option: id, limit: config.limit, copy: config.copy};
		setCookie('forcem', JSON.stringify(newConfig), 30);
		config = JSON.parse(getCookie('forcem'));
		var elems = document.querySelectorAll(".toggle-option");
		for (var i = 0; i < elems.length; i++) {
			elems[i].classList.remove('active');
		}
		document.getElementById(config.option).parentElement.parentElement.className = "toggle-option active";
		generate(config.option, config.limit);
	};
	for(var i=0;i<toggleOption.length;i++){
		toggleOption[i].addEventListener('click', toggleOptionFunction, false);
	}
	//Change Limit
	document.querySelector('#limit').addEventListener('input', function()
	{
		if(this.value <= 0 || this.value == null || this.value == '') {
			this.value = 1;	
		}
		var newConfig = { option: config.option, limit: this.value, copy: config.copy};
		setCookie('forcem', JSON.stringify(newConfig), 30);
		config = JSON.parse(getCookie('forcem'));
		generate(config.option, config.limit);
	});
	//Toggle Copy Type
	document.getElementById('toggle-plain').addEventListener('click', function() {
		document.getElementById('toggle-plain').className = "pull-right active";
		document.getElementById('toggle-html').className = "pull-right";
		var newConfig = { option: config.option, limit: config.limit, copy: "plain"};
		setCookie('forcem', JSON.stringify(newConfig), 30);
		config = JSON.parse(getCookie('forcem'));
	});
	document.getElementById('toggle-html').addEventListener('click', function() {
		document.getElementById('toggle-plain').className = "pull-right";
		document.getElementById('toggle-html').className = "pull-right active";
		var newConfig = { option: config.option, limit: config.limit, copy: "html"};
		setCookie('forcem', JSON.stringify(newConfig), 30);
		config = JSON.parse(getCookie('forcem'));
	});
	//Cookies
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	} 

	//Jquery
	
	jQuery(function( $ ){
		$(".pop").parent().parent().hover(function(){
			$(this).popover('show');	
		}, function(){
			$(this).popover('hide');	
		});
	});

	//Clipboard
	var client = new ZeroClipboard( document.getElementById("copy") );
		//copy = copy.replace(/<[^>]*>/g, "\n");

 	client.on( "ready", function( readyEvent ){
		//alert( "ZeroClipboard SWF is ready!" );
		client.on( "copy", function (event) {
			var clipboard = event.clipboardData;
			clipboard.setData( "text/plain", copyTmp );
		});
		client.on( "aftercopy", function( event ){
			// `this` === `client`
			// `event.target` === the element that was clicked
			//event.target.style.display = "none";
			//alert("Copied text to clipboard: " + event.data["text/plain"] );
		});
	});
	
})();