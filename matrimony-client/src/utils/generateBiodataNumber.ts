/**
 * Generate a unique biodata number
 * Format: BD-YYYYMMDD-XXXXXX
 * BD = Biodata prefix
 * YYYYMMDD = Current date
 * XXXXXX = Random 6-digit number
 */
export function generateBiodataNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  
  const dateString = `${year}${month}${day}`;
  
  // Generate random 6-digit number
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  
  return `BD-${dateString}-${randomNumber}`;
}
