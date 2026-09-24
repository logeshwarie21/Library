const defaultBooks = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        isbn: "9780061122415",
        year: 1988,
        pages: 208,
        available: true,
        icon: "📕",
        cover: "cover-blue",
        description:
            "A philosophical novel about following your dreams, discovering your purpose and listening to your heart."
    },

    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        isbn: "9780132350884",
        year: 2008,
        pages: 464,
        available: true,
        icon: "💻",
        cover: "cover-purple",
        description:
            "A practical guide to writing clean, readable and maintainable software."
    },

    {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self Help",
        isbn: "9780735211292",
        year: 2018,
        pages: 320,
        available: false,
        icon: "🧠",
        cover: "cover-green",
        description:
            "A framework for building good habits, breaking bad ones and making small improvements every day."
    },

    {
        id: 4,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Computer Science",
        isbn: "9780262046305",
        year: 2009,
        pages: 1312,
        available: true,
        icon: "📘",
        cover: "cover-orange",
        description:
            "A comprehensive introduction to modern algorithms and their analysis."
    },

    {
        id: 5,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Finance",
        isbn: "9781612680194",
        year: 1997,
        pages: 336,
        available: true,
        icon: "💰",
        cover: "cover-pink",
        description:
            "A personal finance book discussing financial education, investing and building wealth."
    },

    {
        id: 6,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Finance",
        isbn: "9780857197689",
        year: 2020,
        pages: 256,
        available: false,
        icon: "💵",
        cover: "cover-green",
        description:
            "Explores the relationship between money, behaviour and decision-making."
    },

    {
        id: 7,
        title: "Artificial Intelligence",
        author: "Stuart Russell",
        category: "Artificial Intelligence",
        isbn: "9780134610993",
        year: 2021,
        pages: 1152,
        available: true,
        icon: "🤖",
        cover: "cover-cyan",
        description:
            "An introduction to artificial intelligence, intelligent agents and modern AI concepts."
    },

    {
        id: 8,
        title: "Wings of Fire",
        author: "A. P. J. Abdul Kalam",
        category: "Biography",
        isbn: "9788173711466",
        year: 1999,
        pages: 180,
        available: true,
        icon: "🚀",
        cover: "cover-orange",
        description:
            "The autobiography of Dr. A. P. J. Abdul Kalam, documenting his journey from childhood to becoming a scientist and leader."
    }
];


let books = JSON.parse(localStorage.getItem("libraryBooks")) || defaultBooks;

let transactions =
    JSON.parse(localStorage.getItem("libraryTransactions")) || [];


const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const availabilityFilter =
    document.getElementById("availabilityFilter");

const emptyState = document.getElementById("emptyState");


/* Initialize */

function init() {

    populateCategories();

    renderBooks();

    updateStats();

    renderTransactions();

}


/* Categories */

function populateCategories() {

    const categories = [...new Set(books.map(book => book.category))];

    categoryFilter.innerHTML =
        `<option value="all">All Categories</option>`;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


/* Render Books */

function renderBooks() {

    const search =
        searchInput.value.toLowerCase().trim();

    const category =
        categoryFilter.value;

    const availability =
        availabilityFilter.value;


    const filteredBooks = books.filter(book => {

        const matchesSearch =
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search) ||
            book.isbn.includes(search);

        const matchesCategory =
            category === "all" ||
            book.category === category;

        const matchesAvailability =
            availability === "all" ||
            (availability === "available" && book.available) ||
            (availability === "issued" && !book.available);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesAvailability
        );

    });


    bookGrid.innerHTML = "";


    if (filteredBooks.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";


    filteredBooks.forEach(book => {

        const card = document.createElement("div");

        card.className = "book-card";


        card.innerHTML = `

            <div class="book-cover ${book.cover}">

                <span>${book.icon}</span>

                <span class="status ${
                    book.available
                        ? "available"
                        : "issued"
                }">

                    ${
                        book.available
                            ? "Available"
                            : "Issued"
                    }

                </span>

            </div>


            <div class="book-body">

                <span class="book-category">
                    ${book.category}
                </span>

                <h3 class="book-title">
                    ${book.title}
                </h3>

                <p class="book-author">
                    ${book.author}
                </p>


                <div class="book-footer">

                    <button
                        class="details-btn"
                        onclick="showDetails(${book.id})"
                    >
                        View Details
                    </button>


                    <button
                        class="issue-btn ${
                            book.available
                                ? ""
                                : "return-btn"
                        }"
                        onclick="${
                            book.available
                                ? `issueBook(${book.id})`
                                : `returnBook(${book.id})`
                        }"
                    >

                        ${
                            book.available
                                ? "Issue Book"
                                : "Return Book"
                        }

                    </button>

                </div>

            </div>

        `;


        bookGrid.appendChild(card);

    });

}


/* Stats */

function updateStats() {

    document.getElementById("totalBooks").textContent =
        books.length;


    document.getElementById("availableBooks").textContent =
        books.filter(book => book.available).length;


    document.getElementById("issuedBooks").textContent =
        books.filter(book => !book.available).length;


    document.getElementById("categoryCount").textContent =
        new Set(books.map(book => book.category)).size;

}


/* Issue Book */

function issueBook(id) {

    const book = books.find(book => book.id === id);

    if (!book || !book.available) {

        alert("This book is currently unavailable.");

        return;

    }


    const confirmIssue =
        confirm(
            `Issue "${book.title}" to Arun Student?`
        );


    if (!confirmIssue) return;


    book.available = false;


    transactions.unshift({

        id: Date.now(),

        book: book.title,

        student: "Arun Student",

        action: "Issued",

        date: new Date().toLocaleDateString(),

        status: "Active"

    });


    saveData();

    refreshUI();

    alert(`"${book.title}" has been issued successfully.`);

}


/* Return Book */

function returnBook(id) {

    const book = books.find(book => book.id === id);

    if (!book || book.available) return;


    const confirmReturn =
        confirm(
            `Return "${book.title}"?`
        );


    if (!confirmReturn) return;


    book.available = true;


    transactions.unshift({

        id: Date.now(),

        book: book.title,

        student: "Arun Student",

        action: "Returned",

        date: new Date().toLocaleDateString(),

        status: "Completed"

    });


    saveData();

    refreshUI();

    alert(`"${book.title}" has been returned successfully.`);

}


/* Details */

function showDetails(id) {

    const book = books.find(book => book.id === id);

    if (!book) return;


    document.getElementById("modalCover").textContent =
        book.icon;


    document.getElementById("modalCategory").textContent =
        book.category;


    document.getElementById("modalTitle").textContent =
        book.title;


    document.getElementById("modalAuthor").textContent =
        `By ${book.author}`;


    document.getElementById("modalISBN").textContent =
        book.isbn;


    document.getElementById("modalYear").textContent =
        book.year;


    document.getElementById("modalPages").textContent =
        `${book.pages} pages`;


    document.getElementById("modalStatus").textContent =
        book.available
            ? "Available"
            : "Currently Issued";


    document.getElementById("modalDescription").textContent =
        book.description;


    const actionButton =
        document.getElementById("modalAction");


    actionButton.textContent =
        book.available
            ? "Issue This Book"
            : "Return This Book";


    actionButton.style.background =
        book.available
            ? "#4f46e5"
            : "#16a34a";


    actionButton.onclick = () => {

        closeModal();

        if (book.available) {

            issueBook(book.id);

        } else {

            returnBook(book.id);

        }

    };


    document
        .getElementById("bookModal")
        .classList.add("show");

}


/* Close Modal */

function closeModal() {

    document
        .getElementById("bookModal")
        .classList.remove("show");

}


/* Transactions */

function renderTransactions() {

    const table =
        document.getElementById("transactionTable");


    if (transactions.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center;color:#737b8c">

                    No transactions yet.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        transactions
            .slice(0, 8)
            .map(transaction => `

                <tr>

                    <td>
                        <strong>
                            ${transaction.book}
                        </strong>
                    </td>

                    <td>
                        ${transaction.student}
                    </td>

                    <td>

                        <span class="${
                            transaction.action === "Issued"
                                ? "action-issue"
                                : "action-return"
                        }">

                            ${transaction.action}

                        </span>

                    </td>

                    <td>
                        ${transaction.date}
                    </td>

                    <td>

                        <span class="transaction-status">

                            ${transaction.status}

                        </span>

                    </td>

                </tr>

            `)
            .join("");

}


/* Storage */

function saveData() {

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );


    localStorage.setItem(
        "libraryTransactions",
        JSON.stringify(transactions)
    );

}


/* Refresh */

function refreshUI() {

    populateCategories();

    renderBooks();

    updateStats();

    renderTransactions();

}


/* Events */

searchInput.addEventListener(
    "input",
    renderBooks
);

categoryFilter.addEventListener(
    "change",
    renderBooks
);

availabilityFilter.addEventListener(
    "change",
    renderBooks
);


document
    .getElementById("bookModal")
    .addEventListener("click", function (event) {

        if (event.target === this) {

            closeModal();

        }

    });


/* Start */

init();
