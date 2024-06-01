function onPageLoad() {
    console.log("files-loading");
    var url = "http://127.0.0.1:5000/load_files";
  
    $.get(url, function(data, status) {
        console.log("loading files");
        if (data) {
            var movie_title = document.getElementById("movie_title");
            $("#movie_title").empty();
            $("#movie_title").append('<option value="" disabled selected>Select a movie</option>'); 
            data.forEach((movie_name) => {
                var opt = new Option(movie_name);
                $("#movie_title").append(opt);
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

        var recommendationsDiv = document.getElementById("recommendations");
        recommendationsDiv.innerHTML = ""; // Clear previous recommendations

        data.recommend_list.forEach((movie, index) => {
            recommendationsDiv.innerHTML += `
                <div>
                    <h2>${movie}</h2>
                    <img src="${data.movies_poster[index]}" alt="${movie}" width="100">
                </div>
            `;
        });

        console.log(status);
    });
}







window.onload = onPageLoad;
