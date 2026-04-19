# Design System Strategy: The Intelligent Layer

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Digital Curator."** 

In the world of Prompt Engineering, the UI must act as a sophisticated gallery for invisible logic. We are moving away from the "generic SaaS dashboard" look. Instead, we embrace an editorial tech aesthetic that treats code and prompts like high-end artifacts. The design breaks the traditional "box-in-a-box" grid through **intentional tonal depth** and **asymmetric information density**. By leveraging a sophisticated palette of deep indigos and cyan accents, we create an environment that feels like a premium IDE (Integrated Development Environment) crossed with a high-end architectural journal.

## 2. Colors: The Depth of Indigo
This system rejects the "flat" web. We use a spectrum of deep blues and slate grays to create a sense of infinite digital space.

*   **Primary (`#bac3ff`):** Used for high-level brand moments and key interactive focus.
*   **Secondary Cyan (`#44d8f1`):** Our "Interactive Signal." This is reserved for action-oriented elements and highlights within prompts.
*   **Tertiary Violet (`#f9abff`):** Used for "AI-generated" status or specific prompt logic categories.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. Traditional lines create visual noise that distracts from the content.
*   **How to define boundaries:** Use background shifts. A `surface_container_low` section should sit on a `surface` background. The transition between these hex codes is your "border."
*   **The Signature Texture:** For Hero sections or primary CTAs, use a subtle linear gradient transitioning from `primary` to `primary_container`. This adds a "soul" to the UI that flat hex codes cannot achieve.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Level 0 (Base):** `surface` (#081425) - The foundation.
*   **Level 1 (Sections):** `surface_container_low` (#111c2d) - Large content areas.
*   **Level 2 (Cards):** `surface_container` (#152031) - Individual prompt entries.
*   **Level 3 (Pop-overs):** `surface_container_highest` (#2a3548) - Overlays and tooltips.

## 3. Typography: Editorial Logic
We utilize a triple-font system to create a "Developer-Luxury" hierarchy.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` (3.5rem) for high-impact hero statements. The wide apertures of Manrope convey openness and modernity.
*   **Body & Titles (Inter):** The workhorse. Inter provides maximum readability for complex prompt strings. Use `body-md` (0.875rem) for primary prompt text to maintain a high-density, "pro" feel.
*   **Labels & Metadata (Space Grotesk):** This is our "Tech Signature." Use `label-md` for tags, tokens, and technical metadata. Its quirky, monospaced-adjacent character signals to developers that they are in a technical environment.

## 4. Elevation & Depth
We convey hierarchy through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface_container_low` card on a `surface_container_lowest` background. The subtle shift from `#111c2d` to `#040e1f` creates a soft, natural lift.
*   **Ambient Shadows:** When an element must "float" (like a modal or dropdown), use a shadow with a blur of `24px` to `48px` at `6%` opacity. The shadow color should not be black; it must be a tinted version of `on_surface` (#d8e3fb) to mimic natural light dispersion within the indigo environment.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#454652) at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** For floating navigation or headers, use `surface_container` with a `backdrop-filter: blur(12px)`. This allows the vibrant cyan and indigo accents to bleed through as the user scrolls, creating a sense of immersion.

## 5. Components

### Cards (The Prompt Vessel)
*   **Style:** No borders. Use `surface_container` background.
*   **Corner Radius:** Always `xl` (1.5rem) for the outer container and `md` (0.75rem) for nested elements like code blocks.
*   **Spacing:** Use `spacing-6` (1.5rem) for internal padding to give the "prompt" room to breathe.

### Buttons (The Action Signal)
*   **Primary:** Background `primary`, text `on_primary`. 12px radius. No shadow on rest; subtle `secondary` glow on hover.
*   **Secondary:** Background `secondary_container`, text `on_secondary_container`. Use for "Copy Prompt" or "Fork" actions.
*   **Tertiary:** Ghost style. No background. Use `secondary` text color.

### Inputs (The Command Line)
*   **Style:** `surface_container_highest` background. No border. 
*   **Focus State:** A 2px "Ghost Border" using `secondary` at 40% opacity. 
*   **Typography:** Use `label-md` (Space Grotesk) for the input text to emphasize the "command" nature of the field.

### Prompt-Specific Components
*   **Token Tags:** Small chips using `tertiary_container` with `label-sm` text. These should identify variables within a prompt (e.g., `[Subject]`, `[Style]`).
*   **Code Blocks:** Use `surface_container_lowest` with a "Ghost Border." Syntax highlighting should strictly follow the `secondary` (Cyan) and `tertiary` (Violet) color tokens.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins (e.g., `spacing-24` on the left, `spacing-12` on the right) for hero layouts to create an editorial feel.
*   **Do** use `secondary_fixed_dim` for icons to ensure they feel "lit from within" against the dark indigo background.
*   **Do** rely on the spacing scale (e.g., `spacing-8` vs `spacing-4`) to separate content groups instead of horizontal rules.

### Don't:
*   **Don't** use pure black (#000000) or pure white (#FFFFFF). Use the provided `surface` and `on_surface` tokens to maintain the sophisticated color profile.
*   **Don't** use standard "drop shadows" on cards. If the tonal shift between `surface` and `surface_container` isn't enough, increase the background contrast—don't add a shadow.
*   **Don't** use `Inter` for large headlines. It lacks the "curated" personality required for the brand. Stick to `Manrope`.