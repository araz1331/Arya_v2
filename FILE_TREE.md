# HireArya Platform - File Tree

```
hirearya/
├── app/
│   ├── api/
│   │   └── stripe/
│   │       └── webhook/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── features/
│       ├── agent-builder/
│       │   ├── agent-builder-card.tsx
│       │   └── index.ts
│       └── billing-card/
│           ├── billing-card.tsx
│           └── index.ts
├── lib/
│   ├── services/
│   │   ├── gemini.ts
│   │   ├── stripe.ts
│   │   ├── aws-s3.ts
│   │   └── supabase.ts
│   ├── validations/
│   │   ├── index.ts
│   │   ├── stripe.ts
│   │   └── supabase.ts
│   └── utils.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── components.json
└── .env.example
```
