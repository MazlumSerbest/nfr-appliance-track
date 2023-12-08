export function DateFormat(date: Date) {
    let formattedDate;

    date
        ? (formattedDate = new Date(date).toLocaleDateString("tr-TR"))
        : (formattedDate = "-");

    return formattedDate;
}

export function DateTimeFormat(date: Date) {
    let formattedDate;
    date
        ? (formattedDate = new Date(date).toLocaleString("tr-TR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          }))
        : (formattedDate = "-");

    return formattedDate;
}
