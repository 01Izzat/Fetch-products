const products_table = document.querySelector("div.products-area-wrapper");
const create_button = document.querySelector("button[data-button=create]");
const edit_button = document.querySelector("button[data-button=edit]");

//****************** CREATE ********************//
fetch("/categories", {}).then((res) => {
  const select = document.querySelectorAll("select[data-select]");
  let _html = `<option disabled selected value="0">CATEGORY</option>`;

  res.map((category) => {
    _html += `<option value="${category.id}">${category.name}</option>`;
  });

  Array.from(select).map((input) => (input.innerHTML = _html));
});

//****************** GET PRODUCTS ********************//
fetcher("/products?offset=0&limit=25", {}).then((res) => {
  let elementDom;

  res.map((product) => {
    elementDom = document.createElement("div");
    elementDom.classList.add("products-row");
    elementDom.setAttribute("data-id", product.id);

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
          <li class="dropdown-item" onclick="editProduct(${product.id})">Edit</li>
          <li class="dropdown-item" onclick="deleteProduct(${product.id})">Delete</li>
        </ul>
      </div>
      <div class="product-cell image">
        <img
          src="${product.images[0]}"
          alt="${product.description}"
        />
        <span>${product.title}</span>
      </div>
      <div class="product-cell category" category-id="${product.category.id}">
        <span class="cell-label">Category:</span>${product.category.name}
      </div>
      <div class="product-cell price">
        <span class="cell-label">Price:</span>$${product.price}
      </div>
    `;

    products_table.appendChild(elementDom);
  });
});

//****************** POST PRODUCTS ********************//

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

  fetcher("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    modal_close("createModal");
    Array.from(body.children).map((input) => (input.value = null));

    products_table.innerHTML += `
      <div class="products-row" data-id="${res.id}">
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
            <li class="dropdown-item" onclick="editProduct(${res.id})">Edit</li>
            <li class="dropdown-item" onclick="deleteProduct(${res.id})">Delete</li>
          </ul>
        </div>
        <div class="product-cell image">
          <img
            src="${res.images[0]}"
            alt="${res.description}"
          />
          <span>${res.title}</span>
        </div>
        <div class="product-cell category" category-id="${res.category.id}">
          <span class="cell-label">Category:</span>${res.category.name}
        </div>
        <div class="product-cell price">
          <span class="cell-label">Price:</span>$${res.price}
        </div>
      </div>
    `;
  });
});


//****************** PUT PRODUCTS ********************//

edit_button.addEventListener("click", function () {
  const body = document.querySelector("div#editModal div.modal-body");
  const data = {};
  let iDD;

  Array.from(body.children).map((input) => {
    data[input.name] = input.value;
  });

  iDD = data.id;
  delete data.id;

  fetcher(`/products/${iDD}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    modal_close("editModal");
    const row = document.querySelector(`div.products-row[data-id="${res.id}"]`);

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
          <li class="dropdown-item" onclick="editProduct(${res.id})">Edit</li>
          <li class="dropdown-item" onclick="deleteProduct(${res.id})">Delete</li>
        </ul>
      </div>
      <div class="product-cell image">
        <img
          src="${res.images[0]}"
          alt="${res.description}"
        />
        <span>${res.title}</span>
      </div>
      <div class="product-cell category" category-id="${res.category.id}">
        <span class="cell-label">Category:</span>${res.category.name}
      </div>
      <div class="product-cell price">
        <span class="cell-label">Price:</span>$${res.price}
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

  fetcher(`/products/${id}`).then((res) => {
    Array.from(modalBody.children).map((input) => {
      if (input.name === "categoryId") {
        input.value = res.category.id;
        return;
      }

      input.value = res[input.name];
    });
  });
}

//****************** DELETE PRODUCTS ********************//
function deleteProduct(id) {
  const product = document.querySelector(`div.products-row[data-id="${id}"]`);

  fetcher(`/products/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    product.remove();
  });
}
