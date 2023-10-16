import { addMatchMediaListener } from '../../scripts/responsive.js';

function html(tabs = []) {
  const blockId = `code-tabs__${crypto.randomUUID()}`;

  return `
        <!-- Vertical accordian layout for small screens -->
        <div class="vertical" data-js-small-screen>

        ${tabs
            .map((tab, i) => `
                        <button 
                            id="${`${blockId}__vertical__control__${i}`}"
                            aria-controls="${`${blockId}__vertical__content__${i}`}" 
                            aria-expanded="${i === 0}"
                            class="tab"
                            data-js-tab="${i}">${tab.title}</button>
                        <section 
                              id="${`${blockId}__vertical__content__${i}`}"                               
                              role="region"                                              
                              aria-hidden="${i !== 0}"
                              aria-label="${tab.title}"
                              class="content"
                              data-js-tab-content="${i}">
                          <div class="description"${tab.description}</div>
                          <div class="code"><pre><code>${tab.code}</code></pre></div>
                        </section>
                `).join("")}
        </div>
          
        <!-- Horizontal tab layout for large screens -->
        <div class="horizontal" data-js-large-screen>
          <nav role="tablist" aria-orientation="vertical" aria-multiselectable="false" class="tabs">
          ${tabs
            .map(
              (tab, i) => `
              <button                 
                  id="${`${blockId}__horizontal__control__${i}`}"
                  role="tab"
                  aria-controls="${`${blockId}__horizontal__content__${i}`}"                
                  aria-selected="${i === 0}"
                  class="tab"
                  data-js-tab="${i}">${tab.title}</button>`
                )
            .join("")}
          </nav>

              ${tabs.map((tab, i) => `
                      <section 
                              id="${`${blockId}__horizontal__content__${i}`}"
                              role="tabpanel"
                              aria-hidden="${i !== 0}"
                              class="content"
                              data-js-tab-content="${i}">
                          <p class="title" 
                              data-js-tab-control="${i}">${tab.title}</p>
                          <div class="description" 
                               data-js-description>${tab.description}</div>
                          <div class="code" data-js-code>
                            <pre><code>${tab.code}</code></pre>
                          </div>
                      </section> 
                  `
                )
                .join("")}
          </div>
          `;
}

/**
 * Add event listeners to the block to handle click events and showing/hiding relevant code.
 * @param {*} block the block DOM to decorate
 */
function addTabClickListener(block) {
  const tabs = [
    ...block.querySelectorAll(":scope [data-js-tab]"),
  ];
  const tabContents = [
    ...block.querySelectorAll(":scope [data-js-tab-content]"),
  ];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update the data-js-tab-control elements to have correct aria-selected state        
      const tabId = tab.dataset.jsTab;

      tabs.forEach((el) => { 
        el.setAttribute("aria-selected", false);
        el.setAttribute("aria-expanded", false);
      });

      // Ensure aria-selected="true" on both large/small screen views of this block
      block.querySelectorAll(`[data-js-tab="${tabId}"]`).forEach((el) => { 
        el.setAttribute("aria-selected", true); 
        el.setAttribute("aria-expanded", true);
      });
    
      // Update all data-js-tab-content to be hidden
      tabContents.forEach((el) => { el.setAttribute("aria-hidden", true); });
      // And show all data-js-tab-content mapped to the selected tab id
      block.querySelectorAll(`[data-js-tab-content="${tabId}"]`).forEach((el) => el.setAttribute("aria-hidden", false));
    });
  });
}

/**
 * AEM block decorator.
 * @param {*} block 
 */
export default function decorate(block) {
  // Get the content from the block
  const content = [...block.querySelectorAll(":scope > div")].map((row) => {
    return {
      title: row.querySelector(":scope > div:first-child > h2,h3,h4")
        .textContent,
      description: [...row.querySelectorAll(":scope > div:first-child > p")]
        .map((p) => p.outerHTML)
        .join(""),
      code: row.querySelector(":scope > div:last-child code").textContent,
    };
  });

  // Set the block to constructed HTML
  block.innerHTML = html(content);

  // Add event listeners to the block
  addTabClickListener(block);

  // Attach default matchMedia listener as small/large screens use different HTML to render the experience.
  addMatchMediaListener(block);
}
