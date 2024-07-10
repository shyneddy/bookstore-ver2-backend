import mysql from 'mysql2';
// import mysql from 'mysql2/promise';

// Tạo kết nối cơ sở dữ liệu
const connection = mysql.createConnection({
    host: 'bl9rn1voavu0axuk1d7k-mysql.services.clever-cloud.com',
    user: 'u9yf09vf9jrkelm8',
    password: 'gK5BhGIxj7HCaEPCJXrj', // Mật khẩu mặc định của XAMPP là rỗng
    database: 'bl9rn1voavu0axuk1d7k', // Thay thế "ten_cua_co_so_du_lieu" bằng tên cơ sở dữ liệu của bạn
});

export default connection;
