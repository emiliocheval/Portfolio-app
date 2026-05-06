import type { IconType } from "react-icons";
import { FaCubes, FaUniversalAccess } from "react-icons/fa";
import {
  SiCanva,
  SiClockify,
  SiCss,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGooglegemini,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPnpm,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiReact,
  SiRedis,
  SiRedux,
  SiRender,
  SiSanity,
  SiSass,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTelegram,
  SiTypescript,
  SiUpstash,
  SiVercel,
  SiVite,
  SiWordpress,
} from "react-icons/si";

export type TechDef = {
  name: string;
  color: string;
  Icon: IconType;
};

const DesignsystemIcon = FaCubes as IconType;
const WcagIcon = FaUniversalAccess as IconType;

/** Tools and tech — icons and accent colours for the grid and tags. */
export const secretRecipeTools: TechDef[] = [
  { name: "React", color: "#61DAFB", Icon: SiReact },
  { name: "Next.js", color: "#FAFAFA", Icon: SiNextdotjs },
  { name: "TypeScript", color: "#3178C6", Icon: SiTypescript },
  { name: "JavaScript", color: "#F7DF1E", Icon: SiJavascript },
  { name: "HTML", color: "#E34F26", Icon: SiHtml5 },
  { name: "CSS", color: "#1572B6", Icon: SiCss },
  { name: "Tailwind", color: "#06B6D4", Icon: SiTailwindcss },
  { name: "SCSS", color: "#CC6699", Icon: SiSass },
  { name: "Figma", color: "#F24E1E", Icon: SiFigma },
  {
    name: "Design systems",
    color: "#818CF8",
    Icon: DesignsystemIcon,
  },
  { name: "WCAG", color: "#059669", Icon: WcagIcon },
  { name: "Node.js", color: "#339933", Icon: SiNodedotjs },
  { name: "Express", color: "#B8B8B8", Icon: SiExpress },
  { name: "PostgreSQL", color: "#4169E1", Icon: SiPostgresql },
  { name: "MySQL", color: "#4479A1", Icon: SiMysql },
  { name: "Prisma", color: "#2D3748", Icon: SiPrisma },
  { name: "Supabase", color: "#3ECF8E", Icon: SiSupabase },
  { name: "Sanity", color: "#F03E2F", Icon: SiSanity },
  { name: "MongoDB", color: "#47A248", Icon: SiMongodb },
  { name: "Redis", color: "#DC382D", Icon: SiRedis },
  { name: "Git", color: "#F05032", Icon: SiGit },
  { name: "Vercel", color: "#FAFAFA", Icon: SiVercel },
  { name: "Vite", color: "#646CFF", Icon: SiVite },
  { name: "pnpm", color: "#F69220", Icon: SiPnpm },
  { name: "Redux", color: "#764ABC", Icon: SiRedux },
  { name: "Framer Motion", color: "#0055FF", Icon: SiFramer },
  { name: "WordPress", color: "#21759B", Icon: SiWordpress },
  { name: "Firebase", color: "#FFCA28", Icon: SiFirebase },
  { name: "Context", color: "#61DAFB", Icon: SiReact },
  { name: "Postman", color: "#FF6C37", Icon: SiPostman },
  { name: "Shadcn/ui", color: "#FAFAFA", Icon: SiShadcnui },
  { name: "Zustand", color: "#8B5A2B", Icon: FaCubes as IconType },
  { name: "Canva", color: "#00C4CC", Icon: SiCanva },
];

const byName = new Map(secretRecipeTools.map((t) => [t.name, t]));

const extraTags: Record<string, Pick<TechDef, "color" | "Icon">> = {
  "Next.js 15": { color: "#FAFAFA", Icon: SiNextdotjs },
  "Upstash Redis": { color: "#00E9A3", Icon: SiUpstash },
  "Gemini AI": { color: "#8E75FF", Icon: SiGooglegemini },
  "Google APIs": { color: "#4285F4", Icon: SiGooglecloud },
  "Telegram Bot API": { color: "#26A5E4", Icon: SiTelegram },
  Render: { color: "#46E3B7", Icon: SiRender },
  Luxon: { color: "#1D4ED8", Icon: SiClockify },
};

export function getTechDef(name: string): TechDef | undefined {
  const base = byName.get(name);
  if (base) return base;
  const ex = extraTags[name];
  if (ex) return { name, color: ex.color, Icon: ex.Icon };
  return undefined;
}

export function getTagPillProps(name: string): TechDef {
  return (
    getTechDef(name) ?? {
      name,
      color: "#94A3B8",
      Icon: FaCubes,
    }
  );
}
