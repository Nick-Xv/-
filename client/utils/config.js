/**api链接 */
const apiUrl = "https://www.fkten.xyz/v2/book/";
//
module.exports = { 
    getBookById: apiUrl,
    searchBook: apiUrl + "search",
    getBookList: apiUrl + "series/:id/books" }