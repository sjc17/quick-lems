const ctx = document.getElementById('chart').getContext('2d');

window.onload = async function () {
  const values = [];
  await db.transaction('r', db.LEMs, db.LEMItems, async () => {
    db.LEMs.orderBy('PONumber').uniqueKeys();
  });
};

const myChart = new Chart(ctx, {
  type: 'bar',
  data: {},
});
