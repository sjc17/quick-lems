import db from './database.js';

window.onload = async function () {
  // Auto populate start/end dates
  const today = new Date().toISOString().substr(0, 10);
  document.querySelector('#form-workdate').value = today;

  // Auto calculate total cost
  document.querySelectorAll('.num-input').forEach((node) => {
    node.addEventListener('input', (e) => {
      document.querySelector('input[name="data[][totalcost]"]').value =
        document.querySelector('input[name="data[][quantity]"]').value *
        document.querySelector('input[name="data[][rate]"]').value;
    });
  });

  // Submit button behaviour (don't want default form submit)
  document.querySelector('#submit-btn').addEventListener('click', (e) => {
    e.preventDefault();

    // If any required part of the form is not filled out
    if (!document.querySelector('form').checkValidity()) {
      console.log('Fill out all required fields.');
      return;
    }

    // Get form data
    const formData = new FormData(document.querySelector('form'));
    const formDataObj = {
      client: formData.get('client'),
      location: formData.get('location'),
      PONumber: formData.get('PONumber'),
      POLineItem: formData.get('POLineItem'),
      workDate: formData.get('workDate'),
      comments: formData.get('comments'),
    };

    db.LEMs.add(formDataObj)
      .then((insertedID) => {
        if (document.querySelector('tbody').childElementCount === 1) {
          db.LEMItems.add({
            LEMid: insertedID,
            workOrder: formData.get('data[][workorder]'),
            description: formData.get('data[][description]'),
            quantity: formData.get('data[][quantity]'),
            rate: formData.get('data[][rate]'),
            totalCost: formData.get('data[][totalcost]'),
          });
        } else if (document.querySelector('tbody').childElementCount > 1) {
          const dataArr = formData.get('data');
          for (const obj of dataArr) {
            console.log(obj);
          }
        } else {
          console.log('Error determining rowcount of data entered.');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
};
