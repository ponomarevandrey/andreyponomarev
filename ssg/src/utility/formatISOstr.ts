export function formatISOstr(timestamp: string) {
  const dateStr = new Date(timestamp).toDateString();
  const str1 = dateStr.match(/\b[A-Za-z]{3,3}\b/g);
  const str2 = dateStr.match(/\b\d{1,2}\b/);
  const str3 = dateStr.match(/\b\d{4,4}\b/);

  if (Array.isArray(str1) && Array.isArray(str2) && Array.isArray(str3)) {
    const month = str1[1];
    const day = str2[0];
    const year = str3[0];

    const formatted = { day, month, year };
    return formatted;
  } else {
    throw new Error(
      `${__filename}: Error while parsing timestamp "${timestamp}"`,
    );
  }
}
