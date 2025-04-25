// Dummy data for testing
const dummyBooks = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A story of decadence and excess.",
        category: "Classic",
       imageUrl: "../assets/img/testImage.jpeg"
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
       imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
       imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, {
        id: 2,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction.",
        category: "Science Fiction",
        imageUrl: "../assets/img/testImage.jpeg"
    }, 
];

let currentPage = 1;
const booksPerPage = 8;
let totalBooks = 0;

async function fetchBooks() {
    try {
        //  actual API call for fetching books (Phase 3)
        return dummyBooks; // Dummy data for testing
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

function displayBooks(books) {
    const container = document.querySelector('.CardsContainer');
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const booksToShow = books.slice(start, end);

    let html = '<div class="row">';
    booksToShow.forEach((book, index) => {
        if (index > 0 && index % 4 === 0) {
            html += '</div><div class="row">';
        }
        html += `
            <div class="bookCard">
                <div class="bookImage" onclick="window.location.href='ViewBookDetailsAdmin.html?id=${book.id}'" 
                     style="background-image: url('${book.imageUrl}')"></div>
                <div class="row">
                    <div class="bookInfo">
                        <h3>${book.title}</h3>
                        <p>${book.description}</p>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    html += '<div class="pagination-numbers"></div>';
    container.innerHTML = html;
    updatePaginationButtons();
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
    const books = await fetchBooks();
    totalBooks = books.length;
    displayBooks(books);
    updatePaginationButtons();
}

document.addEventListener('DOMContentLoaded', initializeBooks);
