
// Copied from Bootstrap's documentation
function sendAlert(message, type) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML =
      '<div class="alert alert-' +
      type +
      ' alert-dismissible my-2" role="alert">' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    document.querySelector('#liveAlertPlaceholder').append(wrapper);
  
    document.querySelectorAll('.btn-close').forEach((node) => {
      node.addEventListener('click', (e) => {
        e.currentTarget.parentNode.remove();
      });
    });
  }