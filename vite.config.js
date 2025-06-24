import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const pages = {"index":{"outputDir":"./","lang":"en","title":"","cacheVersion":2,"meta":[{"name":"twitter:card","content":"summary"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://dc46ae19-ab96-4ec7-b01d-385886665d55.weweb-preview.io/"},{"rel":"alternate","hreflang":"en","href":"https://dc46ae19-ab96-4ec7-b01d-385886665d55.weweb-preview.io/"}]},"dashboard":{"outputDir":"./dashboard","lang":"en","title":"Dashboard - Car Rental Admin","cacheVersion":2,"meta":[{"name":"title","content":"Dashboard - Car Rental Admin"},{"name":"description","content":"Overview of bookings, vehicles, revenue, and alerts for car rental operators."},{"name":"keywords","content":"dashboard, car rental, bookings, vehicles, revenue, alerts"},{"itemprop":"name","content":"Dashboard - Car Rental Admin"},{"itemprop":"description","content":"Overview of bookings, vehicles, revenue, and alerts for car rental operators."},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Dashboard - Car Rental Admin"},{"name":"twitter:description","content":"Manage bookings, vehicles, revenue, and alerts efficiently."},{"property":"og:title","content":"Dashboard - Car Rental Admin"},{"property":"og:description","content":"Manage bookings, vehicles, revenue, and alerts efficiently."},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://dc46ae19-ab96-4ec7-b01d-385886665d55.weweb-preview.io/dashboard/"},{"rel":"alternate","hreflang":"en","href":"https://dc46ae19-ab96-4ec7-b01d-385886665d55.weweb-preview.io/dashboard/"}]},"bookings":{"outputDir":"./bookings","lang":"en","title":"Bookings - Car Rental Admin","cacheVersion":2,"meta":[{"name":"title","content":"Bookings - Car Rental Admin"},{"name":"description","content":"Manage current and past vehicle bookings with filters and export options."},{"name":"keywords","content":"bookings, car rental, vehicle bookings, filters, export"},{"itemprop":"name","content":"Bookings - Car Rental Admin"},{"itemprop":"description","content":"Manage current and past vehicle bookings with filters and export options."},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Bookings - Car Rental Admin"},{"name":"twitter:description","content":"View and manage vehicle bookings with detailed filters and export features."},{"property":"og:title","content":"Bookings - Car Rental Admin"},{"property":"og:description","content":"View and manage vehicle bookings with detailed filters and export features."},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://dc46ae19-ab96-4ec7-b01d-385886665d55.weweb-preview.io/bookings/"},{"rel":"alternate","hreflang":"en","href":"https://dc46ae19-ab96-4ec7-b01d-385886665d55.weweb-preview.io/bookings/"}]}};

// Read the main HTML template
const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf-8');
const compiledTemplate = handlebars.compile(template);

// Generate an HTML file for each page with its metadata
Object.values(pages).forEach(pageConfig => {
    // Compile the template with page metadata
    const html = compiledTemplate({
        title: pageConfig.title,
        lang: pageConfig.lang,
        meta: pageConfig.meta,
        scripts: {
            head: pageConfig.scripts.head,
            body: pageConfig.scripts.body,
        },
        alternateLinks: pageConfig.alternateLinks,
        cacheVersion: pageConfig.cacheVersion,
        baseTag: pageConfig.baseTag,
    });

    // Save output html for each page
    if (!fs.existsSync(pageConfig.outputDir)) {
        fs.mkdirSync(pageConfig.outputDir, { recursive: true });
    }
    fs.writeFileSync(`${pageConfig.outputDir}/index.html`, html);
});

const rollupOptionsInput = {};
for (const pageName in pages) {
    rollupOptionsInput[pageName] = path.resolve(__dirname, pages[pageName].outputDir, 'index.html');
}

export default defineConfig(() => {
    return {
        plugins: [nodePolyfills({ include: ['events', 'stream', 'string_decoder'] }), vue()],
        base: "/",
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
            postcss: {
                plugins: [autoprefixer],
            },
        },
        build: {
            chunkSizeWarningLimit: 10000,
            rollupOptions: {
                input: rollupOptionsInput,
                onwarn: (entry, next) => {
                    if (entry.loc?.file && /js$/.test(entry.loc.file) && /Use of eval in/.test(entry.message)) return;
                    return next(entry);
                },
                maxParallelFileOps: 900,
            },
        },
        logLevel: 'warn',
    };
});
