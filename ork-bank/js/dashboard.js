const ctx = document.getElementById("orkChartCanvas").getContext("2d");
const priceLabel = document.getElementById("currentPrice");

let orkValue = parseInt(localStorage.getItem("orkValue")) || 100;
let dataPoints = JSON.parse(localStorage.getItem("dataPoints")) || [];
let labels = JSON.parse(localStorage.getItem("labels")) || [];
let colors = JSON.parse(localStorage.getItem("colors")) || [];
let previous = parseInt(localStorage.getItem("previous")) || orkValue;

let counter = parseInt(localStorage.getItem("counter")) || 0;
let lastUpdated = parseInt(localStorage.getItem("lastUpdated")) || Date.now();

// Calculate how many intervals have passed since last update
const now = Date.now();
const elapsedIntervals = Math.floor((now - lastUpdated) / 5000);

// Pre-populate missed updates to simulate continuous run
for (let i = 0; i < elapsedIntervals; i++) {
  counter += 5;
  const randomChange = Math.floor(Math.random() * 10 - 4);
  orkValue = Math.max(70, orkValue + randomChange);
  const color = orkValue >= previous ? '#00ff66' : '#ff2e2e';
  dataPoints.push(orkValue);
  labels.push(`${counter}s`);
  colors.push(color);
  previous = orkValue;

  if (dataPoints.length > 50) {
    dataPoints.shift();
    labels.shift();
    colors.shift();
  }
}

// Initialize Chart
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'ORKToken',
      data: dataPoints,
      borderColor: () => colors,
      pointBackgroundColor: () => colors,
      pointRadius: 5,
      tension: 0.3,
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        ticks: { color: '#aaa' },
        grid: { color: '#222' }
      },
      y: {
        ticks: { color: '#aaa' },
        grid: { color: '#222' }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    }
  }
});

priceLabel.textContent = `ORKToken: ₹${orkValue}`;

// Update chart every 5 seconds
setInterval(() => {
  counter += 5;
  const randomChange = Math.floor(Math.random() * 10 - 5);
  orkValue = Math.max(70, orkValue + randomChange);
  const color = orkValue >= previous ? '#00ff66' : '#ff2e2e';

  dataPoints.push(orkValue);
  labels.push(`${counter}s`);
  colors.push(color);

  if (dataPoints.length > 50) {
    dataPoints.shift();
    labels.shift();
    colors.shift();
  }

  chart.update();
  priceLabel.textContent = `ORKToken: ₹${orkValue}`;
  previous = orkValue;

  // Save to localStorage
  localStorage.setItem("orkValue", orkValue);
  localStorage.setItem("previous", previous);
  localStorage.setItem("dataPoints", JSON.stringify(dataPoints));
  localStorage.setItem("labels", JSON.stringify(labels));
  localStorage.setItem("colors", JSON.stringify(colors));
  localStorage.setItem("counter", counter);
  localStorage.setItem("lastUpdated", Date.now());

  // Scroll chart container
  if (showScroll) {
    document.querySelector(".graph-box").scrollLeft = 10000;
  }
}, 5000);

// Scroll Button Logic
let showScroll = false;
const scrollBtn = document.createElement("button");
scrollBtn.textContent = "View Graph";
scrollBtn.style.cssText = `
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  z-index: 2;
`;
document.querySelector(".graph-box").appendChild(scrollBtn);

scrollBtn.addEventListener("click", () => {
  showScroll = !showScroll;
  scrollBtn.textContent = showScroll ? "Hide Scroll" : "View Graph";
});