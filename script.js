const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

// Search button click
searchBtn.addEventListener("click", () => {
    performSearch();
});

// Enter key search
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        performSearch();
    }
});

function performSearch() {
    const query = searchInput.value.trim();

    if (query === "") {
        alert("Please enter something to search");
        return;
    }

    console.log("Searching for:", query);
}