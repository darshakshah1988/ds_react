
# README

Please make sure that whenever you create a new page for admin layout. This layout must be linked to your `Next.js` page.

```js
// admin/new-page.tsx

import AdminLayout from '../../admin/layouts/AdminLayout';

export default function NewPage() {}

NewPage.Layout = AdminLayout;
```

If you want to present new content on your `admin` page. So please import the `PageInjector.tsx` component and add your new components within it. This `PageInjector.tsx` will include the full admin layout shell.


```js
import AdminLayout from '../../admin/layouts/AdminLayout';

export default function NewPage() {
  return (
    <PageInjector>
      <h1>My new Page</h1>
    </PageInjector>
  );
}

NewPage.Layout = AdminLayout;
```