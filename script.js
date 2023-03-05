document.querySelector(".jsFilter").addEventListener("click", function () {
  document.querySelector(".filter-menu").classList.toggle("active");
});

document.querySelector(".grid").addEventListener("click", function () {
  document.querySelector(".list").classList.remove("active");
  document.querySelector(".grid").classList.add("active");
  document.querySelector(".products-area-wrapper").classList.add("gridView");
  document
    .querySelector(".products-area-wrapper")
    .classList.remove("tableView");
});

document.querySelector(".list").addEventListener("click", function () {
  document.querySelector(".list").classList.add("active");
  document.querySelector(".grid").classList.remove("active");
  document.querySelector(".products-area-wrapper").classList.remove("gridView");
  document.querySelector(".products-area-wrapper").classList.add("tableView");
});

var modeSwitch = document.querySelector(".mode-switch");
modeSwitch.addEventListener("click", function () {
  document.documentElement.classList.toggle("light");
  modeSwitch.classList.toggle("active");
});

function modal_close(id) {
  const modal = document.querySelector(`#${id}.modal.fade`);
  const backdrop = document.querySelector("div.modal-backdrop.fade");

  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
  modal.style.display = "none";
  document.body.style = "";
  backdrop.remove();
}

function fetcher(url, options) {
  return new Promise((resolve, reject) => {
    fetch("https://api.escuelajs.co/api/v1" + url, options)
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err));
  });
}
