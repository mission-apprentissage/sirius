const IFRAME_FORMATION_BASE_URL = 'https://sirius.inserjeunes.beta.gouv.fr/iframes/formation'

const IFRAME_ETABLISSEMENT_BASE_URL = 'https://sirius.inserjeunes.beta.gouv.fr/iframes/etablissement'

const isFormationPage = (url) => {
    return url.includes('univers-formation')
}

const isEtablissementPage = (url) => {
    return url.includes('univers-lycee/lycees')
}

const adjustIframeHeight = (iframe, height) => {
    iframe.style.height = height + 'px';
}


if(isFormationPage(window.location.href)) {
    const intituleFormation = document.querySelector('.breadcrumb-list > li:nth-child(3)').innerText

    const siriusIframeUrl = `${IFRAME_FORMATION_BASE_URL}?intitule=${intituleFormation}` 
    const iframe = document.createElement('iframe');
    iframe.id = 'myIframe';
    iframe.style.marginTop = "40px"
    iframe.style.paddingLeft = "24px"
    iframe.style.paddingRight = "24px"


    iframe.src = siriusIframeUrl;
    iframe.width = "100%";
    const container = document.querySelector('#content > section:nth-child(3) > article')

    container.appendChild(iframe);
    window.addEventListener('message', (e) => {
        if (e.data?.siriusHeight) {
            adjustIframeHeight(iframe, e.data.siriusHeight)
        }
    })
}

if (isEtablissementPage(window.location.href)) {
    const uai = document.querySelector('#adresse > div:nth-child(6) > span').innerText;

    const siriusIframeUrl = `${IFRAME_ETABLISSEMENT_BASE_URL}?uai=${uai}`;
    const iframe = document.createElement('iframe');
    iframe.id = 'myIframe';
    iframe.style.marginTop = "40px";
    iframe.style.paddingLeft = "24px";
    iframe.style.paddingRight = "24px";

    iframe.src = siriusIframeUrl;
    iframe.width = "100%";
    const container = document.querySelector('#content > section:nth-child(3) > article');

    container.insertBefore(iframe, container.lastElementChild);

    window.addEventListener('message', (e) => {
        if (e.data?.siriusHeight) {
            adjustIframeHeight(iframe, e.data.siriusHeight);
        }
    });
}
