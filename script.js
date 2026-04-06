const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value;
    console.log("Searching for:", query);
});