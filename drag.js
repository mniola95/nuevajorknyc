let isDragging = false;
      let offsetX, offsetY;
      let draggedIcon = null;
      let isTouchDevice = false;

      function handleLinkClick(event) {
        if (isDragging) {
          event.preventDefault();
        }
      }

      function startDrag(event) {
        const touch = event.touches ? event.touches[0] : event;
        const icon = event.target.closest(".draggable-icon");
        if (icon) {
          offsetX = touch.clientX - icon.getBoundingClientRect().left;
          offsetY = touch.clientY - icon.getBoundingClientRect().top;
          isDragging = true;
          draggedIcon = icon;

          // Disable touchmove on the body to prevent background scrolling
          document.body.addEventListener("touchmove", preventScroll, {
            passive: false,
          });
        }
        isTouchDevice = event.type === "touchstart";
      }

      function preventScroll(event) {
        event.preventDefault();
      }

      function handleIconClick(event) {
        const icon = event.target.closest(".draggable-icon");
        const link = icon.querySelector("a");

        if (icon && link && !link.contains(event.target)) {
          event.preventDefault();
          // Do something specific on a separate click, e.g., open a modal
          console.log("Link clicked, but not during dragging");
        }

        isDragging = false;
        draggedIcon = null;

        // Re-enable touchmove on the body after dragging
        document.body.removeEventListener("touchmove", preventScroll);

        // If initiated by touch, delay handling mouseup on desktop
        if (isTouchDevice && !("ontouchstart" in window)) {
          setTimeout(() => {
            isTouchDevice = false;
          }, 500);
        }
      }

      document.addEventListener("mousedown", (event) => {
        startDrag(event);
      });

      document.addEventListener("touchstart", (event) => {
        startDrag(event);
      });

      document.addEventListener("click", (event) => {
        handleIconClick(event);
      });

      document.addEventListener("mousemove", (event) => {
        if (isDragging && draggedIcon) {
          const touch = event.touches ? event.touches[0] : event;
          const x = touch.clientX - offsetX;
          const y = touch.clientY - offsetY;

          draggedIcon.style.left = `${x}px`;
          draggedIcon.style.top = `${y}px`;
        }
      });

      document.addEventListener("touchmove", (event) => {
        if (isDragging && draggedIcon) {
          const touch = event.touches ? event.touches[0] : event;
          const x = touch.clientX - offsetX;
          const y = touch.clientY - offsetY;

          draggedIcon.style.left = `${x}px`;
          draggedIcon.style.top = `${y}px`;
        }
      });

      document.addEventListener("mouseup", () => {
        // Delay handling mouseup on desktop after touch drag
        if (!isTouchDevice) {
          isDragging = false;
          draggedIcon = null;

          // Re-enable touchmove on the body after dragging
          document.body.removeEventListener("touchmove", preventScroll);
        }
      });

      document.addEventListener("touchend", () => {
        isDragging = false;
        draggedIcon = null;

        // Re-enable touchmove on the body after dragging
        document.body.removeEventListener("touchmove", preventScroll);
      });

      document.addEventListener("dragstart", (event) => {
        // Prevent the default drag-and-drop behavior
        event.preventDefault();
      });