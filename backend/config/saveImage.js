const sharp  = require('sharp');
const path   = require('path');
const fs     = require('fs');
const { v4: uuidv4 } = require('uuid');

const saveImage = async (fileBuffer) => {
  const filename  = `${uuidv4()}-${Date.now()}.jpg`;
  const uploadDir = path.join(process.cwd(), 'uploads', 'products');
  const filepath  = path.join(uploadDir, filename);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  await sharp(fileBuffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(filepath);

  return `/uploads/products/${filename}`;
};

module.exports = saveImage;