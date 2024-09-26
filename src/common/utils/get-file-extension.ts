export function getFileExtension(filename: string) {
  const parts = filename.split('.');
  if (parts.length === 1) {
    return '';
  }

  return parts.pop() || '';
}
