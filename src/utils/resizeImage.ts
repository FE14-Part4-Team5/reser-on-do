export const resizeImage = (file: File, maxSize = 1024): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      if (!e.target?.result) return;
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const newFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
              type: 'image/webp',
            });
            resolve(newFile);
          } else {
            reject('Blob conversion failed');
          }
        },
        'image/webp',
        0.7
      );
    };

    reader.readAsDataURL(file);
  });
};
