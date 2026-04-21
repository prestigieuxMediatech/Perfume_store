const sharp  = require('sharp');
const path   = require('path');
const fs     = require('fs');
const { v4: uuidv4 } = require('uuid');

const saveImage = async (fileBuffer, options = {}) => {
  const {
    folder = 'products',
    width = 800,
    height = 800,
    fit = 'inside',
    quality = 80,
  } = options;

  const filename  = `${uuidv4()}-${Date.now()}.jpg`;
  const uploadDir = path.join(process.cwd(), 'uploads', folder);
  const filepath  = path.join(uploadDir, filename);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  await sharp(fileBuffer)
    .resize(width, height, { fit, withoutEnlargement: true })
    .jpeg({ quality })
    .toFile(filepath);

  return `/uploads/${folder}/${filename}`;
};

module.exports = saveImage;
