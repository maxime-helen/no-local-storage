"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// const USER_AGENT_UNIQUE_STRING = 'Display Mobile App';
// const isWebView = () => {
//     const { userAgent } = navigator;
//     return !!userAgent && userAgent.endsWith(USER_AGENT_UNIQUE_STRING);
// };
// const declineStoringData = () => {
//     // cleanup cookies
//     Cookies &&
//         Object.keys(Cookies.get())
//             .map(name => name !== "cookieconsent_status" && Cookies.remove(name)) || 
//         console.warn('js-cookie library is not imported');
//     // disable cookie setter except for when mutating cookie banner
//     const cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
//         Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
//     if (cookieDesc && cookieDesc.configurable) {
//         Object.defineProperty(document, 'cookie', {
//             configurable: true,
//             get: function () {
//                 return cookieDesc.get.call(document);
//             },
//             set: function (val) {
//                 if (val.split('=')[0] === 'cookieconsent_status') {
//                     cookieDesc.set.call(document, val);
//                 }
//             }
//         });
//     }
//     // cleanup storages
//     if (localStorage && sessionStorage) {
//         localStorage.clear();
//         Object.keys(localStorage).forEach((key) => {
//             delete localStorage[key];
//         });
//         sessionStorage.clear();
//         Object.keys(sessionStorage).forEach((key) => {
//             delete sessionStorage[key];
//         });
//         // prevent js setters to mutate storage. 
//         // eg. localStorage.foo = 'bar' results to store 'bar' in foo
//         // note: this for some reasons makes local/sessionStorage undefined
//         Object.defineProperty(window, 'localStorage', {
//             configurable: false,
//             set: () => { return true; },
//             get: () => { },
//         });
//         Object.defineProperty(window, 'sessionStorage', {
//             configurable: false,
//             set: () => { return true; },
//             get: () => { },
//         });
//     };
// };
// // make sure we turn off storage if cookie banner has been declined
// if (document.cookie.includes('cookieconsent_status=deny')) {
//     declineStoringData();
// }
// // initialize osano banner
// let oldStatus;
// !isWebView() && window.cookieconsent && window.cookieconsent.initialise({
//     type: 'opt-in',
//     revokeBtn: '<a style="display: none;">',
//     content: {
//         href: 'https://ubiquity6.com/privacy/privacy-policy.html',
//     },
//     dismissOnScroll: true,
//     palette: {
//         popup: {
//             background: "#09102B"
//         },
//         button: {
//             background: "#8b5ef4"
//         },
//     },
//     onInitialise: function (status) {
//         oldStatus = status;
//     },
//     onStatusChange: function (status) {
//         if (status === window.cookieconsent.status.deny) {
//             declineStoringData();
//         } else if (oldStatus === window.cookieconsent.status.deny) {
//             // let's reload if the user wants to enable back cookies that had previously them declined in the page session
//             // This will reset the unbinds. Theoretically we could store the voided methods and rebind
//             // them here.
//             window.location.reload();
//         }
//         oldStatus = status;
//     },
// }) || console.warn('cookieconsent library is not imported');
var disableCookies = {
  optOut: function optOut() {},
  optIn: function optIn() {}
};
var _default = disableCookies;
exports["default"] = _default;
