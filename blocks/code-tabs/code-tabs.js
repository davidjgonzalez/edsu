import { addMatchMediaListener } from '../../scripts/responsive.js';

function html(tabs = []) {
  const blockId = `code-tabs__${crypto.randomUUID()}`;

  return `
        <!-- Vertical layout for small screens -->
        <div class="vertical" data-js-small-screen role="tablist" aria-orientation="vertical" aria-multiselectable="false" aria-label="Code tabs">
          ${tabs
            .map((tab, i) => `
                        <button 
                            data-js-tab="${i}" 
                            class="tab" 
                            role="tab"
                            id="${`${blockId}__vertical__tab__${i}`}"
                            aria-controls="${`${blockId}__vertical__tabpanel__${i}`}" 
                            aria-selected="${i === 0}">${tab.title}</button>

                        <div 
                              data-js-tab-content="${i}" 
                              class="content"
                              id="${`${blockId}__vertical__tabpanel__${i}`}" 
                              role="tabpanel" 
                              aria-hidden="${i !== 0}">
                          <div class="description"${tab.description}</div>
                          <div class="code"><pre><code>${tab.code}</code></pre></div>
                        </div>
                `).join("")}
        </div>
          
        <!-- Horizontal layout for large screens -->
        <div class="horizontal" data-js-large-screen>
          <nav class="tabs" role="tablist" aria-orientation="vertical" aria-multiselectable="false" aria-label="Code tabs">
                  ${tabs
                    .map(
                      (tab, i) => `
                      <button 
                          class="tab" 
                          role="tab"
                          aria-controls="${`${blockId}__horizontal__${i}`}"
                          data-js-tab="${i}" 
                          aria-selected="${i === 0}">${tab.title}</button>`
                        )
                    .join("")}
          </nav>

              ${tabs
                .map(
                  (tab, i) => `
                      <section class="content" 
                              role="tabpanel"
                              id="${`${blockId}__horizontal__${i}`}"
                              data-js-tab-content="${i}"
                              aria-hidden="${i !== 0}">
                          <h4 class="title" 
                              data-js-tab-control="${i}">${tab.title}</h4>
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
      tabs.forEach((el) => el.setAttribute("aria-selected", false));
      // Ensure aria-selected="true" on both large/small screen views of this block
      block.querySelectorAll(`[data-js-tab="${tabId}"]`).forEach((el) => el.setAttribute("aria-selected", true));
    
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
