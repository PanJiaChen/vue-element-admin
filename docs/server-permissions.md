# Server-driven route permissions

Set `permissionMode: 'server'` in `src/settings.js`, then run the usual development server. Sign in as `admin`, open **Permission → Role Permission**, edit the editor's menu tree, and save. Switch to editor on the Page Permission demo (or log out and sign in as editor). Its sidebar and reachable dynamic routes now come from the saved server response. Nested menus can be selected at any depth. Public login, dashboard, documentation, and error pages remain local.

The default `frontend` mode preserves the existing local `meta.roles` filtering. Server mode calls `GET /vue-element-admin/user/routes` on initial login and when the demo switches roles. It does not grant every local route to an admin role: the server's returned tree is authoritative for every user. A failed request or unknown component rejects route generation instead of falling back to local permissions.

The endpoint returns `{ code: 20000, data: [...] }`. Each node uses the usual route fields (`path`, `name`, `redirect`, `hidden`, `alwaysShow`, `meta`, and `children`) but represents its component with a string, for example:

```json
{
  "path": "/nested",
  "component": "layout/Layout",
  "name": "Nested",
  "alwaysShow": true,
  "meta": { "title": "Nested Routes", "icon": "nested" },
  "children": [{
    "path": "menu2",
    "component": "views/nested/menu2/index",
    "name": "Menu2",
    "meta": { "title": "Menu 2" }
  }]
}
```

Only `Layout`/`layout/Layout` and Vue files bundled under `src/views` are resolved. Directory names resolve their `index.vue`; `.vue` names omit the extension. The client does not evaluate server code or load remote components. The returned tree must exclude the locally registered constant routes.

The existing mock role CRUD now persists additions, edits, and deletions for the lifetime of the mock server. `/routes` supplies the visual editor's catalog; `/user/routes` selects the saved role using the mock token and retains the public not-found redirect. Saving nested selections updates a parent redirect if its target was removed. Editing the signed-in user's role refreshes the router and visited-view cache immediately. A server-mode role switch returns to the dashboard so a removed page is not left mounted. Restarting the development server resets this demonstration data.

For a real backend, persist role/menu associations, derive permissions from the authenticated session, and independently authorize every protected API operation. Replace the existing demonstration token-query convention with your backend's authentication contract. This frontend controls navigation; it does not replace backend access checks.
