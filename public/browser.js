
document.addEventListener('submit', (e) => {
    let inputField = document.querySelector('#inputField');

    if (inputField.value.length > 0) {
        axios.post('/create-item', { item: inputField.value })
    } else {
        e.preventDefault();
    }

})

document.addEventListener('click', (e) => {
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
