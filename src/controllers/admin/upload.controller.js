import { cloudinary } from '../../config/cloudinary.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    sendError(res, 'Aucun fichier reçu', 400);
    return;
  }

  const folder = ['gallery', 'news', 'partners', 'events'].includes(req.body.folder)
    ? req.body.folder
    : 'misc';

  const result = await uploadBufferToCloudinary(req.file.buffer, `apcdd/${folder}`);

  sendSuccess(res, { url: result.secure_url }, 201);
});
