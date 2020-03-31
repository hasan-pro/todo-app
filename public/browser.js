let itemTemplate = (item) => {
  return `
          <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${item.text}</span>
          <div>
          <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
          </li>
        `
}



let HTMLTemplate = items.map((item) => {
  return itemTemplate(item)
}).join('')

// Client side redering item.catch
document.getElementById('item-list').insertAdjacentHTML('beforeend', HTMLTemplate)

// Create Feature
let createField = document.getElementById('create-field');

// Check for item that has been already exist in database
let isExist = (newItem) => {
  let items = document.querySelectorAll('.item-text')
  for (let i of items) {
    if (i.innerText.toUpperCase() === newItem.value.toUpperCase()) return true;
  }
  return false;
}


document.getElementById('create-form').addEventListener('submit', (e) => {
  e.preventDefault();

    if (isExist(createField)) {
      alert('Item is already exist!')
      createField.value = "";
      createField.focus();
    } else {
      if (createField.value.length > 0) {
        axios.post('/create-item', { text: createField.value}).then((response) => {
            // Create the HTML for a new item.
            document.getElementById('item-list').insertAdjacentHTML("beforeend", itemTemplate(response.data))
            createField.value = "";
            createField.focus();
        }).catch((err) => {
            console.log(err);
        })
      }
    }


})

document.addEventListener('click', (e) => {

  // Update Feature
    if (e.target.classList.contains('edit-me')) {
        let targetEl = e.target.parentElement.parentElement.querySelector('.item-text');
        let userInput = prompt('Enter your desired new text.', targetEl.innerHTML)

        if (userInput) {
            axios.post('/update-item', { text: userInput, id: e.target.getAttribute('data-id') }).then(() => {
                targetEl.innerHTML = userInput;
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    // Delete Feature
    if (e.target.classList.contains('delete-me')) {
        let sure = confirm('Are you sure?')
        if (sure) {
            axios.post('/delete-item', { id: e.target.getAttribute('data-id') }).then(() => {
                e.target.parentElement.parentElement.remove();
            }).catch((err) => {
                console.log(err)
            })
        }
    }
})
