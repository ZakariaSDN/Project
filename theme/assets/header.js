class MainHeader extends HTMLElement {
  constructor() {
    super();
    this.currentScrollTop = 0;

    this.enlargedLogo = this.querySelector(".enlarged-logo");
    if (this.classList.contains("hide-on-scroll")) {
      window.addEventListener("scroll", this.onScroll.bind(this), false);
    }

    if(this.enlargedLogo) {
      setTimeout(function(){
        this.classList.add("enlarged-logo-loaded")
      }.bind(this),500)
    }
    const resizeObserver = new ResizeObserver(
      this.updateHeaderHeight.bind(this)
    );
    resizeObserver.observe(this);
    window.addEventListener("scroll", this.headerFillToggle.bind(this), false);
    window.addEventListener(
      "scroll",
      this.calculateAnnouncementHeight.bind(this),
      false
    );
    this.addEventListener("mouseover", this.headerFillAdd.bind(this), false);
    this.addEventListener("mouseout", this.headerFillRemove.bind(this), false);
    this.handleMenuEvents();
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.headerHeight = this?.getBoundingClientRect().height.toFixed(2) || 0;
    if (scrollTop > 100) {
      if (scrollTop > this.currentScrollTop) {
        this.classList.add("sticky-header-hide");
        document.body.style.setProperty("--header-height", `0px`);
      } else {
        this.classList.remove("sticky-header-hide");
        document.body.style.setProperty(
          "--header-height",
          `${this.headerHeight}px`
        );
      }
    } else {
      this.classList.remove("sticky-header-hide");
      document.body.style.setProperty(
        "--header-height",
        `${this.headerHeight}px`
      );
    }

    this.currentScrollTop = scrollTop;
  }
  headerFillToggle() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (this.enlargedLogo && scrollTop > 10) {
      this.classList.add("original-logo");
    } else {
      this.classList.remove("original-logo");
    }
    if (this.classList.contains("transparency-header")) {
      if (scrollTop > 110) {
        this.classList.add("header-fill");
      } else {
        this.classList.remove("header-fill");
      }
    }

    this.currentScrollTop = scrollTop;
  }
  headerFillAdd(event) {
    let logoStatus = (this.enlargedLogo && !this.classList.contains("original-logo")),
    megaMenuStatus = (event.target.hasAttribute("data-menu-with-child") == true || event.target.closest("[data-menu-with-child]") != null );
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (logoStatus && megaMenuStatus== false ) return;
    if (
      scrollTop <= 110 &&
      this.classList.contains("transparency-header") &&
      !this.classList.contains("header-fill")
    ) {
      this.classList.add("header-fill");
    }
  }
  headerFillRemove() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (
      scrollTop <= 110 &&
      this.classList.contains("transparency-header") &&
      this.classList.contains("header-fill")
    ) {
      this.classList.remove("header-fill");
    }
  }
  calculateAnnouncementHeight() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.setProperty(
      "--announcement-height",
      `${Math.max(this.announcementbarHeight - scrollTop, 0)}px`
    );
  }

  updateHeaderHeight() {
      this.announcementbarHeight =
        document
          .querySelector(".announcementbar-wrapper")
          ?.getBoundingClientRect()
          .height.toFixed(2) || 0;
      this.headerHeight = this.getBoundingClientRect().height.toFixed(2) || 0;
      document.body.style.setProperty(
        "--announcement-height",
        `${this.announcementbarHeight}px`
      );
      document.body.style.setProperty(
        "--header-height",
        `${this.headerHeight}px`
      );
  }

  handleMenuEvents() {
    Array.from(this.querySelectorAll("[data-menu-with-child]")).forEach(
      function (menu) {
        menu.addEventListener("keydown", function (event) {
          if (event.key === "Escape") {
            if (
              menu.nextElementSibling &&
              getFocusableElements(menu.nextElementSibling).length > 0
            ) {
              getFocusableElements(menu.nextElementSibling)[0].focus();
            } else if (
              menu.closest(".site-header-nav").nextElementSibling &&
              getFocusableElements(
                menu.closest(".site-header-nav").nextElementSibling
              ).length > 0
            ) {
              getFocusableElements(
                menu.closest(".site-header-nav").nextElementSibling
              )[0].focus();
            }
          }
        });
      }
    );
  }
}

customElements.define("main-header", MainHeader);

class HeaderDrawerMenu extends HTMLElement {
  constructor() {
    super();
    this.headerSection = this.closest(".section-main-header");
    this.closeBtns = this.querySelectorAll("[data-close-drawer]");
    this.drawerBtn = this.headerSection?.querySelector(".header-menu-btn");
    Array.from(this.closeBtns).forEach(
      function (closeBtn) {
        closeBtn.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            this.closeDrawer();
          }.bind(this)
        );
      }.bind(this)
    );
    if (this.drawerBtn) {
      this.drawerBtn.addEventListener("click", this.toggleDrawer.bind(this));
    }
    this._subMenuEvents();
  }
  _subMenuEvents() {
    this.subMenusOpen = this.querySelectorAll("[data-submenu-open]");
    Array.from(this.subMenusOpen).forEach(function (subMenu) {
      subMenu.addEventListener(
        "click",
        function () {
          const mainWrapper = subMenu.closest("[data-menu-link]");
          const subMenuWrapper = mainWrapper?.querySelector(
            "[data-submenu-wrapper]"
          );
          if (subMenuWrapper) {
            subMenuWrapper.classList.add("open");
          }
        }.bind(this)
      );
    });
    this.subMenusClose = this.querySelectorAll("[data-submenu-close]");
    Array.from(this.subMenusClose).forEach(function (subMenu) {
      subMenu.addEventListener(
        "click",
        function () {
          const subMenuWrapper = subMenu.closest("[data-submenu-wrapper]");
          if (subMenuWrapper) {
            subMenuWrapper.classList.remove("open");
            const grandSubMenus = subMenuWrapper.querySelectorAll(
              "[data-submenu-link].active"
            );
            Array.from(grandSubMenus).forEach(function (menu) {
              menu.classList.remove("active");
              DOMAnimations.slideUp(
                menu.querySelector("[data-grand-submenu-wrapper]")
              );
            });
          }
        }.bind(this)
      );
    });

    this.grandSubMenusToggle = this.querySelectorAll(
      "[data-grand-submenu-toggle]"
    );
    Array.from(this.grandSubMenusToggle).forEach(function (grandSubMenu) {
      grandSubMenu.addEventListener(
        "click",
        function () {
          const mainWrapper = grandSubMenu.closest("[data-submenu-link]");
          const grandSubMenuWrapper = mainWrapper?.querySelector(
            "[data-grand-submenu-wrapper]"
          );
          if (grandSubMenuWrapper) {
            if (mainWrapper.classList.contains("active")) {
              mainWrapper.classList.remove("active");
              DOMAnimations.slideUp(grandSubMenuWrapper);
            } else {
              mainWrapper.classList.add("active");
              DOMAnimations.slideDown(grandSubMenuWrapper);
            }
          }
        }.bind(this)
      );
    });
  }
  toggleDrawer() {
    if (this.drawerBtn.classList.contains("active")) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }
  closeDrawer() {
    document.body.classList.remove("overflow-hidden");
    this.classList.remove("open");
    this.drawerBtn.classList.remove("active");
    setTimeout(
      function () {
        this.subMenus = this.querySelectorAll("[data-submenu-wrapper].open");
        Array.from(this.subMenus).forEach(function (subMenu) {
          subMenuWrapper.classList.remove("open");
        });
        this.grandSubMenus = this.querySelectorAll(
          "[data-submenu-link].active"
        );
        Array.from(this.grandSubMenus).forEach(function (menu) {
          menu.classList.remove("active");
          DOMAnimations.slideUp(
            menu.querySelector("[data-grand-submenu-wrapper]")
          );
        });
      }.bind(this),
      400
    );
  }
  openDrawer() {
    document.body.classList.add("overflow-hidden");
    this.classList.add("open");
    this.drawerBtn.classList.add("active");
  }
}
customElements.define("header-drawer-menu", HeaderDrawerMenu);
