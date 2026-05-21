import { defineConfig } from "tinacms";

const branch = process.env.VERCEL_GIT_COMMIT_REF || "main";

// Force local-only mode by clearing these out temporarily
const clientId = "40f8cbe7-33bd-4a2d-afd5-753a41502a89"; 
const token = "1c732fc862902a4e3a6fcb2efbb1bf2615950e8b";

export default defineConfig({
  branch,
  clientId, 
  token,       
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    // ... leave your collections block as it is
    collections: [
      {
        name: "pages",
        label: "Website Pages",
        path: "src/content/pages",
        format: "md",
        slugify: (values) => `${(values.title || "").toLowerCase().replace(/ /g, "-")}`,
        fields: [
          { type: "number", name: "menuOrder", label: "Menu Order Position" },
          { type: "string", name: "parentMenu", label: "Parent Menu Group (Optional)" },
          { type: "string", name: "title", label: "Page Title (For Navigation Menu)", required: true },
          { type: "string", name: "heroTitle", label: "Main Heading" },
          { type: "string", name: "heroTagline", label: "Subheading" },
          { type: "rich-text", name: "body", label: "Main Text Content", isBody: true },
        ],
      },
      // NEW: Global Settings Panel Collection
      {
        name: "global",
        label: "Global Settings",
        path: "src/content/global",
        format: "json", // Using JSON here is clean for pure configuration data
        ui: {
          allowedActions: {
            create: false, // Disallow creating new global files
            delete: false, // Disallow deleting the configuration
          },
        },
        fields: [
          {
            type: "object",
            name: "header",
            label: "Header Settings",
            fields: [
              { type: "string", name: "siteName", label: "Website Brand Name" },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer Settings",
            fields: [
              { type: "string", name: "copyrightText", label: "Copyright Statement" },
              { type: "string", name: "contactEmail", label: "Global Contact Email" },
            ],
          },
        ],
      },
    ],
  },
});