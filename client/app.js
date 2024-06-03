var movies = [];
//loads movie data;
function onPageLoad() {
    console.log("files-loading");
    var url = "http://127.0.0.1:5000/load_files";
    $.get(url, function(data, status) {
        console.log("loading files");
        movies = data;
        if (data) {
            // Initialize autocomplete with the loaded movie names
            autocomplete(document.getElementById("movie_title"), movies);
        }
    });
}

function recommend() {
    console.log("recommend initiated");
    var selected = $("#movie_title").val(); // Get the input value directly

    var url = "http://127.0.0.1:5000/movie";
    $.post(url, { selected_movie: selected }, function(data, status) {
        console.log("request received for recommendations");
        console.log(data.recommend_list);
        console.log(data.movies_poster);

        var recommendationsDiv = $("#recommendations");
        recommendationsDiv.html('');  // Clear previous results
        recommendationsDiv.html('<div class="suggestions"><h2 class="row_title">Recommendations</h2><div class="row_posters_container"><button class="nav left-nav" onclick="left()">&#171;</button><div class="row_posters"></div><button class="nav right-nav" onclick="scrollRight()">&#187;</button></div></div>');
        var rowPosters = recommendationsDiv.find(".row_posters");

        data.recommend_list.forEach((movie, index) => {
            var posterDiv = $('<div></div>');
            posterDiv.html(`
                <img src="${data.movies_poster[index]}" alt="${movie}">
                <p>${movie}</p>
                
            `);
            
            rowPosters.append(posterDiv);
        });

        console.log(status);
    });
}




function left() {
    console.log("left running");
    event.preventDefault();
    const container = document.querySelector('.row_posters');
    container.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
}

function scrollRight() {
    console.log("right running");
    event.preventDefault();
    const container = document.querySelector('.row_posters');
    container.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
}

$(document).ready(function() {
    onPageLoad();
});

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
