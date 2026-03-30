/* Initialize global search functionality */
export function initGlobalSearch() {
  const searchBar = document.querySelector('.js-search-bar');
  const searchButton = document.querySelector('.js-search-button');

  /* Exit if search elements are not present */
  if (!searchBar || !searchButton) return;

  /* Redirect to search results page with query */
  function performSearch() {
    const search = searchBar.value.trim();

    /* Prevent empty search */
    if (!search) return;

    window.location.href =
      `index.html?search=${encodeURIComponent(search)}`;
  }

  /* Trigger search on button click */
  searchButton.addEventListener('click', performSearch);

  /* Trigger search on Enter key press */
  searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}
