/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Get authenticated user info from Cloudflare Access header
    const user = request.headers.get('Cf-Access-Authenticated-User-Email') || 'unknown';
    const timestamp = new Date().toISOString();

    // Extract country from Cloudflare header
    const country = request.headers.get('Cf-IPCountry') || 'unknown';
    const countryLower = country.toLowerCase();

    // For /secure path - return HTML with user info and country link
    if (path === '/secure') {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Secure Access</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            .info { background: #f0f0f0; padding: 1rem; border-radius: 5px; }
            a { color: blue; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>Secure Access Granted</h1>
          <div class="info">
            <p><strong>${user}</strong> authenticated at <strong>${timestamp}</strong> from <a href="/secure/${countryLower}">${country}</a></p>
          </div>
        </body>
        </html>
      `;
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // For /secure/${COUNTRY} path - return flag image
    if (path.startsWith('/secure/')) {
      const countryCode = path.split('/').pop().toLowerCase();
      
      try {
        const flagFile = await env.COUNTRY_FLAGS.get(`${countryCode}.png`);
        
        if (!flagFile) {
          return new Response('Country not found', { status: 404 });
        }

        const arrayBuffer = await flagFile.arrayBuffer();
        return new Response(arrayBuffer, {
          headers: { 'Content-Type': 'image/png' }
        });
      } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
    }

    // Default: return 404
    return new Response('Not found', { status: 404 });
  }
};

