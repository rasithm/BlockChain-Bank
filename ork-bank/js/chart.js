// chart.js

const API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,polygon&vs_currencies=usd";
const ctx = document.getElementById("cryptoChart").getContext("2d");

let tokenNames = ["Bitcoin", "Ethereum", "BNB", "Polygon", "ORK Token"];
let tokenIds = ["bitcoin", "ethereum", "binancecoin", "polygon"];
let lastPrices = [0, 0, 0, 0, 1.00]; // Initial dummy prices for ORK at $1

let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: tokenNames,
    datasets: [{
      label: "Price in USD",
      data: lastPrices,
      backgroundColor: ["#3ae374", "#3ae374", "#3ae374", "#3ae374", "#3ae374"], // will be updated dynamically
      borderRadius: 8,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff"
        }
      },
      x: {
        ticks: {
          color: "#fff"
        }
      }
    }
  }
});

function updatePrices() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const prices = [
        data.bitcoin.usd,
        data.ethereum.usd,
        data.binancecoin.usd,
        data.polygon.usd,
        lastPrices[4] // ORK token stays static or manually updated
      ];

      let newColors = prices.map((price, i) => {
        if (price > lastPrices[i]) return "#3ae374"; // green ↑
        else if (price < lastPrices[i]) return "#ff4d4d"; // red ↓
        else return "#8884d8"; // neutral
      });

      lastPrices = prices;

      chart.data.datasets[0].data = prices;
      chart.data.datasets[0].backgroundColor = newColors;
      chart.update();
    })
    .catch(err => console.error("Price fetch error:", err));
}

// Initial and auto-update every 30s
updatePrices();
setInterval(updatePrices, 30000);
