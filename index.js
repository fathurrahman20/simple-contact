const contactsTable = document.querySelector("#contactsTable");
const contactFormModal = document.getElementById("contactFormModal");
const contactForm = document.getElementById("contactForm");
const addContactBtn = document.getElementById("addContactBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.getElementById("search");
const contactDetailModal = document.getElementById("contactDetailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModal");
const sortBtn = document.getElementById("sortBtn");

// Save contacts to localStorage
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// Render contacts to table
function renderContacts(data = contacts) {
  if (data.length === 0) {
    contactsTable.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-gray-500 py-4">
          Contact not found
        </td>
      </tr>
    `;
    return;
  }

  contactsTable.innerHTML = data
    .map(
      (contact, index) => `
      <tr class="hover:bg-gray-100">
        <td class="border px-4 py-2 text-center">${index + 1}</td>
        <td class="border px-4 py-2">${contact.name}</td>
        <td class="border px-4 py-2">${contact.phone}</td>
        <td class="border px-4 py-2 text-center">
        <span class="inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium ring-1 ring-inset bg-purple-50 text-purple-700 ring-purple-700/10">${
          contact.categories
        }</span>
        </td>
        <td class="border px-4 py-2 space-x-2">
        <div class="flex justify-center items-center flex-col md:flex-row space-x-2">
          <button class="rounded-full bg-green-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600" onclick="viewContactDetail(${
            contact.id
          })">Detail</button>
          <button class="rounded-full bg-yellow-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 my-1 md:my-0" onclick="editContact(${
            contact.id
          })">Edit</button>
          <button class="rounded-full bg-red-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onclick="deleteContact(${
            contact.id
          });">Delete</button>
        </div>
        
        </td>
      </tr>
    `
    )
    .join("");
}

// Save or update contact
function saveContact(e) {
  e.preventDefault();
  const id = document.getElementById("contactId").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value;
  const categories = document.getElementById("categories").value;

  if (id) {
    const index = contacts.findIndex((c) => c.id == id);
    contacts[index] = {
      id: parseInt(id),
      name,
      phone,
      address,
      age,
      email,
      categories,
    };
  } else {
    const newId = contacts.length ? contacts[contacts.length - 1].id + 1 : 1;
    contacts.push({ id: newId, name, phone, address, age, email, categories });
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
  closeModal();
}

// View Contact Detail
function viewContactDetail(id) {
  const contact = contacts.find((c) => c.id === id);
  document.getElementById("detailName").textContent = contact.name;
  document.getElementById("detailPhone").textContent = contact.phone;
  document.getElementById("detailAddress").textContent = contact.address || "-";
  document.getElementById("detailAge").textContent = contact.age || "-";
  document.getElementById("detailEmail").textContent = contact.email || "-";
  document.getElementById("detailCategories").textContent = contact.categories;
  openDetailModal();
}

// Edit Contact
function editContact(id) {
  const contact = contacts.find((contact) => contact.id === id);
  document.getElementById("contactId").value = contact.id;
  document.getElementById("name").value = contact.name;
  document.getElementById("phone").value = contact.phone;
  document.getElementById("address").value = contact.address;
  document.getElementById("age").value = contact.age;
  document.getElementById("email").value = contact.email;
  document.getElementById("categories").value = contact.categories;
  openModal();
}

// Delete Contact
function deleteContact(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this contact?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
  }).then((result) => {
    if (result.isConfirmed) {
      contacts = contacts.filter((contact) => contact.id !== id);
      localStorage.setItem("contacts", JSON.stringify(contacts));
      renderContacts();
      Swal.fire({
        title: "Deleted!",
        text: "Your contact has been deleted.",
        icon: "success",
      });
    }
  });
}

// Open modal form
function openModal() {
  contactFormModal.classList.remove("hidden");
}

// Close modal form and reset form
function closeModal() {
  contactFormModal.classList.add("hidden");
  contactForm.reset();
  document.getElementById("contactId").value = "";
}

// Open detail contact modal
function openDetailModal() {
  contactDetailModal.classList.remove("hidden");
}

// Close detail contact modal
function closeDetailModal() {
  contactDetailModal.classList.add("hidden");
}

// Search contact by name
function searchContacts() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm)
  );
  renderContacts(filteredContacts);
}

// Close sort modal
function sortToggle() {
  document.getElementById("sortModal").classList.toggle("hidden");
}

// Sort contacts by categories
function sortContacts(params) {
  const sortContacts = contacts.filter((contact) =>
    contact.categories.includes(params)
  );
  renderContacts(sortContacts);
}

addContactBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
contactForm.addEventListener("submit", saveContact);
searchInput.addEventListener("input", searchContacts);
closeDetailModalBtn.addEventListener("click", closeDetailModal);
sortBtn.addEventListener("click", sortToggle);

renderContacts();
