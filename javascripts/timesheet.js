window.onload = function () {
  // Auto populate work date
  const today = new Date().toISOString().substr(0, 10);
  document.querySelector('#form-workdate').value = today;

  addRow();

  // Submit button behaviour (don't want default form submit)
  document.querySelector('#submit-btn').addEventListener('click', (e) => {
    e.preventDefault();

    // If any required part of the form is not filled out
    if (!document.querySelector('form').checkValidity()) {
      sendAlert('Fill out all required fields.', 'danger');
      return;
    }

    let costValidFlag = true;
    document
      .querySelectorAll('input[name="data[][totalcost]"]')
      .forEach((node) => {
        if (costValidFlag && node.value === 'NaN') {
          sendAlert('Costs must be valid numbers.', 'danger');
          costValidFlag = false;
        }
      });

    if (!costValidFlag) return;

    if (document.querySelector('tbody').childElementCount === 0) {
      sendAlert('Must have at least one row in the LEM.','danger');
      return;
    }

    // Get form data of LEM
    const formData = new FormData(document.querySelector('form'));

    // Get form table data for LEM Items
    const tableData = [];
    // Iterate through table rows and collect data from inputs
    for (
      let i = 0;
      i < document.querySelector('tbody').childElementCount;
      ++i
    ) {
      const cells = document.querySelector('tbody').children.item(i).children;
      const rowData = {
        workOrder: cells.item(0).firstElementChild.value.trim(),
        description: cells.item(1).firstElementChild.value.trim(),
        unit: cells.item(2).firstElementChild.value.trim(),
        quantity: cells.item(3).firstElementChild.value.trim(),
        rate: cells.item(4).firstElementChild.value.trim(),
        totalCost: cells.item(5).firstElementChild.value.trim(),
      };
      tableData.push(rowData);
    }

    const formDataObj = {
      client: formData.get('client'),
      location: formData.get('location'),
      PONumber: formData.get('PONumber'),
      POLineItem: formData.get('POLineItem'),
      workDate: formData.get('workDate'),
      comments: formData.get('comments'),
    };

    // Add LEM and all related items
    db.transaction('rw', db.LEMs, db.LEMItems, async () => {
      const insertedID = await db.LEMs.add(formDataObj);

      for (const obj of tableData) {
        console.log(obj);
        db.LEMItems.add({
          LEMid: insertedID,
          workOrder: obj.workOrder.trim(),
          description: obj.description.trim(),
          unit: obj.unit.trim(),
          quantity: obj.quantity.trim(),
          rate: obj.rate.trim(),
          totalCost: obj.totalCost,
        });
      }
    })
      .catch((err) => {
        sendAlert('Something went wrong with LEM creation.', 'danger');
        console.error(err);
      })
      .then(() => {
        sendAlert('Success! Your LEM has been created.', 'success');
      });
  });

  document.querySelector('#addrow-btn').addEventListener('click', () => {
    for (let i = document.querySelector('#addrow-input').value; i > 0; i--) {
      addRow();
    }
  });
};

function addRow() {
  // Append new table row
  document.querySelector('tbody').insertAdjacentHTML('beforeend', newTableRow);

  // Event handler: quantity * rate = total cost
  document.querySelectorAll('.num-input').forEach((node) => {
    node.addEventListener('input', (e) => {
      // <tr>
      const rowNodes = e.currentTarget.parentNode.parentNode.children;

      // Total Cost <input>
      rowNodes.item(5).firstElementChild.value =
        // Quantity <input> *
        rowNodes.item(3).firstElementChild.value *
        // Rate <input>
        rowNodes.item(4).firstElementChild.value;
    });
  });

  // Event handler: delete row
  document.querySelectorAll('.delete-btn').forEach((node) =>
    node.addEventListener('click', (e) => {
      // remove() the tr parent node
      e.currentTarget.parentNode.remove();
    })
  );
}

const newTableRow =
  '<tr> <td> <input type="text" required/> </td><td> <input type="text" required/> </td><td><input type="text" required/></td><td> <input type="text" class="num-input" required/> </td><td> <input type="text" class="num-input" required/> </td><td> <input type="text" required readonly/> </td><td class="delete-btn"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16" > <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg> </td></tr>';

