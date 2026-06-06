export default async function Page() {
  const caracteres = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  return (
    <table>
      <tbody>
        <tr>
          {caracteres.map((c) => (
            <td key={c} className="border p-1 text-center">
              {c}
            </td>
          ))}
        </tr>
        <tr className="font-astro">
          {caracteres.map((c) => (
            <td key={c} className="border p-1 text-center">
              {c}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
