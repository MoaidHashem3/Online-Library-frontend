let books = []; 
async function fetchBooks() {
    try {
       
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function searchBooks(query, category) {
    query = query.toLowerCase().trim();
    return books.filter(book => {
        switch(category) {
            case 'title':
                return book.title.toLowerCase().includes(query);
            case 'author':
                return book.author.toLowerCase().includes(query);
            case 'category':
                return book.category.toLowerCase().includes(query);
            default:
                return false;
        }
    });
}

const searchInput = document.getElementById('search');
const searchCategory = document.querySelector('.search-category');

let debounceTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = searchInput.value;
        const category = searchCategory.value;
        const results = searchBooks(query, category);
        displayResults(results);
    }, 300);
});

function displayResults(results) {
    console.log('Search results:', results);
}

document.addEventListener('DOMContentLoaded', fetchBooks);
