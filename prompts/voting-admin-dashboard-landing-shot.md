# Voting Admin Dashboard Landing Screenshot Prompt

## Task

Create a single-page HTML mockup of an administrative dashboard for an online voting service.

This is **not** a production application and **not** a backend task. It is a presentation-grade frontend mockup that will be used as a screenshot on a landing page.

## Main goal

Design a visually strong, clean, modern admin dashboard screen that immediately communicates the product can:

- create sections and nomination categories
- add nominees / projects
- configure voting rules
- view rankings
- track key metrics
- see vote growth charts
- notice suspicious spikes
- inspect individual votes

## Important constraints

- Only **one screen** is required
- It does **not** need to be clickable
- It may be a pure HTML/CSS/JS mockup
- The main goal is **visual quality and credibility**
- Output must be ready to open locally in a browser and use for a screenshot
- Use demo/mock data only
- Choose the design direction yourself, but it must look modern, polished, and expensive — like a real SaaS/admin dashboard
- Do **not** make it look primitive, raw, or like a school project

## Deliverable format

Prefer one of the following:

- `index.html`
- `styles.css`
- `script.js` (only if needed for decorative effects)

Or, if simpler, put everything into a single `index.html` with embedded styles.

## Technical requirements

### Do not build

- backend
- authentication
- database
- real persistence
- real forms / saving logic
- multiple pages
- unnecessary heavy dependencies
- anything requiring a build step unless absolutely necessary

The result should ideally open locally without build tooling.

### Target viewport

- Primary target: desktop
- Best appearance around **1440–1600 px** width
- Optimized for creating a clean, attractive screenshot
- Mobile adaptation is optional, but the layout should not completely break

## Required screen sections

### 1. Sidebar

Create a stylish left sidebar with sections such as:

- Дашборд
- Голосования
- Номинации
- Номинанты / Проекты
- Голоса
- Аналитика
- Настройки

### 2. Top header

At the top include elements such as:

- current voting title
- voting period
- status badge like “Активно”
- action button like “Создать голосование” or “Добавить номинанта”

### 3. Key metrics cards

Create modern stat cards for:

- Всего голосов
- Уникальных пользователей
- Активных номинаций
- Подозрительных всплесков
- Конверсия / вовлеченность
- Голосов за сегодня

Cards should look modern, with icons or subtle micro-indicators for growth/decline.

### 4. Nominee / project ranking block

Create a table or card list showing:

- rank position
- project / nominee name
- nomination category
- total votes
- 24h growth
- status / suspicious activity marker

### 5. Vote growth chart

Add a visually attractive chart showing vote dynamics.

Purpose of the chart:

- show growth for one or several candidates
- make suspicious spikes visually noticeable
- include a nearby badge/alert like:
  - “Подозрительный рост с 14:00 до 15:00”

The chart may be implemented as:

- decorative SVG
- canvas
- a lightweight chart library
- or a well-crafted visual imitation

### 6. Voting rules configuration block

Show visually that the admin can configure:

- voting deadline
- authentication methods
- vote limit per user
- rule like “1 голос в номинации”
- available voting channels

This can be decorative UI with toggles, selects, date fields, and pills.

### 7. Individual votes table

Show that the system can inspect specific votes.

Create a compact table with sample rows including:

- дата/время
- пользователь / ID
- кандидат
- источник
- IP / устройство / регион
- статус проверки

Add a couple of suspicious-marked examples.

## Visual style

Choose the visual style yourself, but it must be:

- modern
- polished
- premium-looking
- suitable for B2B / SaaS / admin dashboard
- not acidic
- not childish
- not template-looking in a cheap way

### Preferred directions

You may choose either:

#### Option A — light dashboard

- light background
- white cards
- blue / violet / emerald accents

#### Option B — dark premium dashboard

- deep dark background
- strong contrast cards
- restrained neon accents

Prefer the option that will look stronger on a landing page screenshot.

### Visual details

Pay attention to:

- rounded corners
- soft shadows
- strong spacing rhythm
- clear visual hierarchy
- consistent typography
- balanced layout
- clean grid
- tasteful icons if useful

## Language and demo content

Use **Russian** in the UI.

### Demo entities

- Голосование: “Премия городских проектов 2026”
- Номинации:
  - Лучший общественный проект
  - Городская инициатива
  - Социальный стартап
- Номинанты:
  - Чистый двор
  - Умный район
  - Город без барьеров
  - Эко-маршрут

### Demo metrics

- Всего голосов: 128 540
- Уникальных пользователей: 92 314
- Активных номинаций: 12
- Подозрительных всплесков: 3

## What the final result must achieve

The final result must:

- open locally in a browser
- look like a real modern admin dashboard
- be suitable for a landing page screenshot
- demonstrate the system’s capabilities on a single screen

## Strict anti-scope instructions

Do **not**:

- design backend architecture instead of making the mockup
- write APIs
- add database logic
- implement real auth
- build real CRUD flows
- create multiple pages unless absolutely necessary
- over-engineer the solution
- spend effort on infrastructure instead of the visual screen

If forced to choose between:

- more logic
- or better visual polish

choose **better visual polish**.

## Execution priorities

Work in this order:

1. strong overall composition
2. polished SaaS-quality visual style
3. clear dashboard structure
4. convincing metrics cards
5. ranking block
6. chart with suspicious spike
7. voting rules block
8. individual votes table

If time is limited, reduce interactivity first — not visual quality.

## Quality bar

The screenshot should instantly communicate:

- this is a professional admin panel
- this product is for online voting management
- the system supports both administration and fraud/anomaly monitoring
- the interface is polished enough for a B2B landing page

If it looks like a student dashboard, the task is not complete.
If it looks like a polished SaaS product screen, the task is successful.

## Required final response from the agent

After finishing, return:

1. a short summary of what was created
2. the list of created files
3. how to open the mockup locally
4. what blocks are shown on the screen
5. which data/elements are decorative only
6. a recommendation for the best screenshot capture

## Final directive

Think like a SaaS product designer, not a backend engineer.
The primary output is **the finished visual screen**, not architectural discussion.
Create a result that is immediately usable as a strong landing page screenshot.
