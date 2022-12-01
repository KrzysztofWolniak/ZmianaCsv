import csv from "csvtojson";
//Trzeba podac nazwe pliku, a plik musi byc w  folderze z nodem
const csvFilePath = process.cwd()+"\\imiona.csv";
// Unikody polskich znaków
const findArray = [
  "\\u0041",
  "\\u0061",
  "\\u0106",
  "\\u0107",
  "\\u0118",
  "\\u0119",
  "\\u0141",
  "\\u0142",
  "\\u0143",
  "\\u0144",
  "\\u00d3",
  "\\u00f3",
  "\\u015a",
  "\\u015b",
  "\\u0179",
  "\\u017a",
  "\\u017b",
  "\\u017c",
];
//Polskie znaki
const replaceArray = [
  "Ą",
  "ą",
  "Ć",
  "ć",
  "Ę",
  "ę",
  "Ł",
  "ł",
  "Ń",
  "ń",
  "Ó",
  "ó",
  "Ś",
  "ś",
  "Ź",
  "ź",
  "Ż",
  "ż",
];
//Funkcja dodana do zmiennej string ktora zmienia unikody na polskie znaki
String.prototype.replaceArray = (replaceString, find, replace) => {
  for (var i = 0; i < find.length; i++) {
    replaceString
      ? (replaceString = replaceString.replace(find[i], replace[i]))
      : null;
  }
  return replaceString;
};


//To mozna uzyc gdy chcemy np wyswietlic kazdy element pliku, samo csv() zwracam nam jsona
csv()
  .fromFile(csvFilePath)
  .then(function (jsonArrayObj) {
    //console.log(jsonArrayObj);
  });


//swtorzenie jsona z pliku csv
const jsonArray = await csv().fromFile(csvFilePath);

const newArray = [];
//Pętla przejezdzajaca po wszystkich imionach
for (const el of jsonArray) {
  el.field15
    ? (el.field15 = el.field15.replaceArray(
        el.field15,
        findArray,
        replaceArray
      ))
    : null;
  newArray.push({
    name: el.name,
    sex: el.sex,
    odmiana: el.field15
      ? el.field15.replace(`vocativus": {"s": "`, "")
      : "Brakuje vocativus",
  });
}
//Funkcja konwertująca do csv
function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      // Dodatkowy replace bo z małym "ł" jest czesto problem
      return Object.values(it).toString().replace("\\u0142","ł");
    })
    .join("\n");
}
//Wyswietlanie csv do skopiowania
console.log(
  "Poczatek Pliku csv\n\n",
  convertToCSV(newArray),
  "\n\nKoniec pliku csv"
);
