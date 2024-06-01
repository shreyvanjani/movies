function onPageLoad() {
    console.log("files-loading");
    var url = "http://127.0.0.1:5000/load_files";
    $.get(url, function(data, status) {
        console.log("loading files");
        if (data) {
            var movieTitleSelect = $("#movie_title");
            movieTitleSelect.empty();
            movieTitleSelect.append('<option value="" disabled selected>Movies</option>');
            data.forEach((movie_name) => {
                var opt = new Option(movie_name, movie_name);
                movieTitleSelect.append(opt);
            });
        }
    });
}

function recommend() {
    console.log("recommend initiated");
    var selected = $("#movie_title option:selected").text();

    var url = "http://127.0.0.1:5000/movie";
    $.post(url, { selected_movie: selected }, function(data, status) {
        console.log("request received for recommendations");
        console.log(data.recommend_list);
        console.log(data.movies_poster);

        var recommendationsDiv = $("#recommendations");
        recommendationsDiv.html('');  // Clear previous results
        recommendationsDiv.html('<div class="suggestions"><h2 class="row_title">Recommendations</h2><div class="row_posters_container"><button class="nav left-nav" onclick="left()">&#171</button><div class="row_posters"></div><button class="nav right-nav" onclick="scrollRight()">&#187;</button></div></div>')
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
    console.log("left running")
    const container = document.querySelector('.row_posters');
    container.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
}

function scrollRight() {
    console.log("right running")
    const container = document.querySelector('.row_posters');
    container.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
}

$(document).ready(function() {
    onPageLoad();
});
