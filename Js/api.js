const TOP_RANKED = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1";
const BEST_ALL_CATEGORIES = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&page=1";
const BEST_ACTION = "http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page_size=7&page=1";
const BEST_ADVENTURE = "http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score&page_size=7&page=1";
const BEST_HORROR = "http://localhost:8000/api/v1/titles/?genre=Horror&sort_by=-imdb_score&page_size=7&page=1";
const BEST_COMEDY = "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score&page_size=7&page=1";

let positions = {
  all_categories: 1,
  action: 1,
  adventure: 1, 
  horror: 1,
  comedy: 1
}

const nb_visible_element = 4;

const getMovieData = async function(url) 
{
try {
    const response = await fetch(url);
    
    const topRankedMovie_data_jsonResponse = await response.json();
    return topRankedMovie_data_jsonResponse;
}
catch (e) {
    logError(e);
    }
}


const sendRequestCategory = async function(category_url) 
{
// Return the data from a request to an url 
try {
    const response = await fetch(category_url);
    const category_jsonResponse = await response.json();
    
    const results = category_jsonResponse.results;
    return results;
    }
catch (e) {
    logError(e);
    }
}

const loadData = async function(url_list) {
    // From a list of URL, return a list of data
    let data = [];
    for (let i = 0; i < url_list.length; i++) {
        data.push(await sendRequestCategory(url_list[i]));
        }

    return data
}

let displayTopMovieData = async function(topRanked) {
    // Put the top movie data in the 'movie' blocks
    const block = document.querySelector(".top-movie__information");
    const topRankedMovie_data = await getMovieData(topRanked.url);
    
    block.innerHTML = (
      "<strong class='top-movie__information-js__title'>" + topRanked.title + "</strong>"  
      + "<br><strong class='top-movie__information-js'>Genre(s) :</strong> " + topRanked.genres
      + "<br><strong class='top-movie__information-js'>Date de sortie :</strong> " + topRankedMovie_data.date_published
      + "<br><strong class='top-movie__information-js'>Note :</strong> " + topRanked.imdb_score
      + "<br><strong class='top-movie__information-js'>Acteurs :</strong> " + topRanked.actors
      + "<br><strong class='top-movie__information-js'>Producteur :</strong> " + topRanked.directors
      + "<br><strong class='top-movie__information-js'>Note :</strong> " + topRankedMovie_data.rated
      + "<br><strong class='top-movie__information-js'>Durée :</strong> " + topRankedMovie_data.duration + "min"
      + "<br><strong class='top-movie__information-js'>Pays d'origine :</strong> " + topRankedMovie_data.countries
      + "<br><strong class='top-movie__information-js'>Budget :</strong> " + topRankedMovie_data.budget + " " + topRankedMovie_data.budget_currency
      + "<br><strong class='top-movie__information-js'>Résumé :</strong> " + topRankedMovie_data.description     
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
  
    }
  }
  let displayMovieData = async function(categoryBlock, categoryData) {
    // Add the movies data to the modals
    const blocks = categoryBlock.querySelectorAll(".modal");
    for (let i = 0; i < blocks.length; i++) {
        let movie = categoryData[i];
        const response = await fetch(movie.url);
        const movie_jsonResponse = await response.json();
        blocks[i].querySelector("p").innerHTML = (
            "<strong>" + movie.title + "</strong>"
            + "<br><strong>Acteurs :</strong> " + movie.actors
            + "<br><strong>Producteur :</strong> " + movie.directors
            + "<br><strong>Genre(s) :</strong> " + movie.genres
            + "<br><strong>Dare de sortie :</strong> " + movie_jsonResponse.date_published
            + "<br><strong>Note imdb :</strong> " + movie.imdb_score
            + "<br><strong>Note :</strong> " + movie_jsonResponse.rated
            + "<br><strong>Durée :</strong> " + movie_jsonResponse.duration + "min"
            + "<br><strong>Pays d'origine :</strong> " + movie_jsonResponse.countries
            + "<br><strong>Budget :</strong> " + movie_jsonResponse.budget + " " + movie_jsonResponse.budget_currency
            + "<br><strong>Résumé :</strong> " + movie_jsonResponse.description
        );
    }
  }

let checkArrows = async function(category, nb_total_elt) {
  // Change the side arrows to active or to disable according to the position
  if (positions[category] == 1) {
      document.querySelector("#" + category +  " .left").classList.add("side-arrow--disable");   
  } else if (positions[category] > (nb_total_elt - nb_visible_element)) {
      document.querySelector("#" + category +  " .right").classList.add("side-arrow--disable");
  } else {
      document.querySelector("#" + category +  " .left").classList.remove("side-arrow--disable");
      document.querySelector("#" + category +  " .right").classList.remove("side-arrow--disable");
  }
}
let setVisibleMovies = async function(parent, position) {
  // Display or hide the movies in the categories depending of the position of the category
  const nb_total_elt = 7;
  for(let elt_nb = 1; elt_nb <= nb_total_elt; elt_nb++) {
      if ((elt_nb >= position) && (elt_nb < (nb_visible_element + position))) {
          document.querySelector(parent + " .category__best-movies .movie:nth-child(" + elt_nb + ")").classList.remove("movie--hidden");
      }else {
          document.querySelector(parent + " .category__best-movies .movie:nth-child(" + elt_nb + ")").classList.add("movie--hidden");
      }
  }
}

let changeCategoryPosition = async function(category, direction) {
  // Change the position inside the category
  const nb_total_elt = document.querySelectorAll("#" + category + " .movie").length;
  if (direction == "right") {
      if (positions[category] <= (nb_total_elt - nb_visible_element)) {
      positions[category] ++;
      setVisibleMovies("#" + category, positions[category]);
      }
  } else {
      if (positions[category] > 1) {
      positions[category] --;
      setVisibleMovies("#" + category, positions[category]);
      }
  }
  checkArrows(category, nb_total_elt);
}

let openModal = async function(movie) {
  document.querySelector("#" + movie + " .modal").style.visibility = "visible";
}
let closeModal = async function(movie) {
document.querySelector("#" + movie + " .modal").style.visibility = "hidden";
} 

let setPage = async function() {
  data = await loadData([TOP_RANKED, BEST_ALL_CATEGORIES, BEST_ACTION, BEST_ADVENTURE, BEST_HORROR, BEST_COMEDY]);
  topMovieRanked = data[0]
  const categoryBlocks = document.querySelectorAll(".category");
    //Categories
    for (let i = 0; i < categoryBlocks.length; i++) {
        displayMoviePreview(categoryBlocks[i], data[(i + 1)]); // "+ 1" due to the fact that the first element of the array isn't for a category
        displayMoviePosters(categoryBlocks[i], data[(i + 1)]);
        displayMovieData(categoryBlocks[i], data[(i + 1)]);
    }
  const topMovieData = document.querySelector('#top-movie__poster');
  topMovieData.style.backgroundImage = "url('" + topMovieRanked[0].image_url + "')";
  displayTopMovieData(topMovieRanked[0]);
}

setPage()

