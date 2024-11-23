export function formatDate(dateString) {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, "0"); // Добавляет ведущий 0 для дня
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц от 0 до 11, поэтому +1
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  }