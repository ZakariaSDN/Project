Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
const trapFocusHandlers = {};
var focusElement = "";

function trapFocusElements(wrapper) {
  removeTrapFocus();
  let elements = getFocusableElements(wrapper);
  if (elements == !1) return !1;
  let first = elements[0];
  first.focus();
  let last = elements[elements.length - 1];
  (trapFocusHandlers.focusin = (e) => {
    (e.target !== wrapper && e.target !== last && e.target !== first) ||
      document.addEventListener("keydown", trapFocusHandlers.keydown);
  }),
    (trapFocusHandlers.focusout = function () {
      document.removeEventListener("keydown", trapFocusHandlers.keydown);
    }),
    (trapFocusHandlers.keydown = function (e) {
      e.code.toUpperCase() === "TAB" &&
        (e.target === last &&
          !e.shiftKey &&
          (e.preventDefault(), first.focus()),
        (e.target === wrapper[0] || e.target === first) &&
          e.shiftKey &&
          (e.preventDefault(), last.focus()));
    }),
    document.addEventListener("focusout", trapFocusHandlers.focusout),
    document.addEventListener("focusin", trapFocusHandlers.focusin);
}

function removeTrapFocus() {
  document.removeEventListener("focusin", trapFocusHandlers.focusin),
    document.removeEventListener("focusout", trapFocusHandlers.focusout),
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
}
var DOMAnimations = {
  slideUp: function (element, duration = 500) {
    return new Promise(function (resolve, reject) {
      element.style.height = element.offsetHeight + "px";
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + "ms";
      element.offsetHeight;
      element.style.overflow = "hidden";
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;
      window.setTimeout(function () {
        element.style.display = "none";
        element.style.removeProperty("height");
        element.style.removeProperty("padding-top");
        element.style.removeProperty("padding-bottom");
        element.style.removeProperty("margin-top");
        element.style.removeProperty("margin-bottom");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition-duration");
        element.style.removeProperty("transition-property");
        resolve(false);
      }, duration);
    });
  },

  slideDown: function (element, duration = 500) {
    return new Promise(function (resolve, reject) {
      element.style.removeProperty("display");
      let display = window.getComputedStyle(element).display;

      if (display === "none") display = "block";

      element.style.display = display;
      let height = element.offsetHeight;
      element.style.overflow = "hidden";
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;
      element.offsetHeight;
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + "ms";
      element.style.height = height + "px";
      element.style.removeProperty("padding-top");
      element.style.removeProperty("padding-bottom");
      element.style.removeProperty("margin-top");
      element.style.removeProperty("margin-bottom");
      window.setTimeout(function () {
        element.style.removeProperty("height");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition-duration");
        element.style.removeProperty("transition-property");
      }, duration);
    });
  },

  slideToggle: function (element, duration = 500) {
    if (window.getComputedStyle(element).display === "none") {
      return this.slideDown(element, duration);
    } else {
      return this.slideUp(element, duration);
    }
  },

  classToggle: function (element, className) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  },
};

if (!Element.prototype.fadeIn) {
  Element.prototype.fadeIn = function () {
    let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
      func =
        typeof arguments[0] === "function"
          ? arguments[0]
          : typeof arguments[1] === "function"
          ? arguments[1]
          : null;

    this.style.opacity = 0;
    this.style.filter = "alpha(opacity=0)";
    this.style.display = "inline-block";
    this.style.visibility = "visible";

    let $this = this,
      opacity = 0,
      timer = setInterval(function () {
        opacity += 50 / ms;
        if (opacity >= 1) {
          clearInterval(timer);
          opacity = 1;

          if (func) func("done!");
        }
        $this.style.opacity = opacity;
        $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
      }, 50);
  };
}

if (!Element.prototype.fadeOut) {
  Element.prototype.fadeOut = function () {
    let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
      func =
        typeof arguments[0] === "function"
          ? arguments[0]
          : typeof arguments[1] === "function"
          ? arguments[1]
          : null;

    let $this = this,
      opacity = 1,
      timer = setInterval(function () {
        opacity -= 50 / ms;
        if (opacity <= 0) {
          clearInterval(timer);
          opacity = 0;
          $this.style.display = "none";
          $this.style.visibility = "hidden";

          if (func) func("done!");
        }
        $this.style.opacity = opacity;
        $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
      }, 50);
  };
}
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

function shippingBarProgress(totalprice) {
  if (!(Number(currencyRate) > 0)) return;
  if (currencyRate != null && shippingStatus == true) {
    let shippingText = "";
    let currencyConvertRate = Math.round(
      currencyRate * (Shopify.currency.rate || 1)
    );
    let getcurrencySymbol = Shopify.currency.active;
    totalprice = totalprice / 100;
    let shippingPrice = currencyConvertRate - totalprice;
    if (shippingPrice > 0) {
      shippingPrice = shippingPrice.toFixed(2);
      let shippingpricemessage = shippingPrice + " " + getcurrencySymbol;
      shippingText = shippingmessage.replace("||price||", shippingpricemessage);
    } else {
      shippingText = shippingsuccessmessage;
    }
    let shippingRatePercentage = (totalprice * 100) / currencyConvertRate;
    if (shippingRatePercentage > 10 && shippingRatePercentage < 100) {
      shippingRatePercentage = parseFloat(shippingRatePercentage) - 5;
    } else if (shippingRatePercentage > 100) {
      shippingRatePercentage = 100;
    }
    shippingRatePercentage = Math.trunc(shippingRatePercentage);
    if (document.querySelector("[data-shipping-bar-main]")) {
      let shippingSelector = document.querySelector("[data-shipping-bar-main]");
      shippingSelector.classList.remove("hidden");
      shippingSelector.querySelector(".shipping-message").textContent =
        shippingText;
      shippingSelector
        .querySelector("progress-bar")
        .style.setProperty("--progressbar-width", `${shippingRatePercentage}%`);
    }
  }
}

function getSwiperSlideCount(container) {
  if (!container) return 0;
  const wrapper = container.querySelector(".swiper-wrapper");
  if (!wrapper) return 0;
  return Array.from(wrapper.children).filter((slide) =>
    slide.classList.contains("swiper-slide")
  ).length;
}

function normalizeSwiperSettings(container, settings = {}) {
  const slideCount = getSwiperSlideCount(container);
  if (!settings.loop || slideCount === 0) return settings;

  const slidesPerView = [settings.slidesPerView];
  const slidesPerGroup = [settings.slidesPerGroup];

  Object.values(settings.breakpoints || {}).forEach((breakpoint) => {
    slidesPerView.push(breakpoint.slidesPerView);
    slidesPerGroup.push(breakpoint.slidesPerGroup);
  });

  const maxSlidesPerView = Math.max(
    1,
    ...slidesPerView
      .map((value) => Number.parseFloat(value))
      .filter(Number.isFinite)
  );
  const maxSlidesPerGroup = Math.max(
    1,
    ...slidesPerGroup
      .map((value) => Number.parseFloat(value))
      .filter(Number.isFinite)
  );
  const minimumLoopSlides = Math.ceil(maxSlidesPerView) + Math.ceil(maxSlidesPerGroup);

  if (slideCount < minimumLoopSlides) {
    settings.loop = false;
    settings.rewind = slideCount > 1;
  }

  return settings;
}

class SliderMainComponent extends HTMLElement {
  constructor() {
    super();
    this.settings = this.dataset.settings;
    this.slider = null;
    if (this.settings) {
      this.initSlider();
    }
    if (this.classList.contains("hover-slider")) {
      Array.from(this.querySelectorAll("hover-slide")).forEach(
        function (slide) {
          slide.addEventListener(
            "mouseover",
            function () {
              let slideIndex = parseInt(slide.dataset.index);
              this.selectSlide(slideIndex);
            }.bind(this)
          );
        }.bind(this)
      );
    }
  }

  initSlider() {
    if (this.slider) {
      this.slider.destroy(true, true);
      this.slider = null;
    }
    let settings;
    try {
      settings = JSON.parse(this.settings);
    } catch (error) {
      console.error("Invalid slider settings", error);
      return;
    }
    this.slider = new Swiper(this, normalizeSwiperSettings(this, settings));
    this.nextEl = this.slider.navigation?.nextEl;
    this.prevEl = this.slider.navigation?.prevEl;
    if (this.nextEl) {
      this.nextEl[0]?.addEventListener("keydown", (e) => {
        if (
          e.code === "Enter" ||
          e.code === "Space" ||
          e.code === "NumpadEnter"
        ) {
          e.preventDefault();
          this.slider.slideNext();
        }
      });
    }
    if (this.prevEl) {
      this.prevEl[0]?.addEventListener("keydown", (e) => {
        if (
          e.code === "Enter" ||
          e.code === "Space" ||
          e.code === "NumpadEnter"
        ) {
          e.preventDefault();
          this.slider.slidePrev();
        }
      });
    }
  }
  selectSlide(index) {
    if (this.slider) {
      this.slider.slideToLoop(index);
    }
  }
}

customElements.define("slider-main-component", SliderMainComponent);

class VideoBanner extends HTMLElement {
  constructor() {
    super();
    if (this.querySelector("[video-play-button]")) {
      this.querySelector("[video-play-button]").addEventListener(
        "click",
        this.videoPlayEvent.bind(this)
      );
    }
  }
  videoPlayEvent(event) {
    let video = this.querySelector("video");
    let iframe = this.querySelector("iframe");
    let poster = this.querySelector(".video-poster");
    if (poster) {
      poster.style.display = "none";
    }
    const playButton = this.querySelector("[video-play-button]");
    if (playButton) playButton.style.display = "none";
    if (video) {
      video.style.display = "block";
      video.play();
    } else {
      if (iframe) {
        iframe.style.display = "block";
      }
    }
  }
}
customElements.define("video-banner", VideoBanner);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    if (this.classList.contains("autoplay-false")) {
      const buttonClickLoad =
        this.closest(".shopify-section").querySelector(".video-play-button");
      buttonClickLoad.addEventListener("click", this.loadContent.bind(this));
    } else {
      this.addObserver();
    }
  }
  addObserver() {
    if ("IntersectionObserver" in window === false) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadContent();
            observer.unobserve(this);
          }
        });
      },
      { rootMargin: "0px 0px 1000px 0px" }
    );
    observer.observe(this);
  }
  loadContent() {
    if (this.parentElement.classList.contains("parallax-media-main")) {
      this.style.position = "absolute";
      this.parentElement.style.position = "fixed";
    }
    const content =
      this.querySelector("template").content.firstElementChild.cloneNode(true);
    this.appendChild(content);
    if (this.querySelector("video")) {
      this.querySelector("video").play();
    }
  }
}
customElements.define("deferred-media", DeferredMedia);

class ParallaxMediaElement extends HTMLElement {
  constructor() {
    super();
    this.parallaxInitialized = false;
    this.initParallax();
  }

  initParallax() {
    if (this.hasAttribute("data-parallax")) {
      new universalParallax().init({
        speed: 3,
      });
      this.parallaxInitialized = true;
    }
  }
}

// Define the custom element
customElements.define("parallax-media", ParallaxMediaElement);

class ProductMedia extends HTMLElement {
  constructor() {
    super();
    this.dataid = this.dataset.id;
    this.slidePerView = 1;
    this.pagination = false;
    this.coverflowEffect = this.classList.contains("slider-coverflow");
    if (this.hasAttribute("data-quick-view-media")) {
      this.slidePerView = 1.3;
      this.pagination = true;
    }
  }

  connectedCallback() {
    if (!this.coverflowEffect) {
      this.thumbnailsSize();
    }
    if (!this.dataid) return;
    const slideItem = this.querySelector(
      `[data-product-images-${this.dataid}]`
    );
    if (slideItem) {
      new ResizeObserver(() => this.thumbnailsSize()).observe(slideItem);
    }
    this.init();
  }

  thumbnailsSize() {
    const slideItem = this.querySelector(
      `[data-product-images-${this.dataid}]`
    );
    if (slideItem) {
      requestAnimationFrame(() => {
        this.mainItemheight = slideItem.getBoundingClientRect().height;
        const thumbmedia = this.querySelector(
          `[data-product-thumbs-${this.dataid}] .swiper-slide`
        );
        if (thumbmedia) {
          thumbmedia.style.setProperty(
            "--thumb_height",
            `${this.mainItemheight}px`
          );
        }
      });
    }
  }

  init() {
    if (!this.coverflowEffect) {
      this.thumbnailPosition = this.dataset.thumbnailPosition;
      if (
        this.thumbnailPosition == "left" ||
        this.thumbnailPosition == "right" ||
        this.thumbnailPosition == "overlay"
      ) {
        this.direction = "vertical";
      } else {
        this.direction = "horizontal";
      }
      if (this.thumbnailPosition != "") {
        const thumbsContainer = this.querySelector(
          `[data-product-thumbs-${this.dataid}]`
        );
        if (thumbsContainer) {
          const thumbsSettings = normalizeSwiperSettings(thumbsContainer, {
            loop: true,
            speed: 300,
            direction: "horizontal",
            slideToClickedSlide: true,
            slidesPerView: 4,
            spaceBetween: 20,
            freeMode: false,
            breakpoints: {
              768: {
                direction: this.direction,
              },
            },
          });
          this.productThumbs = new Swiper(thumbsContainer, thumbsSettings);
        }
      }
    }
    this.centeredSlides = false;
    this.effect = "slide";
    this.navigation = false;
    if (this.coverflowEffect) {
      this.navigation = true;
      this.effect = "coverflow";
      this.slidePerView = 1.25;
      this.centeredSlides = true;
    }
    const imagesContainer = this.querySelector(
      `[data-product-images-${this.dataid}]`
    );
    if (!imagesContainer) return;
    const imageSettings = normalizeSwiperSettings(imagesContainer, {
      loop: true,
      speed: 300,
      slidesPerView: this.slidePerView,
      spaceBetween: 2,
      centeredSlides: this.centeredSlides,
      effect: this.effect,
      grabCursor: true,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        enabled: this.pagination,
        el: `.swiper-pagination-${this.dataid}`,
        type: "bullets",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        enabled: this.navigation,
        nextEl: `.swiper-button-next-${this.dataid}`,
        prevEl: `.swiper-button-prev-${this.dataid}`,
      },

      breakpoints: {
        768: {
          spaceBetween: 10,
          navigation: {
            enabled: true,
            nextEl: `.swiper-button-next-${this.dataid}`,
            prevEl: `.swiper-button-prev-${this.dataid}`,
          },
        },
      },
      thumbs: {
        swiper: this.productThumbs,
      },
    });
    this.productImages = new Swiper(imagesContainer, imageSettings);

    // this.customEvents();
  }
  selectedSlide(index) {
    this.productImages && this.productImages.slideToLoop(index);
    this.productThumbs && this.productThumbs.slideToLoop(index);
  }
  customEvents() {
    if (this.productImages) {
      this.productImages.on("slideChange", function (event) {
        this.section = document.querySelector(
          `[id="shopify-section-${this.el.dataset.section}"]`
        );
        this.previousSlide = this.slides[event.previousIndex];
        this.activeSlide = this.slides[event.activeIndex];

        if (this.previousSlide) {
          this.previousSlide
            .querySelectorAll("video")
            .forEach(function (video) {
              video.pause();
            });

          this.previousSlide
            .querySelectorAll(".product-media-youtube")
            .forEach((video) => {
              video.contentWindow.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                "*"
              );
            });

          this.previousSlide
            .querySelectorAll(".product-media-vimeo")
            .forEach((video) => {
              video.contentWindow.postMessage('{"method":"pause"}', "*");
            });

          this.previousSlide.querySelector("product-model")?.pauseModel();
        }

        if (this.activeSlide) {
          this.activeSlide.querySelector("product-model")?.pauseModel();
        }
      });
    }
  }
}

customElements.define("product-media", ProductMedia);

class CollectionTabs extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const tabs = this.querySelectorAll("[data-tab-head]");
    const contents = this.querySelectorAll("[data-tab-content]");

    tabs.forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        const target = tab.getAttribute("data-url");
        tabs.forEach((t) => t.classList.remove("active"));
        contents.forEach((c) => c.classList.remove("active"));

        tab.classList.add("active");
        const targetContent = target ? this.querySelector(target) : null;
        if (targetContent) targetContent.classList.add("active");
      });
    });
  }
}
customElements.define("collection-tabs-wrapper", CollectionTabs);

class CompareDdrag extends HTMLElement {
  constructor() {
    super();
    this.cursor = this.querySelector("[data-cursor]");
    if (!this.cursor) return; // If there's no cursor element, stop here
    this.setupImageComparison(this.cursor);
  }

  setupImageComparison(cursor) {
    let isActive = false;
    let layout = "";

    const parentSection = cursor.closest(".shopify-section");
    const parentWrapper = cursor.closest("[data-compare-wrapper]");

    const startDrag = () => {
      isActive = true;
    };

    const endDrag = () => {
      isActive = false;
    };

    const moveSlider = (event) => {
      if (!isActive) return;
      const bounding = parentWrapper.getBoundingClientRect();
      const x = event.pageX - bounding.left;
      this.updateDragPosition(x, layout, parentSection);
    };

    // Event Listeners
    cursor.addEventListener("mousedown", startDrag);
    parentSection.addEventListener("mouseup", endDrag);
    parentSection.addEventListener("mouseleave", endDrag);
    parentSection.addEventListener("mousemove", moveSlider);

    // Touch Events for mobile
    cursor.addEventListener("touchstart", startDrag);
    cursor.addEventListener("touchend", endDrag);
    document.addEventListener("touchleave", endDrag);
    parentSection.addEventListener("touchmove", (e) =>
      moveSlider(e.touches[0])
    );
    this.cursor.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const imageWrapper = parentSection.querySelector(
            "[data-compare-wrapper]"
          );
          let currentPosition =
            parseInt(
              imageWrapper.style.getPropertyValue("--compare-percent")
            ) || 50;
          if (
            (event.key === "ArrowLeft" && currentPosition <= 1) ||
            (event.key === "ArrowRight" && currentPosition >= 99)
          ) {
            return;
          }
          if (event.key === "ArrowLeft") {
            currentPosition = currentPosition - 1;
          } else {
            currentPosition = currentPosition + 1;
          }
          imageWrapper.style.setProperty(
            "--compare-percent",
            `${Math.min(100, Math.max(0, currentPosition))}%`
          );
        }
      }.bind(this)
    );
  }

  updateDragPosition(x, layout, parentSection) {
    const imageWrapper = parentSection.querySelector("[data-compare-wrapper]");
    const size = imageWrapper.clientWidth;
    const maxPosition = size - 30;
    const percentage = (Math.max(30, Math.min(x, maxPosition)) / size) * 100;
    imageWrapper.style.setProperty("--compare-percent", `${percentage}%`);
  }
}

customElements.define("compare-drag", CompareDdrag);

class CountdownTimer extends HTMLElement {
  constructor() {
    super();

    const endTimeAttr = this.getAttribute("end-time");
    this.endTime = endTimeAttr ? new Date(endTimeAttr) : null;
    this.intervalId = null;
  }

  connectedCallback() {
    if (!this.endTime || isNaN(this.endTime.getTime())) {
      return;
    }
    this.startTimer();
  }

  disconnectedCallback() {
    clearInterval(this.intervalId);
  }

  startTimer() {
    this.updateTimer();

    this.intervalId = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    const now = new Date();
    const timeLeft = this.endTime - now;

    if (timeLeft <= 0) {
      this.querySelector(".countdown-card").style.display = "none";
      clearInterval(this.intervalId);
      this.setZero();
      return;
    }
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    this.querySelector(".countdown-number.days").textContent = days;
    this.querySelector(".countdown-number.hour").textContent = hours
      .toString()
      .padStart(2, "0");
    this.querySelector(".countdown-number.minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    this.querySelector(".countdown-number.seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }
  setZero() {
    // Set all countdown values to zero
    this.querySelector(".countdown-number.days").textContent = "00";
    this.querySelector(".countdown-number.hour").textContent = "00";
    this.querySelector(".countdown-number.minutes").textContent = "00";
    this.querySelector(".countdown-number.seconds").textContent = "00";
  }
}
customElements.define("countdown-timer", CountdownTimer);

class HotspotHover extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("mouseover", this.init.bind(this));
    this.addEventListener("focus", this.init.bind(this));
    this.addEventListener("click", this.init.bind(this));
  }
  init() {
    if (this.classList.contains("active")) return;
    const parentWrapper = this.closest("[data-hotspot-wrapper]");
    const allSpots = parentWrapper.querySelectorAll(".hot-spot-hover");
    allSpots.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
  }
}
customElements.define("hot-spot-hover", HotspotHover);

class HotSpotView extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest(".shopify-section");
    this.drawer = this.section.querySelector("hotspot-drawer");
    if (this.drawer) {
      this.addEventListener("click", this.viewDrawer.bind(this));

      this.drawer.addEventListener("keydown", this.handleKeyDown.bind(this));

      this.addEventListener(
        "keydown",
        function (e) {
          if (
            e.code === "Enter" ||
            e.code === "Space" ||
            e.code === "NumpadEnter"
          ) {
            e.preventDefault();
            this.viewDrawer();
          }
        }.bind(this)
      );
      this.drawerLayer = this.drawer.querySelector("drawer-layer");
      this.closeBtn = this.drawer.querySelector(".drawer-close");

      if (this.drawerLayer) {
        this.drawerLayer.addEventListener("click", this.closeDrawer.bind(this));
      }
      if (this.closeBtn) {
        this.closeBtn.addEventListener("click", this.closeDrawer.bind(this));
      }
    }
  }

  handleKeyDown(event) {
    if (event.key === "Escape") {
      this.closeDrawer(event); // Call closeDrawer when Escape is pressed
    }
  }
  viewDrawer() {
    this.drawer.style.display = "flex";
    setTimeout(
      function () {
        this.drawer.classList.add("open");
        setTimeout(
          function () {
            focusElement = this;
            trapFocusElements(this.drawer);
          }.bind(this),
          300
        );
      }.bind(this),
      200
    );
  }
  closeDrawer() {
    this.drawer.classList.remove("open");
    setTimeout(
      function () {
        this.drawer.style.display = "none";
      }.bind(this),
      600
    );
    if (focusElement) {
      focusElement.focus();
    }
    focusElement = "";
    removeTrapFocus();
  }
}
customElements.define("view-products", HotSpotView);

class ProductBundleWrapper extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const hoverElements = this.querySelectorAll("[data-content-head]");
    const hoverContents = this.querySelectorAll("[data-content-body]");
    hoverElements.forEach((hoverelement) => {
      hoverelement.addEventListener("mouseover", (event) => {
        const id = hoverelement.getAttribute("data-id");
        hoverElements.forEach((t) => t.classList.remove("active"));
        hoverContents.forEach((c) => c.classList.remove("active"));
        hoverelement.classList.add("active");
        this.querySelector(".bundle-image-wrapper.active")?.classList.remove(
          "active"
        );
        this.querySelector(
          `.bundle-image-wrapper[data-id="${id}"]`
        )?.classList.add("active");
        this.querySelector(`#${CSS.escape(id)}`)?.classList.add("active");
      });
    });
  }
}
customElements.define("bundle-product-wrapper", ProductBundleWrapper);
class BundleProduct extends HTMLElement {
  constructor() {
    super();
    this.cartApiUrl = "/cart/add.js";
    this.cart = document.querySelector("cart-drawer");
  }

  connectedCallback() {
    const button = this.querySelector("button");
    if (!button) return;
    button.addEventListener("click", this.addBundleToCart.bind(this));
  }
  addBundleToCart(evt) {
    this.handleErrorMessage();
    const bundleItems = this.querySelectorAll(
      '.product-bundle-item[data-variant-available="true"]'
    );
    const items = Array.from(bundleItems).map((item) => ({
      id: item.getAttribute("data-variant-id"),
      quantity: 1,
    }));
    if (items.length === 0) {
      return;
    }
    this.querySelector("button span[data-addtocart-text]").classList.add(
      "hidden"
    );
    this.querySelector("button .spinner-loading-btn").classList.remove(
      "hidden"
    );
    // Combine all items in a single fetch request
    fetch(this.cartApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ items: items }),
    })
      .then((response) => {
        this.querySelector("button span[data-addtocart-text]").classList.remove(
          "hidden"
        );
        this.querySelector("button .spinner-loading-btn").classList.add(
          "hidden"
        );
        if (!response.ok) {
          this.handleErrorMessage("Failed to add bundle to cart.");
          throw new Error("Failed to add bundle to cart");
        }

        return response.json();
      })
      .then((cartData) => {
        this.querySelector("button span[data-addtocart-text]").classList.remove(
          "hidden"
        );
        this.querySelector("button .spinner-loading-btn").classList.add(
          "hidden"
        );
        if (this.cart) {
          this.cart.openDrawer(evt);
          this.cart.classList.add("open");
          document.querySelector("body").classList.add("no-scroll");
        } else {
          window.location = window.routes.cart_url;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handleErrorMessage(errorMessage = false) {
    if (this.hideErrors) return;
    this.errorMessageWrapper =
      this.errorMessageWrapper ||
      this.querySelector(".product-form__error-message-wrapper");
    if (!this.errorMessageWrapper) return;
    this.errorMessage =
      this.errorMessage ||
      this.errorMessageWrapper.querySelector(".product-form__error-message");
    this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);
    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}

customElements.define("bundle-product", BundleProduct);

class VariantSelector extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);
    this.debounceTimeout = null;
    this.hasUserInteracted = false; // Track if user has made any variant selections
    (this.other = Array.from(
      document.querySelectorAll("variant-selector")
    ).filter((selector) => selector != this)),
      (this.section = this.closest("section,.product-quick-view-drawer"));


    // Initialize after DOM is ready
    setTimeout(async () => {
      this.updateOptions();
      this.updateMasterId();

      // Handle initial variant from URL parameter first
      const handled = await this.handleInitialVariantFromURL();

      // Only run initial availability if URL variant wasn't handled
      if (!handled) {
        await this.showInitialAvailability();
      }
    }, 0);
  }
  connectedCallback() {
    this.updateOptions();
  }


  async handleInitialVariantFromURL() {
    // Check if there's a variant parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const variantId = urlParams.get('variant');

    if (!variantId) {
      return false; // No variant in URL
    }

    // Only handle URL variants on main product pages
    if (!this.closest(".section-main-product")) {
      return false;
    }

    try {
      // First get product data to find the variant
      if (!this.productData) {
        const productHandle = this.dataset.url.split("/products/")[1];
        if (productHandle) {
          const response = await fetch(`/products/${productHandle}.js`);
          if (response.ok) {
            this.productData = await response.json();
          }
        }
      }

      if (this.productData) {
        // Find the variant by ID
        const urlVariant = this.productData.variants.find(v => v.id == variantId);

        if (urlVariant) {
          // Set the variant selectors to match this variant
          this.setVariantSelectors(urlVariant);

          // Update current variant and render
          this.currentVariant = urlVariant;
          this.updateSelectedVariantScript(urlVariant);

          // Update the variant input to ensure form submits correct variant ID
          this.updateVariantInput();

          // Always render product info to get fresh availability data from server
          this.renderProductInfo();

          // Update availability for this variant
          await this.updateVariantStatuses();

          // Update media with retry logic to ensure DOM is ready
          this.updateMediaWithRetry();

          return true; // Successfully handled URL variant
        }
      }
    } catch (error) {
      console.error("Error handling URL variant:", error);
    }

    return false; // Couldn't handle URL variant
  }

   updateMediaWithRetry(attempts = 0) {
          const maxAttempts = 5;
       const delay = 100 * (attempts + 1); // Increasing delay: 100ms, 200ms, 300ms, etc.
       
       
             const productMedia = this.section.querySelector("product-media");
             const mediaGalleries = document.querySelector(
               `[id^="product-media-gallery-${this.dataset.section}"]`
             );
         
             if (productMedia && mediaGalleries) {
               // Elements are ready, proceed with media update
               this.updateMedia();
             } else if (attempts < maxAttempts) {
               // Elements not ready, retry after delay
               setTimeout(() => {
                 this.updateMediaWithRetry(attempts + 1);
               }, delay);
             } else {
               console.log('Media elements not found after maximum attempts');
             }
      }

  setVariantSelectors(variant) {
    // Set dropdown selectors
    const selects = this.querySelectorAll('select');
    selects.forEach((select, index) => {
      const optionValue = variant[`option${index + 1}`];
      if (optionValue && select.querySelector(`option[value="${optionValue}"]`)) {
        select.value = optionValue;
      }
    });

    // Set radio button selectors
    const fieldsets = this.querySelectorAll('fieldset');
    fieldsets.forEach((fieldset, index) => {
      const optionValue = variant[`option${index + 1}`];
      const radio = fieldset.querySelector(`input[value="${optionValue}"]`);
      if (radio) {
        radio.checked = true;
        // Update visual state
        const currentActive = fieldset.querySelector('.swatches-list-item.active');
        if (currentActive) {
          currentActive.classList.remove('active');
        }
        const newActive = radio.closest('.swatches-list-item');
        if (newActive) {
          newActive.classList.add('active');
        }
      }
    });

    // Update options array
    this.updateOptions();
  }
  onVariantChange() {
    // Mark that user has interacted with variants
    this.hasUserInteracted = true;

    this.updateOptions();
    // this.showLoadingState();
  // Debounce variant updates for performance
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(async () => {
        try {
            await this.updateCurrentVariant();
            await this.updateVariantStatuses();

            // this.hideLoadingState();
            this.updatePickupAvailability();

            if (!this.currentVariant) {
                this.toggleAddButton(true, window.variantStrings.unavailable, true);
                this.setUnavailable();
            } else {
                this.updateMedia();
                this.updateURL();
                this.updateVariantInput();
                this.renderProductInfo();
            }
            this.updateVariantClass();
            this.updateOther();
        } catch (error) {
            console.error('Error in variant change:', error);
            // this.hideLoadingState();
        }
    }, 300);

    // this.updateOptions();
    // this.updateMasterId();
    // this.toggleAddButton(true, "", false);
    // this.updatePickupAvailability();
    // if (!this.currentVariant) {
    //   this.toggleAddButton(true, "", true);
    //   this.setUnavailable();
    // } else {
    //   this.updateMedia();
    //   this.updateURL();
    //   this.updateVariantInput();
    //   this.renderProductInfo();
    //   this.updateVariantStatuses();
    // }
    // this.updateVariantClass();
    // this.updateOther();
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    const selectValues = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    );
    const radioValues = fieldsets.map((fieldset) => {
      const radio = Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      );
      return radio ? radio.value : null;
    });

    // For high variant support, only take first 3 options to match Shopify's option1, option2, option3
    this.options = [...selectValues, ...radioValues].slice(0, 3);

    // Pad with nulls if fewer than 3 options (for consistent array length)
    while (this.options.length < 3) {
      this.options.push(null);
    }
  }

  // URL parameter functionality removed as requested

  async updateCurrentVariant() {
    if (!this.options.length) {
      this.currentVariant = this.getCurrentVariantData();
      return;
    }

    // Find variant using Ajax API and update data-selected-variant
    await this.findAndUpdateSelectedVariant();
  }

  async findAndUpdateSelectedVariant() {
    try {
      // Fetch product data if not already cached
      if (!this.productData) {
        const productHandle = this.dataset.url.split("/products/")[1];
        if (!productHandle) return;

        const response = await fetch(`/products/${productHandle}.js`);
        if (!response.ok) return;

        this.productData = await response.json();
      }

      // Find matching variant
      const variant = this.productData.variants.find((v) => {
        return this.options.every((option, index) => {
          // Skip null options - they don't need to match
          if (option === null) return true;
          return v[`option${index + 1}`] === option;
        });
      });

      if (variant) {
        // Update the data-selected-variant script content
        this.updateSelectedVariantScript(variant);
        this.currentVariant = variant;
      } else {
        this.currentVariant = null;
      }
    } catch (error) {
      console.error("Error finding variant:", error);
      this.currentVariant = null;
    }
  }

  updateSelectedVariantScript(variant) {
    // Update the data-selected-variant script content directly
    const variantScript = this.querySelector('[data-name="main-product"]');
    if (variantScript) {
      variantScript.textContent = JSON.stringify(variant);
    }
  }


  updateMasterId() {
    this.currentVariant = this.getCurrentVariantData();
  }

  getCurrentVariantData() {
    const script = this.querySelector('[data-name="main-product"]');
    if (!script) return null;

    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.error("Invalid JSON in selected variant data:", error);
      console.error("JSON content:", script.textContent);
      return null;
    }
  }

  updateOther() {
    if (this.dataset.updateUrl !== "false" && this.other.length) {
      let fieldsets = this.other[0].querySelectorAll("fieldset"),
        fieldsetsArray = Array.from(fieldsets);
      var filteredArray = this.options.filter(function (element) {
        return element !== null;
      });
      Array.from(filteredArray).forEach(function (option, i) {
        fieldsetsArray.forEach(function (fieldsetsArrayValue) {
          if (fieldsetsArrayValue.querySelector("select")) {
            if (option != null) {
              if (
                fieldsetsArrayValue.querySelector(
                  `select option[value="${option}"]`
                )
              ) {
                fieldsetsArrayValue.querySelector(
                  `select option[value="${option}"]`
                ).selected = true;
              }
            }
          } else if (fieldsetsArrayValue.querySelectorAll("input").length) {
            if (fieldsetsArrayValue.querySelector(`input[value="${option}"]`)) {
              if (
                fieldsetsArrayValue.querySelector(".swatches-list-item.active")
              ) {
                fieldsetsArrayValue
                  .querySelector(".swatches-list-item.active")
                  .classList.remove("active");
              }
              fieldsetsArrayValue
                .querySelector(`input[value="${option}"]`)
                .closest(".swatches-list-item")
                .classList.add("active");
              fieldsetsArrayValue.querySelector(
                `input[value="${option}"]`
              ).checked = true;
            }
          }
        });
      });
      this.other[0].updateOptions();
      this.other[0].updateMasterId();
    }
  }
  updateMedia() {
    if (!this.currentVariant) return;

    this.productMedia = this.section.querySelector("product-media");
    if (!this.productMedia) return;

    const mediaGalleries = document.querySelector(
      `[id^="product-media-gallery-${this.dataset.section}"]`
    );
    if (!mediaGalleries) return;

    // If variant has featured_media, try to show that specific image
    if (this.currentVariant.featured_media && this.currentVariant.featured_media.id) {
   
      const mediaType = this.productMedia.dataset.mediaType;
      const mediaWrapper = mediaGalleries.querySelector(
        "[data-product-main-media]"
      );

      let mediaVariant = mediaGalleries.querySelector(
        "#product-media-" + this.currentVariant.featured_media.id
      );

      if (mediaVariant && mediaWrapper) {
        if (mediaType == "slider") {
          const slideIndex = parseInt(
            mediaVariant.getAttribute("data-swiper-slide-index")
          );
          if (!isNaN(slideIndex)) {
            this.productMedia.selectedSlide(slideIndex);
          }
        } else {
          let childCount = mediaWrapper.children.length;
          let firstChild = mediaWrapper.firstChild;
          if (childCount > 1) {
            mediaWrapper.insertBefore(mediaVariant, firstChild);
          }
        }
      } else {
        console.log('Media variant or wrapper not found');
      }
    } else {
      console.log('No featured_media for variant:', this.currentVariant.id);
    }
  }

  updateURL() {
    // Only update URL on main product page, not on collection pages
    if (this.closest(".section-main-product") && this.dataset.updateUrl !== "false") {
      if (!this.currentVariant) return;

      // Always remove variant from URL during normal product page interactions
      // Only keep variant in URL if it was set from external source and user hasn't interacted
      if (this.hasUserInteracted) {
        // Remove variant from URL for user interactions
        window.history.replaceState(
          {},
          "",
          this.dataset.url
        );
      }
      // If hasUserInteracted is false, we're still in initial load state, so keep existing URL
    }
    return;
  }
  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  async updateVariantStatuses() {
    // Update availability based on current selections using Ajax API
    try {
      await this.updateAvailabilityFromAjax();
    } catch (error) {
      console.error("Error updating variant statuses:", error);
      // Fallback to showing initial availability
      this.showInitialAvailability();
    }
  }

  async showInitialAvailability() {
    // Show availability as set by Liquid template on page load
    try {
      // Fetch product data for initial filtering
      await this.updateAvailabilityFromAjax();
    } catch (error) {
      console.error("Error updating initial availability:", error);
      // Fallback to basic visual state sync
      const inputWrappers = [
        ...this.querySelectorAll(".product-form__controls"),
      ];
      inputWrappers.forEach((option) => {
        const optionInputs = [
          ...option.querySelectorAll('input[type="radio"], option'),
        ];
        this.syncVisualStates(optionInputs);
      });
    }
  }

  async updateAvailabilityFromAjax() {
    // Use the same product data if we just fetched it
    if (!this.productData) {
      try {
        if (!this.dataset.url) {
          return;
        }
        const productHandle = this.dataset.url.split("/products/")[1];
        if (!productHandle) return;

        const response = await fetch(`/products/${productHandle}.js`);
        if (!response.ok) return;

        this.productData = await response.json();
      } catch (error) {
        console.error("Error fetching product data:", error);
        return;
      }
    }

    // Get current selected options for each position
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];

    for (let optionIndex = 0; optionIndex < inputWrappers.length; optionIndex++) {
      const wrapper = inputWrappers[optionIndex];
      const selectElement = wrapper.querySelector("select");
      const optionInputs = [
        ...wrapper.querySelectorAll('input[type="radio"], option'),
      ];

      // Store original options if not already stored
      if (selectElement && !selectElement.dataset.originalOptions) {
        const originalOptions = [
          ...selectElement.querySelectorAll("option"),
        ].map((option) => ({
          value: option.value,
          text: option.textContent,
          element: option.cloneNode(true),
        }));
        selectElement.dataset.originalOptions = JSON.stringify(
          originalOptions.map((opt) => ({ value: opt.value, text: opt.text }))
        );
      }

      // Determine which values are available for this option position
      const availableValuesForThisOption = this.getAvailableValuesForOption(
        this.productData.variants,
        optionIndex,
        this.options.slice(0, optionIndex)
      );

      if (selectElement) {
        // For dropdowns: remove unavailable options
        const originalOptions = JSON.parse(
          selectElement.dataset.originalOptions || "[]"
        );
        const currentValue = selectElement.value;

        // Clear all options except the first (usually empty) option
        const firstOption =
          selectElement.querySelector('option[value=""]') ||
          selectElement.querySelector("option");
        selectElement.innerHTML = "";
        if (firstOption && firstOption.value === "") {
          selectElement.appendChild(firstOption);
        }

        // Add back only available options
        originalOptions.forEach((optData) => {
          if (
            availableValuesForThisOption.includes(optData.value) &&
            optData.value !== ""
          ) {
            const option = document.createElement("option");
            option.value = optData.value;
            option.textContent = optData.text;
            if (optData.value === currentValue) {
              option.selected = true;
            }
            selectElement.appendChild(option);
          }
        });

        // If current selection is no longer available, reset to first available
        if (
          currentValue &&
          !availableValuesForThisOption.includes(currentValue)
        ) {
          if (availableValuesForThisOption.length > 0) {
            selectElement.value = availableValuesForThisOption[0];
          } else {
            selectElement.value = "";
          }
        }

        // Ensure we don't have empty selection when there are available options
        if (!selectElement.value && availableValuesForThisOption.length > 0) {
          selectElement.value = availableValuesForThisOption[0];
        }
      } else {
        // For radio buttons: disable unavailable options
        optionInputs.forEach((input) => {
          const inputValue = input.getAttribute("value");
          const isAvailable = availableValuesForThisOption.includes(inputValue);

          if (isAvailable) {
            input.removeAttribute("disabled");
            input.classList.remove("disabled");
          } else {
            input.setAttribute("disabled", "disabled");
            input.classList.add("disabled");
          }

          // Update parent swatch item
          const parentItem = input.closest(".product-swatch-item");
          if (parentItem) {
            if (isAvailable) {
              parentItem.classList.add("available");
              parentItem.classList.remove("unavailable");
            } else {
              parentItem.classList.add("unavailable");
              parentItem.classList.remove("available");
            }
          }
        });
      }

      // Auto-select first available option if current selection is unavailable
      const remainingInputs = [
        ...wrapper.querySelectorAll('input[type="radio"], option'),
      ];
      await this.autoSelectAvailableOption(
        remainingInputs,
        availableValuesForThisOption,
        optionIndex
      );

      // Update visual states
      this.syncVisualStates(remainingInputs);
    }

    // Update options after all dropdown modifications
    this.updateOptions();

    // Update current variant to reflect the new options
    await this.updateVariantForNewOptions();
  }

  getAvailableValuesForOption(variants, optionIndex, selectedPreviousOptions) {
    const availableValues = new Set();

    variants.forEach((variant) => {
      // Check if this variant matches the previously selected options
      const matchesPreviousSelections = selectedPreviousOptions.every(
        (selectedOption, prevIndex) => {
          return variant[`option${prevIndex + 1}`] === selectedOption;
        }
      );

      // If variant is available and matches previous selections,
      // add its value for the current option to available values
      if (variant.available && matchesPreviousSelections) {
        const optionValue = variant[`option${optionIndex + 1}`];
        if (optionValue) {
          availableValues.add(optionValue);
        }
      }
    });

    return Array.from(availableValues);
  }

  async autoSelectAvailableOption(optionInputs, availableValues, optionIndex) {
    // Check if current selection is unavailable
    const currentSelection = this.options[optionIndex];

    if (currentSelection && !availableValues.includes(currentSelection)) {
      // Current selection is unavailable, auto-select first available option
      if (availableValues.length > 0) {
        const firstAvailable = availableValues[0];
        const inputToSelect = optionInputs.find(
          (input) => input.getAttribute("value") === firstAvailable
        );

        if (inputToSelect) {
          if (inputToSelect.type === "radio") {
            inputToSelect.checked = true;
          } else if (inputToSelect.tagName === "OPTION") {
            inputToSelect.selected = true;
            inputToSelect.parentElement.value = firstAvailable;
          }

          // Update the options array but don't trigger variant change
          this.updateOptions();

          // Find and update the variant for the new options immediately
          await this.updateVariantForNewOptions();

        }
      }
    }
  }

  // Removed old availability update methods - now using Ajax API approach

  syncVisualStates(optionInputs) {
    optionInputs.forEach((input) => {
      const isDisabled = input.hasAttribute("disabled");
      const parentItem = input.closest(".product-swatch-item");

      if (input.tagName === "OPTION") {
        // Handle select options - unavailable options are already removed
        input.innerText = input.getAttribute("value");
      } else if (input.tagName === "INPUT") {
        // Handle radio inputs
        if (isDisabled) {
          input.classList.add("disabled");
          if (parentItem) {
            parentItem.classList.add("unavailable");
            parentItem.classList.remove("available");
          }
        } else {
          input.classList.remove("disabled");
          if (parentItem) {
            parentItem.classList.add("available");
            parentItem.classList.remove("unavailable");
          }
        }
      }
    });
  }

  async updateVariantForNewOptions() {
    // Update variant without triggering the full change cycle
    if (!this.productData) return;

    const variant = this.productData.variants.find((v) => {
      return this.options.every((option, index) => {
        // Skip null options - they don't need to match
        if (option === null) return true;
        return v[`option${index + 1}`] === option;
      });
    });
    if (variant) {
      this.updateSelectedVariantScript(variant);
      this.currentVariant = variant;
      // IMPORTANT: Update the form input to match the new variant
      this.updateVariantInput();
    }
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        if (input.tagName === "OPTION") {
          input.innerText = input.getAttribute("value");
        } else if (input.tagName === "INPUT") {
          input.classList.remove("disabled");
          input.removeAttribute("disabled", "disabled");
        }
      } else {
        if (input.tagName === "OPTION") {
          input.innerText =
            window.variantStrings.unavailable_with_option.replace(
              "[value]",
              input.getAttribute("value")
            );
        } else if (input.tagName === "INPUT") {
          input.classList.add("disabled");
          input.setAttribute("disabled", "disabled");
        }
      }
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }
  getSectionsToRender() {
    return [
      `price-${this.dataset.section}`,
      `price-${this.dataset.section}-sticky`,
      `product-image-${this.dataset.section}-sticky`,
      `Inventory-${this.dataset.section}`,
      `sku-${this.dataset.section}`,
    ];
  }

  renderProductInfo() {
    let sections = this.getSectionsToRender();
    const sectionId = this.dataset.section;
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");

        // Check for updated variant data in the response
        const variantScript = html.querySelector('[data-name="main-product"]');
        if (variantScript) {
          try {
            const freshVariantData = JSON.parse(variantScript.textContent);
            // Update current variant with fresh availability data
            if (freshVariantData && freshVariantData.id === this.currentVariant.id) {
              this.currentVariant = freshVariantData;
              this.updateSelectedVariantScript(freshVariantData);
            }
          } catch (error) {
            console.error('Error parsing fresh variant data:', error);
          }
        }

        const updateSlectedOptions = html.querySelectorAll(
          "[selected-option-value]"
        );
        Array.from(updateSlectedOptions).forEach(function (
          updateSlectedOption,
          index
        ) {
          document
            .querySelectorAll(`.selected-option-${sectionId}-${index + 1}`)
            .forEach(function (updateSlecteddata) {
              updateSlecteddata.innerText = updateSlectedOption.innerText;
            });
        });
        sections.forEach((id) => {
          const destination = document.getElementById(id),
            source = html.getElementById(id);

          if (source && destination) {
            destination.innerHTML = source.innerHTML;
          }

          const price = document.getElementById(id),
            price_fixed = document.getElementById(id + "-sticky"),
            sku = document.getElementById(`Sku-${this.dataset.section}`),
            inventory = document.getElementById(
              `Inventory-${this.dataset.section}`
            );

          if (price) {
            price.classList.remove("hidden");
          }

          if (price_fixed) {
            price_fixed.classList.remove("hidden");
          }
          if (inventory) inventory.classList.remove("hidden");
          if (sku) sku.classList.remove("hidden");
        });

        this.toggleAddButton(!this.currentVariant.available, this.currentVariant.available ? null : window.variantStrings.soldOut);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    const stickyButtonText = document.querySelector(
      'product-cart-sticky [name="add"] > span'
    );
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("aria-disabled", "true");
      addButton.setAttribute("disabled", "disabled");
      if (text) {
        addButtonText.textContent = text;
        if (stickyButtonText) {
          stickyButtonText.textContent = text;
        }
      }
    } else {
      addButton.removeAttribute("aria-disabled");
      addButton.removeAttribute("disabled");
      addButtonText.textContent = window.variantStrings.addToCart;
      if (stickyButtonText) {
        stickyButtonText.textContent = window.variantStrings.addToCart;
      }
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const addButton = button?.querySelector('[name="add"]');
    const price = document.getElementById(`price-${this.dataset.section}`);
    const price_fixed = document.getElementById(
      `price-${this.dataset.section}-sticky`
    );
    const inventory = document.getElementById(
      `Inventory-${this.dataset.section}`
    );
    const sku = document.getElementById(`Sku-${this.dataset.section}`);

    if (!addButton) return;
    this.toggleAddButton(true, window.variantStrings.unavailable);
    if (price) price.classList.add("hidden");
    if (price_fixed) price_fixed.classList.add("hidden");
    if (inventory) inventory.classList.add("hidden");
    if (sku) sku.classList.add("hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
  updateVariantClass() {
    const swatchesItems = Array.from(
      this.querySelectorAll(".swatches-list-item")
    );
    swatchesItems.forEach(function (swatchesItem) {
      if (swatchesItem) {
        swatchesItem.classList.remove("active");
      }
      if (swatchesItem.querySelector(".swatch-input:checked")) {
        swatchesItem
          .querySelector(".swatch-input:checked")
          .closest(".swatches-list-item")
          .classList.add("active");
      }
    });
  }
}

customElements.define("variant-selector", VariantSelector);

// Global handler for product card variant state preservation on page navigation
(function() {
  let pageShowHandlerAdded = false;

  function addPageShowHandler() {
    if (pageShowHandlerAdded) return;

    // Save variant selections before leaving page
    window.addEventListener('beforeunload', function() {
      saveVariantSelections();
    });

    // Restore variant selections when returning from cache
    window.addEventListener('pageshow', function(event) {
      if (event.persisted) {
        // Page was loaded from browser cache (back/forward navigation)
        setTimeout(restoreVariantSelections, 50);
      }
    });

    // Also handle normal page loads in case pageshow doesn't fire
    window.addEventListener('load', function() {
      setTimeout(restoreVariantSelections, 100);
    });

    pageShowHandlerAdded = true;
  }

  function saveVariantSelections() {
    const variantStates = {};
    const productCards = document.querySelectorAll('product-card-item');

    productCards.forEach((card, cardIndex) => {
      const checkedInput = card.querySelector('input[type="radio"]:checked');
      if (checkedInput) {
        const productId = extractProductIdFromCard(card);
        variantStates[productId || cardIndex] = {
          value: checkedInput.value,
          inputId: checkedInput.id
        };
      }
    });

    sessionStorage.setItem('productVariantSelections', JSON.stringify(variantStates));
  }

  function clearAllVariantSelections() {
    // Force clear all variant selections across all product cards
    const allRadioInputs = document.querySelectorAll('product-card-item input[type="radio"]');
    allRadioInputs.forEach(input => {
      input.checked = false;
    });

    // Remove all visual selection states
    const allVariantItems = document.querySelectorAll('product-card-item .filter-swatchs-item');
    allVariantItems.forEach(item => {
      item.classList.remove('active', 'selected');
    });

    // Also clear any other possible selection classes
    const allLabels = document.querySelectorAll('product-card-item .filter-variant-item');
    allLabels.forEach(label => {
      label.classList.remove('active', 'selected');
    });
  }

  function restoreVariantSelections() {
    // First, force clear ALL variant selections on the page
    clearAllVariantSelections();

    const savedStates = sessionStorage.getItem('productVariantSelections');
    if (!savedStates) return;

    try {
      const variantStates = JSON.parse(savedStates);
      const productCards = document.querySelectorAll('product-card-item');

      productCards.forEach((card, cardIndex) => {
        const productId = extractProductIdFromCard(card);
        const savedState = variantStates[productId || cardIndex];

        // Always clear all selections in this card first (whether we have saved state or not)
        const allInputs = card.querySelectorAll('input[type="radio"]');
        allInputs.forEach(input => {
          input.checked = false;
        });

        // Remove all visual states from all items
        const allItems = card.querySelectorAll('.filter-swatchs-item');
        allItems.forEach(item => {
          item.classList.remove('active', 'selected');
        });

        // Only restore if we have a saved state for this specific product
        if (savedState) {
          // Restore the specific selection
          const targetInput = card.querySelector(`input[id="${savedState.inputId}"]`) ||
                             card.querySelector(`input[value="${savedState.value}"]`);

          if (targetInput) {
            targetInput.checked = true;

            // Add visual state to the parent item
            const parentItem = targetInput.closest('.filter-swatchs-item');
            if (parentItem) {
              parentItem.classList.add('active');
            }
          }
        }
      });
    } catch (error) {
      console.error('Error restoring variant selections:', error);
    }
  }

  function extractProductIdFromCard(card) {
    // Try to extract product ID from various possible sources
    const productUrl = card.querySelector('[data-product-url]')?.dataset.productUrl;
    if (productUrl) {
      const match = productUrl.match(/\/products\/([^\/\?]+)/);
      if (match) return match[1];
    }

    // Fallback: look for product ID in input names
    const input = card.querySelector('input[id*="product-"]');
    if (input) {
      const match = input.id.match(/product-(\d+)/);
      if (match) return match[1];
    }

    return null;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPageShowHandler);
  } else {
    addPageShowHandler();
  }
})();

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );

    this.input.addEventListener("focus", this.onInputFocus.bind(this));
  }

  onButtonClick(event) {
    // event.stopPropagation();
    const previousValue = this.input.value;
    if (event.target.name === "plus") {
      this.input.stepUp();
    } else {
      if (event.target.name != undefined) {
        if (this.input.value > 0) {
          this.input.stepDown();
        }
      }
    }

    if (previousValue !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }
    setTimeout(
      function () {
        let refQty = null;
        if (this.hasAttribute("data-main-quantity")) {
          refQty = document.querySelector(
            `[data-sticky-quantity][data-form="${this.getAttribute(
              "data-form"
            )}"]`
          );
        } else if (this.hasAttribute("data-sticky-quantity")) {
          refQty = document.querySelector(
            `[data-main-quantity]["${this.getAttribute("data-form")}"]`
          );
        }
        if (refQty != null || refQty != undefined) {
          refQty.input.value = this.input.value;
        }
      }.bind(this),
      200
    );
  }

  onInputFocus() {
    this.input.select();
  }
}

customElements.define("quantity-input", QuantityInput);

if (!customElements.get("pickup-availability")) {
  class PickupAvailability extends HTMLElement {
    constructor() {
      super();
      if (!this.hasAttribute("available")) return;
      this.fetchAvailability(this.dataset.variantId);

      // Add keydown event listener for Escape key
      document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    fetchAvailability(variantId) {
      const variantSectionUrl = `${this.dataset.rootUrl}variants/${variantId}/?section_id=pickup-availability`;
      fetch(variantSectionUrl)
        .then((response) => response.text())
        .then((text) => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, "text/html")
            .querySelector(".shopify-section");
          this.renderPreview(sectionInnerHTML);
        });
    }

    renderPreview(sectionInnerHTML) {
      if (!sectionInnerHTML) {
        this.removeAttribute("available");
        this.innerHTML = "";
        return;
      }
      if (!sectionInnerHTML.querySelector(".pickup-availability-content")) {
        this.removeAttribute("available");
        this.innerHTML = "";
        return;
      }
      this.innerHTML = sectionInnerHTML.innerHTML;
      this.setAttribute("available", "");
      const drawerHead = this.querySelector("[data-drawer-head]");
      if (drawerHead) {
        drawerHead.addEventListener("click", this.openDrawer.bind(this));
      }
    }

    openDrawer(event) {
      event.preventDefault();
      const template = this.querySelector("#availability-drawer");
      if (!template) return;
      const templateContent = template.content.cloneNode(true);
      document.body.appendChild(templateContent);

      setTimeout(function () {
        const drawer = document.querySelector(".pickup-availability-drawer");
        if (drawer) drawer.classList.add("open");
      }, 500);

      setTimeout(function () {
        focusElement = event.target;
        trapFocusElements(
          document.querySelector(".pickup-availability-drawer")
        );
      }, 800);
      this.closeDrawer();
    }

    closeDrawer() {
      const drawer = document.querySelector(".pickup-availability-drawer");
      if (drawer) {
        const closeElements = drawer.querySelectorAll("[data-close-drawer]");
        Array.from(closeElements).forEach(
          function (closeElement) {
            closeElement.addEventListener(
              "click",
              function (event) {
                event.preventDefault();
                this._closeDrawer(drawer);
              }.bind(this)
            ); // Bind `this` to access the class context
          }.bind(this)
        ); // Bind `this` to access the class context
      }
    }

    _closeDrawer(drawer) {
      drawer.classList.remove("open");
      if (focusElement) {
        focusElement.focus();
      }
      focusElement = "";
      removeTrapFocus();

      setTimeout(function () {
        drawer.remove();
      }, 500);
    }

    handleKeyDown(event) {
      if (event.key === "Escape") {
        const drawer = document.querySelector(".pickup-availability-drawer");
        if (drawer && drawer.classList.contains("open")) {
          this._closeDrawer(drawer); // Close the drawer if it's open
        }
      }
    }
  }

  customElements.define("pickup-availability", PickupAvailability);
}

if (!customElements.get("size-chart")) {
  class SizeChart extends HTMLElement {
    constructor() {
      super();
      const drawerHead = this.querySelector("[data-drawer-head]");
      if (!drawerHead) return;
      drawerHead.addEventListener("click", this.openDrawer.bind(this));

      // Add keydown event listener for Escape key
      document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    openDrawer(event) {
      event.preventDefault();
      const template = this.querySelector("[data-sizechart-content]");
      if (!template) return;
      const templateContent = template.content.cloneNode(true);
      document.body.appendChild(templateContent);

      setTimeout(function () {
        const drawer = document.querySelector(".sizechart-drawer");
        if (drawer) drawer.classList.add("open");
      }, 500);

      setTimeout(function () {
        focusElement = event.target;
        trapFocusElements(document.querySelector(".sizechart-drawer"));
      }, 800);

      this.closeDrawer();
    }

    closeDrawer() {
      const drawer = document.querySelector(".sizechart-drawer");
      if (drawer) {
        const closeElements = drawer.querySelectorAll("[data-close-drawer]");
        Array.from(closeElements).forEach(
          function (closeElement) {
            closeElement.addEventListener(
              "click",
              function (event) {
                event.preventDefault();
                this._closeDrawer(drawer);
              }.bind(this)
            ); // Bind `this` to access the class context
          }.bind(this)
        ); // Bind `this` to access the class context
      }
    }

    _closeDrawer(drawer) {
      drawer.classList.remove("open");
      if (focusElement) {
        focusElement.focus();
      }
      focusElement = "";
      removeTrapFocus();

      setTimeout(function () {
        drawer.remove();
      }, 500);
    }

    handleKeyDown(event) {
      if (event.key === "Escape") {
        const drawer = document.querySelector(".sizechart-drawer");
        if (drawer && drawer.classList.contains("open")) {
          this._closeDrawer(drawer); // Close the drawer if it's open
        }
      }
    }
  }

  customElements.define("size-chart", SizeChart);
}

if (!customElements.get("custom-content-element")) {
  class CustomContentElement extends HTMLElement {
    constructor() {
      super();
      this.drawerTrigger = this.querySelector("[data-custom-drawer]");
      if (!this.drawerTrigger) return;
      this.drawerTrigger.addEventListener("click", this.openDrawer.bind(this));
    }

    openDrawer(event) {
      event.preventDefault();
      const template = this.querySelector("[data-custom-content-container]");
      if (template) {
        const templateContent = template.content.cloneNode(true);
        document.body.appendChild(templateContent);
        const blockid = this.getAttribute("data-id");

        setTimeout(() => {
          const drawer = document.querySelector(
            `[data-drawer-id='${blockid}']`
          );
          if (drawer) {
            drawer.classList.add("open");
            this.addEscapeListener(drawer); // Add escape listener when opening the drawer
          }
        }, 500);

        setTimeout(() => {
          focusElement = event.target;
          trapFocusElements(
            document.querySelector(`[data-drawer-id='${blockid}']`)
          );
        }, 800);

        this.closeDrawer(blockid);
      }
    }

    closeDrawer(blockid) {
      const drawer = document.querySelector(`[data-drawer-id='${blockid}']`);
      if (drawer) {
        const closeElements = drawer.querySelectorAll("[data-close-drawer]");
        Array.from(closeElements).forEach((closeElement) => {
          closeElement.addEventListener("click", (event) => {
            event.preventDefault();
            this._closeDrawer(drawer);
          });
        });
      }
    }

    _closeDrawer(drawer) {
      drawer.classList.remove("open");
      if (this.escapeHandler) {
        document.removeEventListener("keydown", this.escapeHandler);
        this.escapeHandler = null;
      }
      if (focusElement) {
        focusElement.focus();
      }
      focusElement = "";
      removeTrapFocus();

      setTimeout(() => {
        drawer.remove();
      }, 500);
    }

    addEscapeListener(drawer) {
      if (this.escapeHandler) {
        document.removeEventListener("keydown", this.escapeHandler);
      }
      this.escapeHandler = (event) => {
        if (event.key === "Escape") {
          this._closeDrawer(drawer);
        }
      };
      document.addEventListener("keydown", this.escapeHandler);
    }
  }

  customElements.define("custom-content-element", CustomContentElement);
}

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);
      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector("product-recommendations");
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px 200px 0px",
    }).observe(this);
  }
}
customElements.define("product-recommendations", ProductRecommendations);
class ProductRecentlyViewed extends HTMLElement {
  constructor() {
    super();
    const productId = parseInt(this.dataset.productId);
    const cookieName = "luxury-recently-viewed";
    const items = JSON.parse(window.localStorage.getItem(cookieName) || "[]");
    if (!items.includes(productId)) {
      items.unshift(productId);
    }

    window.localStorage.setItem(cookieName, JSON.stringify(items.slice(0, 6)));
  }
}
customElements.define("product-recently-viewed", ProductRecentlyViewed);
class RecentlyViewProducts extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch(this.dataset.url + this.getQueryStringData())
      .then((response) => response.text())
      .then((text) => {
        const html = document.createElement("div");
        html.innerHTML = text;
        const recommendations = html.querySelector("recently-view-products");
        if (recommendations && recommendations.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;
          let totalitem = recommendations.querySelectorAll(
            ".product-media-cards"
          ).length;
          if (
            recommendations
              .querySelector(".recently-view-content-wrap")
              .innerHTML.trim().length != 0
          ) {
            this.closest(".shopify-section").classList.remove("hidden");
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getQueryStringData() {
    const cookieName = "luxury-recently-viewed";
    const items = JSON.parse(window.localStorage.getItem(cookieName) || "[]");
    if (
      this.dataset.productId &&
      items.includes(parseInt(this.dataset.productId))
    ) {
      items.splice(items.indexOf(parseInt(this.dataset.productId)), 1);
    }
    return items
      .map((item) => "id:" + item)
      .slice(0, 6)
      .join(" OR ");
  }
}
customElements.define("recently-view-products", RecentlyViewProducts);

class featuredCollectionList extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest(".section-space");
    if (!this.section.classList.contains("featured-overlay-showcase")) return;
    const resizeObserver = new ResizeObserver(
      this.updateSectionSpacing.bind(this)
    );
    resizeObserver.observe(this);
  }
  updateSectionSpacing() {
    this.section.style.setProperty(
      "--section-bottom-space",
      `${this.clientHeight / 2}px`
    );
  }
}

customElements.define("featured-collection-list", featuredCollectionList);

class CollageWithTabs extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest(".shopify-section");
    this.activeTab = this.querySelector("[data-tab-head].active");
    this.slider = this.querySelector("slider-main-component");

    Array.from(this.querySelectorAll("[data-tab-head]")).forEach((tabHead) => {
      tabHead.setAttribute("tabindex", "0");
      this.tabHeadEvent(tabHead);
    });
  }

  tabHeadEvent(element) {
    element.addEventListener("click", () => this.activateTab(element));

    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.activateTab(element);
      }
    });
  }

  activateTab(element) {
    if (element.classList.contains("active")) return;

    if (this.activeTab) {
      this.activeTab.classList.remove("active");
    }

    element.classList.add("active");
    const slideIndex = parseInt(element.dataset.index);

    if (this.slider) {
      this.slider.selectSlide(slideIndex);
    }

    this.activeTab = element;
  }
}

customElements.define("collage-with-tabs", CollageWithTabs);

class CollectionCarousel extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest(".shopify-section");
    if (!this.hasAttribute("description-on-hover")) return;
    Array.from(this.querySelectorAll(".collection-card")).forEach(
      function (tabHead) {
        this.HoverEvent(tabHead);
      }.bind(this)
    );
  }
  HoverEvent(element) {
    let description = element.querySelector("[data-collection-description]");
    if (!description) return;
    element.style.setProperty(
      "--card-max-height",
      `${description.scrollHeight}px`
    );
  }
}

customElements.define("collection-carousel", CollectionCarousel);

// function customDropdownElements(section = document) {
//   let customDropdowns = section.querySelectorAll(".detail-box");
//   Array.from(customDropdowns).forEach(function (dropdown) {
//     let dropdownButton = dropdown.querySelector(".detail-summary");
//     if (dropdownButton) {
//       dropdownButton.addEventListener("click", (event) => {
//         event.preventDefault();
//         if (dropdown.classList.contains("active")) {
//           dropdown.classList.remove("active");
//         } else {
//           dropdown.classList.add("active");
//         }
//         DOMAnimations.slideToggle(
//           dropdown.querySelector(".detail-expand"),
//           300
//         );
//       });
//       dropdown.onkeydown = function (e) {
//         if (e.keyCode == 13 || e.keyCode == 32) {
//           dropdownButton.click();
//         }
//       };
//     }
//     let dropdownContent = dropdown.querySelector(".detail-expand");
//     if (dropdownContent) {
//       dropdownContent.addEventListener("click", (event) => {
//         dropdown.classList.remove("active");
//         DOMAnimations.slideUp(dropdown.querySelector(".detail-expand"), 300);
//       });
//     }
//     document.addEventListener("click", function (event) {
//       let element = event.target;
//       if (dropdown.contains(element) || element === dropdown) {
//         return false;
//       } else {
//         if (dropdown.classList.contains("active")) {
//           dropdown.classList.remove("active");
//           DOMAnimations.slideUp(dropdown.querySelector(".detail-expand"), 300);
//         }
//       }
//     });
//   });
// }

// class DropdownElement extends HTMLElement {
//   constructor() {
//     super();
//     this.section = this.closest(".shopify-section");
//     this.button = this.querySelector("[detail-summary]");
//     this.content = this.querySelector("[detail-expand]");
//     if(!this.button) return;
//     this.button.addEventListener("click",this.toggleEvent.bind(this));
//     this.content.addEventListener("click",this.toggleEvent.bind(this));
//     this.addEventListener("keydown",function(e){
//       if (e.keyCode == 13 || e.keyCode == 32) {
//           //this.hideContent();
//       }
//     }.bind(this));
//     document.addEventListener("click", function (event) {
//       let element = event.target;
//       if (this.contains(element) || element === this) {
//         return false;
//       } else {
//         if (this.classList.contains("active")) {
//           this.hideContent();
//         }
//       }
//     }.bind(this));
//   }
//   toggleEvent() {
//     if (this.classList.contains("active")) {

//       this.hideContent();
//     } else {
//       this.showContent();
//     }
//   }
//   showContent(){
//     this.content.style.display = 'block';
//       setTimeout(function(){
//       this.classList.add("active");
//       }.bind(this),100)
//   }
//   hideContent(){
//       this.classList.remove("active");
//       setTimeout(function(){
//     this.content.style.display = 'none';
//       }.bind(this),600)
//   }
// }

// customElements.define("dropdown-element", DropdownElement);

class DropdownElement extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest(".shopify-section");
    this.button = this.querySelector("[detail-summary]");
    this.content = this.querySelector("[detail-expand]");

    if (!this.button) return;

    // Toggle dropdown on button click
    this.button.addEventListener("click", this.toggleEvent.bind(this));

    // Handle clicks outside the dropdown to close it
    document.addEventListener(
      "click",
      function (event) {
        const element = event.target;
        if (!this.contains(element)) {
          this.hideContent();
        }
      }.bind(this)
    );

    // Close dropdown on focusout (when tabbing out)
    this.addEventListener("focusout", (event) => {
      if (!this.contains(event.relatedTarget)) {
        this.hideContent();
      }
    });
  }

  toggleEvent() {
    if (this.classList.contains("active")) {
      this.hideContent();
    } else {
      this.showContent();
    }
  }

  showContent() {
    this.content.style.display = "block";
    setTimeout(() => {
      this.classList.add("active");
    }, 100);
  }

  hideContent() {
    this.classList.remove("active");
    setTimeout(() => {
      this.content.style.display = "none";
    }, 600);
  }
}

customElements.define("dropdown-element", DropdownElement);

class ShippingCollapsible extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest(".shopify-section");
    this.button = this.querySelector("[detail-summary]");
    this.content = this.querySelector("[detail-expand]");

    if (!this.button) return;

    // Set tabindex for the button
    this.button.setAttribute("tabindex", "0");

    // Event listeners for button and content
    this.button.addEventListener("click", this.toggleEvent.bind(this));
    this.button.addEventListener("keydown", this.handleKeydown.bind(this));

    // Close the content when clicking outside
    document.addEventListener("click", (event) => {
      let element = event.target;
      if (this.contains(element) || element === this) {
        return false;
      } else {
        if (this.classList.contains("active")) {
          this.collapseContent();
        }
      }
    });
  }

  handleKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent default scrolling behavior for space key
      this.toggleEvent(); // Trigger the toggle function
    }
  }

  toggleEvent() {
    if (this.classList.contains("active")) {
      this.collapseContent();
    } else {
      this.expandContent();
    }
  }

  expandContent() {
    this.classList.add("active");
    this.content.setAttribute("tabindex", "0"); // Make content focusable
    DOMAnimations.slideDown(this.content);
  }

  collapseContent() {
    this.classList.remove("active");
    this.content.setAttribute("tabindex", "-1"); // Remove from tab order
    DOMAnimations.slideUp(this.content);
  }
}

customElements.define("shipping-collapsible", ShippingCollapsible);

// class AccordionElement extends HTMLElement {
//   constructor() {
//     super();
//     this.section = this.closest(".shopify-section");
//     this.button = this.querySelector("[detail-summary]");
//     this.content = this.querySelector("[detail-expand]");
//     if(!this.button) return;
//     this.button.addEventListener("click",this.toggleEvent.bind(this));
//   }
//   toggleEvent() {
//     if (this.classList.contains("active")) {
//       this.hideContent();
//     } else {
//       this.showContent();
//     }
//   }
//   showContent(){
//       this.classList.add("active");
//       DOMAnimations.slideDown(this.content);
//   }
//   hideContent(){
//       this.classList.remove("active");
//       DOMAnimations.slideUp(this.content);
//   }
// }

// customElements.define("accordion-element", AccordionElement);
class AccordionElement extends HTMLElement {
  constructor() {
    super();
    this.section = this.closest(".shopify-section");
    this.button = this.querySelector("[detail-summary]");
    this.content = this.querySelector("[detail-expand]");
    if (!this.button) return;
    this.button.setAttribute("tabindex", "0");
    this.button.addEventListener("click", this.toggleEvent.bind(this));
    this.button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.toggleEvent();
      }
    });
  }

  toggleEvent() {
    if (this.classList.contains("active")) {
      this.hideContent();
    } else {
      this.showContent();
    }
  }

  showContent() {
    this.classList.add("active");
    DOMAnimations.slideDown(this.content);
  }

  hideContent() {
    this.classList.remove("active");
    DOMAnimations.slideUp(this.content);
  }
}

customElements.define("accordion-element", AccordionElement);

class GiftWrapping extends HTMLElement {
  constructor() {
    super();

    this.giftWrapId = this.dataset.giftWrapId;
    this.giftWrapping = this.dataset.giftWrapping;
    this.cartItemsSize = parseInt(this.getAttribute("cart-items-size"));
    this.giftWrapsInCart = parseInt(this.getAttribute("gift-wraps-in-cart"));
    this.itemsInCart = parseInt(this.getAttribute("items-in-cart"));
    const giftWrapControl = this.querySelector("[add-gift-product]");
    if (!giftWrapControl) return;
    giftWrapControl.addEventListener("change", () => this.setGiftWrap());
  }

  setGiftWrap() {
    const sections = this.getSectionsToRender().map(
      (section) => section.section
    );
    const body = JSON.stringify({
      updates: {
        [this.giftWrapId]: this.itemsInCart,
      },
      attributes: {
        "gift-wrapping": true,
      },
      sections: sections,
      sections_url: window.location.pathname,
    });

    fetch(`${window.routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        const resultState = JSON.parse(response);
        this.getSectionsToRender().forEach((section) => {
          if (document.getElementById(section.id)) {
            const elementToReplace = document.getElementById(section.id);
            elementToReplace.innerHTML = this.getSectionInnerHTML(
              resultState.sections[section.section],
              section.selector
            );
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }
  getSectionsToRender() {
    let maincartID = "#main-cart";
    let maincartfooter = "#main-cart";
    if (document.getElementById("main-cart")) {
      maincartID = document.getElementById("main-cart").dataset.id;
    }
    if (document.getElementById("main-cart-summary")) {
      maincartfooter = document.getElementById("main-cart-summary").dataset.id;
    }
    return [
      {
        id: "cart-drawer",
        section: document.getElementById("cart-drawer")?.id,
        selector: "cart-drawer",
      },
      {
        id: "main-cart",
        section: document.getElementById("main-cart")?.dataset.id,
        selector: ".cart-item-content",
      },
      {
        id: "main-cart-summary",
        section: document.getElementById("main-cart-summary")?.dataset.id,
        selector: ".main-summary-content",
      },
    ];
  }
  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }
}
customElements.define("gift-wrapping", GiftWrapping);

class QuickView extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    if (this.querySelector("[data-quickview]")) {
      this.addEventListener("click", (event) => {
        event.preventDefault();
        const drawer = document.querySelector("#product-quick-view-drawer");
        if (drawer) {
          this.setupEventListener(event, drawer);
        } else if (this.dataset.productUrl) {
          window.location.href = this.dataset.productUrl;
        }
      });
    }
  }
  setupEventListener(event, drawer) {
    const selector = "#product-quick-view-drawer";
    const drawerContent = this.querySelector(selector);
    const drawerSelector = document.querySelector("#product-quick-view-drawer");
    drawerSelector.classList.add("loading");
    this.querySelector("[data-quickview]").classList.add("loading");
    this.querySelector("[data-quickview]")
      .querySelector(".quick-view-icon")
      .classList.add("hidden");
    this.querySelector("[data-quickview]")
      .querySelector(".spinner-loading-btn")
      .classList.remove("hidden");
    drawerSelector.innerHTML = "";
    const productUrl = this.dataset.productUrl.split("?")[0];
    const sectionUrl = `${productUrl}`;
    fetch(sectionUrl)
      .then((response) => response.text())
      .then((responseText) => {
        const responseHTML = new DOMParser().parseFromString(
          responseText,
          "text/html"
        );
        const productElement = responseHTML.querySelector(selector);
        if (!productElement) {
          throw new Error("Quick view content is unavailable");
        }
        drawerSelector.classList.remove("loading");

        drawerSelector.innerHTML = productElement.innerHTML;
        drawer.classList.add("open");
        document.querySelector("body").classList.add("no-scroll");
        this.querySelector("[data-quickview]").classList.remove("loading");
        this.querySelector("[data-quickview]")
          .querySelector(".quick-view-icon")
          .classList.remove("hidden");
        this.querySelector("[data-quickview]")
          .querySelector(".spinner-loading-btn")
          .classList.add("hidden");
        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
        this.closeDrawer();

        if (window.ProductModel) window.ProductModel.loadShopifyXR();
        pauseVideo();
      })
      .catch((e) => {
        console.error(e);
        drawerSelector.classList.remove("loading");
        const quickViewButton = this.querySelector("[data-quickview]");
        quickViewButton?.classList.remove("loading");
        quickViewButton?.querySelector(".quick-view-icon")?.classList.remove("hidden");
        quickViewButton?.querySelector(".spinner-loading-btn")?.classList.add("hidden");
      });
  }

  closeDrawer() {
    const drawer = document.querySelector(".product-quick-view-drawer");
    if (drawer) {
      const closeElements = drawer.querySelectorAll("[data-close-drawer]");
      Array.from(closeElements).forEach(function (closeElement) {
        closeElement.addEventListener("click", function (event) {
          event.preventDefault();
          drawer.classList.remove("open");
          document.querySelector("body").classList.remove("no-scroll");
        });
      });
    }
  }
}
customElements.define("quick-view", QuickView);

class CustomSlider extends HTMLElement {
  constructor() {
    super();
    this.dataid = this.dataset.id;
    this.mainSlider = this.querySelector(`[data-main-slider-${this.dataid}]`);
    this.thumbSlider = this.querySelector(`[data-thumb-slider-${this.dataid}]`);
  }
  connectedCallback() {
    if (this.mainSlider) {
      if (this.thumbSlider) {
        this.customThumImage = new Swiper(
          this.thumbSlider,
          normalizeSwiperSettings(this.thumbSlider, {
            loop: true,
            centeredSlides: true,
            speed: 300,
          })
        );
      }
      this.customImageMain = new Swiper(this.mainSlider, normalizeSwiperSettings(this.mainSlider, {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        navigation: {
          nextEl: `.swiper-button-next-${this.dataid}`,
          prevEl: `.swiper-button-prev-${this.dataid}`,
        },
        thumbs: {
          swiper: this.customThumImage,
        },
      }));
    }
  }
}

customElements.define("custom-slider-element", CustomSlider);

class searchDrawerTrigger extends HTMLElement {
  constructor() {
    super();
    this.searchDrawer = document.querySelector("search-drawer");
    if (!this.searchDrawer) return;

    this.addEventListener("click", this.openDrawer.bind(this));
    this.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.openDrawer();
      }
    });
  }

  openDrawer() {
    this.searchDrawer.classList.add("open");
    document.querySelector("body").classList.add("no-scroll");
    setTimeout(function () {
      focusElement = document.querySelector("search-drawer-trigger");
      trapFocusElements(document.querySelector("search-drawer"));
    }, 500);
  }
}

customElements.define("search-drawer-trigger", searchDrawerTrigger);

class searchDrawer extends HTMLElement {
  constructor() {
    super();
    this.closeBtns = this.querySelectorAll("[data-close-drawer]");
    this.preSuggestions = this.querySelector("[data-suggestion-wrapper]");
    this.resultsContainer = this.querySelector("[data-result-wrapper]");
    this.loadingContainer = this.querySelector("[data-loading-wrapper]");
    this.clear = this.querySelector("[data-search-clear]");
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.closeDrawer.bind(this));
    }
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
    // if(this.drawerLayer){
    //   this.drawerLayer.addEventListener("click",this.closeDrawer.bind(this))
    // }
    this.input = this.querySelector('input[type="search"]');

    if (this.input) {
      this.input.addEventListener(
        "input",
        this.debounce((event) => {
          this.onChange(event);
        }, 300).bind(this)
      );
      if (this.clear) {
        this.clear.addEventListener(
          "click",
          function () {
            this.input.value = "";
            this.input.dispatchEvent(new Event("input", { bubbles: true }));
          }.bind(this)
        );
      }
    }
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  closeDrawer() {
    this.classList.remove("open");
    document.querySelector("body").classList.remove("no-scroll");
    if (focusElement) {
      focusElement.focus();
    }
    focusElement = "";
    removeTrapFocus();
  }
  handleKeyDown(event) {
    if (event.key === "Escape") {
      this.closeDrawer(event); // Call closeDrawer when Escape is pressed
    }
  }

  debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  onChange() {
    this.searchTerm = this.input.value.trim();
    if (this.searchTerm == "") {
      if (this.resultsContainer) {
        this.resultsContainer.classList.add("hidden");
        this.resultsContainer.innerHtml = "";
      }
      if (this.loadingContainer) {
        this.loadingContainer.classList.add("hidden");
      }
      if (this.preSuggestions) {
        this.preSuggestions.classList.remove("hidden");
      }
    } else {
      if (this.preSuggestions) {
        this.preSuggestions.classList.add("hidden");
      }
      if (this.loadingContainer) {
        this.loadingContainer.classList.remove("hidden");
      }
      this.getSearchResults();
    }
  }

  getSearchResults() {
    const queryKey = this.searchTerm.replace(" ", "-").toLowerCase();
    fetch(
      `${routes.predictive_search_url}?q=${encodeURIComponent(
        this.searchTerm
      )}&section_id=predictive-search`
    )
      .then((response) => {
        if (!response.ok) {
          console.log("error");
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, "text/html")
          .querySelector("[data-result-wrapper]").innerHTML;
        this.resultsContainer.innerHTML = resultsMarkup;
        if (this.resultsContainer) {
          this.resultsContainer.classList.remove("hidden");
        }
        if (this.loadingContainer) {
          this.loadingContainer.classList.add("hidden");
        }
      })
      .catch((error) => {
        if (error?.code === 20) {
          return;
        }
        throw error;
      });
  }
}
customElements.define("search-drawer", searchDrawer);

class searchTabWrapper extends HTMLElement {
  constructor() {
    super();
    this.searchDrawer = this.closest("search-drawer");
    if (!this.searchDrawer) return;
    this.activeTab = this.searchDrawer.querySelector(".tab-nav-link.active");
    this.activeTabContent = this.searchDrawer.querySelector(
      ".predictive-search-tab-item.active"
    );
    this.tabs = this.querySelectorAll(".tab-nav-link");
    Array.from(this.tabs).forEach(
      function (tab) {
        if (tab.classList.contains("active")) return false;
        tab.addEventListener(
          "click",
          function (event) {
            event.preventDefault();
            this.tabContent = this.searchDrawer.querySelector(tab.dataset.tab);
            if (this.tabContent) {
              this.closeExisting();
              tab.classList.add("active");
              this.tabContent.classList.add("active");
              this.tabContent.style.display = "block";
              this.activeTab = tab;
              this.activeTabContent = this.tabContent;
            }
          }.bind(this)
        );
      }.bind(this)
    );
    if (this.tabs.length > 0) {
      this.tabs[0].click();
    }
  }
  closeExisting() {
    if (this.activeTab) {
      this.activeTab.classList.remove("active");
    }
    if (this.activeTabContent) {
      this.activeTabContent.classList.remove("active");
      this.activeTabContent.style.display = "none";
    }
  }
}

customElements.define("tabs-wrapper", searchTabWrapper);

var ytplayerList;
function onPlayerReady(e) {
  var video_data = e.target.getVideoData(),
    label = video_data.video_id + ":" + video_data.title;
  e.target.ulabel = label;
}

function onPlayerError(e) {
  console.log("[onPlayerError]");
}
function onPlayerStateChange(e) {
  var label = e.target.ulabel;
  if (e["data"] == YT.PlayerState.PLAYING) {
    pauseOthersYoutubes(e.target);
  }

  if (e["data"] == YT.PlayerState.PAUSED) {
  }

  if (e["data"] == YT.PlayerState.ENDED) {
  }

  if (e["data"] == YT.PlayerState.BUFFERING) {
    e.target.uBufferingCount
      ? ++e.target.uBufferingCount
      : (e.target.uBufferingCount = 1);
    console.log({
      event: "youtube",
      action:
        "buffering[" +
        e.target.uBufferingCount +
        "]:" +
        e.target.getPlaybackQuality(),
      label: label,
    });

    if (YT.PlayerState.UNSTARTED == e.target.uLastPlayerState) {
      pauseOthersYoutubes(e.target);
    }
  }
  if (e.data != e.target.uLastPlayerState) {
    e.target.uLastPlayerState = e.data;
  }
}

function initYoutubePlayers() {
  ytplayerList = null;
  ytplayerList = [];
  for (var e = document.getElementsByTagName("iframe"), x = e.length; x--; ) {
    if (/youtube.com\/embed/.test(e[x].src)) {
      ytplayerList.push(initYoutubePlayer(e[x]));
    }
  }
}

function pauseOthersYoutubes(currentPlayer) {
  if (!currentPlayer) return;
  for (var i = ytplayerList.length; i--; ) {
    if (ytplayerList[i] && ytplayerList[i] != currentPlayer) {
      ytplayerList[i].pauseVideo();
    }
  }
  document
    .querySelectorAll(".product-media-vimeo, iframe[src*='player.vimeo.com']")
    .forEach((video) => {
      if (
        video.getAttribute("data-autoplay") == "true" ||
        video.hasAttribute("autoplay")
      )
        return false;
      video.contentWindow.postMessage('{"method":"pause"}', "*");
    });
  document.querySelectorAll("video").forEach((video) => {
    if (
      video.getAttribute("data-autoplay") == "true" ||
      video.hasAttribute("autoplay")
    )
      return false;
    video.pause();
  });
}

function initYoutubePlayer(ytiframe) {
  var ytp = new YT.Player(ytiframe, {
    events: {
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
      onReady: onPlayerReady,
    },
  });
  ytiframe.ytp = ytp;
  return ytp;
}

function onYouTubeIframeAPIReady() {
  initYoutubePlayers();
}

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function pauseVideo(section = document) {
  document.querySelectorAll("video").forEach((video) => {
    video.onplay = function (event) {
      let checkCurrent = event.target;
      document
        .querySelectorAll(
          ".product-media-vimeo, iframe[src*='player.vimeo.com']"
        )
        .forEach((video) => {
          if (
            video.getAttribute("data-autoplay") == "true" ||
            video.hasAttribute("autoplay")
          )
            return false;
          video.contentWindow.postMessage('{"method":"pause"}', "*");
        });
      document
        .querySelectorAll(
          ".product-media-youtube,.youtube-video,iframe[src*='www.youtube.com']"
        )
        .forEach((video) => {
          if (
            video.getAttribute("data-autoplay") == "true" ||
            video.hasAttribute("autoplay")
          )
            return false;
          video.contentWindow.postMessage(
            '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
            "*"
          );
        });
      document.querySelectorAll("video").forEach((video) => {
        if (
          video.getAttribute("data-autoplay") == "true" ||
          video.hasAttribute("autoplay")
        )
          return false;
        if (checkCurrent != video) {
          video.pause();
        }
      });
    };
  });
  document
    .querySelectorAll(".product-media-vimeo, iframe[src*='player.vimeo.com']")
    .forEach((video) => {
      var player = new Vimeo.Player(video);
      player.on("play", function (event) {
        let checkCurrent = event.target;

        document
          .querySelectorAll(
            ".product-media-youtube,.youtube-video,iframe[src*='www.youtube.com']"
          )
          .forEach((video) => {
            if (
              video.getAttribute("data-autoplay") == "true" ||
              video.hasAttribute("autoplay")
            )
              return false;
            video.contentWindow.postMessage(
              '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
              "*"
            );
          });
        document.querySelectorAll("video").forEach((video) => {
          if (
            video.getAttribute("data-autoplay") == "true" ||
            video.hasAttribute("autoplay")
          )
            return false;
          video.pause();
        });
        if (window.ProductModel) window.ProductModel.loadShopifyXR();
      });
    });
}
function sortClassBody() {
  const sortButton = document.querySelector(".facets-filters-sort");
  if (sortButton) {
    // Event listener for click
    sortButton.addEventListener("click", toggleSortClass);

    function toggleSortClass() {
      const body = document.querySelector("body");
      body.classList.toggle("facet-sort-filter-top");
    }
  }
}

function closeSort() {
  if (document.querySelector(".facets-filters-sort")) {
    document
      .querySelector("[data-sort-close]")
      .addEventListener("click", () => {
        const body = document.querySelector("body");
        if (body.classList.contains("facet-sort-filter-top")) {
          body.classList.remove("facet-sort-filter-top");
          document
            .querySelector(".facets-filters-sort")
            .removeAttribute("open");
        }
      });
  }
}
document.addEventListener("DOMContentLoaded", function (section = document) {
  sortClassBody();
  closeSort();
  pauseVideo();
  if (document.querySelector("[data-main-search-clear]")) {
    const clearBtn = document.querySelector("[data-main-search-clear]");
    clearBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const form = clearBtn.closest("form");
      const inputField = form?.querySelector("[data-main-search-input]");
      if (inputField) {
        inputField.value = "";
      }
    });
  }
});

class MouseCursor extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const movingCursor = this;
    const parentDrawer = this.closest(".drawer");
    parentDrawer.addEventListener("mousemove", (event) => {
      if (window.innerWidth > 1021) {
        let positionX = event.clientX;
        let positionY = event.clientY;
        movingCursor.style.transform = `translate(${positionX}px, ${positionY}px)`;
      }
    });
  }
}
customElements.define("drawer-mouse-cursor", MouseCursor);

class ProductAddToCartSticky extends HTMLElement {
  constructor() {
    super();
    this.animations_enabled =
      document.body.classList.contains("animations-true") &&
      typeof gsap !== "undefined";
  }

  connectedCallback() {
    this.setupObservers();
    this.setupToggle();
  }

  setupToggle() {
    const button = this.querySelector(".product-cart-sticky-button");
    const content = this.querySelector(".product-cart-sticky-detail");
    button.addEventListener("click", function () {
      content.classList.toggle("active");
      return false;
    });
  }

  setupObservers() {
    let _this = this;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.target === footer) {
            if (entry.intersectionRatio > 0) {
              _this.classList.remove("active");
            } else if (entry.intersectionRatio === 0 && _this.formPassed) {
              _this.classList.add("active");
            }
          }

          if (entry.target === form) {
            let boundingRect = form.getBoundingClientRect();
            if (
              entry.intersectionRatio === 0 &&
              window.scrollY > boundingRect.top + boundingRect.height
            ) {
              _this.formPassed = true;
              _this.classList.add("active");
            } else if (entry.intersectionRatio === 1) {
              _this.formPassed = false;
              _this.classList.remove("active");
            }
          }
        });
      },
      {
        threshold: [0, 1],
      }
    );

    const form = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const footer = document.querySelector("footer");

    _this.formPassed = false;
    observer.observe(form);
    observer.observe(footer);
  }
}
customElements.define("product-cart-sticky", ProductAddToCartSticky);

class BackToTop extends HTMLElement {
  constructor() {
    super();
    this.currentScrollTop = 0;
    window.addEventListener("scroll", this.onScroll.bind(this), false);
    this.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  onScroll() {
    if ((window.pageYOffset || document.documentElement.scrollTop) > 400) {
      this.classList.remove("hidden");
    } else {
      this.classList.add("hidden");
    }
  }
}

customElements.define("back-to-top", BackToTop);

class ProductCardItem extends HTMLElement {
  constructor() {
    super();
    this.initChangeItem();
  }

  initChangeItem() {
    const swatchColorElements = this.querySelectorAll(
      "[data-card-color-option]"
    );

    swatchColorElements.forEach((element) => {
      element.setAttribute("tabindex", "0");
      element.addEventListener("click", this.handleClick.bind(this, element));
      element.addEventListener(
        "keydown",
        this.handleKeyDown.bind(this, element)
      );
    });
  }

  handleClick(element) {
    const url = element.getAttribute("data-product-url");
    if (url) {
      window.location.href = `${window.location.origin}${url}`;
    }
  }

  handleKeyDown(element, event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick(element);
    }
  }
}

customElements.define("product-card-item", ProductCardItem);

class WideMediaContent extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll("[data-media-item]");
    this.activeItem = this.querySelector(`.active[data-media-item]`);
    this.initEvents();
  }

  initEvents() {
    this.items.forEach(
      function (item) {
        item.addEventListener(
          "mouseover",
          function () {
            this.updateItem(item);
          }.bind(this)
        );
        item.addEventListener(
          "focus",
          function () {
            this.updateItem(item);
          }.bind(this)
        );
      }.bind(this)
    );
  }
  updateItem(item) {
    if (item.classList.contains("active")) return;
    if (this.activeItem) {
      this.activeItem.classList.remove("active");
    }
    item.classList.add("active");
    this.activeItem = item;
  }
}

customElements.define("wide-media-content", WideMediaContent);

class hoverMediaContent extends HTMLElement {
  constructor() {
    super();
    this.items = this.querySelectorAll("[data-media-header]");
    this.activeItem = this.querySelector(`.active[data-media-item]`);
    this.initEvents();
  }

  initEvents() {
    this.items.forEach(
      function (item) {
        item.addEventListener(
          "click",
          function () {
            this.updateItem(item);
          }.bind(this)
        );

        item.addEventListener(
          "keydown",
          function (e) {
            if (
              e.code === "Enter" ||
              e.code === "Space" ||
              e.code === "NumpadEnter"
            ) {
              e.preventDefault();
              this.updateItem(item);
            }
          }.bind(this)
        );
      }.bind(this)
    );
  }
  updateItem(item) {
    if (item.classList.contains("active")) return;
    if (this.activeItem) {
      this.activeItem
        .querySelector("[data-media-header]")
        .setAttribute("tabindex", "0");
      if (this.activeItem.querySelector("a")) {
        this.activeItem.querySelector("a").setAttribute("tabindex", "-1");
      }
      this.activeItem.classList.remove("active");
    }
    item.closest("[data-media-item]").classList.add("active");
    this.activeItem = item.closest("[data-media-item]");
    item.removeAttribute("tabindex");
    if (this.activeItem.querySelector("a")) {
      this.activeItem.querySelector("a").setAttribute("tabindex", "0");
      this.activeItem.querySelector("a").focus();
    }
  }
}

customElements.define("hover-media-content", hoverMediaContent);

class NewsletterForm extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input[name='contact[email]']");
    this.form = this.querySelector("form");
    this.message = this.querySelector(".form-message__wrapper-email");
    this.submitBtn = this.querySelector(`[type="submit"]`);
    this.pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.initEvents();
  }

  initEvents() {
    this.input.addEventListener(
      "input",
      function () {
        let value = this.input.value.trim();
        this.pattern.test(value)
          ? ((this.message.style.display = "none"),
            (this.submitBtn.disabled = !1))
          : ((this.message.style.display = "flex"),
            (this.submitBtn.disabled = !0));
      }.bind(this)
    );
    this.submitBtn.addEventListener(
      "submit",
      function (e) {
        let value = this.input.value.trim();
        this.pattern.test(value) ||
          (e.preventDefault(),
          (this.message.style.display = "flex"),
          (this.submitBtn.disabled = !0));
      }.bind(this)
    );
  }
}

customElements.define("newsletter-form", NewsletterForm);
