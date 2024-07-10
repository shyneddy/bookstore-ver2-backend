import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: 'dccufaric',
    api_key: '765784527863929',
    api_secret: '-4BVBunPltEYrGclnrpjmWqhF70'
});

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {

        cloudinary.uploader.destroy(fileToDelete, (error, result) => {
            console.log('result :: ', result);
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            }, {
                resource_type: "auto",
            })
        })
    })
}


export { cloudinaryDeleteImg };