// https://support.glitch.com/t/tutorial-how-to-force-https/16669/2

if (location.protocol != "https:") {
  location.href =
    "https:" + window.location.href.substring(window.location.protocol.length);
}

$(function(){
  // navigation tools
  
  $(window).on('mousemove touchmove', (e) => {
    // code inspired from https://codepen.io/whipcat/pen/ExKPQqZ
    
    let eye = $('.eye-container .eye .eye-ball');
    
    $(".eye-ball").on('mouseenter touchenter', function() {
      $(this).addClass('iris-center')
    });
    
    $(".eye-ball").on('mouseleave touchend', function() {
      $(this).removeClass('iris-center')
    });
    
    this.x = (eye.offset().left) + (eye.width() / 2);
    this.y = (eye.offset().top) + (eye.height() / 2);
    this.rad = Math.atan2(e.pageX - this.x, e.pageY - this.y);
    this.rot = (this.rad * (180 / Math.PI) * -1) + 180;
    $(".eye-container .eye .eye-ball").css("transform", `rotate(${this.rot}deg)`);
  });
  
  $(window).scroll(function (e) {
    this.dim = $("#nav")[0].getBoundingClientRect();

    $("#nav").css("top", this.dim.top - (this.scrollY - this.oldScroll) + "px");

    if (this.oldScroll > this.scrollY) {
      if (this.dim.top >= 0) {
        $("#nav").css("top", 0 + "px");
      }
    } else {
      if (this.dim.top <= -this.dim.height) {
        $("#nav").css("top", -this.dim.height + "px");
      }
    }

    this.oldScroll = this.scrollY;
  });
  
  $(window).resize(function() {
    if ($(this).width() > 600) {
      $(".nav .nav-items").css('display', 'flex')
    }
  });
  
  $(".nav-toggle").click(function (e) {
    if ($(".nav-items").is(":hidden")) {
      $(".nav-items").css("display", "flex");
      $(".hamburger-icon").addClass("active");
    } else {
      $(".nav-items").hide();
      $(".hamburger-icon").removeClass("active");
    }

      if (document.body.clientWidth <= 600) {
        $("#nav").css("top", 0 + "px");
      }
  });
});

class Ripple {
  constructor(button) {
    this.button = button;

    this.rippleColor = JSON.parse(this.button.getAttribute("ripple-hsl"));

    if (this.rippleColor) {
      // https://stackoverflow.com/a/11371599/16557976  -- Thanks! 🙏

      let css = `
        .ripple[ripple-hsl="[${this.rippleColor[0]}, ${this.rippleColor[1]}, ${this.rippleColor[2]}]"]:hover {
          background-color: hsla(${this.rippleColor[0]}, ${this.rippleColor[1]}%, ${this.rippleColor[2]}%,0.1) !important;
        }
        
        .ripple[ripple-hsl="[${this.rippleColor[0]}, ${this.rippleColor[1]}, ${this.rippleColor[2]}]"]:focus {
          box-shadow: 0 0 0 1pt hsla(${this.rippleColor[0]}, ${this.rippleColor[1]}%, ${this.rippleColor[2]}%, 0.35) !important;
        }
      `;

      let style = document.createElement("style");

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      document.getElementsByTagName("head")[0].appendChild(style);
    }

    this.rippleFadeDelay = 600;

    // desktop
    
    this.button.addEventListener("mousedown", (e) => {
      this.rippleEnter(e);
    });

    this.button.addEventListener("mouseup", (e) => {
      this.rippleLeave(e);
    });

    this.button.addEventListener("mouseleave", (e) => {
      this.rippleLeave(e);
    });
    
    // touch
    
    this.button.addEventListener("touchstart", (e) => {
      this.rippleEnter(e);
    });

    this.button.addEventListener("touchend", (e) => {
      this.rippleLeave(e);
    });

    this.button.addEventListener("touchleave", (e) => {
      this.rippleLeave(e);
    });
  }

  rippleEnter(e) {
    this.getRipplesNotLeave();

    this.clientX = e.clientX ? e.clientX : e.touches[0].clientX;
    this.clientY = e.clientY ? e.clientY : e.touches[0].clientY;

    this.dim = this.calcDim();
    this.circle = document.createElement("span");
    this.diameter = Math.max(this.button.clientWidth, this.button.clientHeight);
    this.radius = this.diameter / 2;

    this.x = `${this.clientX - this.dim.left.toFixed(0) - this.radius}px`;
    this.y = `${this.clientY - this.dim.top.toFixed(0) - this.radius}px`;
    this.centerX = `${this.dim.width / 2}px`;
    this.centerY = `${this.dim.height / 2}px`;

    if (this.clientX === 0 && this.clientY === 0) {
      this.x = `${this.dim.width / 2 - this.radius}px`;
      this.y = `${this.dim.height / 2 - this.radius}px`;
    }

    this.circle.style.width = this.circle.style.height = `${this.diameter}px`;
    this.circle.style.left = this.x;
    this.circle.style.top = this.y;
    this.circle.classList.add("_ripple--enter");

    if (this.rippleColor) {
      this.circle.style.backgroundColor = `hsla(${this.rippleColor[0]}, ${this.rippleColor[1]}%, ${this.rippleColor[2]}%, 0.3)`;
    }

    this.button.appendChild(this.circle);
  }

  rippleLeave(e) {
    this.getRipplesNotLeave();
    this.removeRipples();
  }

  getRipplesNotLeave() {
    let ripples = this.button.querySelectorAll(
      "._ripple--enter:not(._ripple--leave)"
    );
    ripples.forEach((ripple) => {
      ripple.classList.add("_ripple--leave");
    });
  }

  calcDim() {
    return this.button.getBoundingClientRect();
  }

  removeRipples() {
    let ripples = this.button.querySelectorAll("._ripple--leave");

    ripples.forEach((ripple) => {
      ripple.addEventListener("animationend", function () {
        ripple.remove();
      });
    });
  }
}

let buttons = document.querySelectorAll(".ripple");

buttons.forEach((button) => {
  new Ripple(button);
});

// Light ☀ / Dark 🌙 Mode Function

let Scheme = (function () {
  function getScheme() {
    if (["light", "dark"].indexOf(localStorage.getItem("theme-mode")) > -1) {
      return localStorage.getItem("theme-mode");
    } else {
      if (window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }

        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          return "light";
        }
      } else {
        return "light";
      }
    }
  }

  function setScheme(color) {
    localStorage.setItem("theme-mode", color);

    if (getScheme() === "dark") {
      let stylesheet = document.createElement("link");
      stylesheet.setAttribute("href", "dark.css");
      stylesheet.setAttribute("type", "text/css");
      stylesheet.setAttribute("id", "dark-mode");
      stylesheet.setAttribute("rel", "stylesheet");
      document.head.append(stylesheet);
    }

    if (getScheme() === "light") {
      let stylesheet = document.getElementById("dark-mode");

      if (stylesheet) {
        stylesheet.remove();
      }
    }
  }

  setScheme(getScheme());

  let colorSchemeInput = document.getElementById("colorSchemeInput");
  let colorSchemeButton = document.getElementById("colorSchemeButton");
  let icon = colorSchemeButton.querySelector(".fa-solid");

  if (getScheme() === "dark") {
    colorSchemeInput.checked = true;
  }

  if (colorSchemeInput.checked) {
    icon.classList.add("fa-sun");
  } else {
    icon.classList.add("fa-moon");
  }

  colorSchemeButton.addEventListener("click", function () {
    if (colorSchemeInput.checked) {
      setScheme("light");
      icon.classList.add("fa-moon");
      icon.classList.remove("fa-sun");
    } else {
      setScheme("dark");
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  });

  return {
    getScheme,
    setScheme,
  };
})();

new TypeIt("#heading-main", {
  speed: 80,
  startDelay: 900,
})
  .type("Select an Artifact.", { delay: 500 })
  .go();
