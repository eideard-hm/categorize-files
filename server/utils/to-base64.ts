export const toDataUrl = (file: Express.Multer.File): string => {
  const b64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${b64}`;
};
