const apiUrl = "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false";

const filmeDoDiaUrl = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
const filmeDoDiaVideoUrl = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"

const filmeIDUrl = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/"
const filmeTitleUrl = " https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query="

let globalMovieList
let currentPage = 1;
const pageLength = 5;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const result = await axios.get(apiUrl);
        globalMovieList = result.data.results
        showMovieList(globalMovieList.slice(0, 5))
    } catch (error) {
        console.log(error);
    }

    try {
        const result = await axios.get(filmeDoDiaUrl);
        showHighlight(result.data)
    } catch (error) {
        console.log(error);
    }

    try {
        const result = await axios.get(filmeDoDiaVideoUrl);
        console.log("HIGHLIGHT Video");
        showHighlightVideo(result.data.results[0])
    } catch (error) {
        console.log(error);
    }
})


const showMovieList = (movieData) => {
    console.log(movieData);
    const movieList = document.querySelector(".movies");
    movieList.innerHTML = '';


    movieData.forEach(movie => {
        const movieItem = document.createElement("div");
        movieItem.classList.add("movies");
        movieItem.innerHTML = `

        <div class="movie" style="background: url(${movie.poster_path}); background-size: cover;" onclick="getMovie(${movie.id})">
        <div class="movie__info">
        <span class="movie__title">${movie.title}</span>
        <span class="movie__rating">
        ${movie.vote_average}
          <img src="./assets/estrela.svg" alt="Estrela">
        </span>
        </div>
        </div>

        `;

        movieList.appendChild(movieItem);
    });

}

const showHighlight = (highlight) => {
    const bg = document.querySelector(".highlight__video");
    bg.style.backgroundImage = `url(${highlight.backdrop_path})`
    bg.style.backgroundSize = `cover`

    const title = document.querySelector(".highlight__title");
    title.innerHTML = highlight.title

    const rating = document.querySelector(".highlight__rating");
    rating.innerHTML = highlight.vote_average

    const genere = document.querySelector(".highlight__genres");
    console.log(highlight.genres);
    let genresString
    highlight.genres.map((item) => {
        if (genresString) {
            genresString += ", " + item.name
        } else {
            genresString = item.name
        }
    })
    genere.innerHTML = genresString

    const launch = document.querySelector(".highlight__description");
    const date = highlight.release_date
    launch.innerHTML = date.slice(8, 10) + "/" + date.slice(5, 7) + "/" + date.slice(0, 4)

    const description = document.querySelector(".highlight__description");
    description.innerHTML = highlight.overview.slice(0, 250)

}

const showHighlightVideo = (highlightVideo) => {
    const urlVideo = document.querySelector(".highlight__video-link");
    console.log(highlightVideo);
    urlVideo.href = "https://www.youtube.com/watch?v=" + highlightVideo.key
}


const getMovie = async (id) => {
    try {
        const result = await axios.get(filmeIDUrl + `${id}?language=pt-BR`);
        console.log(result.data);
        const movie = result.data

        const title = document.querySelector(".modal__title");
        title.innerHTML = movie.title

        const img = document.querySelector(".modal__img");
        img.src = movie.backdrop_path

        const description = document.querySelector(".modal__description");
        description.innerHTML = movie.overview

        const vote = document.querySelector(".modal__average");
        vote.innerHTML = movie.vote_average

        openModal()

    } catch (error) {
        console.log(error);
    }
}

const getMovieByTitle = async () => {
    const title = document.querySelector(".input").value;

    try {
        const result = await axios.get(filmeTitleUrl + title);
        console.log(result.data);
        const movie = result.data
        if (title.length > 0) {
            console.log(movie);
            showMovieList(movie.results.slice(0, 5))
        } else {
            showMovieList(globalMovieList.slice(0, 5))
        }


    } catch (error) {
        console.log(error);
    }


}

const pagination = (direction) => {
    if (direction === 'left' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'right' && (currentPage * pageLength) < globalMovieList.length) {
        currentPage++;
    }

    const startIndex = (currentPage - 1) * pageLength;
    const endIndex = startIndex + pageLength;

    showMovieList(globalMovieList.slice(startIndex, endIndex));

}

const openModal = () => {
    const modal = document.querySelector(".modal.hidden");
    modal.classList.remove('hidden')
}

const closeModal = () => {
    const modal = document.querySelector(".modal");
    modal.classList.add('hidden')
}