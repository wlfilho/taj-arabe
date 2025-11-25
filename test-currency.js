const val = 1234.56;
console.log("pt-BR, BRL:", val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
console.log("pt-BR, USD:", val.toLocaleString("pt-BR", { style: "currency", currency: "USD" }));
console.log("en-US, USD:", val.toLocaleString("en-US", { style: "currency", currency: "USD" }));

// Custom formatting
const parts = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).formatToParts(val);
const custom = parts.map(p => p.type === "currency" ? "$" : p.value).join("");
console.log("Custom replace:", custom);

// Simple replace
const simple = val.toLocaleString("pt-BR", { minimumFractionDigits: 2 }).replace(/^/, "$ ");
console.log("Simple replace:", simple);
