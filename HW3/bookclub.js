
/* Called when the user pushes the "submit" button */
/* Sends a request to the API using the JSONp protocol */
function newRequest() {

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ","+");

	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ","+");

	var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-","");

	// Connects possible query parts with pluses
	var query = ["",title,author,isbn].reduce(fancyJoin);

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

		script.src = beginning+query+callback	
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);	
		}

}


/* Used above, for joining possibly empty strings with pluses */
function fancyJoin(a,b) {
    if (a == "") { return b; }	
    else if (b == "") { return a; }
    else { return a+"+"+b; }
}


/* The callback function, which gets run when the API returns the result of our query */
function handleResponse(bookListObj) {
	var bookList = bookListObj.items;

	/* where to put the data on the Web page */ 
	var bookDisplay = document.getElementById("bookDisplay");

	/* write each title as a new paragraph */
	for (i=0; i<bookList.length; i++) {
		var book = bookList[i];
		var title = book.volumeInfo.title;
		var author = book.volumeInfo.authors;
		var desc = book.volumeInfo.description.split(" ");
		console.log(desc);
		var thumbnail = book.volumeInfo.imageLinks.thumbnail;
		var tile = document.createElement("div");
		tile.className = "tile";
		var titlepar = document.createElement("p");
		titlepar.textContent = title;
		titlepar.className = "titlepar";
		var authorpar = document.createElement("p");
		authorpar.textContent = author;
		authorpar.className = "authorpar";
		var descpar = document.createElement("p");
		descpar.className = "descpar";
		var wordblock = document.createElement("div");
		wordblock.className = "wordblock";
		var Xsymbol = document.createElement("p");
		Xsymbol.textContent = '\u24E7';
		Xsymbol.className = "Xsymbol";
		descpar.textContent = desc.splice(0,30).join(" ");
		var thumbnailimg = document.createElement("img");
		thumbnailimg.src = thumbnail;
		thumbnailimg.alt= title;
		thumbnailimg.className = "thumbnailimg";
		/* ALWAYS AVOID using the innerHTML property */
		tile.append(thumbnailimg);
		tile.append(Xsymbol);
		tile.append(titlepar);
		tile.append(authorpar);
		tile.append(descpar);
		wordblock.appendChild(Xsymbol);
		wordblock.appendChild(titlepar);
		wordblock.appendChild(authorpar);
		wordblock.appendChild(descpar);
		tile.append(wordblock);
		bookDisplay.append(tile);
	}	
}

