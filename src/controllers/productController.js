import connection from "../models/connectDatabase.js";
import { cloudinaryDeleteImg } from "../util/cloudinaryDeleteImg.js";

class ProductController {
  // getDetail(req, res) {

  //     const book_id = req.query.book_id;
  //     var detail_book = {};
  //     console.log();
  //     const query = 'SELECT * FROM `books` WHERE id = ?'

  //     connection.query(query, [book_id], (error, results) => {
  //         if (error) {
  //             console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //             return res.status(500).json({ message: 'Lỗi máy chủ' });
  //         }

  //         if (results.length === 0) {
  //             return res.status(401).json({ message: 'Không có sản phẩm' });
  //         }

  //         detail_book = results[0];

  //         if (req.session.user_id) {
  //             const favorite_query = 'SELECT * FROM `favorites` WHERE user_id = ? and book_id = ?'

  //             connection.query(favorite_query, [req.session.user_id, book_id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn:', error);
  //                     return;
  //                 }

  //                 if (results.length > 0) {
  //                     detail_book.favorite = true;
  //                 }

  //             });
  //         }

  //         const query = 'SELECT `name` FROM `categories` WHERE id = ?'

  //         connection.query(query, [detail_book.category_id], (error, results) => {
  //             if (error) {
  //                 console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //                 return res.status(500).json({ message: 'Lỗi máy chủ' });
  //             }

  //             if (results.length === 0) {
  //                 return res.status(401).json({ message: 'Không có sản phẩm' });
  //             }

  //             detail_book.category_name = results[0].name;

  //             const query = 'SELECT * FROM `images` WHERE product_id = ?'

  //             connection.query(query, [detail_book.id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //                     return res.status(500).json({ message: 'Lỗi máy chủ' });
  //                 }

  //                 detail_book.img = results

  //                 for (var i = 1; i < detail_book.img.length; i++) {
  //                     if (detail_book.img[i].image_id == detail_book.img_main_id) {
  //                         var temp = detail_book.img[i];
  //                         detail_book.img[i] = detail_book.img[0];
  //                         detail_book.img[0] = temp;
  //                     }
  //                 }

  //                 const query = 'SELECT COUNT(*) AS count_rating FROM rating WHERE book_id = ?';
  //                 connection.query(query, [book_id], (error, results) => {
  //                     if (error) {
  //                         console.error('Lỗi truy vấn:', error);
  //                         return;
  //                     }
  //                     detail_book.user_rating = results[0].count_rating;

  //                     const query = `SELECT u.full_name, r.stars, r.comment
  //                     FROM rating r
  //                     JOIN users u ON u.id = r.user_id
  //                     WHERE r.book_id = ?`
  //                     connection.query(query, [book_id], (error, results) => {
  //                         if (error) {
  //                             console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //                             return res.status(500).json({ message: 'Lỗi máy chủ' });
  //                         }

  //                         detail_book.allComment = results;

  //                         if (req.session.user_id) {

  //                             const query = 'SELECT `stars` FROM `rating` WHERE user_id = ? and book_id = ?';
  //                             connection.query(query, [req.session.user_id, book_id], (error, results) => {
  //                                 if (error) {
  //                                     console.error('Lỗi truy vấn:', error);
  //                                     return;
  //                                 }
  //                                 if (results.length > 0) {
  //                                     const my_rating = results[0].stars;
  //                                     detail_book.isRating = true;
  //                                     detail_book.my_rating = my_rating;
  //                                     res.status(200).json({
  //                                         message: 'hello home page!!',
  //                                         book_detail: detail_book
  //                                     })

  //                                 } else {
  //                                     detail_book.isRating = false;
  //                                     res.status(200).json({
  //                                         message: 'hello home page!!',
  //                                         book_detail: detail_book
  //                                     })
  //                                 }

  //                             });
  //                         } else {

  //                             res.status(200).json({
  //                                 message: 'hello home page!!',
  //                                 book_detail: detail_book
  //                             })
  //                         }

  //                     });
  //                 });
  //             });

  //         });

  //     });

  // }

  // getDetail(req, res) {
  //     const book_id = req.query.book_id;
  //     var detail_book = {};

  //     const query = 'SELECT * FROM `books` WHERE id = ?';
  //     connection.query(query, [book_id], (error, results) => {
  //         if (error) {
  //             console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //             return res.status(500).json({ message: 'Lỗi máy chủ' });
  //         }

  //         if (results.length === 0) {
  //             return res.status(401).json({ message: 'Không có sản phẩm' });
  //         }

  //         detail_book = results[0];

  //         if (req.session.user_id) {
  //             const favorite_query = 'SELECT * FROM `favorites` WHERE user_id = ? and book_id = ?';
  //             connection.query(favorite_query, [req.session.user_id, book_id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn:', error);
  //                     return;
  //                 }

  //                 if (results.length > 0) {
  //                     detail_book.favorite = true;
  //                 }

  //                 fetchCategory();
  //             });
  //         } else {
  //             fetchCategory();
  //         }

  //         function fetchCategory() {
  //             const query = 'SELECT `name` FROM `categories` WHERE id = ?';
  //             connection.query(query, [detail_book.category_id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //                     return res.status(500).json({ message: 'Lỗi máy chủ' });
  //                 }

  //                 if (results.length === 0) {
  //                     return res.status(401).json({ message: 'Không có sản phẩm' });
  //                 }

  //                 detail_book.category_name = results[0].name;

  //                 fetchImages();
  //             });
  //         }

  //         function fetchImages() {
  //             const query = 'SELECT * FROM `images` WHERE product_id = ?';
  //             connection.query(query, [detail_book.id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //                     return res.status(500).json({ message: 'Lỗi máy chủ' });
  //                 }

  //                 detail_book.img = results;

  //                 for (var i = 1; i < detail_book.img.length; i++) {
  //                     if (detail_book.img[i].image_id == detail_book.img_main_id) {
  //                         var temp = detail_book.img[i];
  //                         detail_book.img[i] = detail_book.img[0];
  //                         detail_book.img[0] = temp;
  //                     }
  //                 }

  //                 fetchRatingCount();
  //             });
  //         }

  //         function fetchRatingCount() {
  //             const query = 'SELECT COUNT(*) AS count_rating FROM rating WHERE book_id = ?';
  //             connection.query(query, [book_id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn:', error);
  //                     return;
  //                 }
  //                 detail_book.user_rating = results[0].count_rating;

  //                 fetchUserRatings();
  //             });
  //         }

  //         function fetchUserRatings() {
  //             const query = `SELECT u.full_name, r.stars, r.comment
  //                 FROM rating r
  //                 JOIN users u ON u.id = r.user_id
  //                 WHERE r.book_id = ?`;
  //             connection.query(query, [book_id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
  //                     return res.status(500).json({ message: 'Lỗi máy chủ' });
  //                 }

  //                 detail_book.allComment = results;

  //                 if (req.session.user_id) {
  //                     fetchUserRating();
  //                 } else {
  //                     sendResponse();
  //                 }
  //             });
  //         }

  //         function fetchUserRating() {
  //             const query = 'SELECT `stars` FROM `rating` WHERE user_id = ? and book_id = ?';
  //             connection.query(query, [req.session.user_id, book_id], (error, results) => {
  //                 if (error) {
  //                     console.error('Lỗi truy vấn:', error);
  //                     return;
  //                 }
  //                 if (results.length > 0) {
  //                     const my_rating = results[0].stars;
  //                     detail_book.isRating = true;
  //                     detail_book.my_rating = my_rating;
  //                     sendResponse();
  //                 } else {
  //                     detail_book.isRating = false;
  //                     sendResponse();
  //                 }
  //             });
  //         }

  //         function sendResponse() {
  //             res.status(200).json({
  //                 message: 'hello home page!!',
  //                 book_detail: detail_book
  //             });
  //         }
  //     });
  // }

  getDetail(req, res) {
    const book_id = req.query.book_id;
    let detail_book = {};

    const query = "SELECT * FROM `books` WHERE id = ? and isDelete = false";

    new Promise((resolve, reject) => {
      connection.query(query, [book_id], (error, results) => {
        if (error) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          reject({ status: 500, message: "Lỗi máy chủ" });
          return;
        }

        if (results.length === 0) {
          reject({ status: 401, message: "Không có sản phẩm" });
          return;
        }

        detail_book = results[0];
        resolve();
      });
    })
      .then(() => {
        if (req.session.user_id) {
          const favorite_query =
            "SELECT * FROM `favorites` WHERE user_id = ? and book_id = ?";

          return new Promise((resolve, reject) => {
            connection.query(
              favorite_query,
              [req.session.user_id, book_id],
              (error, results) => {
                if (error) {
                  console.error("Lỗi truy vấn:", error);
                  reject({ status: 500, message: "Lỗi máy chủ" });
                  return;
                }

                if (results.length > 0) {
                  detail_book.favorite = true;
                }

                resolve();
              }
            );
          });
        } else {
          return Promise.resolve(); // Trả về Promise resolved nếu không có session user_id
        }
      })
      .then(() => {
        const query = "SELECT `name` FROM `categories` WHERE id = ?";

        return new Promise((resolve, reject) => {
          connection.query(
            query,
            [detail_book.category_id],
            (error, results) => {
              if (error) {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                reject({ status: 500, message: "Lỗi máy chủ" });
                return;
              }

              if (results.length === 0) {
                reject({ status: 401, message: "Không có sản phẩm" });
                return;
              }

              detail_book.category_name = results[0].name;
              resolve();
            }
          );
        });
      })
      .then(() => {
        const query = "SELECT * FROM `images` WHERE product_id = ?";

        return new Promise((resolve, reject) => {
          connection.query(query, [detail_book.id], (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              reject({ status: 500, message: "Lỗi máy chủ" });
              return;
            }

            detail_book.img = results;

            for (let i = 1; i < detail_book.img.length; i++) {
              if (detail_book.img[i].image_id == detail_book.img_main_id) {
                const temp = detail_book.img[i];
                detail_book.img[i] = detail_book.img[0];
                detail_book.img[0] = temp;
              }
            }

            resolve();
          });
        });
      })
      .then(() => {
        const query =
          "SELECT COUNT(*) AS count_rating FROM rating WHERE book_id = ?";

        return new Promise((resolve, reject) => {
          connection.query(query, [book_id], (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn:", error);
              reject({ status: 500, message: "Lỗi máy chủ" });
              return;
            }

            detail_book.user_rating = results[0].count_rating;
            resolve();
          });
        });
      })
      .then(() => {
        const query = `SELECT u.full_name, r.stars, r.comment
                            FROM rating r
                            JOIN users u ON u.id = r.user_id
                            WHERE r.book_id = ?`;

        return new Promise((resolve, reject) => {
          connection.query(query, [book_id], (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              reject({ status: 500, message: "Lỗi máy chủ" });
              return;
            }

            detail_book.allComment = results;
            resolve();
          });
        });
      })
      .then(() => {
        if (req.session.user_id) {
          const query =
            "SELECT `stars` FROM `rating` WHERE user_id = ? and book_id = ?";

          return new Promise((resolve, reject) => {
            connection.query(
              query,
              [req.session.user_id, book_id],
              (error, results) => {
                if (error) {
                  console.error("Lỗi truy vấn:", error);
                  reject({ status: 500, message: "Lỗi máy chủ" });
                  return;
                }
                if (results.length > 0) {
                  const my_rating = results[0].stars;
                  detail_book.isRating = true;
                  detail_book.my_rating = my_rating;
                } else {
                  detail_book.isRating = false;
                }
                resolve();
              }
            );
          });
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        res.status(200).json({
          message: "hello home page!!",
          book_detail: detail_book,
        });
      })
      .catch((error) => {
        res.status(error.status).json({ message: error.message });
      });
  }

  async searchItems(req, res) {
    const key = req.body.key;
    console.log(key);
    var list = [];
    var result = [];

    const query = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.isDelete, b.quantity_sold, b.rating, i.image_url, c.name
        FROM books b
        JOIN images i ON b.img_main_id = i.image_id
        JOIN categories c ON c.id = b.category_id
        WHERE b.isDelete = false`;

    connection.query(query, (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      list = results;

      for (var i = 0; i < list.length; i++) {
        if (
          longestCommonSubsequence(
            removeVietnameseTones(key).toLowerCase().split(""),
            removeVietnameseTones(list[i].author).toLowerCase().split("")
          ) >=
          shorterLength(key, list[i].author) * 0.9
        ) {
          result.push(list[i]);
          list.splice(i, 1);
          i--;
        }
      }

      for (var i = 0; i < list.length; i++) {
        if (
          longestCommonSubsequence(
            removeVietnameseTones(key).toLowerCase().split(""),
            removeVietnameseTones(list[i].title).toLowerCase().split("")
          ) >=
          shorterLength(key, list[i].title) * 0.9
        ) {
          result.push(list[i]);
          list.splice(i, 1);
          i--;
        }
      }

      res.status(200).json({
        message: "search",
        searchItems: result,
      });
    });

    function shorterLength(str1, str2) {
      return str1.length < str2.length ? str1.length : str2.length;
    }

    function longestCommonSubsequence(a, b) {
      const matrix = Array(a.length + 1)
        .fill()
        .map(() => Array(b.length + 1).fill(0));
      for (let i = 1; i < a.length + 1; i++) {
        for (let j = 1; j < b.length + 1; j++) {
          if (a[i - 1] === b[j - 1]) {
            matrix[i][j] = 1 + matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
          }
        }
      }
      return matrix[a.length][b.length];
    }

    function removeVietnameseTones(str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");

      return str;
    }
  }

  searchByCategory(req, res) {
    const key = req.body.key;
    const priceFrom = req.body.priceFrom;
    const priceTo = req.body.priceTo;
    const filter = req.body.filter;
    var list = [];
    var arr_id = [];
    var id;
    var list_items = [];

    function getAllCategoryId(id, arr_id, list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].parent_id == id) {
          console.log(list[i].id);
          arr_id.push(list[i].id);
          var _id = list[i].id;
          list.splice(i, 1);
          getAllCategoryId(_id, arr_id, list);
          i--;
        }
      }
    }

    const query = "SELECT * FROM `categories`";

    connection.query(query, [key], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      list = results;

      if (results.length === 0) {
        return res.status(401).json({ message: "Không có danh mục" });
      }

      const query = "SELECT * FROM `categories` WHERE name = ?";

      connection.query(query, [key], (error, results) => {
        if (error) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "Không có danh mục" });
        }
        id = results[0].id;
        arr_id.push(id);

        getAllCategoryId(id, arr_id, list);

        var completedQueries = 0;

        for (var i = 0; i < arr_id.length; i++) {
          (function (i) {
            const query = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.quantity_sold, b.rating, i.image_url, c.name
                        FROM books b
                        JOIN images i ON b.img_main_id = i.image_id
                        JOIN categories c ON c.id = b.category_id
                        WHERE b.category_id = ? and b.price >= ? and b.price <= ? and b.isDelete = false`;
            connection.query(
              query,
              [
                arr_id[i],
                priceFrom ? priceFrom : 0,
                priceTo ? priceTo : 9999999999,
              ],
              (error, results) => {
                if (error) {
                  console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                  return res.status(500).json({ message: "Lỗi máy chủ" });
                }
                if (results.length > 0) {
                  list_items.push(...results);
                }

                completedQueries++;

                if (completedQueries === arr_id.length) {
                  return sendResponse();
                }
              }
            );
          })(i);
        }

        function sendResponse() {
          if (filter && filter == "priceInc") {
            for (var i = 0; i < list_items.length - 1; i++) {
              console.log("inc");

              for (var j = i + 1; j < list_items.length; j++) {
                if (Number(list_items[i].price) > Number(list_items[j].price)) {
                  var temp = list_items[i];
                  list_items[i] = list_items[j];
                  list_items[j] = temp;
                }
              }
            }
          }

          if (filter && filter == "priceDec") {
            console.log("dec");

            for (var i = 0; i < list_items.length - 1; i++) {
              for (var j = i + 1; j < list_items.length; j++) {
                if (Number(list_items[i].price) < Number(list_items[j].price)) {
                  var temp = list_items[i];
                  list_items[i] = list_items[j];
                  list_items[j] = temp;
                }
              }
            }
          }

          return res.status(200).json({
            message: "list item category",
            listItems: list_items,
          });
        }
      });
    });
  }

  Rating(req, res) {
    const book_id = req.body.book_id;
    const rating = req.body.rating;
    const user_id = req.session.user_id;
    const comment = req.body.comment;

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return;
      }

      const query = "SELECT * FROM `rating` WHERE user_id = ? and book_id = ?";
      connection.query(query, [user_id, book_id], (error, results) => {
        if (error) {
          // console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
          // return res.status(500).json({ message: 'Lỗi máy chủ' });
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          connection.rollback(() => {
            console.log("Transaction rolled back");
            res.status(500).json({ message: "Lỗi máy chủ" });
          });
          return;
        }

        if (results.length === 0) {
          const query =
            "INSERT INTO `rating`(`book_id`, `user_id`, `stars`, `comment`, `date`) VALUES (?,?,?,?, NOW())";
          connection.query(
            query,
            [book_id, user_id, rating, comment],
            (error, results) => {
              if (error) {
                // console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                // return res.status(500).json({ message: 'Lỗi máy chủ' });

                console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                connection.rollback(() => {
                  console.log("Transaction rolled back");
                  res.status(500).json({ message: "Lỗi máy chủ" });
                });
                return;
              }

              const query =
                "SELECT AVG(stars) AS avgStart FROM rating WHERE book_id = ?";

              connection.query(query, [book_id], (error, results) => {
                if (error) {
                  // console.error('Lỗi truy vấn:', error);
                  // return;
                  console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                  connection.rollback(() => {
                    console.log("Transaction rolled back");
                    res.status(500).json({ message: "Lỗi máy chủ" });
                  });
                  return;
                }

                const star = results[0].avgStart;

                const query =
                  "UPDATE `books` SET `rating`= ?,`date`= NOW() WHERE id = ?";

                connection.query(
                  query,
                  [Number(star).toFixed(), book_id],
                  (error, results) => {
                    if (error) {
                      console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                      connection.rollback(() => {
                        console.log("Transaction rolled back");
                        res.status(500).json({ message: "Lỗi máy chủ" });
                      });
                      return;
                    }

                    connection.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction:", err);
                        connection.rollback(() => {
                          console.log("Transaction rolled back");
                          // connection.end();
                        });
                      } else {
                        return res.status(200).json({ mesage: "rating" });
                      }
                    });
                  }
                );
              });
            }
          );
        } else {
          const query =
            "UPDATE `rating` SET `stars`= ?, `comment`= ? WHERE user_id = ? and book_id = ?";
          connection.query(
            query,
            [rating, comment, user_id, book_id],
            (error, results) => {
              if (error) {
                // console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                // return res.status(500).json({ message: 'Lỗi máy chủ' });
                console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                connection.rollback(() => {
                  console.log("Transaction rolled back");
                  res.status(500).json({ message: "Lỗi máy chủ" });
                });
                return;
              }

              const query =
                "SELECT AVG(stars) AS avgStart FROM rating WHERE book_id = ?";

              connection.query(query, [book_id], (error, results) => {
                if (error) {
                  // console.error('Lỗi truy vấn:', error);
                  // return;
                  console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                  connection.rollback(() => {
                    console.log("Transaction rolled back");
                    res.status(500).json({ message: "Lỗi máy chủ" });
                  });
                  return;
                }

                const star = results[0].avgStart;
                console.log(star);

                const query = "UPDATE `books` SET `rating`= ? WHERE id = ?";

                connection.query(
                  query,
                  [Number(star).toFixed(), book_id],
                  (error, results) => {
                    if (error) {
                      // console.error('Lỗi truy vấn:', error);
                      // return;
                      console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                      connection.rollback(() => {
                        console.log("Transaction rolled back");
                        res.status(500).json({ message: "Lỗi máy chủ" });
                      });
                      return;
                    }

                    // return res.status(200).json({ mesage: 'rating' })
                    connection.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction:", err);
                        connection.rollback(() => {
                          console.log("Transaction rolled back");
                          // connection.end();
                        });
                      } else {
                        return res.status(200).json({ mesage: "rating" });
                      }
                    });
                  }
                );
              });
            }
          );
        }
      });
    });
  }

  Favorite(req, res) {
    const book_id = req.body.book_id;

    const query = "SELECT * FROM `favorites` WHERE user_id = ? and book_id = ?";
    connection.query(
      query,
      [req.session.user_id, book_id],
      (error, results) => {
        if (error) {
          console.error("Lỗi truy vấn:", error);
          return;
        }

        if (results.length === 0) {
          const query =
            "INSERT INTO `favorites`(`user_id`, `book_id`) VALUES (?, ?)";
          connection.query(
            query,
            [req.session.user_id, book_id],
            (error, results) => {
              if (error) {
                console.error("Lỗi truy vấn:", error);
                return;
              }

              return res
                .status(200)
                .json({ message: "favorites", isFavorites: true });
            }
          );
        } else {
          const query =
            "DELETE FROM `favorites` WHERE user_id = ? and book_id = ?";
          connection.query(
            query,
            [req.session.user_id, book_id],
            (error, results) => {
              if (error) {
                console.error("Lỗi truy vấn:", error);
                return;
              }
            }
          );

          return res
            .status(200)
            .json({ message: "favorites", isFavorites: false });
        }
      }
    );
  }

  getUserFavorite(req, res) {
    const user_id = req.session.user_id;
    const query = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.quantity_sold, b.rating, i.image_url
        FROM books b
        JOIN favorites f ON b.id = f.book_id 
        JOIN images i ON b.img_main_id = i.image_id
        WHERE f.user_id = ?`;
    connection.query(query, [user_id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      const list_User_Favorite = results;
      res.status(200).json({
        message: "get user order",
        list_User_Favorite,
      });
    });
  }

  getUserRating(req, res) {
    const user_id = req.session.user_id;
    const query = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.quantity_sold, r.stars, r.comment, b.rating, i.image_url
        FROM books b
        JOIN images i ON b.img_main_id = i.image_id
        JOIN rating r ON r.book_id = b.id 
        WHERE r.user_id = ?`;

    connection.query(query, [user_id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      let list_User_Rating = results;

      res.status(200).json({
        message: "user rating!!",
        list_User_Rating,
      });
    });
  }

  getProductAll(req, res) {
    const query = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.isDelete, i.image_url, c.name
        FROM books b
        JOIN images i ON b.img_main_id = i.image_id 
        JOIN categories c ON b.category_id = c.id `;
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      let fullListProduct = results;

      res.status(200).json({
        message: "admin get list product!!",
        fullListProduct,
      });
    });
  }

  addProduct(req, res) {
    console.log("ok");
    const listImg = req.files["selectedFileImg"];
    const avatar = req.files["selectedFileAvatar"][0];

    const { title, price, author, category, quantity, description } = req.body;

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return;
      }

      const query =
        "INSERT INTO `books`(`title`, `author`, `price`, `description`, `date`, `category_id`, `quantity_remaining`) VALUES (?,?,?,?,NOW(),?,?)";
      connection.query(
        query,
        [title, author, price, description, Number(category), Number(quantity)],
        (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            connection.rollback(() => {
              console.log("Transaction rolled back");
              res.status(500).json({ message: "Lỗi máy chủ" });
            });
            return;
          }

          let book_id = results.insertId;

          const query =
            "INSERT INTO `images`(`product_id`, `image_url`, `key`) VALUES (?,?,?)";
          connection.query(
            query,
            [book_id, avatar.path, avatar.filename],
            (error, results) => {
              if (error) {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                connection.rollback(() => {
                  console.log("Transaction rolled back");
                  res.status(500).json({ message: "Lỗi máy chủ" });
                });
                return;
              }
              let main_img_id = results.insertId;
              const query = "UPDATE `books` SET `img_main_id`= ? WHERE id = ?";
              connection.query(
                query,
                [main_img_id, book_id],
                (error, results) => {
                  if (error) {
                    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                    connection.rollback(() => {
                      console.log("Transaction rolled back");
                      res.status(500).json({ message: "Lỗi máy chủ" });
                    });
                    return;
                  }
                }
              );
            }
          );

          var completedQueries = 0;

          for (var i = 0; i < listImg.length; i++) {
            (function (i) {
              const query =
                "INSERT INTO `images`(`product_id`, `image_url`, `key`) VALUES (?,?,?)";
              connection.query(
                query,
                [book_id, listImg[i].path, listImg[i].filename],
                (error, results) => {
                  if (error) {
                    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                    connection.rollback(() => {
                      console.log("Transaction rolled back");
                      res.status(500).json({ message: "Lỗi máy chủ" });
                    });
                    return;
                  }

                  completedQueries++;

                  if (completedQueries === listImg.length) {
                    connection.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction:", err);

                        for (var i = 0; i < listImg.length; i++) {
                          cloudinaryDeleteImg(listImg[i].filename);
                        }
                        cloudinaryDeleteImg(avatar.filename);

                        connection.rollback(() => {
                          console.log("Transaction rolled back");
                          res.status(500).json({ message: "Lỗi máy chủ" });
                          // connection.end();
                        });
                      } else {
                        return sendResponse();
                      }
                    });
                  }
                }
              );
            })(i);
          }

          function sendResponse() {
            res.status(200).json({
              message: "Thêm sản phẩm thành công",
              isAddProduct: true,
            });
          }
        }
      );
    });
  }

  removeProduct(req, res) {
    const { book_id, isDelete } = req.body;

    const query = "UPDATE `books` SET `isDelete`= ? WHERE id = ?";
    connection.query(
      query,
      [Number(req.body.isDelete) === 1 ? false : true, book_id],
      (error, results) => {
        if (error) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }

        if (Number(req.body.isDelete) === 0) {
          const query =
            "DELETE FROM order_items WHERE book_id = ? AND order_id IN (SELECT id FROM `orders` WHERE `status` IS NULL);";
          connection.query(query, [book_id], (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }

            return res.status(200).json({
              isSuccess: true,
            });
          });
        } else {
          return res.status(200).json({
            isSuccess: true,
          });
        }
      }
    );
  }

  async updateProduct(req, res) {
    const {
      id,
      title,
      price,
      author,
      category,
      quantity_remaining,
      description,
    } = req.body;
    const listImg = JSON.parse(req.body.img);
    const listImgNew = req.files["selectedFileImg"]
      ? req.files["selectedFileImg"]
      : null;
    const avatar =
      req.files["selectedFileAvatar"] && req.files["selectedFileAvatar"][0]
        ? req.files["selectedFileAvatar"][0]
        : null;
    let listImgDelete = [];
    let avatarDelete;
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return;
      }

      const query = `SELECT i.image_id, i.image_url, i.key
            FROM books b
            JOIN images i ON b.img_main_id <> i.image_id and i.product_id = b.id
            WHERE b.id = ?`;
      connection.query(query, [id], (error, results) => {
        if (error) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          connection.rollback(() => {
            console.log("Transaction rolled back");
            res.status(500).json({ message: "Lỗi máy chủ" });
          });
          return;
        }

        if (results.length > 0) {
          let arr_img = results;
          for (var i = 0; i < arr_img.length; i++) {
            var bool = false;
            for (var j = 0; j < listImg.length; j++) {
              if (arr_img[i].image_id == listImg[j].image_id) {
                bool = true;
              }
            }
            if (!bool) {
              if (arr_img[i].key) {
                // cloudinaryDeleteImg(arr_img[i].key);
                listImgDelete.push(arr_img[i].key);
              }
              const query = "DELETE FROM `images` WHERE image_id = ?";
              connection.query(
                query,
                [arr_img[i].image_id],
                (error, results) => {
                  if (error) {
                    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                    connection.rollback(() => {
                      console.log("Transaction rolled back");
                      res.status(500).json({ message: "Lỗi máy chủ" });
                    });
                    return;
                  }
                }
              );
              arr_img.splice(i, 1);
              i--;
            }
          }
        }

        if (avatar) {
          const query = `SELECT i.image_id, i.image_url, i.key
                    FROM books b
                    JOIN images i ON b.img_main_id = i.image_id
                    WHERE b.id = ?`;
          connection.query(query, [id], (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              connection.rollback(() => {
                console.log("Transaction rolled back");
                res.status(500).json({ message: "Lỗi máy chủ" });
              });
              return;
            }

            if (results.length > 0) {
              let main_img = results[0];
              if (main_img.key) {
                // cloudinaryDeleteImg(main_img.key);
                avatarDelete = main_img.key;
              }

              const query =
                "UPDATE `images` SET `image_url`= ?,`key`= ? WHERE product_id = ? and image_id IN (SELECT img_main_id FROM `books` WHERE id = ?);";
              connection.query(
                query,
                [avatar.path, avatar.filename, id, id],
                (error, results) => {
                  if (error) {
                    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                    connection.rollback(() => {
                      console.log("Transaction rolled back");
                      res.status(500).json({ message: "Lỗi máy chủ" });
                    });
                    return;
                  }
                }
              );
            }
          });
        }

        if (listImgNew) {
          for (var i = 0; i < listImgNew.length; i++) {
            (function (i) {
              const query =
                "INSERT INTO `images`(`product_id`, `image_url`, `key`) VALUES (?,?,?)";
              connection.query(
                query,
                [id, listImgNew[i].path, listImgNew[i].filename],
                (error, results) => {
                  if (error) {
                    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                    connection.rollback(() => {
                      console.log("Transaction rolled back");
                      res.status(500).json({ message: "Lỗi máy chủ" });
                    });
                    return;
                  }
                }
              );
            })(i);
          }
        }

        const queryadd =
          "UPDATE `books` SET `title`= ?,`author`= ?,`price`= ?,`description`= ?,`category_id`= ?,`quantity_remaining`= ? WHERE id = ?";
        connection.query(
          queryadd,
          [
            title,
            author,
            Number(price),
            description,
            Number(category),
            Number(quantity_remaining),
            Number(id),
          ],
          (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              connection.rollback(() => {
                console.log("Transaction rolled back");
                res.status(500).json({ message: "Lỗi máy chủ" });
              });
              return;
            }

            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);

                if (listImgNew) {
                  for (var i = 0; i < listImgNew.length; i++) {
                    cloudinaryDeleteImg(listImgNew[i].filename);
                  }
                }
                if (avatar) {
                  cloudinaryDeleteImg(avatar.filename);
                }

                connection.rollback(() => {
                  console.log("Transaction rolled back");
                  // connection.end();
                });
              } else {
                if (listImgDelete && listImgDelete.length > 0) {
                  for (var i = 0; i < listImgDelete.length; i++) {
                    cloudinaryDeleteImg(listImgDelete[i]);
                  }
                }
                if (avatarDelete) {
                  cloudinaryDeleteImg(avatarDelete);
                }

                return res.status(200).json({
                  isSuccess: true,
                  message: "ok",
                });
              }
            });
          }
        );
      });
    });
  }

  topSelingProduct(req, res) {
    const query = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.quantity_sold, b.rating, i.image_url
        FROM books b
        JOIN images i ON b.img_main_id = i.image_id
        WHERE b.quantity_sold > 0
        ORDER BY b.quantity_sold DESC
        LIMIT 10;`;
    connection.query(query, (err, results) => {
      if (err) throw err;

      let list_topSelling;
      list_topSelling = results;

      res.status(200).json({
        message: "Top Selling",
        list_topSelling,
      });
    });
  }
}

const productController = new ProductController();

export default productController;

// export { NewsController };
