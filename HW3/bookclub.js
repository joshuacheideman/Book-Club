/* Called when the user pushes the "submit" button */
/* Sends a request to the API using the JSONp protocol */
function newRequest() {

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ", "+");

	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ", "+");

	var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-", "");

	// Connects possible query parts with pluses
	var query = ["", title, author, isbn].reduce(fancyJoin);

	// The JSONp part.  Query is executed by appending a request for a new
	// Javascript library to the DOM.  It's URL is the URL for the query. 
	// The library returned just calls the callback function we specify, with
	// the JSON data we want as an argument. 
	if (query != "") {

		// remove old script
		var oldScript = document.getElementById("jsonpCall");
		if (oldScript != null) {
			document.body.removeChild(oldScript);
		}
		// make a new script element
		var script = document.createElement('script');
		// build up complicated request URL
		var beginning = "https://www.googleapis.com/books/v1/volumes?q="
		var callback = "&callback=handleResponse"
		newRequest.DisplayErrorMessage = function()
		{
			var message=document.createElement("span");
			
			var booktitle= document.createElement("span");
			var titlebold = document.createElement("span");
			titlebold.textContent = title;
			titlebold.style.fontWeight ="700";
			
			var bookauthor = document.createElement("span");
			var authorbold = document.createElement("span");
			authorbold.textContent = author;
			authorbold.style.fontWeight="700";
			
			var bookisbn = document.createElement("span");
			var isbnbold = document.createElement("span");
			isbnbold.textContent = isbn;
			isbnbold.style.fontWeight="700";
			
			var br = document.createElement("br");
			var error1 = document.createElement("span");
			error1.textContent = "Could not be found.";
			
			var error2 = document.createElement("span");
			error2.textContent = "Try another search.";
			
			booktitle.textContent = "The book ";
			booktitle.append(titlebold);
			bookauthor.textContent = " by ";
			bookauthor.append(authorbold);
			bookisbn.textContent = " or ISBN number ";
			bookisbn.append(isbnbold);
			
			message.append(booktitle);
			message.append(bookauthor);
			message.append(bookisbn);
			message.append(br);
			message.append(br.cloneNode(true));
			message.append(error1);
			message.append(br.cloneNode(true));
			message.append(br.cloneNode(true));
			message.append(error2);
			
			message.id = "error_message";
			message.style.color = "white";
			message.style.fontSize = "30px";
			ShowOverlay();
			function ShowOverlay()
			{
					var overlay_dim = document.getElementById("overlay_dim");
					overlay_dim.style.display = "flex";
					createOverlayInfo();
			}
			function createOverlayInfo()
			{
				var left_arrow = document.getElementById("left_arrow");
				left_arrow.style.visibility = "hidden";
				var right_arrow = document.getElementById("right_arrow");
				right_arrow.style.visibility = "hidden";
				var exit_large = document.getElementById("exit_large");
				exit_large.style.visibility = "hidden";
				overlay_tile.style.backgroundColor= "transparent";
				if(overlay_tile.childElementCount == 0)
					overlay_tile.append(message);
				var keep_button = document.getElementById("keep_button");
				var keep_button_text = keep_button.childNodes[1];
				var ok_button_text = document.createElement("p");
				ok_button_text.textContent = "OK";
				keep_button.replaceChild(ok_button_text,keep_button_text);
				keep_button.onclick = closeOverlay;
			}
		}
		script.src = beginning + query + callback
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);
	}

}


/* Used above, for joining possibly empty strings with pluses */
function fancyJoin(a, b) {
	if (a == "") { return b; }
	else if (b == "") { return a; }
	else { return a + "+" + b; }
}

var numtiles = 0;
/* The callback function, which gets run when the API returns the result of our query */
function handleResponse(bookListObj) {
	var bookList = bookListObj.items;
	if(bookList===undefined)
	{
		newRequest.DisplayErrorMessage();
	}
	else
	{
	/* where to put the data on the Web page */
	var bookDisplay = document.getElementById("bookDisplay");
	var tile_list = new Array;
	/* write each title as a new paragraph */
	for (i = 0; i < bookList.length; i++) {
		var book = bookList[i];

		// Get title
		var title = book.volumeInfo.title;

		// Get author(s)
		var author = book.volumeInfo.authors;
		if (author != null)
			var author_string = author.join(', ');

		// Get description
		var desc = book.volumeInfo.description;
		if (desc != null)
			desc_list = desc.split(" ");

		// Get thumbnail image
		var thumbnail = book.volumeInfo
		if (thumbnail.imageLinks == null || thumbnail.imageLinks.thumbnail == null)
			thumbnail = null;
		else thumbnail = thumbnail.imageLinks.thumbnail;

		// Create tile div
		var tile = document.createElement("div");
		tile.className = "tile";
		tile.id = "tile" + numtiles;
		numtiles++;

		// Create paragraph for title
		var titlepar = document.createElement("p");
		titlepar.textContent = title;
		titlepar.className = "titlepar";

		// Create paragraph for author(s)
		var authorpar = document.createElement("p");
		authorpar.textContent = "by " +author_string;
		authorpar.className = "authorpar";

		// Create paragraph for description
		var descpar = document.createElement("p");
		var span_dots = document.createElement("span");
		span_dots.className = "dots";
		span_dots.textContent = " ...";
		descpar.className = "descpar";
		if (desc != null)
			{
			descpar.textContent = desc_list.splice(0, 30).join(" ");
			// descpar.textContent += " \u2026";
			}

		// Create paragraph for Xsymbol
		var Xsymbol = document.createElement("p");
		Xsymbol.textContent = '\u24E7';
		Xsymbol.className = "Xsymbol";

		// Create div to store hold all paragraphs
		// Goes inside tile div
		var wordblock = document.createElement("div");
		wordblock.className = "wordblock";

		// Create image
		// Goes inside tile div
		var thumbnailimg = document.createElement("img");
		if (thumbnail == null) {
			thumbnailimg.src = "file://null";
			thumbnailimg.alt = "no image";
		}
		else {
			thumbnailimg.src = thumbnail;
			thumbnailimg.alt = title;
		}
		thumbnailimg.className = "thumbnailimg";

		/* ALWAYS AVOID using the innerHTML property */
		// Assemble wordblock
		wordblock.appendChild(Xsymbol);0
		wordblock.appendChild(titlepar);
		wordblock.appendChild(authorpar);
		if (descpar != null)
			wordblock.appendChild(descpar);
		descpar.append(span_dots);

		// Assemble final tile
		tile.append(thumbnailimg);
		tile.append(wordblock);
		tile_list.push(tile);
	}
	addButtonActions(tile_list);
	showOverlay(tile_list);
	}
}
function addOnClick(element, func, param) {
	function noarg() {
		func(param);
	}
	element.onclick = noarg;
}

function addButtonActions(tile_list) {
	var left_arrow = document.getElementById("left_arrow");
	var right_arrow = document.getElementById("right_arrow");
	
	
	for (let i = 0; i < tile_list.length; i++) {
		var our_tile = tile_list[i];
			if(i==0)
				tile_list[i].prev = null
			else tile_list[i].prev = tile_list[i-1];
			if(i==tile_list[i].length)
				tile_list[i].next = null;
			else tile_list[i].next = tile_list[i+1];
		if(i>=0 && i<tile_list.length-1)
			addOnClick(right_arrow,goRight,null);
		if(i>0 && i<tile_list.length)
			
			addOnClick(left_arrow,goLeft,null);
	}
	var keep_button = document.getElementById("keep_button");
	addOnClick(keep_button,Keep,null);
}

function removeElement(tile) {
	var tile_div = document.getElementById(tile);
	var bookDisplay = document.getElementById("bookDisplay");
	bookDisplay.removeChild(tile_div);
}

function showOverlay(tile_list)
{
	var overlay_dim = document.getElementById("overlay_dim");
	overlay_dim.style.display = "flex";
	createOverlayInfo(tile_list);
}
function createOverlayInfo(tile_list)
{
	var left_arrow = document.getElementById("left_arrow");
	var right_arrow = document.getElementById("right_arrow");
	var overlay_tile = document.getElementById("overlay_tile");
	var exit_large = document.getElementById("exit_large");
	exit_large.style.visibility = "visible";
	if(overlay_tile.childElementCount == 0)
	overlay_tile.append(tile_list[0]);
	left_arrow.style.visibility = "hidden";
	right_arrow.style.visibility = "visible";
	var Xsymbol = tile_list[0].getElementsByClassName("Xsymbol");
	Xsymbol[0].style.visibility = "hidden";
	var ok_button = document.getElementById("keep_button");
	var ok_button_text = keep_button.childNodes[1];
	var keep_button_text = document.createElement("p");
	keep_button_text.textContent = "Keep";
	ok_button.replaceChild(keep_button_text,ok_button_text);
	
	
}

function closeOverlay()
{
	var overlay_dim = document.getElementById("overlay_dim");
	overlay_dim.style.display = "none";
	var overlay_tile = document.getElementById("overlay_tile");
	overlay_tile.removeChild(overlay_tile.childNodes[1]);
}
function goRight(tile)
{
	var overlay_tile = document.getElementById("overlay_tile");
	var current_tile = overlay_tile.lastChild;
	var next_tile = current_tile.next;
	next_tile.style.display = "flex";
	overlay_tile.replaceChild(next_tile,current_tile);
	var Xsymbol = next_tile.getElementsByClassName("Xsymbol");
	Xsymbol[0].style.visibility = "hidden";
	var left_arrow = document.getElementById("left_arrow");
	if(next_tile.prev)
		left_arrow.style.visibility = "visible";
	if(next_tile.prev== null)
		left_arrow.style.visibility = "hidden";
	if(next_tile.next!=null)
		right_arrow.style.visibility = "visible";
	if(next_tile.next==null)
		right_arrow.style.visibility = "hidden";
}
var tile_num=0;
function Keep(tile)
{
	current_tile = overlay_tile.lastChild;
	var bookDisplay = document.getElementById("bookDisplay");
	var duplicated_tile = current_tile.cloneNode(true);
	duplicated_tile.id = "tile"+tile_num;
	tile_num++;
	bookDisplay.append(duplicated_tile);
	var X_button = duplicated_tile.getElementsByClassName("Xsymbol");
	X_button[0].style.visibility = "visible";
	var tile_ID = duplicated_tile.id;
	collapseSearch();
	addOnClick(X_button[0], removeElement, tile_ID);
}
function goLeft(tile)
{
	var overlay_tile = document.getElementById("overlay_tile");
	var current_tile = overlay_tile.lastChild;
	var prev_tile = current_tile.prev;
	overlay_tile.replaceChild(prev_tile,current_tile);
	var Xsymbol = prev_tile.getElementsByClassName("Xsymbol");
	Xsymbol[0].style.visibility = "hidden";
	var right_arrow = document.getElementById("right_arrow");
	if(prev_tile.prev)
		left_arrow.style.visibility = "visible";
	if(prev_tile.prev==null)
		left_arrow.style.visibility = "hidden";
	if(prev_tile.next=== undefined)
		right_arrow.style.visibility = "hidden";
	if(prev_tile.next!==undefined)
	{
		right_arrow.style.visibility = "visible";
	}
}

function collapseSearch()
{
	document.getElementById("subtitle").style.display = "none";
	document.getElementsByTagName("header")[0].style.display = "flex";
	document.getElementsByTagName("header")[0].style.alignItems  ="center";
	document.getElementById("search_all").style.display = "flex";
	document.getElementById("search_all").style.justifyContent = "space-evenly";
	if(window.matchMedia("(max-width:920px)").matches)
	{
		document.getElementById("search_all").style.display = "none";
		var magnify = document.getElementById("magnify").style.display="initial";
	}
	else
	{
		document.getElementById("search_all").style.display = "flex";
		for(let i=0;i<ors.length;i++)
		{
			ors[i].style.display="none";
		}
	}
	var ors = document.getElementsByClassName("or");
}
function magnifyclick()
{
	var search_all = document.getElementById("search_all");
	search_all.style.display="flex";
	search_all.style.flexDirection="column";
	document.getElementsByTagName("header")[0].style.flexDirection = "column";
	document.getElementById("magnify").style.display = "none";
	var ors = document.getElementsByClassName("or");
}