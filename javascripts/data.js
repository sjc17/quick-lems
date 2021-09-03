window.onload = function () {
  // Add LEM and all related items
  db.transaction('r', db.LEMs, db.LEMItems, async () => {
    const tbody = document.querySelector('tbody');
    await db.LEMs.each(LEM => {
      const tr = document.createElement('tr');
      ['client','PONumber','POLineItem','location','workDate'].forEach(key => {
        const td = document.createElement('td');
        td.innerText = LEM[key];
        tr.append(td);
      });
      tr.setAttribute('id', LEM.id);
      tbody.append(tr);
    })
  })
    .catch((err) => {
      sendAlert('Something went wrong with retrieving local data.', 'danger');
      console.error(err);
    });
};
