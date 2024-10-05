const wishlistRow = document.querySelector(".wishlist-row");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.addEventListener("DOMContentLoaded", () => {
    renderWishlistHTML(wishlist);
});

function renderWishlistHTML(arr) {
    wishlistRow.innerHTML = "";
    if (arr.length === 0) {
        wishlistRow.innerHTML = `<p>Your wishlist is empty!</p>`;
        return;
    }

    arr.forEach((movie) => {
        wishlistRow.innerHTML += `
            <div class="col-4">
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
                        <button data-id="${movie.id}" class="btn btn-danger remove">Remove from Wishlist</button>
                    </div>
                </div>
            </div>`;
    });

    const removeBtns = document.querySelectorAll(".remove");
    removeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            wishlist = wishlist.filter((movie) => movie.id !== id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderWishlistHTML(wishlist);
        });
    });
}

function addToWishlist(movie) {
    if (!wishlist.some((m) => m.id === movie.id)) {
        wishlist.push(movie);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlistHTML(wishlist);
    }
}