document.addEventListener('DOMContentLoaded', function () {
    // Check if a form with class 'wpcf7-form' exists on the page
    if (document.querySelector('form.wpcf7-form')) {
        // Load Google reCAPTCHA script
        var recaptchaScript = document.createElement('script');
        recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
        recaptchaScript.async = true;
        recaptchaScript.defer = true;
        document.head.appendChild(recaptchaScript);

        // Load Contact Form 7 reCAPTCHA script
        var wpcf7RecaptchaScript = document.createElement('script');
        wpcf7RecaptchaScript.src = '/wp-includes/js/wpcf7-recaptcha.js'; // Adjust path if needed
        wpcf7RecaptchaScript.async = true;
        document.head.appendChild(wpcf7RecaptchaScript);
    }
});

// Function to set cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// Function to get cookies
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// Function to store UTM data & capture first/last page visit
function storeAttributionData() {
    let searchParams = new URLSearchParams(window.location.search);

    let attribution = {
        'utm_source': searchParams.get('utm_source') || getCookie('utm_source'),
        'utm_medium': searchParams.get('utm_medium') || getCookie('utm_medium'),
        'utm_campaign': searchParams.get('utm_campaign') || getCookie('utm_campaign'),
        'utm_content': searchParams.get('utm_content') || getCookie('utm_content'),
        'utm_term': searchParams.get('utm_term') || getCookie('utm_term'),
        'utm_referral': searchParams.get('utm_referral') || getCookie('utm_referral'), // <-- added
        'gclid': searchParams.get('gclid') || getCookie('gclid'),
        'gbraid': searchParams.get('gbraid') || getCookie('gbraid'),
        'mklid': searchParams.get('mklid') || getCookie('mklid')
    };

    // Store UTM and click IDs as cookies (for 90 days)
    Object.keys(attribution).forEach(key => {
        if (attribution[key]) {
            setCookie(key, attribution[key], 90);
        }
    });

    // Store first landing page (lpage) if not already set
    if (!getCookie('lpage')) {
        let landingPage = window.location.href;
        setCookie('lpage', landingPage, 90);
        console.log(`🌍 First landing page (lpage) set: ${landingPage}`);
    } else {
        console.log(`🔄 First landing page (lpage) already exists: ${getCookie('lpage')}`);
    }

    // Store current page as conversion page (cpage) - ALWAYS UPDATE
    let currentPage = window.location.href;
    setCookie('cpage', currentPage, 1);
    console.log(`✅ Conversion page (cpage) set: ${currentPage}`);

    console.log("✅ Attribution Data Stored:", attribution);
}

// Function to retrieve stored attribution data, including lpage & cpage
function getAttributionData() {
    let attribution = {
        'utm_source': getCookie('utm_source'),
        'utm_medium': getCookie('utm_medium'),
        'utm_campaign': getCookie('utm_campaign'),
        'utm_content': getCookie('utm_content'),
        'utm_term': getCookie('utm_term'),
        'utm_referral': getCookie('utm_referral'), // <-- added
        'gclid': getCookie('gclid'),
        'gbraid': getCookie('gbraid'),
        'mklid': getCookie('mklid'),
        'lpage': getCookie('lpage'),  // First landing page
        'cpage': getCookie('cpage')   // Current conversion page
    };

    console.log("📌 Retrieved Attribution Data:", attribution);
    return attribution;
}

// Function to update Zoho Form iframe BEFORE it loads
function updateZohoFormIframesBeforeLoad() {
    let iframes = document.querySelectorAll("iframe[src*='zoho']");

    if (iframes.length === 0) {
        console.warn("⚠ No Zoho Forms found on the page.");
        return;
    }

    let attribution = getAttributionData();

    iframes.forEach((iframe) => {
        let originalSrc = iframe.getAttribute("src");
        if (!originalSrc) {
            console.warn("⚠ No src attribute found on iframe:", iframe);
            return;
        }

        let url = new URL(originalSrc, window.location.origin);

        // Append UTM, landing page & conversion page data
        Object.keys(attribution).forEach(param => {
            if (attribution[param]) {
                url.searchParams.set(param, attribution[param]);
            }
        });

        console.log("🔄 Final Zoho Form iframe URL:", url.toString());
        iframe.setAttribute("src", url.toString());
    });
}

// Function to detect and replace Zoho Forms before they load (for lazy-loaded forms)
function observeZohoFormInsertion() {
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === "IFRAME" && node.src.includes("zoho")) {
                    console.log("🔄 New Zoho Form detected before load, updating...");
                    updateZohoFormIframesBeforeLoad();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Function to ensure Zoho Forms update before loading
function waitForZohoIframeBeforeLoad(retries = 10) {
    let iframe = document.querySelector("iframe[src*='zoho']");

    if (!iframe && retries > 0) {
        console.warn(`⌛ Waiting for Zoho Form to load... (${retries} retries left)`);
        setTimeout(() => waitForZohoIframeBeforeLoad(retries - 1), 1000);
    } else if (iframe) {
        updateZohoFormIframesBeforeLoad();
    } else {
        console.error("🚨 Zoho Form NOT found after all retries.");
    }
}

// Run attribution setup & update iframes before they load
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Running Zoho Form UTM Attribution Script...");
    storeAttributionData(); // Store UTM + landing/conversion pages
    waitForZohoIframeBeforeLoad();
    observeZohoFormInsertion();
});
