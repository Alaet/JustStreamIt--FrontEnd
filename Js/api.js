const TOP_RANKED = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1";
const BEST_ALL_CATEGORIES = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&page=1";
const BEST_ACTION = "http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page_size=7&page=1";
const BEST_ADVENTURE = "http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score&page_size=7&page=1";
const BEST_HORROR = "http://localhost:8000/api/v1/titles/?genre=Horror&sort_by=-imdb_score&page_size=7&page=1";
const BEST_THRILLER = "http://localhost:8000/api/v1/titles/?genre=Thriller&sort_by=-imdb_score&page_size=7&page=1";

const sendRequest = async function(url) {
// Return the data from a request to an url 
try {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    const results = jsonResponse.results;
    return results;
    }
catch (e) {
    logError(e);
    }
}

const loadData = async function(urllist) {
    // From a list of URL, return a list of data
    let data = [];
    for (let i = 0; i < urllist.length; i++) {
        data.push(await sendRequest(urllist[i]));
        }

    return data
}

let displayTopMovieData = function(topRanked) {
    // Put the top movie data in the 'movie' blocks
    const block = document.querySelector(".top-movie__information");
    block.innerHTML = (
        "<strong>" + topRanked.title + "</strong>"
        + "<br><strong>Genre(s) :</strong> " + topRanked.genres
        + "<br><strong>Année :</strong> " + topRanked.year
        + "<br><strong>Note :</strong> " + topRanked.imdb_score
        + "<br><strong>Acteurs :</strong> " + topRanked.actors
        + "<br><strong>Producteur :</strong> " + topRanked.directors
    );
  }


  let displayMoviePreview = function(categoryBlock, categoryData) {
    // Put the movies' data in the 'movie' blocks
    const blocks = categoryBlock.querySelectorAll(".movie__information");
    for (let i = 0; i < blocks.length; i++) {
        const movie = categoryData[i];
        blocks[i].innerHTML = (
            "<strong>" + movie.title + "</strong>"
            + "<br><strong>Genre(s) :</strong> " + movie.genres
            + "<br><strong>Année :</strong> " + movie.year
            + "<br><strong>Note :</strong> " + movie.imdb_score
        );
    }
  }
  const displayMoviePosters = function(categoryBlock, categoryData) {
    // Display the posters in the 'movie' blocks
    const articles = categoryBlock.querySelectorAll("article");
    const h2s = categoryBlock.querySelectorAll(".movie h2");
    for (let i = 0; i < articles.length; i++) {
        articles[i].style.backgroundImage = "url('" + categoryData[i].image_url + "')";
        h2s[i].innerHTML = categoryData[i].title;
    }
  }
  let displayMovieData = function(categoryBlock, categoryData) {
    // Add the movies data to the modals
    const blocks = categoryBlock.querySelectorAll(".modal");
    for (let i = 0; i < blocks.length; i++) {
        let movie = categoryData[i];
        blocks[i].querySelector("p").innerHTML = (
            "<strong>" + movie.title + "</strong>"
            + "<br><strong>Acteurs :</strong> " + movie.actors
            + "<br><strong>Producteur :</strong> " + movie.directors
            + "<br><strong>Genre(s) :</strong> " + movie.genres
            + "<br><strong>Année :</strong> " + movie.year
            + "<br><strong>Note :</strong> " + movie.imdb_score
        );
    }
  }

let setPage = async function() {
n_data = await loadData([TOP_RANKED, BEST_ALL_CATEGORIES, BEST_ACTION, BEST_ADVENTURE, BEST_HORROR, BEST_THRILLER]);
topMovieRanked = n_data[0]
const categoryBlocks = document.querySelectorAll(".category");
  //Categories
  for (let i = 0; i < categoryBlocks.length; i++) {
      displayMoviePreview(categoryBlocks[i], n_data[(i + 1)]); // "+ 1" due to the fact that the first element of the array isn't for a category
      displayMoviePosters(categoryBlocks[i], n_data[(i + 1)]);
      displayMovieData(categoryBlocks[i], n_data[(i + 1)]);
  }
const topMovieData = document.querySelector('#top-movie__poster');
topMovieData.style.backgroundImage = "url('" + topMovieRanked[0].image_url + "')";
console.log(n_data[0][0].image_url)
displayTopMovieData(topMovieRanked[0]);
}

setPage()

let openModal = async function(movie) {
    document.querySelector("#" + movie + " .modal").style.visibility = "visible";
  }
  let closeModal = async function(movie) {
    document.querySelector("#" + movie + " .modal").style.visibility = "hidden";
  }