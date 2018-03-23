document.body.appendChild(document.createElement('app-root'));

script = document.createElement('script');
script.async = false;
script.src = "http://localhost:4200/inline.bundle.js";
document.head.appendChild(script);

script = document.createElement('script');
script.async = false;
script.src = "http://localhost:4200/polyfills.bundle.js";
document.head.appendChild(script);

script = document.createElement('script');
script.async = false;
script.src = "http://localhost:4200/styles.bundle.js";
document.head.appendChild(script);

script = document.createElement('script');
script.async = false;
script.src = "http://localhost:4200/vendor.bundle.js";
document.head.appendChild(script);

script = document.createElement('script');
script.async = false;
script.src = "http://localhost:4200/main.bundle.js";
document.head.appendChild(script);
