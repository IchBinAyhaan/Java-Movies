import { API_BASE_URL, endpoints } from "./constants.js";
import { deleteDataById, getAllData } from "./helpers.js";

const moviesRow = document.querySelector(".movies-row");
const loader = document.querySelector(".movies-loader");
const searchInp = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const addMovieForm = document.getElementById('add-movie-form');
const editMovieForm = document.getElementById('edit-movie-form');

let movies = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; 

document.addEventListener("DOMContentLoaded", async () => {
    loader.classList.replace("d-none", "d-flex");
    movies = await getAllData(API_BASE_URL, endpoints.movies);
    loader.classList.replace("d-flex", "d-none");
    renderMoviesHTML(movies);

    searchInp.addEventListener("keyup", (e) => {
        const searchedMovies = movies.filter((x) => {
            return x.title.toLowerCase().includes(e.target.value.toLowerCase().trim());
        });
        renderMoviesHTML(searchedMovies);
    });

    sortSelect.addEventListener("change", (e) => {
        const sortOrder = e.target.value;
        let sortedMovies;

        if (sortOrder === "asc") {
            sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === "desc") {
            sortedMovies = [...movies].sort((a, b) => b.title.localeCompare(a.title));
        } else {
            sortedMovies = movies;
        }

        renderMoviesHTML(sortedMovies);
    });
});

async function fetchMovieDetails(id) {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoints.movies}/${id}`);
        const movie = response.data;
        document.getElementById('title').value = movie.title;
        document.getElementById('year').value = movie.year;
        document.getElementById('director').value = movie.director;
        document.getElementById('actors').value = movie.actors.join(', ');
        document.getElementById('image').value = movie.image;
        document.getElementById('description').value = movie.description;
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

async function updateMovie(id, updatedMovie) {
    try {
        await axios.put(`${API_BASE_URL}${endpoints.movies}/${id}`, updatedMovie);
        alert('Movie updated successfully!');
        window.location.href = "index.html";
    } catch (error) {
        console.error('Error updating movie:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) {
        fetchMovieDetails(movieId);
    }

    editMovieForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const year = document.getElementById('year').value;
        const director = document.getElementById('director').value;
        const actors = document.getElementById('actors').value.split(',').map(actor => actor.trim());
        const description = document.getElementById('description').value;
        const image = document.getElementById('image').value;

        const updatedMovie = {
            title,
            year,
            director,
            actors,
            description,
            image
        };

        const movieId = new URLSearchParams(window.location.search).get('id');
        updateMovie(movieId, updatedMovie);
    });
});

addMovieForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const director = document.getElementById('director').value;
    const actors = document.getElementById('actors').value.split(',').map(actor => actor.trim());
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;

    const newMovie = {
        title,
        year,
        director,
        actors,
        description,
        image
    };

    console.log("Adding movie with data:", newMovie);

    try {
        await addMovie(newMovie);
        showSuccessAlert(`Movie successfully added: ${title}`);
        addMovieForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    } catch (error) {
        console.error('Failed to add movie:', error);
    }
});

async function addMovie(movie) {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoints.movies}`, movie);
        console.log("STATUS CODE: ", response.status);
        console.log("Response Data:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding movie:', error);
        throw error;
    }
}

function renderMoviesHTML(arr) {
    moviesRow.innerHTML = "";
    arr.forEach((movie) => {
        const isInWishlist = wishlist.some(m => m.id === movie.id);
        moviesRow.innerHTML += `
            <div class="col-3">
                <div class="card">
                    <div class="img-wrapper">
                        <img src="${movie.image}" class="card-img-top" alt="${movie.title}" title="${movie.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="m-0">Release Year: ${movie.year}</p>
                        <p class="m-0">Director: ${movie.director}</p>
                        <p class="m-0">Actors: ${movie.actors.join(', ')}</p>
                        <p class="m-0 mb-3">Description: ${movie.description}</p>
                        <button data-id="${movie.id}" class="btn btn-danger delete">Delete</button>
                        <a href="detail.html?id=${movie.id}" class="btn btn-primary">Details</a>
                        <a href="edit.html?id=${movie.id}" class="btn btn-warning">Edit</a>
                        <i data-id="${movie.id}" class="${isInWishlist ? 'fas' : 'far'} fa-heart add-to-wishlist" style="cursor:pointer; font-size: 24px;"></i>
                    </div>
                </div>
            </div>`;
    });

    const deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    e.target.closest(".col-3").remove();
                    const id = e.target.getAttribute("data-id");
                    deleteDataById(API_BASE_URL, endpoints.movies, id).then((res) => {
                        console.log("response: ", res);
                    });
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            });
        });
    });
    const heartIcons = document.querySelectorAll(".add-to-wishlist");
    heartIcons.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            const movieId = e.target.getAttribute("data-id");
            const movie = movies.find(m => m.id === movieId);
            if (wishlist.some(m => m.id === movieId)) {
                wishlist = wishlist.filter(m => m.id !== movieId);
                e.target.classList.remove("fas");
                e.target.classList.add("far");
            } else {
                wishlist.push(movie);
                e.target.classList.add("fas"); 
                e.target.classList.remove("far");
            }
            localStorage.setItem("wishlist", JSON.stringify(wishlist)); 
        });
    });
}
