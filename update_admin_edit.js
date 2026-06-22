import fs from 'fs';

const filePath = 'c:/llixtar/WORK/child-school-landing/app/admin/page.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add edit states
const editStates = `
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [isUpdatingPromo, setIsUpdatingPromo] = useState(false);
`;

if (!code.includes('const [editingPromoId')) {
  code = code.replace(
    /const \[isAddingPromo, setIsAddingPromo\] = useState\(false\);/,
    `const [isAddingPromo, setIsAddingPromo] = useState(false);\n${editStates}`
  );
}

// 2. Add handleEdit and handleUpdate
const editFunctions = `
  const handleStartEditPromotion = (promo: DBPromotion) => {
    setEditingPromoId(promo.id!);
    setAddPromoBadge(promo.badge);
    setAddPromoTitle(promo.title);
    setAddPromoDesc(promo.description);
    setAddPromoDiscount(promo.discount_text);
    
    if (promo.expiry_date) {
      setAddPromoExpiryType("date");
      // Format to datetime-local expected string
      const d = new Date(promo.expiry_date);
      const pad = (n: number) => n.toString().padStart(2, "0");
      setAddPromoExpiryDate(\`\${d.getFullYear()}-\${pad(d.getMonth()+1)}-\${pad(d.getDate())}T\${pad(d.getHours())}:\${pad(d.getMinutes())}\`);
    } else {
      setAddPromoExpiryType("permanent");
      setAddPromoExpiryDate("");
    }
    
    setAddPromoBgColor(promo.bg_color);
    setAddPromoTextColor(promo.text_color);
    setAddPromoBtnText(promo.btn_text);
    
    if (promo.link.startsWith("#")) {
      setAddPromoLinkType("section");
      setAddPromoSection(promo.link);
      setAddPromoCustomLink("");
    } else {
      setAddPromoLinkType("custom");
      setAddPromoSection("#prices");
      setAddPromoCustomLink(promo.link);
    }
    
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromoId || !addPromoTitle.trim() || !addPromoDesc.trim() || !addPromoDiscount.trim() || !addPromoBtnText.trim()) return;
    setIsUpdatingPromo(true);

    try {
      let expiry_date = null;
      if (addPromoExpiryType === "date" && addPromoExpiryDate) {
        expiry_date = new Date(addPromoExpiryDate).toISOString();
      }

      let finalLink = addPromoLinkType === "section" ? addPromoSection : addPromoCustomLink;

      const { error } = await supabase
        .from("promotions")
        .update({
          badge: addPromoBadge,
          title: addPromoTitle,
          description: addPromoDesc,
          discount_text: addPromoDiscount,
          expiry_date,
          bg_color: addPromoBgColor,
          text_color: addPromoTextColor,
          link: finalLink,
          btn_text: addPromoBtnText
        })
        .eq("id", editingPromoId);

      if (error) throw error;
      
      setPromotions(prev => prev.map(p => p.id === editingPromoId ? {
        ...p,
        badge: addPromoBadge,
        title: addPromoTitle,
        description: addPromoDesc,
        discount_text: addPromoDiscount,
        expiry_date,
        bg_color: addPromoBgColor,
        text_color: addPromoTextColor,
        link: finalLink,
        btn_text: addPromoBtnText
      } : p));
      
      setEditingPromoId(null);
      setAddPromoBadge("АКЦІЯ");
      setAddPromoTitle("");
      setAddPromoDesc("");
      setAddPromoDiscount("");
      setAddPromoExpiryType("permanent");
      setAddPromoExpiryDate("");
      setAddPromoBgColor("bg-btn-ctaBg");
      setAddPromoTextColor("text-btn-ctaText");
      setAddPromoLinkType("section");
      setAddPromoSection("#prices");
      setAddPromoCustomLink("");
      setAddPromoBtnText("Обрати курс");
    } catch (err) {
      console.error("Error updating promotion:", err);
      alert("Не вдалося оновити акцію.");
    } finally {
      setIsUpdatingPromo(false);
    }
  };

  const handleCancelEditPromo = () => {
    setEditingPromoId(null);
    setAddPromoBadge("АКЦІЯ");
    setAddPromoTitle("");
    setAddPromoDesc("");
    setAddPromoDiscount("");
    setAddPromoExpiryType("permanent");
    setAddPromoExpiryDate("");
    setAddPromoBgColor("bg-btn-ctaBg");
    setAddPromoTextColor("text-btn-ctaText");
    setAddPromoLinkType("section");
    setAddPromoSection("#prices");
    setAddPromoCustomLink("");
    setAddPromoBtnText("Обрати курс");
  };
`;

if (!code.includes('handleStartEditPromotion')) {
  code = code.replace(
    /const handleDeletePromotion = async/,
    editFunctions + '\n  const handleDeletePromotion = async'
  );
}

// 3. Update UI Header
code = code.replace(
  `mb-6">➕ Додати нову акцію</h3>`,
  `mb-6">{editingPromoId ? "✏️ Редагувати акцію" : "➕ Додати нову акцію"}</h3>`
);

// 4. Update Form submit handler
code = code.replace(
  `<form onSubmit={handleAddPromotion} className="flex flex-col gap-5">`,
  `<form onSubmit={editingPromoId ? handleUpdatePromotion : handleAddPromotion} className="flex flex-col gap-5">`
);

// 5. Update submit buttons
code = code.replace(
  /<button type="submit" disabled=\{isAddingPromo\}[\s\S]*?<\/button>/,
  `
                  {editingPromoId ? (
                    <div className="flex gap-2">
                      <button type="button" onClick={handleCancelEditPromo} className="px-6 py-3 rounded-xl border-4 border-black bg-white font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                        Скасувати
                      </button>
                      <button type="submit" disabled={isUpdatingPromo} className="px-6 py-3 rounded-xl border-4 border-black bg-[#facc15] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50">
                        {isUpdatingPromo ? "Зберігаємо..." : "Зберегти зміни"}
                      </button>
                    </div>
                  ) : (
                    <button type="submit" disabled={isAddingPromo} className="px-6 py-3 rounded-xl border-4 border-black bg-[#facc15] font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50">
                      {isAddingPromo ? "Додаємо..." : "Додати акцію"}
                    </button>
                  )}
  `
);

// 6. Add Edit button in the list
const editButtonHtml = `
                        <div className="flex gap-2">
                          <button onClick={() => handleStartEditPromotion(promo)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeletePromotion(promo.id!)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
`;
code = code.replace(
  /<button onClick=\{\(\) => handleDeletePromotion\(promo.id!\)\}[\s\S]*?<\/button>/,
  editButtonHtml
);

fs.writeFileSync(filePath, code);
