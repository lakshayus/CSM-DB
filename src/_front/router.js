import { createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import { initializeData, initializePlugins, onPageUnload } from '@/_common/helpers/data';

let router;
const routes = [];

function scrollBehavior(to) {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
}

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

// eslint-disable-next-line no-undef
window.wwg_designInfo = {"id":"dc46ae19-ab96-4ec7-b01d-385886665d55","homePageId":"0ebccb3e-9fc2-4682-8ba7-34527fd16018","authPluginId":null,"baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[],"pages":[{"id":"0ebccb3e-9fc2-4682-8ba7-34527fd16018","linkId":"0ebccb3e-9fc2-4682-8ba7-34527fd16018","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"68ec7de6-4aea-468e-909b-fde37f7b42b1","sectionTitle":"Sidebar Section","linkId":"c9aaee8e-68b9-4aab-acaf-55855fd75f76"},{"uid":"b64e165a-6168-4be8-bb2a-5abfde290b0c","sectionTitle":"Navbar Section","linkId":"fe8783ac-9dc7-4531-b85e-7e820fe122fa"},{"uid":"17eb3716-dd3b-423d-8d6a-e7b569e00cba","sectionTitle":"Impersonation Banner","linkId":"9cf9c4fd-f40f-4757-9526-86cd3d5394a1"},{"uid":"15089783-d711-43c5-b9ba-56c7122a59a5","sectionTitle":"Content Section","linkId":"8c0716c3-8781-4e62-8db5-432affbb728b"}],"pageUserGroups":[],"title":{"en":"","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{},"keywords":{},"socialDesc":{},"socialTitle":{},"structuredData":{}},"metaImage":""},{"id":"1c40e4fe-5110-4c0f-875c-857c41f608e1","linkId":"1c40e4fe-5110-4c0f-875c-857c41f608e1","name":"Dashboard","folder":"Admin Panel/","paths":{"en":"dashboard","default":"dashboard"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"af809c27-6976-426f-9ba1-35183b87897f","sectionTitle":"Sidebar Section","linkId":"e1c07202-5789-4890-b510-37af53adb229"},{"uid":"5aa79025-28b5-4907-b199-df229350c2ea","sectionTitle":"Navbar Section","linkId":"3b3b5d8f-88d7-4167-857c-49fce2f09b9f"},{"uid":"590d9de7-7b01-4ee6-8041-9ee8371345a1","sectionTitle":"Main Content Section","linkId":"418d8445-4c43-49b2-81e7-25658fe31a27"}],"pageUserGroups":[],"title":{"en":"Dashboard - Car Rental Admin"},"meta":{"desc":{"en":"Overview of bookings, vehicles, revenue, and alerts for car rental operators."},"keywords":{"en":"dashboard, car rental, bookings, vehicles, revenue, alerts"},"socialDesc":{"en":"Manage bookings, vehicles, revenue, and alerts efficiently."},"socialTitle":{"en":"Dashboard - Car Rental Admin"}},"metaImage":""},{"id":"0174d2c9-a9e7-46dd-8f22-be5b187e5d1e","linkId":"0174d2c9-a9e7-46dd-8f22-be5b187e5d1e","name":"Bookings","folder":"Admin Panel/","paths":{"en":"bookings","default":"bookings"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"b9d835bc-6d3d-43f1-a32a-aad02b0ec4e2","sectionTitle":"Sidebar Section","linkId":"c9abf472-9d19-4d9c-8d87-3fd938793ff2"},{"uid":"d1b897a4-5544-4337-ac8b-abdce8d15861","sectionTitle":"Navbar Section","linkId":"3b5c4e9d-f2d9-43f3-9e59-7c1ae6222fb1"},{"uid":"983737ff-0aec-4b27-94e3-045eb3cf11d2","sectionTitle":"Main Section","linkId":"0b6cbd44-1604-40e1-b48f-e49a62c7cd62"}],"pageUserGroups":[],"title":{"en":"Bookings - Car Rental Admin"},"meta":{"desc":{"en":"Manage current and past vehicle bookings with filters and export options."},"keywords":{"en":"bookings, car rental, vehicle bookings, filters, export"},"socialDesc":{"en":"View and manage vehicle bookings with detailed filters and export features."},"socialTitle":{"en":"Bookings - Car Rental Admin"}},"metaImage":""}],"plugins":[{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"}]};
// eslint-disable-next-line no-undef
window.wwg_cacheVersion = 2;
// eslint-disable-next-line no-undef
window.wwg_pluginsSettings = pluginsSettings;
// eslint-disable-next-line no-undef
window.wwg_disableManifest = false;

const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {};

const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    //Replace params
    path = path.replace(/{{([\w]+)\|([^/]+)?}}/g, ':$1');

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            //Init plugins
            await initializePlugins();

            //Check if private page
            if (page.pageUserGroups?.length) {
                // cancel navigation if no plugin
                if (!wwLib.wwAuth.plugin) {
                    return false;
                }

                await wwLib.wwAuth.init();

                // Redirect to not sign in page if not logged
                if (!wwLib.wwAuth.getIsAuthenticated()) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthenticatedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }

                //Check roles are required
                if (
                    page.pageUserGroups.length > 1 &&
                    !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
                ) {
                    window.location.href = `${wwLib.wwPageHelper.getPagePath(
                        wwLib.wwAuth.getUnauthorizedPageId()
                    )}?_source=${to.path}`;

                    return null;
                }
            }

            try {
                await import(`@/pages/${page.id.split('_')[0]}.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

let routerOptions = {};

const isProd =
    !window.location.host.includes(
        // TODO: add staging2 ?
        '-staging.' + (process.env.WW_ENV === 'staging' ? import.meta.env.VITE_APP_PREVIEW_URL : '')
    ) && !window.location.host.includes(import.meta.env.VITE_APP_PREVIEW_URL);

if (isProd && window.wwg_designInfo.baseTag?.href) {
    let baseTag = window.wwg_designInfo.baseTag.href;
    if (!baseTag.startsWith('/')) {
        baseTag = '/' + baseTag;
    }
    if (!baseTag.endsWith('/')) {
        baseTag += '/';
    }

    routerOptions = {
        base: baseTag,
        history: createWebHistory(baseTag),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter({
    ...routerOptions,
    scrollBehavior,
});

//Trigger on page unload
let isFirstNavigation = true;
router.beforeEach(async (to, from) => {
    if (to.name === from.name) return;
    if (!isFirstNavigation) await onPageUnload();
    isFirstNavigation = false;
    wwLib.globalVariables._navigationId++;
    return;
});

//Init page
router.afterEach((to, from, failure) => {
    wwLib.$store.dispatch('front/showPageLoadProgress', false);
    let fromPath = from.path;
    let toPath = to.path;
    if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
    if (!toPath.endsWith('/')) toPath = toPath + '/';
    if (failure || (from.name && toPath === fromPath)) return;
    initializeData(to);
});
/* wwFront:end */

export default router;
