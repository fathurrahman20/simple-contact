const contactsTable = document.querySelector("#contactsTable");
const contactFormModal = document.getElementById("contactFormModal");
const contactForm = document.getElementById("contactForm");
const addContactBtn = document.getElementById("addContactBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.getElementById("search");

const contactDetailModal = document.getElementById("contactDetailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModal");

// Menyimpan data kontak
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

// Render kontak ke tabel
function renderContacts(data = contacts) {
  if (data.length === 0) {
    contactsTable.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-gray-500 py-4">
          Kontak tidak ditemukan
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
          }); event.stopPropagation();">Delete</button>
        </div>
        
        </td>
      </tr>
    `
    )
    .join("");
}

// Simpan atau tambah kontak baru
function saveContact(e) {
  e.preventDefault();
  const id = document.getElementById("contactId").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value;

  if (id) {
    const index = contacts.findIndex((c) => c.id == id);
    contacts[index] = {
      id: parseInt(id),
      name,
      phone,
      address,
      age,
      email,
    };
  } else {
    const newId = contacts.length ? contacts[contacts.length - 1].id + 1 : 1;
    contacts.push({ id: newId, name, phone, address, age, email });
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));
  renderContacts();
  closeModal();
}

// Lihat detail kontak
function viewContactDetail(id) {
  const contact = contacts.find((c) => c.id === id);
  document.getElementById("detailName").textContent = contact.name;
  document.getElementById("detailPhone").textContent = contact.phone;
  document.getElementById("detailAddress").textContent = contact.address || "-";
  document.getElementById("detailAge").textContent = contact.age || "-";
  document.getElementById("detailEmail").textContent = contact.email || "-";
  openDetailModal();
}

// Edit kontak
function editContact(id) {
  const contact = contacts.find((contact) => contact.id === id);
  document.getElementById("contactId").value = contact.id;
  document.getElementById("name").value = contact.name;
  document.getElementById("phone").value = contact.phone;
  document.getElementById("address").value = contact.address;
  document.getElementById("age").value = contact.age;
  document.getElementById("email").value = contact.email;
  openModal();
}

// Hapus kontak
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

// Buka modal form
function openModal() {
  contactFormModal.classList.remove("hidden");
}

// Tutup modal form dan reset form
function closeModal() {
  contactFormModal.classList.add("hidden");
  contactForm.reset();
  document.getElementById("contactId").value = ""; // Pastikan ID kosong untuk tambah kontak baru
}

// Buka modal detail kontak
function openDetailModal() {
  contactDetailModal.classList.remove("hidden");
}

// Tutup modal detail kontak
function closeDetailModal() {
  contactDetailModal.classList.add("hidden");
}

function searchContacts() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm)
  );
  renderContacts(filteredContacts);
}

// Event listeners
addContactBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
contactForm.addEventListener("submit", saveContact);
searchInput.addEventListener("input", searchContacts);
closeDetailModalBtn.addEventListener("click", closeDetailModal);

renderContacts();
