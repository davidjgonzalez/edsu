import { buildBlock } from "./aem.js";

export default function autoblock(main) {
  hero(main);
}

function hero(main) {
  const el = main.querySelector(":scope > div > h1");

  const header = el;
  const paragraph = header?.nextElementSibling;
  let picture = paragraph?.nextElementSibling;

  if (picture?.nodeName === "P") {
    picture = picture.firstElementChild;
  }

  if (header && paragraph && picture) {
    const section = document.createElement("div");
    section.append(buildBlock("hero", { elems: [header, paragraph, picture] }));
    main.prepend(section);
  }
}
