export class Book {
    constructor(id, author, name, isbn) {
        this.id = id;
        this.author = author;
        this.name = name;
        this.isbn = isbn;
    }
}

const books = [
    {
        id: 1,
        author: "Martin Fowler",
        name: "Refactoring",
        isbn: "isbn-1"
    },
    {
        id: 2,
        author: "Bob Martin",
        name: "Clean Architecture",
        isbn: "isbn-2"
    },
    {
        id: 3,
        author: "Bob Martin",
        name: "Clean Code",
        isbn: "isbn-3"
    },
];

export { books };