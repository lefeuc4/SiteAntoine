# Testing Patterns

**Analysis Date:** 2026-04-05

## Test Framework

**Runner:**
- None installed. No test framework is configured.
- No `jest`, `vitest`, `@testing-library/*`, or `playwright` in `package.json`.

**Run Commands:**
```bash
# No test commands exist. package.json scripts:
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm seed         # Database seeding
```

## Current State: Zero Tests

This project has **no test files, no test configuration, and no testing dependencies**. The `package.json` has no `test` script. There are no `*.test.*`, `*.spec.*`, or `__tests__/` directories anywhere in the codebase.

## Recommended Test Setup

Based on the stack (Next.js 16, React 19, TypeScript 5, Payload CMS 3), the recommended setup is:

**Runner:**
- Vitest (fast, ESM-native, compatible with Next.js)
- Config file: `vitest.config.ts` at project root

**Libraries to Install:**
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

**Config Template:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Package.json scripts to add:**
```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Test File Organization

**Recommended Location:**
- Co-located with source files: `src/components/ui/ServiceCard.test.tsx` next to `src/components/ui/ServiceCard.tsx`
- Shared test utilities: `src/test/setup.ts`, `src/test/helpers.ts`
- Integration tests for server actions: `src/app/actions/__tests__/`

**Naming:**
- Unit tests: `{ComponentName}.test.tsx` or `{module}.test.ts`
- Integration tests: `{feature}.integration.test.ts`

## Priority Test Targets

**High Priority — Business Logic:**

1. **Contact form validation** (`src/lib/contactSchema.ts`):
   - Pure Zod schema, easy to test
   - Validates nom (min 2, max 100), email format, message (min 10, max 2000), honeypot (max 0)
   ```typescript
   // src/lib/contactSchema.test.ts
   import { contactSchema } from './contactSchema'

   describe('contactSchema', () => {
     it('accepts valid form data', () => {
       const result = contactSchema.safeParse({
         nom: 'Marie Dupont',
         email: 'marie@exemple.fr',
         message: 'Bonjour, je suis interessee par vos programmes.',
         website: '',
       })
       expect(result.success).toBe(true)
     })

     it('rejects honeypot field with content', () => {
       const result = contactSchema.safeParse({
         nom: 'Bot',
         email: 'bot@spam.com',
         message: 'Buy cheap stuff',
         website: 'http://spam.com',
       })
       expect(result.success).toBe(false)
     })
   })
   ```

2. **sendContactEmail Server Action** (`src/app/actions/sendContactEmail.ts`):
   - Mock Resend SDK
   - Test validation pass-through, honeypot detection, error handling
   ```typescript
   // src/app/actions/__tests__/sendContactEmail.test.ts
   import { sendContactEmail } from '../sendContactEmail'

   // Mock resend
   vi.mock('resend', () => ({
     Resend: vi.fn().mockImplementation(() => ({
       emails: {
         send: vi.fn().mockResolvedValue({ data: { id: 'test' }, error: null }),
       },
     })),
   }))

   describe('sendContactEmail', () => {
     it('returns success for valid data', async () => {
       const result = await sendContactEmail({
         nom: 'Marie',
         email: 'marie@test.fr',
         message: 'Bonjour, je souhaite en savoir plus.',
         website: '',
       })
       expect(result.status).toBe('success')
     })

     it('returns fake success for honeypot submissions', async () => {
       const result = await sendContactEmail({
         nom: 'Bot',
         email: 'bot@test.com',
         message: 'Spam message here',
         website: 'http://spam.com',
       })
       // Should return success to not tip off bots, but NOT send email
       expect(result.status).toBe('success')
     })
   })
   ```

**Medium Priority — Components:**

3. **ContactForm component** (`src/components/sections/ContactForm.tsx`):
   - Client component with react-hook-form
   - Test form validation UX, submission flow, success/error states

4. **ServiceCard, ProgrammeCard, ResultatCard** (`src/components/ui/`):
   - Presentational components
   - Test rendering with various prop combinations, empty states

5. **CookieBanner** (`src/components/ui/CookieBanner.tsx`):
   - Test localStorage interaction, show/hide logic

**Lower Priority — Page-Level:**

6. **Page components** (`src/app/(frontend)/*.tsx`):
   - Server Components that call Payload — require mocking `getPayload()`
   - More valuable as integration tests

## Mocking Strategy

**Payload Local API:**
```typescript
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 }),
    findGlobal: vi.fn().mockResolvedValue({}),
    count: vi.fn().mockResolvedValue({ totalDocs: 0 }),
  }),
}))
```

**Resend SDK:**
```typescript
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ data: { id: 'test' }, error: null }) },
  })),
}))
```

**next/navigation:**
```typescript
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn() }),
}))
```

**What NOT to Mock:**
- Zod schemas — test them directly
- Pure utility functions — test with real inputs
- CSS classes — test behavior, not styling

## Coverage

**Requirements:** None enforced. No coverage configuration exists.

**Recommended targets:**
- `src/lib/` — 100% (pure logic)
- `src/app/actions/` — 90%+ (critical business logic)
- `src/components/ui/` — 80%+ (user-facing components)
- `src/components/sections/` — 70%+ (section components)
- `src/collections/` and `src/globals/` — not testable (static config objects)

## Test Types

**Unit Tests:**
- Scope: Individual functions, components, schemas
- Approach: Vitest + Testing Library, mock external dependencies
- Priority targets: `contactSchema.ts`, `sendContactEmail.ts`, card components

**Integration Tests:**
- Scope: Full page render with mocked Payload data
- Approach: Render Server Components with mocked `getPayload()`
- Not yet feasible without test setup

**E2E Tests:**
- Framework: Not used. Playwright recommended for future.
- Priority scenarios: Contact form submission, navigation, mobile menu, admin login
- Requires running dev server + test database

---

*Testing analysis: 2026-04-05*
