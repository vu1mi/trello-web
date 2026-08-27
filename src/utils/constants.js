
let api_root = ''

if (import.meta.env.VITE_BUILD_MODE === 'production') {
    api_root = 'https://be-trelloweb.onrender.com';
}
if (import.meta.env.VITE_BUILD_MODE === 'dev') {
    api_root = 'http://localhost:8018';
}
export const API_ROOT = api_root;

export const  PAGE_DEFAULT_LIMIT = 10;
export const  PAGE_DEFAULT_PAGE = 1;

export const CARD_MEMBER_ACTION ={
    ADD: 'ADD',
    REMOVE: 'REMOVE',
}