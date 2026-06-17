/**
 * Utility for client-side image optimization to WebP.
 * Supports converting JPEGs, PNGs, and Apple's HEIC/HEIF format to WebP.
 */
export async function optimizeImageToWebP(file: File): Promise<Blob> {
  let imageFile: Blob | File = file;

  // 1. Detect if the file is HEIC/HEIF
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isHeic) {
    try {
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8,
      });
      imageFile = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.error("Error converting HEIC image:", err);
      throw new Error(`Не вдалося конвертувати HEIC файл "${file.name}". Можливо, він пошкоджений.`);
    }
  }

  // 2. Load the image into an HTML Image element to draw on canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Не вдалося ініціалізувати canvas context"));
        return;
      }

      // Limit max dimension to 1600px to maintain high resolution but keep size small
      const MAX_WIDTH = 1600;
      const MAX_HEIGHT = 1600;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas content to WebP blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error(`Не вдалося зберегти зображення "${file.name}" як WebP`));
          }
        },
        "image/webp",
        0.82 // WebP quality setting: 0.82 is ideal for high fidelity and compression
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      console.error("Error loading image in canvas:", err);
      reject(new Error(`Не вдалося завантажити зображення "${file.name}" для обробки. Перевірте формат файлу.`));
    };

    img.src = objectUrl;
  });
}
