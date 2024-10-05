import { getDataById } from "./helpers.js";
import { API_BASE_URL, endpoints } from "./constants.js";

const detailRow = document.querySelector(".movie-row");

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  const movies = await getDataById(API_BASE_URL, endpoints.movies, id);
  const movie = movies[0];
  detailRow.innerHTML = `  <div class="col-9">
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
                                 <a href="index.html" class="btn btn-primary">Go Back</a>
                            </div>
                        </div>
                    </div>`;
});