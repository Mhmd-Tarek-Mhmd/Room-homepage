(function () {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  const Modal = {
    menuIndex: 0,
    sliderIndex: 0,
  };

  const Controller = {
    getMenuIndex: () => Modal.menuIndex,
    setMenuIndex: (val) => (Modal.menuIndex = val),

    getSliderIndex: () => Modal.sliderIndex,
    setSliderIndex: (val) => (Modal.sliderIndex = val),

    init: function () {
      MenuViews.init();
      SliderViews.init();
    },
  };

  const MenuViews = {
    init: function () {
      const menuToggler = $(".hero nav button");

      menuToggler.onclick = () => {
        !$(".hero #menu").classList.contains("show") ? showMenu() : hideMenu();
      };

      // Helper Functions
      function showMenu() {
        $(".hero #menu").classList.add("show");
        menuToggler.firstElementChild.src = "assets/images/icon-close.svg";
        menuToggler.ariaLabel = "Hide links menu";
        $("html").style.overflow = "hidden";
        $("html").addEventListener("keydown", trapFocusHandle);
      }
      function hideMenu() {
        $(".hero #menu").classList.remove("show");
        menuToggler.firstElementChild.src = "assets/images/icon-hamburger.svg";
        menuToggler.ariaLabel = "Show links menu";
        $("html").style.overflow = "auto";
        $("html").removeEventListener("keydown", trapFocusHandle);
      }
      function trapFocusHandle(e) {
        const { getMenuIndex, setMenuIndex } = Controller;
        const focusableEles = [menuToggler, ...$$("nav #menu a")];

        const toPrevInd = () =>
          getMenuIndex() === 0
            ? setMenuIndex(focusableEles.length - 1)
            : setMenuIndex(getMenuIndex() - 1);
        const toNextInd = () =>
          focusableEles.length - 1 === getMenuIndex()
            ? setMenuIndex(0)
            : setMenuIndex(getMenuIndex() + 1);

        switch (e.keyCode) {
          case 9: // Tab
            e.preventDefault();
            e.shiftKey ? toPrevInd() : toNextInd();
            break;
          case 37: // left arrow
            toPrevInd();
            break;
          case 39: // right arrow
            toNextInd();
            break;
          case 35: // End
            setMenuIndex(focusableEles.length - 1);
            break;
          case 36: // Home
            setMenuIndex(0);
            break;
          case 27: // Esc
            hideMenu();
        }

        focusableEles[getMenuIndex()].focus();
      }
    },
  };

  const SliderViews = {
    init: function () {
      const { getSliderIndex, setSliderIndex } = Controller;

      $(".slider .prev").onclick = (e) => {
        if (getSliderIndex() !== 0) {
          setSliderIndex(getSliderIndex() - 1);
          getSliderIndex() === 1 &&
            $(".slider .next").removeAttribute("disabled");

          this.render("prev");
        }

        getSliderIndex() === 0 && e.target.setAttribute("disabled", "");
      };

      $(".slider .next").onclick = (e) => {
        const slides = $$(".slider .slide");

        if (slides.length > getSliderIndex()) {
          setSliderIndex(getSliderIndex() + 1);
          getSliderIndex() === slides.length - 2 &&
            $(".slider .prev").removeAttribute("disabled");

          this.render("next");
        }

        slides.length - 1 === getSliderIndex() &&
          e.target.setAttribute("disabled", "");
      };
    },

    render: function (arg) {
      const slides = $$(".slider .slide");
      let i = Controller.getSliderIndex();
      let hiddenInd = arg === "next" ? i - 1 : i + 1;

      slides[hiddenInd].setAttribute("hidden", "");
      slides[i].removeAttribute("hidden");
    },
  };

  Controller.init();
})();
