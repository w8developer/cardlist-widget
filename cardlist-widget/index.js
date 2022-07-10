(async function widget() {
  /**
   * Load the widget's configuration with the provided url.
   *
   * @param {string} url - url to fetch
   * @returns {Promise<Record<string, ang>>} - widget config
   */
  const getConfig = async (url) => {
    const response = await fetch(url);
    const config = await response.json();

    return config;
  };

  /**
   * Load css dynamically.
   *
   * @param {string} css - url to load
   */
  const loadStyle = (css) => {
    if (!css) {
      return;
    }

    const allLinks = document.querySelectorAll("link");

    const exists = Array.from(allLinks).some((link) => {
      return link.href === css;
    });

    if (exists) {
      return;
    }

    const link = document.createElement("link");

    let res, rej;

    const action = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });

    link.rel = "stylesheet";
    link.href = css;

    link.onload = () => {
      res();
    };

    link.onerror = () => {
      rej();
    };

    document.head.appendChild(link);

    return action;
  };

  /**
   * Render spin when loading resources.
   *
   * @param {boolean} status - show or hide spin.
   */
  const displaySpin = (status) => {
    const el = document.querySelector("#spin");

    el.style.display = status ? "block" : "none";
  };

  /**
   * Render the widget to the provided element.
   *
   * @param {string} id - id of the element to render to
   * @param {Record<string,string>[]} data - data to render
   */
  const getView = (id, data) => {
    const items = data
      .map(
        (item, index) => `
      <div class="col-12 col-lg-4 my-0 my-sm-3 my-lg-0 px-5">
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-12 d-flex text-center text-lg-start ${
            index % 2 ? "order-sm-1" : ""
          }">
            <div class="home__cover">
              <img class="card-img" src="${item.cover}" />
            </div>
          </div>
          <div class="col-12 col-sm-6 col-lg-12">
            <h2 class="my-4">${item.title}</h2>
            <p>${item.subtitle}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");
    const html = `
      <link rel="stylesheet" href="/cardlist-widget/index.css" />
      <div class="container overflow-hidden my-5">
        <div class="row gx-5">
          ${items}
        </div>
      </div>
    `;

    const element = document.getElementById(id);

    element.innerHTML = html;
  };

  const widgetID = document.currentScript.dataset.id;
  const configPath = document.currentScript.dataset.config;

  displaySpin(true);

  const config = await getConfig(configPath);

  await loadStyle(config.bootstrapCDN);

  displaySpin(false);

  getView(widgetID, config.data);
})();
