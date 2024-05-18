// script.js
const API = "http://localhost:8000/contacts";
const inputName = document.querySelector(".input-name");
const inputSurname = document.querySelector(".input-surname");
const inputPhone = document.querySelector(".input-phone");
const inputPhoto = document.querySelector(".input-photo");
const btnAdd = document.querySelector(".btn-add");
const contactList = document.querySelector(".contact-list");
const editModal = document.querySelector(".edit-modal");
const inputEdit = document.querySelector(".input-edit");
const inputEditSurname = document.querySelector(".input-edit-surname");
const inputEditPhone = document.querySelector(".input-edit-phone");
const inputEditPhoto = document.querySelector(".input-edit-photo");
const btnSaveEdit = document.querySelector(".btn-save-edit");

// CREATE (добавление)
btnAdd.addEventListener("click", () => {
  const newContact = {
    name: inputName.value.trim(),
    surname: inputSurname.value.trim(),
    phone: inputPhone.value.trim(),
    photo: inputPhoto.value.trim(),
  };

  if (
    !newContact.name ||
    !newContact.surname ||
    !newContact.phone ||
    !newContact.photo
  ) {
    alert("Введите данные");
    return;
  }

  createContact(newContact);
});

function createContact(contact) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => {
    inputName.value = "";
    inputSurname.value = "";
    inputPhone.value = "";
    inputPhoto.value = "";
    readContacts();
  });
}

// READ (отображение)
function readContacts() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      contactList.innerHTML = "";
      data.forEach((contact) => {
        contactList.innerHTML += `
          <li>
            <img src="${contact.photo}" alt="${contact.name}">
            <div>
              <h3>${contact.name} ${contact.surname}</h3>
              <p>${contact.phone}</p>
              <button class="btn-edit" data-id="${contact.id}">Изменить</button>
              <button class="btn-delete" data-id="${contact.id}">Удалить</button>
            </div>
          </li>
        `;
      });
    });
}

// DELETE (удаление)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.id;
    deleteContact(id);
  }
});

function deleteContact(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => readContacts());
}

// EDIT (редактирование)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.dataset.id;
    editContact(id);
  }
});

function editContact(id) {
  fetch(`${API}/${id}`)
    .then((res) => res.json())
    .then((contact) => {
      inputEdit.value = contact.name;
      inputEditSurname.value = contact.surname;
      inputEditPhone.value = contact.phone;
      inputEditPhoto.value = contact.photo;
      btnSaveEdit.dataset.id = id;
      editModal.style.display = "block";
    });
}

btnSaveEdit.addEventListener("click", () => {
  const id = btnSaveEdit.dataset.id;
  const editedContact = {
    name: inputEdit.value.trim(),
    surname: inputEditSurname.value.trim(),
    phone: inputEditPhone.value.trim(),
    photo: inputEditPhoto.value.trim(),
  };

  if (
    !editedContact.name ||
    !editedContact.surname ||
    !editedContact.phone ||
    !editedContact.photo
  ) {
    alert("Введите данные");
    return;
  }

  updateContact(id, editedContact);
  editModal.style.display = "none";
});

function updateContact(id, contact) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => readContacts());
}

// Initialize
readContacts();
