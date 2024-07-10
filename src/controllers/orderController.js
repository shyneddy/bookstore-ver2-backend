import connection from "../models/connectDatabase.js";
import { updateOrderPrice } from "../util/updateTotalPriceOrder.js";

class OrderController {
  addItem(req, res) {
    const item = req.body;
    var total_price;

    // Bắt đầu transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return;
      }
      console.log("Transaction started");

      const query = `SELECT * FROM orders WHERE user_id = ? and status IS NULL`;
      connection.query(query, [req.session.user_id], (error, results) => {
        if (error) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          connection.rollback(() => {
            console.log("Transaction rolled back");
            res.status(500).json({ message: "Lỗi máy chủ" });
          });
          return;
        }

        if (results.length === 0) {
          const query_insert = "INSERT INTO `orders`(`user_id`) VALUES (?)";
          connection.query(
            query_insert,
            [req.session.user_id],
            (error, results) => {
              if (error) {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                connection.rollback(() => {
                  console.log("Transaction rolled back");
                  res.status(500).json({ message: "Lỗi máy chủ" });
                });
                return;
              }

              const order_id = results.insertId;

              const query_insert_item =
                "INSERT INTO `order_items`(`order_id`, `book_id`, `quantity`, `price`) VALUES (?,?,?,?)";

              connection.query(
                query_insert_item,
                [results.insertId, item.id, item.quantity, Number(item.price)],
                (error, results) => {
                  if (error) {
                    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                    connection.rollback(() => {
                      console.log("Transaction rolled back");
                      res.status(500).json({ message: "Lỗi máy chủ" });
                    });
                    return;
                  }

                  updateOrderPrice(connection, order_id);

                  connection.commit((err) => {
                    if (err) {
                      console.error("Error committing transaction:", err);
                      connection.rollback(() => {
                        console.log("Transaction rolled back");
                        // connection.end();
                      });
                    } else {
                      return res.status(200).json({
                        message: "thêm sản phẩm vào giỏ hàng",
                        addOrder: true,
                      });
                    }
                  });
                }
              );
            }
          );
        } else {
          var order = results[0];
          const query_oder_item =
            "SELECT * FROM `order_items` WHERE order_id = ? and book_id = ?";

          connection.query(
            query_oder_item,
            [order.id, item.id],
            (error, results) => {
              if (error) {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                connection.rollback(() => {
                  console.log("Transaction rolled back");
                  res.status(500).json({ message: "Lỗi máy chủ" });
                });
                return;
              }

              if (results.length === 0) {
                const query_insert_item =
                  "INSERT INTO `order_items`(`order_id`, `book_id`, `quantity`, `price`) VALUES (?,?,?,?)";

                connection.query(
                  query_insert_item,
                  [order.id, item.id, item.quantity, Number(item.price)],
                  (error, results) => {
                    if (error) {
                      console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                      connection.rollback(() => {
                        console.log("Transaction rolled back");
                        res.status(500).json({ message: "Lỗi máy chủ" });
                      });
                      return;
                    }

                    updateOrderPrice(connection, order.id);

                    connection.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction:", err);
                        connection.rollback(() => {
                          console.log("Transaction rolled back");
                          // connection.end();
                        });
                      } else {
                        return res.status(200).json({
                          message: "thêm sản phẩm vào giỏ hàng",
                          addOrder: true,
                        });
                      }
                    });
                  }
                );
              } else {
                const query_update_order_item =
                  "UPDATE `order_items` SET `quantity`= `quantity` + ? WHERE id= ?";

                connection.query(
                  query_update_order_item,
                  [item.quantity, results[0].id],
                  (error, results) => {
                    if (error) {
                      console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                      connection.rollback(() => {
                        console.log("Transaction rolled back");
                        res.status(500).json({ message: "Lỗi máy chủ" });
                      });
                      return;
                    }

                    updateOrderPrice(connection, order.id);

                    connection.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction:", err);
                        connection.rollback(() => {
                          console.log("Transaction rolled back");
                          // connection.end();
                        });
                      } else {
                        return res.status(200).json({
                          message: "thêm sản phẩm vào giỏ hàng",
                          addOrder: true,
                        });
                      }
                    });
                  }
                );
              }
            }
          );
        }
      });
    });
  }

  getOrder(req, res) {
    const query = `SELECT oi.id, oi.order_id, oi.book_id, oi.quantity, oi.price, b.title, b.author, b.price, b.quantity_remaining, b.category_id, i.image_url
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN books b ON oi.book_id = b.id
        JOIN images AS i ON b.img_main_id = i.image_id
        WHERE o.user_id = ? and o.status IS NULL`;

    connection.query(query, [req.session.user_id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      // if (results.length === 0) {
      //     return res.status(401).json({ message: 'Không có giỏ hàng' });
      // }

      var list_item = results;

      const query =
        "SELECT `total_amount` FROM `orders` WHERE user_id = ? and status IS NULL";
      connection.query(query, [req.session.user_id], (error, results) => {
        if (error) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "Order không tồn tại" });
        }

        return res.status(200).json({
          message: "page Order",
          list_item: list_item,
          totalPrice: results[0],
        });
      });

      // return res.status(200).json({
      //     message: 'page Order',
      //     list_item: list_item
      // });
      // for (var i = 0; i < list_item.length; i++) {

      //     (function (i) {
      //         const query = `
      //         SELECT b.title, b.author, b.price, b.quantity_remaining, b.category_id, i.image_url
      //         FROM books AS b
      //         JOIN images AS i ON b.img_main_id = i.image_id
      //         WHERE b.id = ?
      //         `

      //         connection.query(query, [list_item[i].book_id], (error, results) => {
      //             if (error) {
      //                 console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
      //                 return res.status(500).json({ message: 'Lỗi máy chủ' });
      //             }
      //             list_item[i].book = results[0];
      //             completedQueries++;

      //             if (completedQueries === list_item.length) {
      //                 return sendResponse();
      //             }
      //         });
      //     })(i);
      // }

      // function sendResponse() {
      //     return res.status(200).json({
      //         message: 'page Order',
      //         list_item: list_item
      //     });
      // }
    });
  }

  updateItem(req, res) {
    const id_order_item = req.body.id;
    const quantity = req.body.quantity;

    const query = "SELECT * FROM `order_items` WHERE id = ?";
    connection.query(query, [id_order_item], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "OrderItem không tồn tại" });
      }

      const parent_id = results[0].order_id;
      const query_update_order_item =
        "UPDATE `order_items` SET `quantity`= ? WHERE id= ?";

      connection.query(
        query_update_order_item,
        [quantity, id_order_item],
        (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }

          updateOrderPrice(connection, parent_id);

          return res.status(200).json({
            message: "Thay đổi sản phẩm thành công",
            updateOrder: true,
          });
        }
      );
    });
  }

  deleteItem(req, res) {
    const id = req.body.id;
    var order_id;
    const query = "SELECT `id`, `order_id` FROM `order_items` WHERE id = ?";
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "OrderItem không tồn tại" });
      } else {
        order_id = results[0].order_id;
        const query = "DELETE FROM `order_items` WHERE id = ?";
        connection.query(query, [id], (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }

          updateOrderPrice(connection, order_id);

          return res.status(200).json({
            message: "Đã xóa Order Item",
            isDelete: true,
          });
        });
      }
    });
  }

  getPriceOrder(req, res) {
    const id = req.query.id;
    const query = "SELECT `total_amount` FROM `orders` WHERE id = ?";
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Order không tồn tại" });
      }

      res.status(200).json({
        message: "Total Price",
        totalPrice: results[0],
      });
    });
  }

  getNumberOrderbyUser(req, res) {
    const query = `SELECT COUNT(oi.book_id) as orderNumber
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.user_id = ? and o.status IS NULL`;

    connection.query(query, [req.session.user_id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      let orderNumber = results[0].orderNumber;

      res.status(200).json({
        message: "admin get list category!!",
        orderNumber,
      });
    });
  }

  confirm(req, res) {
    var user;
    // const query = 'SELECT `id`, `phone_number`, `full_name`, `address`, `gender` FROM `users` WHERE id = ?'
    const query = `SELECT u.id, u.phone_number, u.full_name, u.address, u.gender
        FROM users u
        JOIN orders o ON o.user_id = u.id
        WHERE u.id = ? and o.status IS NULL and o.total_amount > 0`;

    connection.query(query, [req.session.user_id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      user = results[0];

      // const query_getOrder = 'SELECT `id` FROM `orders` WHERE user_id = ? and status IS NULL';

      // connection.query(query_getOrder, [user.id], (error, results) => {
      //     if (error) {
      //         console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
      //         return res.status(500).json({ message: 'Lỗi máy chủ' });
      //     }

      //     const query_get_listOrder = `SELECT oi.id, oi.order_id, oi.book_id, oi.quantity, oi.price, b.title, i.image_url
      //         FROM order_items oi
      //         JOIN books b ON oi.book_id = b.id
      //         JOIN images AS i ON b.img_main_id = i.image_id
      //         WHERE oi.order_id = ?`
      //     connection.query(query_get_listOrder, [results[0].id], (error, results) => {
      //         if (error) {
      //             console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
      //             return res.status(500).json({ message: 'Lỗi máy chủ' });
      //         }

      //         res.status(200).json({
      //             message: 'Confirm Order',
      //             user: user,
      //             list_order: results
      //         })

      //     });

      // });

      res.status(200).json({
        message: "Confirm Order",
        user: user,
      });
    });
  }

  PostConfirm(req, res) {
    const full_name = req.body.full_name ? req.body.full_name : null;
    const phone_number = req.body.phone_number ? req.body.phone_number : null;
    const address = req.body.address ? req.body.address : null;
    const user_id = req.session.user_id;
    const query = "SELECT * FROM `orders` WHERE user_id = ? and status IS NULL";
    connection.query(query, [user_id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      const order_id = results[0].id;

      const query =
        "UPDATE `orders` SET `order_date`= NOW(),`status`= ?,`name_des`= ?,`address_des`= ?,`phone_des`= ? WHERE id = ?";
      connection.query(
        query,
        ["Đang chờ xử lý", full_name, address, phone_number, order_id],
        (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }

          res.status(200).json({
            message: "confirm post",
          });
        }
      );
    });
  }

  getUserOrder(req, res) {
    const user_id = req.session.user_id;

    const query =
      "SELECT * FROM `orders` WHERE user_id = ? and status IS NOT NULL ORDER BY order_date DESC;";
    connection.query(query, [user_id], (err, results) => {
      if (err) throw err;

      let list_User_Order = results;

      var completedQueries = 0;
      for (var i = 0; i < list_User_Order.length; i++) {
        (function (i) {
          const query = `SELECT oi.id, oi.order_id, oi.book_id, oi.quantity, oi.price, b.title, b.author, b.price, b.category_id, i.image_url
                    FROM order_items oi
                    JOIN orders o ON oi.order_id = o.id
                    JOIN books b ON oi.book_id = b.id
                    JOIN images i ON i.image_id = b.img_main_id
                    WHERE o.id = ? and o.status IS NOT NULL`;

          connection.query(query, [list_User_Order[i].id], (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }

            if (results.length > 0) {
              list_User_Order[i].detail = results;
            }

            completedQueries++;

            if (completedQueries === list_User_Order.length) {
              return sendResponse();
            }
          });
        })(i);
      }

      function sendResponse() {
        return res.status(200).json({
          message: "get list User Order!!",
          list_User_Order,
        });
      }
    });
  }

  getOrderAll(req, res) {
    const query =
      "SELECT * FROM `orders` WHERE status IS NOT NULL ORDER BY order_date DESC;";
    connection.query(query, (err, results) => {
      if (err) throw err;

      let fullListOrder = results;

      var completedQueries = 0;
      for (var i = 0; i < fullListOrder.length; i++) {
        (function (i) {
          const query = `SELECT oi.id, oi.order_id, oi.book_id, oi.quantity, oi.price, b.title, b.author, b.price, b.category_id, i.image_url
                    FROM order_items oi
                    JOIN orders o ON oi.order_id = o.id
                    JOIN books b ON oi.book_id = b.id
                    JOIN images i ON i.image_id = b.img_main_id
                    WHERE o.id = ? and o.status IS NOT NULL`;

          connection.query(query, [fullListOrder[i].id], (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }

            if (results.length > 0) {
              fullListOrder[i].detail = results;
            }

            completedQueries++;

            if (completedQueries === fullListOrder.length) {
              return sendResponse();
            }
          });
        })(i);
      }

      function sendResponse() {
        return res.status(200).json({
          message: "admin get list Order!!",
          fullListOrder,
        });
      }
    });
  }

  editOrderAll(req, res) {
    const { id, status } = req.body;
    console.log(status);

    const query = "SELECT `status` FROM `orders` WHERE id = ?";
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      if (results[0].status == "Hoàn tất") {
        return res.status(401).json({ message: "Đơn hàng đã hoàn tất" });
      } else {
        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error starting transaction:", err);
            return;
          }

          if (status == "Hoàn tất") {
            const query = `SELECT oi.book_id, oi.quantity
                      FROM order_items oi
                      JOIN orders o ON oi.order_id = o.id
                      JOIN books b ON oi.book_id = b.id
                      WHERE o.id = ?`;

            connection.query(query, [Number(id)], (error, results) => {
              if (error) {
                console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
                return res.status(500).json({ message: "Lỗi máy chủ" });
              }
              let book_quantity = [];

              if (results.length > 0) {
                book_quantity = results;

                for (var i = 0; i < book_quantity.length; i++) {
                  console.log(i);
                  (function (i) {
                    const query =
                      "UPDATE `books` SET `quantity_remaining`= quantity_remaining - ?,`quantity_sold`= quantity_sold + ? WHERE id = ?";
                    connection.query(
                      query,
                      [
                        book_quantity[i].quantity,
                        book_quantity[i].quantity,
                        Number(book_quantity[i].book_id),
                      ],
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
                      }
                    );
                  })(i);
                }
              }
            });
          }

          const query = "UPDATE `orders` SET `status`= ? WHERE id = ?";
          connection.query(query, [status, Number(id)], (error, results) => {
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

            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                connection.rollback(() => {
                  console.log("Transaction rolled back");
                  // connection.end();
                });
              } else {
                return res.status(200).json({
                  message: "Cập nhật đơn hàng thành công",
                  isSuccess: true,
                });
              }
            });
          });
        });
      }
    });
  }

  getOrderNew(req, res) {
    const query = `SELECT o.order_date, u.full_name, o.status, o.total_amount
        FROM orders o
        JOIN users u ON u.id = o.user_id
        WHERE o.status IS NOT NULL
        ORDER BY o.order_date DESC
        LIMIT 10;`;
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      let list_OrderNew;
      list_OrderNew = results;

      res.status(200).json({
        message: "Order New",
        list_OrderNew,
      });
    });
  }

  dashboardStatus(req, res) {
    let totalSales;
    let totalOrder;
    let countProducts;
    let totalReturn;

    const getTotalSales = () => {
      return new Promise((resolve, reject) => {
        const query = `SELECT SUM(total_amount) AS totalSales FROM orders WHERE status = 'Hoàn tất';`;
        connection.query(query, (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            reject(error);
          }

          totalSales = results[0].totalSales;
          resolve();
        });
      });
    };

    const getTotalOrder = () => {
      return new Promise((resolve, reject) => {
        const query1 = `SELECT COUNT(id) AS total_orders_sold FROM orders WHERE status = 'Hoàn tất';`;
        connection.query(query1, (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            reject(error);
          }

          totalOrder = results[0].total_orders_sold;
          resolve();
        });
      });
    };

    const getCountProducts = () => {
      return new Promise((resolve, reject) => {
        const query1 =
          "SELECT COUNT(title) as countProducts FROM `books` WHERE isDelete = false";
        connection.query(query1, (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            reject(error);
          }

          countProducts = results[0].countProducts;
          resolve();
        });
      });
    };

    const getTotalReturn = () => {
      return new Promise((resolve, reject) => {
        const query2 = `SELECT COUNT(id) AS total_orders_returned FROM orders WHERE status = 'Hủy';`;
        connection.query(query2, (error, results) => {
          if (error) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
            reject(error);
          }

          totalReturn = results[0].total_orders_returned;
          resolve();
        });
      });
    };

    Promise.all([
      getTotalSales(),
      getTotalOrder(),
      getCountProducts(),
      getTotalReturn(),
    ])
      .then(() => {
        res.status(200).json({
          message: "Dashboard Status",
          totalSales,
          totalOrder,
          countProducts,
          totalReturn,
        });
      })
      .catch((error) => {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
      });
  }

  getDetailOrderByUser(req, res) {
    console.log(req.query);
    const order_id = Number(req.query.order_id);
    let myOrderBooks;
    let totalOrder;
    const getListBook = () => {
      return new Promise((resolve, reject) => {
        const query = `SELECT b.title, b.author, b.price, i.image_url, oi.quantity
                FROM books AS b
                JOIN images AS i ON b.img_main_id = i.image_id
                JOIN order_items AS oi ON b.id = oi.book_id
                JOIN orders AS o ON o.id = oi.order_id
                WHERE o.status IS NOT NULL and o.user_id = ? and o.id = ?`;
        connection.query(
          query,
          [req.session.user_id, order_id],
          (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              reject(error);
            }

            myOrderBooks = results;
            resolve();
          }
        );
      });
    };

    const getTotalOrder = () => {
      return new Promise((resolve, reject) => {
        const query2 =
          "SELECT `order_date`, `total_amount`, `status`, `name_des`, `address_des`, `phone_des` FROM `orders` WHERE id = ? and status IS NOT NULL and user_id = ?";
        connection.query(
          query2,
          [order_id, req.session.user_id],
          (error, results) => {
            if (error) {
              console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
              reject(error);
            }
            totalOrder = results[0];
            resolve();
          }
        );
      });
    };

    Promise.all([getListBook(), getTotalOrder()])
      .then(() => {
        res.status(200).json({
          message: "Dashboard Status",
          myOrderBooks,
          totalOrder,
        });
      })
      .catch((error) => {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
      });
  }
}

const orderController = new OrderController();

export default orderController;
