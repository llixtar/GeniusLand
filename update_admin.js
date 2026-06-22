import fs from 'fs';

const filePath = 'c:/llixtar/WORK/child-school-landing/app/admin/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add DBPromotion interface
const dbPromotionInterface = `
interface DBPromotion {
  id?: string;
  created_at?: string;
  badge: string;
  title: string;
  description: string;
  discount_text: string;
  expiry_date: string | null;
  bg_color: string;
  text_color: string;
  link: string;
  btn_text: string;
  sort_order?: number;
}
`;
if (!code.includes('interface DBPromotion')) {
  code = code.replace('interface GalleryPhoto {', dbPromotionInterface + '\ninterface GalleryPhoto {');
}

// 2. Add "promotions" to activeTab
code = code.replace(
  `const [activeTab, setActiveTab] = useState<"leads" | "reviews" | "pricing" | "teachers" | "articles" | "courses" | "gallery">("leads");`,
  `const [activeTab, setActiveTab] = useState<"leads" | "reviews" | "pricing" | "teachers" | "articles" | "courses" | "gallery" | "promotions">("leads");`
);

// 3. Add state and functions
const promotionsStateAndFunctions = `
  // Promotions states
  const [promotions, setPromotions] = useState<DBPromotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  
  const [addPromoBadge, setAddPromoBadge] = useState("АКЦІЯ");
  const [addPromoTitle, setAddPromoTitle] = useState("");
  const [addPromoDesc, setAddPromoDesc] = useState("");
  const [addPromoDiscount, setAddPromoDiscount] = useState("");
  const [addPromoExpiryType, setAddPromoExpiryType] = useState<"permanent" | "date">("permanent");
  const [addPromoExpiryDate, setAddPromoExpiryDate] = useState("");
  const [addPromoBgColor, setAddPromoBgColor] = useState("bg-btn-ctaBg");
  const [addPromoTextColor, setAddPromoTextColor] = useState("text-btn-ctaText");
  const [addPromoLinkType, setAddPromoLinkType] = useState<"section" | "custom">("section");
  const [addPromoSection, setAddPromoSection] = useState("#prices");
  const [addPromoCustomLink, setAddPromoCustomLink] = useState("");
  const [addPromoBtnText, setAddPromoBtnText] = useState("Обрати курс");
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  const fetchPromotions = async () => {
    setPromotionsLoading(true);
    try {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setPromotions(data || []);
    } catch (err: any) {
      console.error("Error fetching promotions:", err?.message || err);
    } finally {
      setPromotionsLoading(false);
    }
  };

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPromoTitle.trim() || !addPromoDesc.trim() || !addPromoDiscount.trim() || !addPromoBtnText.trim()) return;
    setIsAddingPromo(true);

    try {
      let expiry_date = null;
      if (addPromoExpiryType === "date" && addPromoExpiryDate) {
        expiry_date = new Date(addPromoExpiryDate).toISOString();
      }

      let finalLink = addPromoLinkType === "section" ? addPromoSection : addPromoCustomLink;

      const nextSortOrder = promotions.length > 0 ? Math.max(...promotions.map(p => p.sort_order || 0)) + 1 : 0;

      const { data, error } = await supabase
        .from("promotions")
        .insert([{
          badge: addPromoBadge,
          title: addPromoTitle,
          description: addPromoDesc,
          discount_text: addPromoDiscount,
          expiry_date,
          bg_color: addPromoBgColor,
          text_color: addPromoTextColor,
          link: finalLink,
          btn_text: addPromoBtnText,
          sort_order: nextSortOrder
        }])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        setPromotions(prev => [...prev, data[0]]);
      }
      
      setAddPromoTitle("");
      setAddPromoDesc("");
      setAddPromoDiscount("");
      setAddPromoCustomLink("");
    } catch (err) {
      console.error("Error adding promotion:", err);
      alert("Не вдалося додати акцію.");
    } finally {
      setIsAddingPromo(false);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!confirm("Видалити цю акцію?")) return;
    try {
      setPromotions(prev => prev.filter(p => p.id !== id));
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      alert("Помилка видалення.");
      fetchPromotions();
    }
  };

  // End of promotions state
`;
if (!code.includes('const [promotions, setPromotions]')) {
  code = code.replace(
    '  const router = useRouter();',
    promotionsStateAndFunctions + '\n  const router = useRouter();'
  );
}

// 4. Fetch promotions in useEffect
if (!code.includes('fetchPromotions();')) {
  code = code.replace(
    'fetchGallery();',
    'fetchGallery();\n        fetchPromotions();'
  );
}

// 5. Sidebar mapping and buttons
code = code.replace(
  `{activeTab === "gallery" && "🖼️ Керування Галереєю фото"}`,
  `{activeTab === "gallery" && "🖼️ Керування Галереєю фото"}\n            {activeTab === "promotions" && "🎁 Керування Акціями"}`
);

const desktopBtnGallery = `
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={\`w-full text-left px-5 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider border-2 border-transparent transition-all \${
                    activeTab === "gallery" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                  }\`}
                >
                  <span className="mr-2">🖼️</span> Галерея
                </button>
`;
const desktopBtnPromotions = `
                <button
                  onClick={() => setActiveTab("promotions")}
                  className={\`w-full text-left px-5 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider border-2 border-transparent transition-all \${
                    activeTab === "promotions" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                  }\`}
                >
                  <span className="mr-2">🎁</span> Акції
                </button>
`;
if (!code.includes('setActiveTab("promotions")') && code.includes(desktopBtnGallery)) {
  code = code.replace(desktopBtnGallery, desktopBtnGallery + desktopBtnPromotions);
}

const mobileBtnGallery = `
              <button
                onClick={() => { setActiveTab("gallery"); setIsMobileMenuOpen(false); }}
                className={\`w-full text-left px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider \${
                  activeTab === "gallery" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
                }\`}
              >
                <span className="mr-2">🖼️</span> Галерея
              </button>
`;
const mobileBtnPromotions = `
              <button
                onClick={() => { setActiveTab("promotions"); setIsMobileMenuOpen(false); }}
                className={\`w-full text-left px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider \${
                  activeTab === "promotions" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
                }\`}
              >
                <span className="mr-2">🎁</span> Акції
              </button>
`;
if (code.includes(mobileBtnGallery) && !code.includes(mobileBtnPromotions)) {
  code = code.replace(mobileBtnGallery, mobileBtnGallery + mobileBtnPromotions);
}

// 6. Promotions Tab UI Content
const promotionsTabHtml = `
        {/* TAB 8: PROMOTIONS CONTENT */}
        {activeTab === "promotions" && (
          <div className="flex flex-col gap-6">
            <div className="border-4 border-black bg-[#facc15]/10 p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase tracking-wider text-black mb-6">➕ Додати нову акцію</h3>
              <form onSubmit={handleAddPromotion} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Бейдж (напис на плашці)</label>
                    <input type="text" value={addPromoBadge} onChange={e => setAddPromoBadge(e.target.value)} placeholder="Напр. АКЦІЯ або НОВИНКА" className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Текст знижки (кругла плашка)</label>
                    <input type="text" value={addPromoDiscount} onChange={e => setAddPromoDiscount(e.target.value)} placeholder="Напр. -10% або FREE" className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Заголовок акції</label>
                    <input type="text" value={addPromoTitle} onChange={e => setAddPromoTitle(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Опис (можна в кілька рядків)</label>
                    <textarea rows={3} value={addPromoDesc} onChange={e => setAddPromoDesc(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Тип дійсності</label>
                    <select value={addPromoExpiryType} onChange={e => setAddPromoExpiryType(e.target.value as any)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors">
                      <option value="permanent">Постійна</option>
                      <option value="date">До конкретної дати (або таймер)</option>
                    </select>
                  </div>
                  {addPromoExpiryType === "date" && (
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Дата та час завершення</label>
                      <input type="datetime-local" value={addPromoExpiryDate} onChange={e => setAddPromoExpiryDate(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors" />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Колір плашки (Tailwind клас)</label>
                    <select value={addPromoBgColor} onChange={e => setAddPromoBgColor(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors">
                      <option value="bg-btn-ctaBg">Жовтий (bg-btn-ctaBg)</option>
                      <option value="bg-brand-secondary">Синій (bg-brand-secondary)</option>
                      <option value="bg-[#e11d48]">Червоний (bg-[#e11d48])</option>
                      <option value="bg-emerald-500">Зелений (bg-emerald-500)</option>
                      <option value="bg-violet-500">Фіолетовий (bg-violet-500)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Колір тексту на плашці</label>
                    <select value={addPromoTextColor} onChange={e => setAddPromoTextColor(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors">
                      <option value="text-btn-ctaText">Чорний (text-btn-ctaText)</option>
                      <option value="text-white">Білий (text-white)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 mb-1">Текст кнопки</label>
                    <input type="text" value={addPromoBtnText} onChange={e => setAddPromoBtnText(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors" />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-500 mb-1">Куди веде кнопка?</label>
                      <select value={addPromoLinkType} onChange={e => setAddPromoLinkType(e.target.value as any)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors">
                        <option value="section">Блок на сайті</option>
                        <option value="custom">Своє посилання (Інстаграм, тощо)</option>
                      </select>
                    </div>
                    {addPromoLinkType === "section" ? (
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-1">Оберіть блок</label>
                        <select value={addPromoSection} onChange={e => setAddPromoSection(e.target.value)} className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors">
                          <option value="#courses">Курси</option>
                          <option value="#prices">Тарифи</option>
                          <option value="#teachers">Викладачі</option>
                          <option value="#contacts">Контакти</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-1">Вставте посилання</label>
                        <input type="text" value={addPromoCustomLink} onChange={e => setAddPromoCustomLink(e.target.value)} placeholder="https://instagram.com/..." className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#facc15] transition-colors" />
                      </div>
                    )}
                  </div>

                </div>
                <div className="mt-2 flex justify-end">
                  <button type="submit" disabled={isAddingPromo} className="px-6 py-3 rounded-xl border-4 border-black bg-[#facc15] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50">
                    {isAddingPromo ? "Додаємо..." : "Додати акцію"}
                  </button>
                </div>
              </form>
            </div>

            <div className="border-4 border-black bg-white p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black uppercase tracking-wider text-black mb-4">Активні акції</h3>
              {promotionsLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#facc15]" /></div>
              ) : promotions.length === 0 ? (
                <p className="text-center text-slate-500 font-bold p-8">Немає акцій. Додайте першу!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promotions.map(promo => (
                    <div key={promo.id} className="border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={\`text-xs font-bold px-2 py-1 border border-black rounded \${promo.bg_color} \${promo.text_color}\`}>{promo.badge}</span>
                          <span className="text-xs font-bold text-slate-500">{promo.expiry_date ? new Date(promo.expiry_date).toLocaleString('uk') : "Постійна"}</span>
                        </div>
                        <h4 className="font-black text-lg mb-1">{promo.title}</h4>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{promo.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                        <span className={\`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold text-xs \${promo.bg_color} \${promo.text_color}\`}>{promo.discount_text}</span>
                        <button onClick={() => handleDeletePromotion(promo.id!)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
`;

if (!code.includes('activeTab === "promotions" && (')) {
  code = code.replace(
    /{\/\* TAB 7: GALLERY CONTENT \*\//,
    promotionsTabHtml + '\n\n        {/* TAB 7: GALLERY CONTENT */'
  );
}

fs.writeFileSync(filePath, code);
