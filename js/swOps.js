function invokeServiceWorkerUpdateFlow(registration) {
  let label = document.createElement("span");
  label.textContent = "Hay una nueva version disponible. ";

  let updateButton = document.createElement("a");
  updateButton.id = "check";
  updateButton.textContent = "Actualizar ahora";
  updateButton.addEventListener("click", () => {
    console.log("Updating to new version");
    registration.waiting.postMessage("SKIP_WAITING");
  });

  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.appendChild(label);
  wrapper.appendChild(updateButton);

  let newVersionToast = document.createElement("div");
  newVersionToast.className = "new-version-toast";
  newVersionToast.appendChild(wrapper);

  document.getElementsByTagName("app")[0].prepend(newVersionToast);
}

// check if the browser supports serviceWorker at all
if ("serviceWorker" in navigator) {
  // wait for the page to load
  window.addEventListener("load", async () => {
    // register the service worker from the file specified
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );

    // ensure the case when the updatefound event was missed is also handled
    // by re-invoking the prompt when there's a waiting Service Worker
    if (registration.waiting) {
      invokeServiceWorkerUpdateFlow(registration);
    }

    // detect Service Worker update available and wait for it to become installed
    registration.addEventListener("updatefound", () => {
      if (registration.installing) {
        // wait until the new Service worker is actually installed (ready to take over)
        registration.installing.addEventListener("statechange", () => {
          if (registration.waiting) {
            // if there's an existing controller (previous Service Worker), show the prompt
            if (navigator.serviceWorker.controller) {
              invokeServiceWorkerUpdateFlow(registration);
            } else {
              // otherwise it's the first install, nothing to do
              console.log("Service Worker initialized for the first time");
            }
          }
        });
      }
    });

    let refreshing = false;

    // detect controller change and refresh the page
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  });
}
