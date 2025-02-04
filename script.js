let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle"; // Der erste Spieler ist der Kreis
let gameOver = false; // Flag, um zu überprüfen, ob das Spiel vorbei ist

function init() {
  render();
}

function render() {
  // Container-Element holen
  const container = document.getElementById("container");

  // Tabelle erzeugen
  let tableHTML = "<table>";

  for (let i = 0; i < 3; i++) {
    tableHTML += "<tr>"; // neue Reihe

    // Spalten der Reihe hinzufügen
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const symbol = fields[index];

      // Jede Zelle (td) mit dem entsprechenden Symbol (null, 'circle', 'cross') befüllen
      tableHTML += `<td data-index="${index}" onclick="handleCellClick(${index})">`;

      // Symbol anzeigen (nur 'circle' oder 'cross', falls vorhanden)
      if (symbol) {
        tableHTML +=
          symbol === "circle"
            ? generateAnimatedCircle()
            : generateAnimatedCross();
      }

      tableHTML += "</td>";
    }

    tableHTML += "</tr>"; // Reihe schließen
  }

  tableHTML += "</table>";

  // Den HTML-Code der Tabelle in den Container einfügen
  container.innerHTML = tableHTML;

  // Falls das Spiel vorbei ist, weiße Linie anzeigen
  if (gameOver) {
    drawWinningLine();
  }
}

function generateAnimatedCircle() {
  // SVG-Code für einen Kreis mit einer animierten Füllung, die nur einmal abläuft
  const svgCode = `      
      <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="8">
          <animate attributeName="stroke-dasharray" from="0, 188.4" to="188.4, 0" dur="0.325s" />
        </circle>
      </svg>
    `;
  return svgCode;
}

function generateAnimatedCross() {
  const svgCode = `
      <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
        <!-- Erste Diagonale Linie des Kreuzes -->
        <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="10">
          <animate attributeName="stroke-dasharray" from="0, 80" to="80, 0" dur="0.3s" fill="freeze" />
        </line>
        <!-- Zweite Diagonale Linie des Kreuzes -->
        <line x1="10" y1="60" x2="60" y2="10" stroke="#FFC000" stroke-width="10">
          <animate attributeName="stroke-dasharray" from="0, 80" to="80, 0" dur="0.3s" fill="freeze" />
        </line>
      </svg>
    `;
  return svgCode;
}

// Funktion, die aufgerufen wird, wenn auf eine Zelle geklickt wird
function handleCellClick(index) {
  // Wenn das Spiel vorbei ist, nichts tun
  if (gameOver) return;

  // Verhindern, dass die Zelle erneut angeklickt wird, wenn sie schon besetzt ist
  const cell = document.querySelector(`td[data-index="${index}"]`);
  const symbol = fields[index];

  // Nur ein Symbol setzen, wenn die Zelle noch leer ist
  if (!symbol) {
    // Das Symbol des aktuellen Spielers setzen
    fields[index] = currentPlayer;

    // Das SVG für das aktuelle Symbol in die Zelle setzen
    cell.innerHTML = currentPlayer === "circle" ? generateAnimatedCircle() : generateAnimatedCross();

    // Entferne das onclick-Attribut, um weitere Klicks auf diese Zelle zu verhindern
    cell.removeAttribute('onclick');

    // Überprüfen, ob das Spiel vorbei ist
    if (checkWin()) {
      gameOver = true; // Das Spiel ist vorbei
      drawWinningLine();
    } else if (fields.every(cell => cell !== null)) {
      // Wenn alle Felder besetzt sind und niemand gewonnen hat -> Unentschieden
      gameOver = true;
      alert("Unentschieden!");
    } else {
      // Wechsel den Spieler
      currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
    }

  }
}

// Überprüft, ob ein Spieler gewonnen hat
function checkWin() {
  // Alle Gewinnbedingungen (horizontal, vertikal, diagonal)
  const winningCombinations = [
    [0, 1, 2], // Erste Reihe
    [3, 4, 5], // Zweite Reihe
    [6, 7, 8], // Dritte Reihe
    [0, 3, 6], // Erste Spalte
    [1, 4, 7], // Zweite Spalte
    [2, 5, 8], // Dritte Spalte
    [0, 4, 8], // Erste Diagonale
    [2, 4, 6], // Zweite Diagonale
  ];

  // Überprüfen, ob eine der Gewinnkombinationen erfüllt ist
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return fields[a] && fields[a] === fields[b] && fields[a] === fields[c];
  });
}

// Funktion, um eine weiße Linie zu zeichnen, die den Gewinn anzeigt
function drawWinningLine() {
  // Alle Gewinnbedingungen (horizontal, vertikal, diagonal)
  const winningCombinations = [
    [0, 1, 2], // Erste Reihe
    [3, 4, 5], // Zweite Reihe
    [6, 7, 8], // Dritte Reihe
    [0, 3, 6], // Erste Spalte
    [1, 4, 7], // Zweite Spalte
    [2, 5, 8], // Dritte Spalte
    [0, 4, 8], // Erste Diagonale
    [2, 4, 6], // Zweite Diagonale
  ];

  // Überprüfen, welche der Gewinnkombinationen erfüllt ist
  const winningCombination = winningCombinations.find(combination => {
    const [a, b, c] = combination;
    return fields[a] && fields[a] === fields[b] && fields[a] === fields[c];
  });

  if (winningCombination) {
    const [a, b, c] = winningCombination;
    const cells = [
      document.querySelector(`td[data-index="${a}"]`),
      document.querySelector(`td[data-index="${b}"]`),
      document.querySelector(`td[data-index="${c}"]`)
    ];

    // Die weiße Linie über die drei Felder zeichnen
    const rectA = cells[0].getBoundingClientRect();
    const rectB = cells[1].getBoundingClientRect();
    const rectC = cells[2].getBoundingClientRect();

    // Berechne die Koordinaten für die Linie
    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.backgroundColor = "white";
    line.style.height = "5px"; // Dicke der Linie

    // Berechne die Mitte der Zellen
    const startX = rectA.left + rectA.width / 2;
    const startY = rectA.top + rectA.height / 2;
    const endX = rectC.left + rectC.width / 2;
    const endY = rectC.top + rectC.height / 2;

    // Berechne den Winkel und die Länge der Linie
    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    // Setze die Position und Rotation der Linie
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}rad)`;
    line.style.transformOrigin = "0 0"; // Drehpunkt auf dem Startpunkt der Linie
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;

    // Linie zum Container hinzufügen
    document.body.appendChild(line);
  }
}
