import connection from '../models/connectDatabase.js'
import bcrypt from 'bcrypt';

class UserController {


    async forgetPassword(req, res) {

        const { phone_number, password, username } = req.body;
        // const password_old = req.body.password_old
        // const password_new = req.body.password_new
        const query = `SELECT * FROM users WHERE username = ? and phone_number = ?`;
        connection.query(query, [username, phone_number], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Lỗi đăng nhập' });
            }

            bcrypt.hash(password, 10, async (error, hashedPassword) => {
                if (error) {
                    console.error('Lỗi mã hóa mật khẩu:', error);
                    return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
                } else {
                    const sql_register = "UPDATE `users` SET `password`= ? WHERE username = ?";
                    connection.query(sql_register, [hashedPassword, username], (error, results) => {
                        if (error) {
                            console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                            return res.status(500).json({ message: 'Lỗi máy chủ' });
                        }


                        res.status(200).json({
                            message: 'Đổi mật khẩu thành công',
                            isSuccess: true
                        })
                    });

                }
            });

        });

    }



    login(req, res) {
        const { username, password } = req.body;
        const query = `SELECT * FROM users WHERE username = ?`;
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Lỗi so sánh mật khẩu:', err);
                    return res.status(500).json({ message: 'Lỗi máy chủ' });
                }

                if (!isMatch) {
                    return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
                }

                req.session.username = user.username;
                req.session.user_id = user.id;

                delete user.password; // Xóa mật khẩu khỏi đối tượng người dùng trước khi trả về
                return res.status(200).json({ message: 'Đăng nhập thành công', isLogin: true, user });
            });
        });

    }

    // async login(req, res) {
    //     const { username, password } = req.body;
    //     const query = `SELECT * FROM users WHERE username = ?`;

    //     try {
    //         const [rows, fields] = await connection.promise().query(query, [username]);

    //         if (rows.length === 0) {
    //             return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    //         }

    //         const user = rows[0];
    //         const isMatch = await bcrypt.compare(password, user.password);

    //         if (!isMatch) {
    //             return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    //         }

    //         req.session.username = user.username;
    //         req.session.user_id = user.id;

    //         delete user.password; // Xóa mật khẩu khỏi đối tượng người dùng trước khi trả về
    //         return res.status(200).json({ message: 'Đăng nhập thành công', isLogin: true, user });
    //     } catch (error) {
    //         console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
    //         return res.status(500).json({ message: 'Lỗi máy chủ' });
    //     }
    // }

    adminLogin(req, res) {
        const { username, password } = req.body;
        const query = `SELECT * FROM users WHERE username = ? and role = true`;
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }

            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Lỗi so sánh mật khẩu:', err);
                    return res.status(500).json({ message: 'Lỗi máy chủ' });
                }

                if (!isMatch) {
                    return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
                }

                req.session.username = user.username;
                req.session.user_id = user.id;

                delete user.password; // Xóa mật khẩu khỏi đối tượng người dùng trước khi trả về
                return res.status(200).json({ message: 'Đăng nhập thành công', isAdmin: true, user });
            });
        });
    }

    register(req, res) {

        var infoUserRegister = req.body;
        infoUserRegister.gender = infoUserRegister.gender == 'male' ? 1 : 0;

        connection.query('SELECT * FROM users WHERE username = ?', [infoUserRegister.username], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                return res.status(500).json({ error: 'Internal Server Error' });

            } else if (results.length > 0) {
                res.status(400).json({ error: 'Username already exists', isExists: true });

            } else {
                bcrypt.hash(infoUserRegister.password, 10, async (error, hashedPassword) => {
                    if (error) {
                        console.error('Lỗi mã hóa mật khẩu:', error);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
                    } else {
                        const sql_register = 'INSERT INTO `users`(`username`, `password`, `phone_number`, `full_name`, `address`, `gender`) ' + `VALUES ('${infoUserRegister.username}','${hashedPassword}','${infoUserRegister.phone_number}','${infoUserRegister.full_name}','${infoUserRegister.address}',${infoUserRegister.gender})`;
                        await connection.promise().query(sql_register);
                        console.log('đã lưu');

                        const query = `SELECT * FROM users WHERE username = ?`;
                        connection.query(query, [infoUserRegister.username], (error, results) => {
                            if (error) {
                                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                                return res.status(500).json({ message: 'Lỗi máy chủ' });
                            }
                            console.log('kq: ', results[0]);
                            const user = results[0];
                            req.session.username = user.username;
                            req.session.user_id = user.id;


                            res.status(200).json({
                                message: 'Đăng ký thành công',
                                user
                            })
                        });
                    }
                });



            }
        });


    }

    islogin(req, res) {

        if (req.session.username) {
            var userinfo;

            const query = 'SELECT * FROM `users` WHERE username = ?'

            connection.query(query, [req.session.username], (error, results) => {
                if (error) {
                    console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                    return res.status(500).json({ message: 'Lỗi máy chủ' });
                }

                console.log(req.session.username);

                userinfo = results[0];

                return res.status(200).json({
                    isLogin: true,
                    userinfo: userinfo
                })
            });

        } else {
            return res.status(200).json({
                isLogin: false
            })
        }


    }

    sigout(req, res) {
        req.session.destroy();

        res.status(200).json({
            success: true
        })
    }

    getInfo(req, res) {

        var userinfo;

        const query = 'SELECT * FROM `users` WHERE username = ?'

        connection.query(query, [req.session.username], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            userinfo = results[0];
            delete userinfo.password; // Xóa mật khẩu khỏi đối tượng người dùng trước khi trả về

            res.status(200).json({
                message: 'hello user info page!!',
                userinfo: userinfo
            })
        });

    }

    updateInfo(req, res) {
        console.log('abcxyz');
        console.log(req.body);
        const newInfoUser = req.body;
        const updateQuery = 'UPDATE `users` SET `phone_number`= ?,`full_name`= ?,`address`= ?,`gender`= ? WHERE username = ?'
        connection.query(updateQuery, [newInfoUser.phone_number, newInfoUser.full_name, newInfoUser.address, newInfoUser.gender, newInfoUser.username], (error, result) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }
            console.log('Truy vấn thành công!');
            res.status(200).json({
                message: 'update page',
                isUpdate: true
            })
        });

    }

    updatePassword(req, res) {
        console.log('abcxyz');
        const password_old = req.body.password_old
        const password_new = req.body.password_new
        const query = `SELECT * FROM users WHERE username = ?`;
        connection.query(query, [req.session.username], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Lỗi đăng nhập' });
            }

            const user = results[0];
            bcrypt.compare(password_old, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Lỗi so sánh mật khẩu:', err);
                    return res.status(500).json({ message: 'Lỗi máy chủ' });
                }

                if (!isMatch) {
                    return res.status(401).json({ message: 'Mật khẩu không đúng', falsePassword: true });
                }

                bcrypt.hash(password_new, 10, async (error, hashedPassword) => {
                    if (error) {
                        console.error('Lỗi mã hóa mật khẩu:', error);
                        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đăng ký.' });
                    } else {
                        const updateQuery = 'UPDATE `users` SET `password`= ? WHERE username = ?'

                        connection.query(updateQuery, [hashedPassword, req.session.username], (error, results) => {
                            if (error) {
                                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                                return res.status(500).json({ message: 'Lỗi máy chủ' });
                            }

                            res.status(200).json({
                                message: 'Đổi mật khẩu thành công',
                                isUpdate: true
                            })
                        });
                    }
                });

            });
        });

    }


    Identify(req, res) {
        const { username } = req.body;
        console.log(username);
        const query = 'SELECT `id`, `username`, `full_name` FROM `users` WHERE username = ?';
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Không tìm thấy' });
            }

            let user = results[0];
            // console.log(user);
            return res.status(200).json({
                message: 'thông tin người dùng',
                user
            })
        });
    }

    getIdentify(req, res) {
        const { username } = req.query;
        console.log(username);
        const query = 'SELECT `id`, `username`, `full_name` FROM `users` WHERE username = ?';
        connection.query(query, [username], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Không tìm thấy' });
            }

            let user = results[0];
            console.log(user);
            return res.status(200).json({
                message: 'thông tin người dùng',
                user
            })
        });

    }

    getAllUser(req, res) {
        // console.log('customer');
        const query = `
        SELECT u.id,u.username,u.phone_number,u.full_name,u.address,u.gender,u.role, u.date, max(o.order_date) as order_date
                        FROM users u
                        JOIN orders o ON u.id = o.user_id
                        GROUP BY u.full_name
                        ORDER BY order_date DESC`;
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            let listUser = results;

            return res.status(200).json({
                message: 'Tất cả User',
                listUser
            })

        });
    }


}

const userController = new UserController;

export default userController;
