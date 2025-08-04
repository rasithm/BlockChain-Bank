
// credit.js
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.tab-buttons button');
  const tabs = document.querySelectorAll('.tab-content');
  document.getElementById('card').addEventListener('click', () => {
  document.querySelector('.card-inner').classList.toggle('flipped');
});

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      btn.classList.add('active');
      tabs[index].classList.add('active');
    });
  });

  // Optional: Activate first tab by default
  buttons[0].click();
});
