const breakpoints = {
  large: getComputedStyle(document.documentElement).getPropertyValue(
    "--large-breakpoint"
  ),
};

function defaultCallback(block, matches) {
  block.querySelectorAll("[data-js-large-screen]").forEach((el) => {
    el.setAttribute("aria-hidden", !matches);
  });

  block.querySelectorAll("[data-js-small-screen]").forEach((el) => {
    el.setAttribute("aria-hidden", matches);
  });
}

export function addMatchMediaListener(block, callback = defaultCallback) {
  const mql = window.matchMedia(`(min-width: ${breakpoints.large})`);

  mql.addEventListener("change", (e) => {
    // When viewport is resized
    callback(block, e.matches);
  });

  // Initial page load
  callback(block, mql.matches);
}
