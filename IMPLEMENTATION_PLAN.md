# Website Improvements Implementation Plan

This plan outlines the steps to improve the LexisLaw application as requested.

## Proposed Changes

### Phase 1: Contact Information Update
Update the admin phone number from `0785962689` to `0734334784` across the codebase.

#### [MODIFY] [whatsapp.js](file:///c:/Users/Lenovo/Downloads/LexisLaw/convex/whatsapp.js)
- Update `ADMIN_WHATSAPP_NUMBER` to `27734334784`.

#### [MODIFY] [Footer.tsx](file:///c:/Users/Lenovo/Downloads/LexisLaw/components/Footer.tsx)
- Update the displayed phone number in the footer to `+27 73 433 4784`.

---

### Phase 2: Admin Page Security
Restrict access to the admin page until it is properly set up.

#### [MODIFY] [page.tsx](file:///c:/Users/Lenovo/Downloads/LexisLaw/app/admin/page.tsx)
- Implement a temporary "Access Restricted" overlay or a redirect to the home page with a message.

---

### Phase 3: Icon Integration
Replace all text-based emojis with professional icons from `lucide-react`.

#### [MODIFY] [page.tsx](file:///c:/Users/Lenovo/Downloads/LexisLaw/app/page.tsx)
- Replace emojis (`⚖️`, `💬`, `📱`, `👨‍👩‍👧`, `🏢`, `🏠`) with Lucide icons.

#### [MODIFY] [Footer.tsx](file:///c:/Users/Lenovo/Downloads/LexisLaw/components/Footer.tsx)
- Replace contact method emojis (`📞`, `✉️`, `📍`) with Lucide icons.

---

### Phase 4: Mobile responsiveness & Hamburger Menu
Enhance the mobile navigation experience.

#### [MODIFY] [Navbar.tsx](file:///c:/Users/Lenovo/Downloads/LexisLaw/components/Navbar.tsx)
- Improve the mobile menu design and transition effects.
- Ensure the "burger" animation is smooth and feels premium.

## Verification Plan

### Automated Tests
- No specific automated tests exist for these UI changes, but I will check for build errors:
  - `npm run build` (or equivalent) to ensure no breaking changes in imports.

### Manual Verification
- **Phase 1**: Verify the phone numbers in the footer and the WhatsApp generation logic.
- **Phase 2**: Navigate to `/admin` and confirm it is inaccessible.
- **Phase 3**: Visually inspect the landing page and footer for the new icons.
- **Phase 4**: Test the hamburger menu on different viewport sizes (mobile/tablet/desktop).
