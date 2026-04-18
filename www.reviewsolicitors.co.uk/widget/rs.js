(function (rs) {
    var endpointUrl = 'https://www.reviewsolicitors.co.uk/';
    // var endpointUrl = 'http://localhost:8080/';
    // var endpointUrl = 'http://solicitors.ygg-prod.prevs.net/';

    var widgetUrl = endpointUrl + 'widget/';

    var mobileScaleFactor = 0.75;
    var floatingWidgetOpened = false;

    // for local testing outside of spring boot
    if (widgetUrl.indexOf('hostport') > 0) {
        widgetUrl = 'http://localhost:8080/widget/';
        rs.local = true;
    }
    rs.isMobile = function () {
        var isMobile = false;
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
                navigator.userAgent
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                navigator.userAgent.substr(0, 4)
            ) ||
            window.screen.width < 768
        ) {
            isMobile = true;
        }
        return isMobile;
    };

    rs.getScaleFactor = function () {
        if (rs.isMobile()) {
            return mobileScaleFactor;
        } else {
            return 1;
        }
    };

    rs.log = function (mess) {
        if (widgetUrl.indexOf('localhost') < 0) return;
        if (window.console) console.log(mess);
        //else
        //alert(mess);
    };

    rs.logLoad = function (firmId, widgetName) {
        if (
            !/bingbot/i.test(navigator.userAgent) &&
            (!document.referrer || !(document.referrer.indexOf('reviewsolicitors.co.uk/solicitor') > 0))
        )
            postAjax(widgetUrl + 'widgetLoad/' + firmId + '/' + widgetName + '/');
    };

    rs.logOpen = function (firmId, widgetName) {
        if (!floatingWidgetOpened && (!document.referrer || !(document.referrer.indexOf('reviewsolicitors.co.uk') > 0))) {
            postAjax(widgetUrl + 'widgetOpen/' + firmId + '/' + widgetName + '/');
            floatingWidgetOpened = true;
        }
    };

    rs.insertIframe = function (id, holderId, srcUrl, width, visibility, widgetType) {
        var rsiframe = document.createElement('iframe');
        rsiframe.style.visibility = visibility;
        rsiframe.id = id;
        rsiframe.name = id;
        rsiframe.frameBorder = '0px';
        rsiframe.style.border = '0px';
        rsiframe.title = 'ReviewSolicitors';
        rsiframe.style.overflow = 'hidden';
        if (widgetType === 'horizontal-3-panel') rsiframe.style.height = 'inherit';
        if (width) {
            rsiframe.style.width = width * rs.getScaleFactor() + 'px';
        } else {
            rsiframe.style.width = '100%';
        }

        if (widgetType === 'lyons-bowe') {
            document.head.insertAdjacentHTML("beforeend", `<style>
                .rswidget iframe { height: 1160px}
                @media screen and (min-width: 768px) { .rswidget iframe { height: 890px !important;}}
                @media screen and (min-width: 1040px) { .rswidget iframe { height: 870px !important;}}
                @media screen and (min-width: 1440px) { .rswidget iframe { height: 640px !important;}}
            }</style>`)
        }

        rsiframe.scrolling = 'no';
        rsiframe.src = srcUrl;
        return rsiframe;
    };

    rs.widgetLoaded = function (e) {
        try {
            var jsonObj = JSON.parse(e.data);
        } catch (e) {
            return;
        }
        // magic string to detect RS widget, avoid risk of any Chrome security errors and more flexible than e.origin
        if (jsonObj.rs != 'rs') return;

        var id = jsonObj.windowName;

        rs.log('rs widget iframe content loaded for: ' + id);
        var iframe = document.getElementById(id);
        if (iframe) {
            iframe.style.height = jsonObj.height + 'px';
            if (jsonObj.requestShow) {
                iframe.style.display = 'block';
                iframe.style.visibility = 'visible';
            }
        }
    };

    rs.getIframeForId = function (iframeId) {
        //IE
        var frame = window.frames[iframeId];
        if (frame) return frame;

        for (var x = 0; x < window.frames.length; x++) {
            if (window.frames[x].name == iframeId) {
                frame = window.frames[x];
                break;
            }
        }
        return frame;
    };

    var buildWidgetUrl = function (widgetName, firmId, props) {
        if (typeof props == 'string') props = JSON.parse(props);
        var base = widgetUrl + widgetName + '/' + firmId + '/?';
        for (var key in props) {
            base += key + '=' + props[key] + '&';
        }
        return base;
    };

    rs.insertCSS = function (stylesheetUrl, node) {
        var existingLinkElements = document.querySelectorAll('link');
        var documentContainsStylesheet;

        for (var i = 0; i < existingLinkElements.length; i++) {
            if (existingLinkElements[i].href === stylesheetUrl) {
                documentContainsStylesheet = true;
            }
        }

        if (documentContainsStylesheet) return;

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.media = 'all';
        link.href = stylesheetUrl;
        document.head.insertBefore(link, node);
    };

    rs.insertScript = function (scriptSrc, node) {
        var existingScriptElements = document.querySelectorAll('script');
        var documentContainsScript;

        for (var j = 0; j < existingScriptElements.length; j++) {
            if (existingScriptElements[j].src === scriptSrc) {
                documentContainsScript = true;
            }
        }

        if (documentContainsScript) return;

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptSrc;
        document.head.insertBefore(script, node);
    };

    rs.getWidgetHtml = function (requestUrl, callback) {
        var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                    callback(xhttp.responseText);
                }
            }
        };

        xhttp.open('GET', requestUrl);
        xhttp.send();
    };

    rs.buildScript = function (url, widgetUrl, endpointUrl, elementId, widgetName, firmId, props) {
        var propsScript = document.createElement('script');
        propsScript.id = 'rs-propsscript-' + firmId + '-' + widgetName;
        propsScript.type = 'text/javascript';
        propsScript.innerHTML =
            'var rsWidgetUrl' +
            widgetName +
            ' = ' +
            "'" +
            widgetUrl +
            "'; " +
            'var rsEndpointUrl' +
            widgetName +
            ' = ' +
            "'" +
            endpointUrl +
            "'; " +
            'var rsElementId' +
            widgetName +
            ' = ' +
            "'" +
            elementId +
            "'; " +
            'var rsWidgetName' +
            widgetName +
            ' = ' +
            "'" +
            widgetName +
            "'" +
            '; ' +
            'var rsFirmId' +
            widgetName +
            ' = ' +
            firmId +
            '; ' +
            'var rsProps' +
            widgetName +
            ' = ' +
            JSON.stringify(props) +
            '; ';
        console.log(propsScript.innerHTML);
        document.head.appendChild(propsScript);

        var rsScript = document.createElement('script');
        rsScript.type = 'text/javascript';
        rsScript.src = url;
        rsScript.defer = true;
        document.head.appendChild(rsScript);
    };

    rs.loadWidget = function (elementId, widgetName, firmId, props) {
        rs.logLoad(firmId, widgetName);


        // LEGACY IMPLEMENTATIONS
        if (widgetName === 'carousel') {
            rs.buildScript(
                endpointUrl + 'widget/rs-widget-carousel.js',
                widgetUrl,
                endpointUrl,
                elementId,
                widgetName,
                firmId,
                props
            );
            return;
        }

        if (widgetName === 'sideLegacy') {
            widgetName = 'side';
            rs.buildScript(
                endpointUrl + 'widget/rs-widget-side.js',
                widgetUrl,
                endpointUrl,
                elementId,
                widgetName,
                firmId,
                props
            );
            return;
        }

        if (widgetName === 'side') {
            widgetName = 'sideNew';
            rs.buildScript(
                endpointUrl + 'widget/rs-widget-sideNew.js',
                widgetUrl,
                endpointUrl,
                elementId,
                widgetName,
                firmId,
                props
            );
            return;
        }

        if (widgetName === 'overlay') {
            rs.buildScript(
                endpointUrl + 'widget/rs-widget-overlay.js',
                widgetUrl,
                endpointUrl,
                elementId,
                widgetName,
                firmId,
                props
            );
            return;
        }

        if (widgetName === 'bottom') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-bottom.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'estas') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-estas.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        // **NEW WIDGETS**

        if (widgetName === 'emailfooter') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-emailFooter.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'single_review_horizontal') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-single_review_horizontal.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'curved_footer') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-curvedFooter.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'horizontalLineSeparation') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-horizontalLineSeparation.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'review_title_highlight_scroller') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-review_title_highlight_scroller.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'reviewUsOn') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-reviewUsOn.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'qualityIndicators') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-quality_indicators.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'ranking') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-ranking.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'starRatingSummary') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-starRatingSummary.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'detailed') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-detailed.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'halfPage') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-half_page.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'topBorder') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-topBorder.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'fullWidthBlack') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-fullWidthBlack.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'dropdownCarousel') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-dropdownCarousel.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'skyscraper') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-skyscraper.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'masonry') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-masonry.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'clientAssist') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-clientAssist.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        if (widgetName === 'individualSolicitor') {
            rs.buildScript(endpointUrl + 'widget/rs-widget-individualSolicitor.js', widgetUrl, endpointUrl, elementId, widgetName, firmId, props);
            return;
        }

        var floating = false;
        if (widgetName == 'dropdown' || widgetName == 'carousel') {
            props['float'] = 'bottom';
            floating = true;
        } else if (widgetName == 'side') {
            bottomPos = props['bottom'] == null ? 209 : props['bottom'];
            if (props['dashboard'] != true && props['defaultposition'] != false) {
                // Move the div to the end of the body outside other divs
                rsFrame = document.getElementById(elementId);
                document.body.appendChild(rsFrame);
                rsFrame.style.position = 'fixed';
                rsFrame.style.right = '0px';
                rsFrame.style.bottom = bottomPos * rs.getScaleFactor() + 'px';
                rsFrame.style.zIndex = props['zIndex'] == null ? '9999999' : props['zIndex'];
                rsFrame.style.width = 66 * rs.getScaleFactor() + 'px';
                rsFrame.style.visibility = 'inherit';
                rsFrame.style.display = 'inherit';
                if (props['left'] == true) {
                    rsFrame.style.left = '0px';
                } else {
                    rsFrame.style.float = 'right';
                }
                if (rs.isMobile()) {
                    rsFrame.style.right = 0 - (66 * (1 - rs.getScaleFactor())) / 2 + 'px';
                    rsFrame.style.transform = 'scale(' + rs.getScaleFactor() + ')';
                    rsFrame.style['-webkit-transform'] = 'scale(' + rs.getScaleFactor() + ')';
                }
            }
            props['float'] = 'left';
            floating = true;
        }

        // the side widget has a fixed width for the embedded part
        var embeddedProps = JSON.parse(JSON.stringify(props));
        if (widgetName == 'side') {
            embeddedProps['width'] = 66;
        }

        var url = buildWidgetUrl(widgetName, firmId, embeddedProps);
        rs.log('widget embedded : ' + url);
        var frame = rs.insertIframe(
            'iframe-embedded' + elementId,
            elementId,
            url,
            embeddedProps['width'],
            'visible',
            widgetName
        );

        document.getElementById(elementId).appendChild(frame);
        frame.className = widgetName + '-widget embedded-widget';

        if (floating) {
            loadFloatingFrame(frame, elementId, widgetName, firmId, props);
        }
    };

    var loadFloatingFrame = function (frame, elementId, widgetName, firmId, props) {
        url = buildWidgetUrl(widgetName + '/floating', firmId, props);
        rs.log('widget floating: ' + url);

        var floatFrame = rs.insertIframe('iframe-floating-' + elementId, elementId, url, props['width'], 'visible');
        floatFrame.className = widgetName + '-widget floating-widget';

        var floatDiv = document.createElement('div');
        floatDiv.className = 'floatHolder';

        floatDiv.style.position = 'absolute';
        floatDiv.style.zIndex = '999';
        floatDiv.style.opacity = '1';

        var topPosition = 0;

        // pad a div around the frame to give a bigger area for the mouseout event
        if (props['left'] == true) {
            topPosition = -75 * rs.getScaleFactor();
            floatDiv.style.top = topPosition - 9999 + 'px';
            floatDiv.style.right = -460 * rs.getScaleFactor() + 'px';
            floatDiv.style.padding =
                75 * rs.getScaleFactor() +
                'px 0px ' +
                75 * rs.getScaleFactor() +
                'px ' +
                75 * rs.getScaleFactor() +
                'px';
        } else if (props['float'] == 'left') {
            topPosition = -75 * rs.getScaleFactor();
            floatDiv.style.top = topPosition - 9999 + 'px';
            floatDiv.style.left = -495 * rs.getScaleFactor() + 'px';
            floatDiv.style.padding =
                75 * rs.getScaleFactor() +
                'px 0px ' +
                75 * rs.getScaleFactor() +
                'px ' +
                75 * rs.getScaleFactor() +
                'px';
        } else if (props['float'] == 'bottom') {
            topPosition = 20 * rs.getScaleFactor();
            floatDiv.style.marginTop = 60 * rs.getScaleFactor() + 'px';
            floatDiv.style.top = topPosition - 9999 + 'px';
            floatDiv.style.padding =
                '0px ' +
                75 * rs.getScaleFactor() +
                'px ' +
                75 * rs.getScaleFactor() +
                'px ' +
                75 * rs.getScaleFactor() +
                'px';
            floatDiv.style.left = -75 * rs.getScaleFactor() + 'px';
        } else {
            rs.log('unrecognised float property');
        }

        if (rs.isMobile()) {
            var overlay = document.createElement('div');
            overlay.className = 'rsoverlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.addEventListener('click', function (e) {
                if (widgetVisible()) {
                    hideWidget();
                    removeClickListener();
                } else {
                    showWidget(firmId, widgetName);
                    document.addEventListener('click', outsideClickListener);
                }
            });
            document.getElementById(elementId).appendChild(overlay);

            var outsideClickListener = function (event) {
                if (clickedOutsideWidget(event.target) && widgetVisible()) {
                    hideWidget();
                    removeClickListener();
                }
            };

            var removeClickListener = function () {
                document.removeEventListener('click', outsideClickListener);
            };

            var clickedOutsideWidget = function (clickedElement) {
                return !floatFrame.contains(clickedElement) && !overlay.contains(clickedElement);
            };

            var widgetVisible = function () {
                return floatDiv.style.top.slice(0, -2) > -9000;
            };
        } else {
            frame.addEventListener('mouseover', function (e) {
                showWidget(firmId, widgetName);
            });

            // the fudge factor of 10 accounts for mouseout event that may deliver
            // the coord as technically still being inside the bounding rectangle
            floatDiv.addEventListener('mouseout', function (e) {
                var targetPosition = e.target.getBoundingClientRect();
                if (
                    props['left'] == true &&
                    (e.clientX < targetPosition.left + 10 ||
                        e.clientX > targetPosition.right - 10 ||
                        e.clientY > targetPosition.bottom - 10)
                ) {
                    hideWidget();
                }
                if (
                    (props['float'] == 'bottom' &&
                        e.target == floatDiv &&
                        (e.clientX < targetPosition.left + 10 || e.clientX > targetPosition.right - 10)) ||
                    e.clientY > targetPosition.bottom - 10
                ) {
                    hideWidget();
                } else if (
                    props['float'] == 'left' &&
                    e.target == floatDiv &&
                    (e.clientX < targetPosition.left + 10 ||
                        e.clientY < targetPosition.top + 10 ||
                        e.clientY > targetPosition.bottom - 10)
                ) {
                    hideWidget();
                }
            });
            frame.addEventListener('mouseout', function (e) {
                // don't hide when moving the cursor from the embedded widget to the floating widget
                // is a bit of a fudge factor because the actual coords are affected by the velocity
                // of the cursor
                var targetPosition = e.target.getBoundingClientRect();
                if (
                    props['left'] == true &&
                    Math.abs(targetPosition.left - e.clientX) < 60 &&
                    Math.abs(targetPosition.top - e.clientY) > 5 &&
                    Math.abs(targetPosition.bottom - e.clientY) > 5
                ) {
                    return;
                } else if (
                    props['float'] === 'left' &&
                    Math.abs(targetPosition.left - e.clientX) < 15 &&
                    Math.abs(targetPosition.top - e.clientY) > 5 &&
                    Math.abs(targetPosition.bottom - e.clientY) > 5
                ) {
                    return;
                } else if (props['float'] === 'bottom' && Math.abs(targetPosition.bottom - e.clientY) < 15) {
                    return;
                } else {
                    hideWidget();
                }
            });
        }

        var hideWidget = function () {
            floatDiv.style.top = topPosition - 9999 + 'px';
        };

        var showWidget = function (firmId, widgetName) {
            floatDiv.style.top = topPosition + 'px';
            rs.logOpen(firmId, widgetName);
        };

        floatDiv.appendChild(floatFrame);
        document.getElementById(elementId).appendChild(floatDiv);
    };

    var postAjax = function (url) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('POST', url);
        xhr.send();
        return xhr;
    };
})
    ((window.rs = window.rs || {}));

window.addEventListener(
    'message',
    function (e) {
        rs.widgetLoaded(e);
    },
    false
);
