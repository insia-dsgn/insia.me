function filterTiles(filter) {
    const tiles = Array.from(document.querySelectorAll(".tile"));
    const grid = document.querySelector(".grid");
  
    const firstRects = new Map();
    tiles.forEach(tile => {
      if (!tile.classList.contains("hidden")) {
        firstRects.set(tile, tile.getBoundingClientRect());
      }
    });
  
    const isAll = filter === "all";
    const toHide = [];
    const toShow = [];
  
    tiles.forEach(tile => {
      const match = isAll || tile.classList.contains(filter);
      const isVisible = !tile.classList.contains("hidden");
  
      if (!match && isVisible) toHide.push(tile);
      if (match && !isVisible) toShow.push(tile);
    });
  
    toHide.forEach(tile => {
      tile.classList.add("fading-out");
    });
  
    setTimeout(() => {
      toHide.forEach(tile => {
        tile.classList.add("hidden");
        tile.classList.remove("fading-out");
      });
  
      toShow.forEach(tile => {
        tile.classList.remove("hidden");
        tile.classList.add("appearing");
      });
  
      requestAnimationFrame(() => {
        const lastRects = new Map();
        tiles.forEach(tile => {
          if (!tile.classList.contains("hidden")) {
            lastRects.set(tile, tile.getBoundingClientRect());
          }
        });
  
        tiles.forEach(tile => {
          const first = firstRects.get(tile);
          const last = lastRects.get(tile);
  
          if (first && last) {
            const dx = first.left - last.left;
            const dy = first.top - last.top;
  
            if (dx !== 0 || dy !== 0) {
              tile.style.transform = `translate(${dx}px, ${dy}px)`;
              tile.style.transition = "none";
              void tile.offsetWidth;
              tile.style.transition = "transform 0.4s ease, opacity 0.3s ease";
              tile.style.transform = "";
            }
          }
  
          tile.classList.remove("appearing");
        });
  
        const masonryInstance = Masonry.data(grid);
        if (masonryInstance) masonryInstance.layout();
      });
    }, 300);
  }
  
  document.querySelectorAll(".tile").forEach(tile => {
    tile.addEventListener("click", () => {
      const link = tile.dataset.link;
      const isEnlarge = tile.classList.contains("enlarge");
  
    //   if (link && !isEnlarge) {
    //     window.open(link, "_blank");
    //   } else if (isEnlarge) {
    //     const modal = document.getElementById("image-modal");
    //     const modalImg = modal.querySelector("img");
    //     const tileImg = tile.querySelector("img").src;
  
    //     modalImg.src = tileImg;
    //     modal.classList.add("active");

    if (isEnlarge || link) {
        const modal = document.getElementById("image-modal");
        const modalImg = modal.querySelector("img");
        const tileImg = tile.querySelector("img").src;
  
        modalImg.src = tileImg;
        modal.classList.add("active");
      }
    });
  });
  
  document.getElementById("image-modal").addEventListener("click", () => {
    document.getElementById("image-modal").classList.remove("active");
  });
  
  document.querySelector(".filter-select").addEventListener("change", (e) => {
    filterTiles(e.target.value);
  });
  
  document.querySelectorAll(".filter-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterTiles(filter);
  
      document.querySelectorAll(".filter-buttons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
  
      document.querySelector(".filter-select").value = filter;
    });
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    filterTiles("featured");
  
    document.querySelectorAll(".filter-buttons button").forEach(btn => {
      if (btn.dataset.filter === "featured") {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  
    const dropdown = document.querySelector(".filter-select");
    if (dropdown) dropdown.value = "featured";
  
    const grid = document.querySelector(".grid");
    new Masonry(grid, {
      itemSelector: ".tile",
      columnWidth: ".grid-sizer",
      percentPosition: true,
      gutter: 20,
      horizontalOrder: true,
      fitWidth: true
    });
  });
  