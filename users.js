const users_table = document.querySelector("div.products-area-wrapper");
const create_button = document.querySelector("button[data-button=create]");
const edit_button = document.querySelector("button[data-button=edit]");

//****************** GET ********************//

fetcher("/users?offset=0&limit=25", {}).then((res) => {
  let elementDom;

  res.map((user) => {
    elementDom = document.createElement("div");
    elementDom.classList.add("products-row");
    elementDom.setAttribute("data-id", user.id);

    elementDom.innerHTML = `
      <div class="dropdown-center">
        <button class="cell-more-button dropdown-toggle" role="button" data-bs-toggle="dropdown">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-more-vertical"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>

        <ul class="dropdown-menu dropdown-menu-dark">
          <li class="dropdown-item" onclick="editProduct(${user.id})">Edit</li>
          <li class="dropdown-item" onclick="deleteProduct(${user.id})">Delete</li>
        </ul>
      </div>
      <div class="product-cell image">
        <img
          src="${user.avatar}"
          alt="${user.name}"
        />
        <span>${user.name}</span>
      </div>
      <div class="product-cell category">
        <span class="cell-label">Email:</span>${user.email}
      </div>
      <div class="product-cell price">
        <span class="cell-label">Role:</span>${user.role}
      </div>
    `;

    users_table.appendChild(elementDom);
  });
});

//****************************** CREATE ********************/

create_button.addEventListener("click", function () {
  const body = document.querySelector("div#createModal div.modal-body");
  const data = {};

  Array.from(body.children).map((input) => {
    if (input.name === "images") {
      data[input.name] = [input.value];
      return;
    }

    data[input.name] = input.value;
  });

  fetcher("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((user) => {
    modal_close("createModal");
    Array.from(body.children).map((input) => (input.value = null));

    users_table.innerHTML += `
      <div class="products-row" data-id="${user.id}">
        <div class="dropdown-center">
          <button class="cell-more-button dropdown-toggle" role="button" data-bs-toggle="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-more-vertical"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          <ul class="dropdown-menu dropdown-menu-dark">
            <li class="dropdown-item" onclick="editProduct(${user.id})">Edit</li>
            <li class="dropdown-item" onclick="deleteProduct(${user.id})">Delete</li>
          </ul>
        </div>
        <div class="product-cell image">
          <img
            src="${user.avatar}"
            alt="${user.name}"
          />
          <span>${user.name}</span>
        </div>
        <div class="product-cell category">
          <span class="cell-label">Email:</span>${user.email}
        </div>
        <div class="product-cell price">
          <span class="cell-label">Role:</span>${user.role}
        </div>
      </div>
    `;
  });
});


//****************** EDIT PRODUCTS ********************//
edit_button.addEventListener("click", function () {
  const body = document.querySelector("div#editModal div.modal-body");
  const data = {};
  let iDD;

  Array.from(body.children).map((input) => {
    data[input.name] = input.value;
  });

  iDD = data.id;
  delete data.id;

  fetcher(`/users/${iDD}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((user) => {
    modal_close("editModal");
    const row = document.querySelector(
      `div.products-row[data-id="${user.id}"]`
    );

    row.innerHTML = `
      <div class="dropdown-center">
        <button class="cell-more-button dropdown-toggle" role="button" data-bs-toggle="dropdown">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-more-vertical"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>

        <ul class="dropdown-menu dropdown-menu-dark">
          <li class="dropdown-item" onclick="editProduct(${user.id})">Edit</li>
          <li class="dropdown-item" onclick="deleteProduct(${user.id})">Delete</li>
        </ul>
      </div>
      <div class="product-cell image">
        <img
          src="${user.avatar}"
          alt="${user.name}"
        />
        <span>${user.name}</span>
      </div>
      <div class="product-cell category">
        <span class="cell-label">Email:</span>${user.email}
      </div>
      <div class="product-cell price">
        <span class="cell-label">Role:</span>${user.role}
      </div>
    `;
  });
});



function editProduct(id) {
  const modalBody = document.querySelector("div#editModal div.modal-body");
  const modalButton = document.querySelector(
    'button[data-bs-target="#editModal"]'
  );

  modalButton.dispatchEvent(new Event("click"));

  fetcher(`/users/${id}`).then((res) => {
    Array.from(modalBody.children).map((input) => {
      input.value = res[input.name];
    });
  });
}

//******************************DELETE********************/
function deleteProduct(id) {
  const user = document.querySelector(`div.products-row[data-id="${id}"]`);

  fetcher(`/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res == true) {
      user.remove();
    }
  });
}
