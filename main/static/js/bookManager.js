let currentPage = 1;
const booksPerPage = 10;
let totalBooks = 0;
let allBooks = [];


async function fetchBooks() {
    try {
        const response = await fetch('/fetch-books/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });
        
        const data = await response.json();
        if (data.success) {
            return data.books;
        } else {
            throw new Error(data.error || 'Failed to fetch books');
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

function getLoggedInUserRole() {
   
    return localStorage.getItem('userRole') || 'user';
}

function displayBooks(books) {
    const container = document.querySelector('.CardsContainer');
    
    if (!books || books.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #EEEEEE; font-size: 1.2rem;">
                No books found matching your search
            </div>`;
        return;
    }

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const booksToShow = books.slice(start, end);

    let html = '<div class="row">';
    booksToShow.forEach((book, index) => {
        if (index > 0 && index % 5 === 0) { 
            html += '</div><div class="row">';
        }
        const truncatedDescription = book.description?.length > 100 
            ? book.description.substring(0, 100) + '...' 
            : book.description;

        html += `
            <div class="bookCard">
                <div class="bookImage" onclick="navigateToBookDetails(${book.id})" 
                     style="background-image: url('${book.imageUrl}')"></div>
                <div class="bookInfo">
                    <h3>${book.title}</h3>
                    <p title="${book.description}">${truncatedDescription}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';
    html += '<div class="pagination-numbers"></div>';
    container.innerHTML = html;
    updatePaginationButtons();
}

function navigateToBookDetails(bookId) {
    const userRole = getLoggedInUserRole();
     const page = userRole === 'admin' ? '/view-book-details-admin/' : '/view-book-details-user/'; // prefix the path with / to correctly move to that page
     window.location.href = `${page}?id=${bookId}`;
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    const paginationContainer = document.querySelector('.pagination-numbers');

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <div class="page-number ${i === currentPage ? 'active' : ''}" 
                 onclick="goToPage(${i})">${i}</div>
        `;
    }
    paginationContainer.innerHTML = paginationHTML;
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    initializeBooks();
}

async function initializeBooks() {
    try {
        allBooks = await fetchBooks(); 
        totalBooks = allBooks.length;
        displayBooks(allBooks);
        updatePaginationButtons();
    } catch (error) {
        console.error('Error initializing books:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeBooks);