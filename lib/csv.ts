export function splitCsvRows(csv: string): string[] {
  const rows: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];

    if (char === "\"") {
      const nextChar = csv[i + 1];
      current += char;

      if (insideQuotes && nextChar === "\"") {
        current += nextChar;
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && csv[i + 1] === "\n") {
        i += 1;
      }

      rows.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current) {
    rows.push(current);
  }

  return rows;
}

export function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === "\"") {
      const nextChar = line[i + 1];
      if (insideQuotes && nextChar === "\"") {
        current += "\"";
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}
