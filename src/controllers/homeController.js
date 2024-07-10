import connection from '../models/connectDatabase.js'

class HomeController {

    newBooks(req, res) {

        const queryNew = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.quantity_sold, b.rating, i.image_url
        FROM books b
        JOIN images i ON b.img_main_id = i.image_id
        WHERE b.isDelete = false and b.date IS NOT NULL
        ORDER BY b.date DESC
        LIMIT 10;`;
        connection.query(queryNew, (err, results) => {
            if (err) throw err;
            let list_book_new;
            if (results.length > 0) {
                list_book_new = results;
            }


            res.status(200).json({
                message: 'Sách mới!!',
                list_book_new,
            })


        });

    }

    topBooksRating(req, res) {
        const queryRating = `SELECT b.id, b.title, b.author, b.price, b.category_id, b.quantity_remaining, b.quantity_sold, b.rating, i.image_url
            FROM books b
            JOIN images i ON b.img_main_id = i.image_id
            WHERE b.isDelete = false and b.rating > 0
            ORDER BY b.rating  DESC
            LIMIT 10;`;
        connection.query(queryRating, (err, results) => {
            if (err) throw err;

            let list_book_rating;
            if (results.length > 0) {
                list_book_rating = results;
            }

            res.status(200).json({
                message: 'Sách đánh giá cao!!',
                list_book_rating
            })
        });
    }

    Adminindex(req, res) {
        res.status(200).json({ admin: req.userAdmin })
    }



}

const homeController = new HomeController;

export default homeController;
