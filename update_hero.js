import fs from 'fs';

const filePath = 'c:/llixtar/WORK/child-school-landing/components/Hero.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Add supabase import
if (!code.includes('import { supabase } from "@/lib/supabase";')) {
  code = code.replace(
    'import { useState, useEffect } from "react";',
    'import { useState, useEffect } from "react";\nimport { supabase } from "@/lib/supabase";'
  );
}

// Replace the hardcoded promotions array and add fetching logic
const stateAndFetch = `
  const [promotions, setPromotions] = useState<any[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const { data, error } = await supabase
          .from("promotions")
          .select("*")
          .order("sort_order", { ascending: true });
        if (!error && data) {
          setPromotions(data);
        }
      } catch (err) {
        console.error("Error fetching promotions", err);
      } finally {
        setPromotionsLoading(false);
      }
    };
    fetchPromos();
  }, []);
`;

code = code.replace(
  /const promotions = \[\s*\{[\s\S]*?\}\s*\];/,
  stateAndFetch
);

// We need to modify how current promo is formatted.
// The hardcoded promotions had properties: color, textColor, discount, badge, etc.
// The db has: bg_color, text_color, discount_text, badge, etc.
// We should map them in the render or transform them after fetch.
// Let's modify the fetch to transform data.
code = code.replace(
  /setPromotions\(data\);/,
  `const mapped = data.map(p => ({
            id: p.id,
            badge: p.badge,
            title: p.title,
            desc: p.description,
            discount: p.discount_text,
            expiryDate: p.expiry_date, // native date string
            color: p.bg_color,
            textColor: p.text_color,
            link: p.link,
            btnText: p.btn_text
          }));
          setPromotions(mapped);`
);

// We need to modify timeLeft logic. 
// We should check if expiryDate is null. If so, "Постійна".
// If > 7 days, "До DD month".
// If <= 7 days, timeLeft countdown.
const timerLogic = `
  // Formatted expiry text for > 7 days
  const [expiryText, setExpiryText] = useState("Постійна");

  // Countdown timer for giveaways or time-limited promotions
  useEffect(() => {
    if (promotions.length === 0 || !promotions[currentPromo]) return;
    const targetDateStr = promotions[currentPromo].expiryDate;
    
    if (!targetDateStr) {
      setTimeLeft(null);
      setExpiryText("Постійна");
      return;
    }

    const difference = +new Date(targetDateStr) - +new Date();
    const daysLeft = difference / (1000 * 60 * 60 * 24);

    if (daysLeft > 7) {
      setTimeLeft(null);
      const date = new Date(targetDateStr);
      const months = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
      setExpiryText(\`до \${date.getDate()} \${months[date.getMonth()]}\`);
      return;
    }

    const calculateTimeLeft = () => {
      const diff = +new Date(targetDateStr) - +new Date();
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPromo, promotions]);
`;

code = code.replace(
  /\/\/ Countdown timer[\s\S]*?\}, \[currentPromo\]\);/,
  timerLogic
);

// In the UI, use expiryText instead of promotions[currentPromo].expiry
code = code.replace(
  /\{promotions\[currentPromo\]\.expiry\}/g,
  '{expiryText}'
);

// Fix layout for empty promotions.
// Left column: className="text-center lg:col-span-7 lg:text-left flex flex-col justify-center"
// If promotions.length === 0, make it full width and centered on desktop too.
code = code.replace(
  `className="text-center lg:col-span-7 lg:text-left flex flex-col justify-center"`,
  `className={\`text-center flex flex-col justify-center transition-all \${promotions.length > 0 ? "lg:col-span-7 lg:text-left" : "lg:col-span-12 items-center"}\`}`
);

// Hide mobile and desktop promo components if promotions.length === 0
// Wrapping mobile block
code = code.replace(
  /<div\s*onTouchStart=\{handleTouchStart\}[\s\S]*?{isMobileExpanded \? "min-h-\[110px\]" : "min-h-\[55px\]"\}`}/,
  `{promotions.length > 0 && (\n            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => {
                // Ignore toggling when clicking links or buttons
                if ((e.target as HTMLElement).closest("a, button")) return;
                setIsMobileExpanded(!isMobileExpanded);
              }}
              className={\`lg:hidden relative w-full max-w-sm bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 mb-6 overflow-visible text-left mx-auto transition-all duration-300 cursor-pointer select-none \${
                isMobileExpanded ? "min-h-[110px]" : "min-h-[55px]"
              }\`}`
);

// Close mobile block
code = code.replace(
  /(\s*<\/div>\s*)({\/\* ГОЛОВНИЙ ЗАГОЛОВОК: Окреме керування розмірами тексту \*\/})/,
  `$1          )}
$2`
);

// Wrap desktop block
code = code.replace(
  /<div\s*onMouseEnter=\{\(\) => setIsPaused\(true\)\}[\s\S]*?className="hidden lg:flex lg:col-span-5 w-full justify-center lg:justify-end"/,
  `{promotions.length > 0 && (\n          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="hidden lg:flex lg:col-span-5 w-full justify-center lg:justify-end"`
);

// Close desktop block
code = code.replace(
  /(\s*<\/div>\s*<\/div>\s*)({\/\* ПЕРЕВАГИ БАТЬКІВ)/,
  `$1        )}
$2`
);

// Handle newlines in description properly for Array mapping in UI
// It was: Array.isArray(promotions[currentPromo].desc)
// Now we use split('\n')
code = code.replace(
  /Array\.isArray\(promotions\[currentPromo\]\.desc\)/g,
  '(promotions[currentPromo].desc && promotions[currentPromo].desc.includes("\\n"))'
);
code = code.replace(
  /\(promotions\[currentPromo\]\.desc as string\[\]\)/g,
  '(promotions[currentPromo].desc.split("\\n"))'
);


fs.writeFileSync(filePath, code);
