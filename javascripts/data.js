window.onload = function () {
  // Add LEM and all related items
  db.transaction('r', db.LEMs, async () => {
    await db.LEMs.each((LEM) => {
      const option = document.createElement('option');
      option.innerText = `${LEM.client}: ${LEM.PONumber}-${LEM.POLineItem}, ${LEM.location}, ${LEM.workDate}`;
      option.value = LEM.id;
      document.querySelector('#list-lems').append(option);
    });
  })
    .then(() => {
      showLEMItems(document.querySelector('#list-lems').value);
      console.log('Completed database transaction.');
    })
    .catch((err) => {
      sendAlert('Something went wrong with retrieving local data.', 'danger');
      console.error(err);
    });

  document.querySelector('#list-lems').addEventListener('change', (e) => {
    showLEMItems(e.target.value);
  });
};

async function showLEMItems(id) {
  const tbody = document.querySelector('#list-items');
  tbody.replaceChildren();

  let totalCostSum = 0;

  db.LEMItems.filter((item) => {
    return item.LEMid == document.querySelector('#list-lems').value;
  }).each((item) => {
    console.log(item);
    const tr = document.createElement('tr');
    ['workOrder','description','quantity','unit','rate','totalCost'].forEach(key => {
      const td = document.createElement('td');
      td.innerText = item[key];
      tr.append(td);
    });
    tbody.append(tr);
    totalCostSum += Number(item.totalCost);
    document.querySelector('#lem-info').innerText = `LEM Total Cost: ${totalCostSum}`;
  });
}
