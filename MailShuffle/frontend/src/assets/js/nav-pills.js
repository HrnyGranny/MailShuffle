/* eslint-disable */

export default function setNavPills() {
  var total = document.querySelectorAll(".nav-pills");

  function initNavs() {
    total.forEach(function (item, i) {
      if (item.querySelector(".moving-tab")) {
        return;
      }

      var moving_div = document.createElement("div");
      var first_li = item.querySelector("li:first-child .nav-link");
      var tab = first_li.cloneNode();
      tab.innerHTML = "-";

      moving_div.classList.add("moving-tab", "position-absolute", "nav-link");
      moving_div.appendChild(tab);
      item.appendChild(moving_div);

      moving_div.style.padding = "0px";
      moving_div.style.transition = ".5s ease";

      // Ajustar layout inicial según el ancho de pantalla
      checkLayout(item);

      // Calcular posición inicial
      updateMovingTab(item);

      // Listeners para clicks
      var list_items = item.querySelectorAll("li .nav-link");
      list_items.forEach(function (link) {
        link.addEventListener("click", function () {
          setTimeout(function () {
            updateMovingTab(item);
          }, 10);
        });
      });
    });
  }

  // Función para cambiar entre horizontal y vertical
  function checkLayout(item) {
    if (window.innerWidth < 991) {
      if (!item.classList.contains("flex-column")) {
        item.classList.remove("flex-row");
        item.classList.add("flex-column", "on-resize");
      }
    } else {
      if (item.classList.contains("on-resize")) {
        item.classList.remove("flex-column", "on-resize");
        item.classList.add("flex-row");
      }
    }
  }

  // Función para calcular posición y tamaño
  function updateMovingTab(navPillsList) {
    var moving_div = navPillsList.querySelector(".moving-tab");
    if (!moving_div) return;

    var active_link = navPillsList.querySelector(".nav-link.active");
    if (!active_link) return;

    var active_li = active_link.parentElement;
    var nodes = Array.from(active_li.closest("ul").children);
    var index = nodes.indexOf(active_li);

    var tab_clone = active_link.cloneNode();
    tab_clone.innerHTML = "-";
    moving_div.innerHTML = "";
    moving_div.appendChild(tab_clone);

    var isVertical = navPillsList.classList.contains("flex-column");
    var sum = 0;

    if (isVertical) {
      // Vertical (Móvil)
      for (var j = 0; j < index; j++) {
        // Sumamos la altura de los elementos previos
        sum += nodes[j].offsetHeight;
      }
      moving_div.style.transform = "translate3d(0px," + sum + "px, 0px)";
      // En vertical, el ancho es el del contenedor (primer elemento como referencia)
      moving_div.style.width =
        navPillsList.querySelector("li:nth-child(1)").offsetWidth + "px";
      moving_div.style.height = active_li.offsetHeight + "px";
    } else {
      // Horizontal (Escritorio)
      for (var j = 0; j < index; j++) {
        // Sumamos el ancho de los elementos previos
        sum += nodes[j].offsetWidth;
      }
      moving_div.style.transform = "translate3d(" + sum + "px, 0px, 0px)";
      moving_div.style.width = active_li.offsetWidth + "px";
      moving_div.style.height = "100%";
    }
  }

  setTimeout(function () {
    initNavs();
  }, 100);

  window.addEventListener("resize", function (event) {
    total.forEach(function (item, i) {
      checkLayout(item); // 1. Decidir si es columna o fila
      updateMovingTab(item); // 2. Mover la píldora al sitio correcto
    });
  });
}
