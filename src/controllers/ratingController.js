import connection from '../models/connectDatabase.js'
import bcrypt from 'bcrypt';

class RatingController {

    getAllRating(req, res) {
        let listRating;
        const query = `
        SELECT u.full_name, r.id, r.stars, r.comment, r.date, b.title, b.id as book_id
                        FROM rating r
                        JOIN users u ON u.id = r.user_id
                        JOIN books b ON b.id = r.book_id
                        ORDER BY r.date DESC
        `
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            listRating = results;

            res.status(200).json({
                message: 'Danh sách đánh giá',
                listRating
            })
        });
    }

    removeRating(req, res) {
        const { rating_id, book_id } = req.body;
        let avgRating;
        const removeRating = () => {
            return new Promise((resolve, reject) => {
                const query = "DELETE FROM `rating` WHERE id = ?";
                connection.query(query, [rating_id], (error, results) => {
                    if (error) {
                        console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                        reject(error);
                    }

                    resolve();
                });
            });
        };

        const avgRatingBook = () => {
            return new Promise((resolve, reject) => {
                const query = "SELECT AVG(stars) AS avgStart FROM rating WHERE book_id = ?";
                connection.query(query, [book_id], (error, results) => {
                    if (error) {
                        console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                        reject(error);
                    }

                    if (results.length > 0) {
                        avgRating = results[0].avgStart;
                        const query = "UPDATE `books` SET `rating`= ? WHERE id = ?";
                        connection.query(query, [avgRating, book_id], (error, results) => {
                            if (error) {
                                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                                return res.status(500).json({ message: 'Lỗi máy chủ' });
                            }
                        });
                    }

                    resolve();
                });
            });
        };


        Promise.all([removeRating(), avgRatingBook()])
            .then(() => {
                res.status(200).json({
                    message: 'Xóa thành công',
                    isDeleteRating: true
                });
            })
            .catch((error) => {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                res.status(500).json({ message: 'Lỗi máy chủ' });
            });

    }

}

const ratingController = new RatingController;

export default ratingController;