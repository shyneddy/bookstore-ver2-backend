import connection from '../models/connectDatabase.js';
import { cloudinaryDeleteImg } from '../util/cloudinaryDeleteImg.js';
class BannerController {


    getBanner(req, res) {
        const query = 'SELECT `id`, `link_banner` FROM `banner`';
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            let listBanner = results;

            res.status(200).json({
                message: 'Danh sách banner',
                listBanner
            })
        });
    }

    addBanner(req, res) {
        const banner = req.files['selectedFileBanner'][0];
        console.log(banner);

        const query = "INSERT INTO `banner`(`link_banner`, `key`) VALUES (?,?)"

        connection.query(query, [banner.path, banner.filename], (error, results) => {
            if (error) {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                return res.status(500).json({ message: 'Lỗi máy chủ' });
            }

            res.status(200).json({
                message: 'Thêm Banner thành công',
                isAddBanner: true
            })
        });

    }

    async removeBanner(req, res) {

        const { banner_id } = req.body;

        const getKeyBanner = () => {
            return new Promise((resolve, reject) => {
                const query = "SELECT `key` FROM `banner` WHERE id = ?";
                connection.query(query, [banner_id], (error, results) => {
                    if (error) {
                        console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                        reject(error);
                    }

                    if (results.length > 0) {
                        let key = results[0].key;
                        cloudinaryDeleteImg(key);
                    }
                    resolve();
                });
            });
        };

        const removeBanner = () => {
            return new Promise((resolve, reject) => {
                const query = "DELETE FROM `banner` WHERE id = ?";
                connection.query(query, [banner_id], (error, results) => {
                    if (error) {
                        console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                        reject(error);
                    }
                    resolve();
                });
            });
        };

        Promise.all([getKeyBanner(), removeBanner()])
            .then(() => {
                res.status(200).json({
                    message: 'Xóa thành công',
                    isDeleteBanner: true
                });
            })
            .catch((error) => {
                console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
                res.status(500).json({ message: 'Lỗi máy chủ' });
            });

    }



}

const bannerController = new BannerController;

export default bannerController;

// export { NewsController };