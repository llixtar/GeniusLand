"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { optimizeImageToWebP } from "@/lib/imageOptimizer";
import { 
  LogOut, 
  RefreshCw, 
  Search, 
  Phone, 
  Calendar, 
  Trash2, 
  Loader2, 
  Check,
  ChevronDown,
  AlertCircle,
  Plus,
  Edit3,
  ArrowUp,
  ArrowDown,
  Menu,
  X
} from "lucide-react";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  course: string | null;
  comment: string | null;
  status: string;
  notes: string | null;
}

interface Review {
  id: string;
  created_at: string;
  author: string;
  text: string;
}

interface DBPrice {
  id: string;
  created_at: string;
  name: string;
  lessons: string;
  price: string;
  duration: string;
  billing_plan: string;
  alt_lessons: string | null;
  alt_price: string | null;
  sort_order: number;
}

interface DBTeacher {
  id?: string;
  name: string;
  role: string;
  image: string;
  experience: string;
  sub_experience?: string | null;
  quote: string;
  bullets: string[];
  sort_order?: number;
}

interface DBArticle {
  id: string;
  created_at: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  content: string[];
}

interface DBCourse {
  id?: string;
  created_at?: string;
  title: string;
  subtitle?: string | null;
  age: string;
  info: string;
  online: string;
  group_duration?: string | null;
  indiv_duration: string;
  points: string[];
  bg_image: string;
  is_full_width: boolean;
  sort_order?: number;
}

interface GalleryPhoto {
  id: string;
  created_at: string;
  url: string;
  storage_path: string;
}

const statusOptions = [
  { value: "new", label: "🆕 Нова", bg: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "in_progress", label: "⏳ В роботі", bg: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "contacted", label: "📞 Зв'язалися", bg: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "completed", label: "✅ Завершено", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "cancelled", label: "❌ Скасовано", bg: "bg-rose-100 text-rose-800 border-rose-300" },
];

const courseMapping: { [key: string]: string } = {
  "tutor_group": "📚 Репетиторство (Група)",
  "english_group": "🇬🇧 Англійська мова (Група)",
  "speech_group": "🗣️ Логопед (Група)",
  "mental_group": "🧮 Ментальна арифметика (Група)",
  "speedread_group": "⚡ Швидкочитання (Група)",
  "school_group": "🎒 Підготовка до школи (Група)",
  "tutor_indiv": "📚 Репетиторство (Індивідуально)",
  "english_indiv": "🇬🇧 Англійська мова (Індивідуально)",
  "speech_indiv": "🗣️ Логопед (Індивідуально)",
  "multiply_indiv": "✖️ Таблиця множення (Індивідуально)",
  "mental_indiv": "🧮 Ментальна арифметика (Індивідуально)",
  "speedread_indiv": "⚡ Швидкочитання (Індивідуально)",
  "school_indiv": "🎒 Підготовка до школи (Індивідуально)",
};

const getCourseLabel = (value: string | null) => {
  if (!value) return "❓ Ще не визначились";
  return courseMapping[value] || value;
};

const getAuthorEmoji = (author: string, index: number) => {
  const lower = author.toLowerCase();
  if (lower.includes("тато") || lower.includes("батько") || lower.includes("татові")) {
    const maleIcons = ["👨", "👨‍🎓", "👨‍🎨"];
    return maleIcons[index % maleIcons.length];
  }
  const femaleIcons = ["👩", "👩‍🎓", "👩‍🎨"];
  return femaleIcons[index % femaleIcons.length];
};

const getUkDate = () => {
  const months = [
    "Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня",
    "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня"
  ];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
};

const translit = (str: string) => {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'y', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
    'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
    'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g'
  } as any;
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i].toLowerCase();
    if (ru[char] !== undefined) {
      newStr += ru[char];
    } else {
      newStr += char;
    }
  }
  return newStr
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"leads" | "reviews" | "pricing" | "teachers" | "articles" | "courses" | "gallery">("leads");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Authentication states
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Leads states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);
  const [savedNotesId, setSavedNotesId] = useState<string | null>(null);

  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newAuthor, setNewAuthor] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewSearch, setReviewSearch] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editAuthor, setEditAuthor] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [isUpdatingReview, setIsUpdatingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  // Pricing states
  const [pricingList, setPricingList] = useState<DBPrice[]>([]);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingPlanFilter, setPricingPlanFilter] = useState<"group" | "individual">("group");
  const [pricingPage, setPricingPage] = useState(1);
  const pricingPerPage = 3;
  const [addName, setAddName] = useState("");
  const [addLessons, setAddLessons] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addDuration, setAddDuration] = useState("");
  const [addBillingPlan, setAddBillingPlan] = useState<"group" | "individual">("group");
  const [addAltLessons, setAddAltLessons] = useState("");
  const [addAltPrice, setAddAltPrice] = useState("");
  const [isAddingPrice, setIsAddingPrice] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLessons, setEditLessons] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editAltLessons, setEditAltLessons] = useState("");
  const [editAltPrice, setEditAltPrice] = useState("");
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Teachers states
  const [teachers, setTeachers] = useState<DBTeacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [addTeacherName, setAddTeacherName] = useState("");
  const [addTeacherRole, setAddTeacherRole] = useState("");
  const [addTeacherImage, setAddTeacherImage] = useState("/teachers/maryna.jpg");
  const [addTeacherExperience, setAddTeacherExperience] = useState("");
  const [addTeacherSubExperience, setAddTeacherSubExperience] = useState("");
  const [addTeacherQuote, setAddTeacherQuote] = useState("");
  const [addTeacherBullets, setAddTeacherBullets] = useState("");
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [editTeacherName, setEditTeacherName] = useState("");
  const [editTeacherRole, setEditTeacherRole] = useState("");
  const [editTeacherImage, setEditTeacherImage] = useState("");
  const [editTeacherExperience, setEditTeacherExperience] = useState("");
  const [editTeacherSubExperience, setEditTeacherSubExperience] = useState("");
  const [editTeacherQuote, setEditTeacherQuote] = useState("");
  const [editTeacherBullets, setEditTeacherBullets] = useState("");
  const [isUpdatingTeacher, setIsUpdatingTeacher] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [teachersPage, setTeachersPage] = useState(1);
  const teachersPerPage = 3;

  // Articles states
  const [dbArticles, setDbArticles] = useState<DBArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [addArticleTitle, setAddArticleTitle] = useState("");
  const [addArticleSlug, setAddArticleSlug] = useState("");
  const [addArticleDescription, setAddArticleDescription] = useState("");
  const [addArticleCategory, setAddArticleCategory] = useState("Ментальна арифметика");
  const [addArticleDate, setAddArticleDate] = useState("");
  const [addArticleContent, setAddArticleContent] = useState("");
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editArticleTitle, setEditArticleTitle] = useState("");
  const [editArticleSlug, setEditArticleSlug] = useState("");
  const [editArticleDescription, setEditArticleDescription] = useState("");
  const [editArticleCategory, setEditArticleCategory] = useState("");
  const [editArticleDate, setEditArticleDate] = useState("");
  const [editArticleContent, setEditArticleContent] = useState("");
  const [isUpdatingArticle, setIsUpdatingArticle] = useState(false);
  const [articlesPage, setArticlesPage] = useState(1);
  const articlesPerPage = 3;

  // Courses states
  const [courses, setCourses] = useState<DBCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [addCourseTitle, setAddCourseTitle] = useState("");
  const [addCourseSubtitle, setAddCourseSubtitle] = useState("");
  const [addCourseAge, setAddCourseAge] = useState("");
  const [addCourseInfo, setAddCourseInfo] = useState("");
  const [addCourseOnline, setAddCourseOnline] = useState("");
  const [addCourseGroupDuration, setAddCourseGroupDuration] = useState("");
  const [addCourseIndivDuration, setAddCourseIndivDuration] = useState("");
  const [addCoursePoints, setAddCoursePoints] = useState("");
  const [addCourseBgImage, setAddCourseBgImage] = useState("/courses-bg/school-prep.png");
  const [addCourseIsFullWidth, setAddCourseIsFullWidth] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editCourseTitle, setEditCourseTitle] = useState("");
  const [editCourseSubtitle, setEditCourseSubtitle] = useState("");
  const [editCourseAge, setEditCourseAge] = useState("");
  const [editCourseInfo, setEditCourseInfo] = useState("");
  const [editCourseOnline, setEditCourseOnline] = useState("");
  const [editCourseGroupDuration, setEditCourseGroupDuration] = useState("");
  const [editCourseIndivDuration, setEditCourseIndivDuration] = useState("");
  const [editCoursePoints, setEditCoursePoints] = useState("");
  const [editCourseBgImage, setEditCourseBgImage] = useState("");
  const [editCourseIsFullWidth, setEditCourseIsFullWidth] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [uploadingCourseImage, setUploadingCourseImage] = useState(false);
  const [coursesPage, setCoursesPage] = useState(1);
  const coursesPerPage = 3;

  // Gallery states
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [galleryPage, setGalleryPage] = useState(1);
  const galleryPerPage = 12;

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUserEmail(session.user?.email || "Admin");
        setCheckingAuth(false);
        fetchLeads();
        fetchReviews();
        fetchPricingList();
        fetchTeachers();
        fetchArticles();
        fetchCourses();
        fetchGallery();
      }
    };
    checkAuth();
  }, [router]);

  // Set default dates on load
  useEffect(() => {
    setAddArticleDate(getUkDate());
  }, []);

  // Reset page counts when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [reviewSearch]);

  useEffect(() => {
    setPricingPage(1);
  }, [pricingPlanFilter]);

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error("Error fetching leads:", err?.message || err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      console.error("Error fetching reviews:", err?.message || err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchPricingList = async () => {
    setPricingLoading(true);
    try {
      const { data, error } = await supabase
        .from("pricing")
        .select("*")
        .order("billing_plan", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setPricingList(data || []);
    } catch (err: any) {
      console.error("Error fetching pricing list:", err?.message || err);
    } finally {
      setPricingLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setTeachersLoading(true);
    try {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setTeachers(data || []);
    } catch (err: any) {
      console.error("Error fetching teachers:", err?.message || err);
    } finally {
      setTeachersLoading(false);
    }
  };

  const fetchArticles = async () => {
    setArticlesLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDbArticles(data || []);
    } catch (err: any) {
      console.error("Error fetching articles:", err?.message || err);
    } finally {
      setArticlesLoading(false);
    }
  };

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      console.error("Error fetching courses:", err?.message || err);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGalleryPhotos(data || []);
    } catch (err: any) {
      console.error("Error fetching gallery:", err?.message || err);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const filesArray = Array.from(files);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        setUploadStatus(`Оптимізація та завантаження фото ${i + 1} з ${filesArray.length}: "${file.name}"...`);

        try {
          // 1. Optimize client-side to WebP blob
          const webpBlob = await optimizeImageToWebP(file);

          // 2. Prepare storage path
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.webp`;
          const storagePath = `gallery/${fileName}`;

          // 3. Upload WebP blob to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(storagePath, webpBlob, {
              contentType: "image/webp",
              cacheControl: "31536000",
              upsert: false
            });

          if (uploadError) {
            console.error("Storage upload error:", uploadError);
            throw new Error(uploadError.message || "Помилка завантаження файлу в сховище");
          }

          // 4. Get Public URL
          const { data: { publicUrl } } = supabase.storage
            .from("gallery")
            .getPublicUrl(storagePath);

          // 5. Insert row into gallery table
          const { error: dbError } = await supabase
            .from("gallery")
            .insert([
              {
                url: publicUrl,
                storage_path: storagePath
              }
            ]);

          if (dbError) {
            console.error("Database insert error:", dbError);
            throw new Error(dbError.message || "Помилка збереження запису в базу даних");
          }

          successCount++;
        } catch (fileErr: any) {
          console.error(`Failed to process/upload file "${file.name}":`, fileErr);
          failCount++;
        }
      }

      if (failCount > 0) {
        alert(`Завантаження завершено з помилками.\nУспішно завантажено: ${successCount}\nПомилок: ${failCount}`);
      } else {
        alert(`Успішно завантажено ${successCount} фото!`);
      }
      
      e.target.value = "";
      fetchGallery();
    } catch (err: any) {
      console.error("General upload error:", err);
      alert(`Помилка під час завантаження: ${err.message || err}`);
    } finally {
      setUploadingGallery(false);
      setUploadStatus("");
    }
  };

  const handleDeleteGalleryPhoto = async (id: string, storagePath: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це фото з галереї?")) return;

    try {
      // Optimistic update
      setGalleryPhotos(prev => prev.filter(p => p.id !== id));

      // 1. Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([storagePath]);

      if (storageError) {
        console.error("Storage deletion error (continuing database deletion):", storageError);
      }

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;
    } catch (err: any) {
      console.error("Error deleting photo:", err);
      alert("Не вдалося видалити фото.");
      fetchGallery(); // Rollback
    }
  };

  const handleCourseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCourseImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('courses')
        .upload(filePath, file);

      if (error) {
        console.error("Storage upload error details:", error);
        throw new Error(error.message || "Помилка завантаження файлу");
      }

      const { data: { publicUrl } } = supabase.storage
        .from('courses')
        .getPublicUrl(filePath);

      if (isEdit) {
        setEditCourseBgImage(publicUrl);
      } else {
        setAddCourseBgImage(publicUrl);
      }
    } catch (err: any) {
      console.error("Error uploading image:", err);
      alert(`Не вдалося завантажити зображення: ${err.message || err}. Переконайтеся, що ви виконали SQL-запит для створення Storage Bucket "courses" в кабінеті Supabase.`);
    } finally {
      setUploadingCourseImage(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCourseTitle.trim() || !addCourseAge.trim() || !addCourseInfo.trim() || !addCourseOnline.trim() || !addCourseIndivDuration.trim() || !addCoursePoints.trim()) return;
    setIsAddingCourse(true);

    try {
      const nextSortOrder = courses.length > 0 ? Math.max(...courses.map(c => c.sort_order || 0)) + 1 : 0;
      const pointsArray = addCoursePoints.split(",").map(p => p.trim()).filter(Boolean);

      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            title: addCourseTitle.trim(),
            subtitle: addCourseSubtitle.trim() || null,
            age: addCourseAge.trim(),
            info: addCourseInfo.trim(),
            online: addCourseOnline.trim(),
            group_duration: addCourseGroupDuration.trim() || null,
            indiv_duration: addCourseIndivDuration.trim(),
            points: pointsArray,
            bg_image: addCourseBgImage.trim() || "/courses-bg/school-prep.png",
            is_full_width: addCourseIsFullWidth,
            sort_order: nextSortOrder
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setCourses(prev => [...prev, data[0]]);
      }
      setAddCourseTitle("");
      setAddCourseSubtitle("");
      setAddCourseAge("");
      setAddCourseInfo("");
      setAddCourseOnline("");
      setAddCourseGroupDuration("");
      setAddCourseIndivDuration("");
      setAddCoursePoints("");
      setAddCourseBgImage("/courses-bg/school-prep.png");
      setAddCourseIsFullWidth(false);
      setCoursesPage(1);
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Не вдалося додати напрямок.");
    } finally {
      setIsAddingCourse(false);
    }
  };

  const handleStartEditCourse = (c: DBCourse) => {
    setEditingCourseId(c.id || null);
    setEditCourseTitle(c.title);
    setEditCourseSubtitle(c.subtitle || "");
    setEditCourseAge(c.age);
    setEditCourseInfo(c.info);
    setEditCourseOnline(c.online);
    setEditCourseGroupDuration(c.group_duration || "");
    setEditCourseIndivDuration(c.indiv_duration);
    setEditCoursePoints(c.points ? c.points.join(", ") : "");
    setEditCourseBgImage(c.bg_image);
    setEditCourseIsFullWidth(c.is_full_width);
  };

  const handleCancelEditCourse = () => {
    setEditingCourseId(null);
    setEditCourseTitle("");
    setEditCourseSubtitle("");
    setEditCourseAge("");
    setEditCourseInfo("");
    setEditCourseOnline("");
    setEditCourseGroupDuration("");
    setEditCourseIndivDuration("");
    setEditCoursePoints("");
    setEditCourseBgImage("");
    setEditCourseIsFullWidth(false);
  };

  const handleUpdateCourse = async (id: string) => {
    if (!editCourseTitle.trim() || !editCourseAge.trim() || !editCourseInfo.trim() || !editCourseOnline.trim() || !editCourseIndivDuration.trim() || !editCoursePoints.trim()) return;
    setIsUpdatingCourse(true);

    try {
      const pointsArray = editCoursePoints.split(",").map(p => p.trim()).filter(Boolean);

      const { error } = await supabase
        .from("courses")
        .update({
          title: editCourseTitle.trim(),
          subtitle: editCourseSubtitle.trim() || null,
          age: editCourseAge.trim(),
          info: editCourseInfo.trim(),
          online: editCourseOnline.trim(),
          group_duration: editCourseGroupDuration.trim() || null,
          indiv_duration: editCourseIndivDuration.trim(),
          points: pointsArray,
          bg_image: editCourseBgImage.trim() || "/courses-bg/school-prep.png",
          is_full_width: editCourseIsFullWidth
        })
        .eq("id", id);

      if (error) throw error;

      setCourses(prev => prev.map(c => c.id === id ? {
        ...c,
        title: editCourseTitle.trim(),
        subtitle: editCourseSubtitle.trim() || null,
        age: editCourseAge.trim(),
        info: editCourseInfo.trim(),
        online: editCourseOnline.trim(),
        group_duration: editCourseGroupDuration.trim() || null,
        indiv_duration: editCourseIndivDuration.trim(),
        points: pointsArray,
        bg_image: editCourseBgImage.trim(),
        is_full_width: editCourseIsFullWidth
      } : c));

      setEditingCourseId(null);
      setEditCourseTitle("");
      setEditCourseSubtitle("");
      setEditCourseAge("");
      setEditCourseInfo("");
      setEditCourseOnline("");
      setEditCourseGroupDuration("");
      setEditCourseIndivDuration("");
      setEditCoursePoints("");
      setEditCourseBgImage("");
      setEditCourseIsFullWidth(false);
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Не вдалося оновити напрямок.");
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити напрямок "${title}"?`)) return;

    try {
      setCourses(prev => prev.filter(c => c.id !== id));

      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Не вдалося видалити напрямок.");
      fetchCourses();
    }
  };

  const handleMoveCourse = async (id: string, direction: "up" | "down") => {
    const currentIndex = courses.findIndex(c => c.id === id);
    if (currentIndex === -1) return;

    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === courses.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentItem = courses[currentIndex];
    const targetItem = courses[targetIndex];

    const tempOrder = currentItem.sort_order || 0;
    currentItem.sort_order = targetItem.sort_order || 0;
    targetItem.sort_order = tempOrder;

    const updated = [...courses];
    updated[currentIndex] = targetItem;
    updated[targetIndex] = currentItem;
    setCourses(updated);

    try {
      const { error: error1 } = await supabase
        .from("courses")
        .update({ sort_order: currentItem.sort_order })
        .eq("id", currentItem.id);

      const { error: error2 } = await supabase
        .from("courses")
        .update({ sort_order: targetItem.sort_order })
        .eq("id", targetItem.id);

      if (error1 || error2) throw new Error("Database update failed");
    } catch (err) {
      console.error("Error reordering courses:", err);
      fetchCourses();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));

      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Не вдалося оновити статус.");
      fetchLeads(); // Rollback
    }
  };

  const handleNotesBlur = async (id: string, notesText: string) => {
    setSavingNotesId(id);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ notes: notesText })
        .eq("id", id);

      if (error) throw error;
      
      setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: notesText } : l));
      setSavedNotesId(id);
      setTimeout(() => setSavedNotesId(null), 2000);
    } catch (err) {
      console.error("Error updating notes:", err);
    } finally {
      setSavingNotesId(null);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити заявку від "${name}"?`)) return;

    try {
      setLeads(prev => prev.filter(l => l.id !== id));

      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting lead:", err);
      alert("Не вдалося видалити заявку.");
      fetchLeads(); // Rollback
    }
  };

  // Add Review
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newReviewText.trim()) return;
    setIsAddingReview(true);

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            author: newAuthor.trim(),
            text: newReviewText.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setReviews(prev => [data[0], ...prev]);
      }
      setNewAuthor("");
      setNewReviewText("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Не вдалося додати відгук.");
    } finally {
      setIsAddingReview(false);
    }
  };

  // Edit Review handlers
  const handleStartEdit = (rev: Review) => {
    setEditingReviewId(rev.id);
    setEditAuthor(rev.author);
    setEditReviewText(rev.text);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditAuthor("");
    setEditReviewText("");
  };

  const handleUpdateReview = async (id: string) => {
    if (!editAuthor.trim() || !editReviewText.trim()) return;
    setIsUpdatingReview(true);

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          author: editAuthor.trim(),
          text: editReviewText.trim()
        })
        .eq("id", id);

      if (error) throw error;

      setReviews(prev => prev.map(r => r.id === id ? { ...r, author: editAuthor.trim(), text: editReviewText.trim() } : r));
      setEditingReviewId(null);
      setEditAuthor("");
      setEditReviewText("");
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Не вдалося оновити відгук.");
    } finally {
      setIsUpdatingReview(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: string, author: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити відгук від "${author}"?`)) return;

    try {
      setReviews(prev => prev.filter(r => r.id !== id));

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Не вдалося видалити відгук.");
      fetchReviews(); // Rollback
    }
  };

  // Add Pricing Package
  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addLessons.trim() || !addPrice.trim() || !addDuration.trim()) return;
    setIsAddingPrice(true);

    try {
      const planPrices = pricingList.filter(p => p.billing_plan === addBillingPlan);
      const nextSortOrder = planPrices.length > 0 ? Math.max(...planPrices.map(p => p.sort_order)) + 1 : 0;

      const { data, error } = await supabase
        .from("pricing")
        .insert([
          {
            name: addName.toUpperCase().trim(),
            lessons: addLessons.trim(),
            price: addPrice.trim(),
            duration: addDuration.trim(),
            billing_plan: addBillingPlan,
            alt_lessons: addAltLessons.trim() || null,
            alt_price: addAltPrice.trim() || null,
            sort_order: nextSortOrder
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setPricingList(prev => [...prev, data[0]]);
      }
      setAddName("");
      setAddLessons("");
      setAddPrice("");
      setAddDuration("");
      setAddAltLessons("");
      setAddAltPrice("");
      setPricingPlanFilter(addBillingPlan);
      setPricingPage(1);
    } catch (err) {
      console.error("Error adding pricing package:", err);
      alert("Не вдалося додати тариф.");
    } finally {
      setIsAddingPrice(false);
    }
  };

  // Edit Pricing Package handlers
  const handleStartEditPrice = (price: DBPrice) => {
    setEditingPriceId(price.id);
    setEditName(price.name);
    setEditLessons(price.lessons);
    setEditPrice(price.price);
    setEditDuration(price.duration);
    setEditAltLessons(price.alt_lessons || "");
    setEditAltPrice(price.alt_price || "");
  };

  const handleCancelEditPrice = () => {
    setEditingPriceId(null);
    setEditName("");
    setEditLessons("");
    setEditPrice("");
    setEditDuration("");
    setEditAltLessons("");
    setEditAltPrice("");
  };

  const handleUpdatePrice = async (id: string) => {
    if (!editName.trim() || !editLessons.trim() || !editPrice.trim() || !editDuration.trim()) return;
    setIsUpdatingPrice(true);

    try {
      const { error } = await supabase
        .from("pricing")
        .update({
          name: editName.toUpperCase().trim(),
          lessons: editLessons.trim(),
          price: editPrice.trim(),
          duration: editDuration.trim(),
          alt_lessons: editAltLessons.trim() || null,
          alt_price: editAltPrice.trim() || null
        })
        .eq("id", id);

      if (error) throw error;

      setPricingList(prev => prev.map(p => p.id === id ? { 
        ...p, 
        name: editName.toUpperCase().trim(), 
        lessons: editLessons.trim(),
        price: editPrice.trim(),
        duration: editDuration.trim(),
        alt_lessons: editAltLessons.trim() || null,
        alt_price: editAltPrice.trim() || null
      } : p));
      setEditingPriceId(null);
      setEditName("");
      setEditLessons("");
      setEditPrice("");
      setEditDuration("");
      setEditAltLessons("");
      setEditAltPrice("");
    } catch (err) {
      console.error("Error updating pricing package:", err);
      alert("Не вдалося оновити тариф.");
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  // Delete Pricing Package
  const handleDeletePrice = async (id: string, name: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити тариф для "${name}"?`)) return;

    try {
      setPricingList(prev => prev.filter(p => p.id !== id));

      const { error } = await supabase
        .from("pricing")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting pricing package:", err);
      alert("Не вдалося видалити тариф.");
      fetchPricingList(); // Rollback
    }
  };

  // Move Pricing Package (Reorder)
  const handleMovePrice = async (id: string, direction: "up" | "down") => {
    const currentIndex = pricingList.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const currentItem = pricingList[currentIndex];
    const plan = currentItem.billing_plan;

    const planItems = pricingList
      .filter(p => p.billing_plan === plan)
      .sort((a, b) => a.sort_order - b.sort_order);

    const indexInPlan = planItems.findIndex(p => p.id === id);
    if (indexInPlan === -1) return;

    if (direction === "up" && indexInPlan === 0) return;
    if (direction === "down" && indexInPlan === planItems.length - 1) return;

    const targetIndexInPlan = direction === "up" ? indexInPlan - 1 : indexInPlan + 1;
    const targetItem = planItems[targetIndexInPlan];

    const tempOrder = currentItem.sort_order;
    currentItem.sort_order = targetItem.sort_order;
    targetItem.sort_order = tempOrder;

    setPricingList([...pricingList]);

    try {
      const { error: error1 } = await supabase
        .from("pricing")
        .update({ sort_order: currentItem.sort_order })
        .eq("id", currentItem.id);

      const { error: error2 } = await supabase
        .from("pricing")
        .update({ sort_order: targetItem.sort_order })
        .eq("id", targetItem.id);

      if (error1 || error2) throw new Error("Database update failed");
    } catch (err) {
      console.error("Error reordering pricing packages:", err);
      fetchPricingList(); // Rollback
    }
  };

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('teachers')
        .upload(filePath, file);

      if (error) {
        console.error("Storage upload error details:", error);
        throw new Error(error.message || "Помилка завантаження файлу");
      }

      const { data: { publicUrl } } = supabase.storage
        .from('teachers')
        .getPublicUrl(filePath);

      if (isEdit) {
        setEditTeacherImage(publicUrl);
      } else {
        setAddTeacherImage(publicUrl);
      }
    } catch (err: any) {
      console.error("Error uploading image:", err);
      alert(`Не вдалося завантажити зображення: ${err.message || err}. Переконайтеся, що ви виконали SQL-запит для створення Storage Bucket "teachers" в кабінеті Supabase.`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Teacher
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTeacherName.trim() || !addTeacherRole.trim() || !addTeacherExperience.trim() || !addTeacherQuote.trim()) return;
    setIsAddingTeacher(true);

    try {
      const nextSortOrder = teachers.length > 0 ? Math.max(...teachers.map(t => t.sort_order || 0)) + 1 : 0;
      const bulletsArray = addTeacherBullets.split(",").map(b => b.trim()).filter(Boolean);

      const { data, error } = await supabase
        .from("teachers")
        .insert([
          {
            name: addTeacherName.trim(),
            role: addTeacherRole.trim(),
            image: addTeacherImage.trim() || "/teachers/maryna.jpg",
            experience: addTeacherExperience.trim(),
            sub_experience: addTeacherSubExperience.trim() || null,
            quote: addTeacherQuote.trim(),
            bullets: bulletsArray,
            sort_order: nextSortOrder
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setTeachers(prev => [...prev, data[0]]);
      }
      setAddTeacherName("");
      setAddTeacherRole("");
      setAddTeacherImage("/teachers/maryna.jpg");
      setAddTeacherExperience("");
      setAddTeacherSubExperience("");
      setAddTeacherQuote("");
      setAddTeacherBullets("");
      setTeachersPage(1);
    } catch (err) {
      console.error("Error adding teacher:", err);
      alert("Не вдалося додати викладача.");
    } finally {
      setIsAddingTeacher(false);
    }
  };

  // Edit Teacher handlers
  const handleStartEditTeacher = (t: DBTeacher) => {
    setEditingTeacherId(t.id || null);
    setEditTeacherName(t.name);
    setEditTeacherRole(t.role);
    setEditTeacherImage(t.image);
    setEditTeacherExperience(t.experience);
    setEditTeacherSubExperience(t.sub_experience || "");
    setEditTeacherQuote(t.quote);
    setEditTeacherBullets(t.bullets ? t.bullets.join(", ") : "");
  };

  const handleCancelEditTeacher = () => {
    setEditingTeacherId(null);
    setEditTeacherName("");
    setEditTeacherRole("");
    setEditTeacherImage("");
    setEditTeacherExperience("");
    setEditTeacherSubExperience("");
    setEditTeacherQuote("");
    setEditTeacherBullets("");
  };

  const handleUpdateTeacher = async (id: string) => {
    if (!editTeacherName.trim() || !editTeacherRole.trim() || !editTeacherExperience.trim() || !editTeacherQuote.trim()) return;
    setIsUpdatingTeacher(true);

    try {
      const bulletsArray = editTeacherBullets.split(",").map(b => b.trim()).filter(Boolean);

      const { error } = await supabase
        .from("teachers")
        .update({
          name: editTeacherName.trim(),
          role: editTeacherRole.trim(),
          image: editTeacherImage.trim() || "/teachers/maryna.jpg",
          experience: editTeacherExperience.trim(),
          sub_experience: editTeacherSubExperience.trim() || null,
          quote: editTeacherQuote.trim(),
          bullets: bulletsArray
        })
        .eq("id", id);

      if (error) throw error;

      setTeachers(prev => prev.map(t => t.id === id ? {
        ...t,
        name: editTeacherName.trim(),
        role: editTeacherRole.trim(),
        image: editTeacherImage.trim(),
        experience: editTeacherExperience.trim(),
        sub_experience: editTeacherSubExperience.trim() || null,
        quote: editTeacherQuote.trim(),
        bullets: bulletsArray
      } : t));
      
      setEditingTeacherId(null);
      setEditTeacherName("");
      setEditTeacherRole("");
      setEditTeacherImage("");
      setEditTeacherExperience("");
      setEditTeacherSubExperience("");
      setEditTeacherQuote("");
      setEditTeacherBullets("");
    } catch (err) {
      console.error("Error updating teacher:", err);
      alert("Не вдалося оновити дані викладача.");
    } finally {
      setIsUpdatingTeacher(false);
    }
  };

  // Delete Teacher
  const handleDeleteTeacher = async (id: string, name: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити викладача "${name}"?`)) return;

    try {
      setTeachers(prev => prev.filter(t => t.id !== id));

      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting teacher:", err);
      alert("Не вдалося видалити викладача.");
      fetchTeachers(); // Rollback
    }
  };

  // Move Teacher (Reorder)
  const handleMoveTeacher = async (id: string, direction: "up" | "down") => {
    const currentIndex = teachers.findIndex(t => t.id === id);
    if (currentIndex === -1) return;

    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === teachers.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentItem = teachers[currentIndex];
    const targetItem = teachers[targetIndex];

    const tempOrder = currentItem.sort_order || 0;
    currentItem.sort_order = targetItem.sort_order || 0;
    targetItem.sort_order = tempOrder;

    const updated = [...teachers];
    updated[currentIndex] = targetItem;
    updated[targetIndex] = currentItem;
    setTeachers(updated);

    try {
      const { error: error1 } = await supabase
        .from("teachers")
        .update({ sort_order: currentItem.sort_order })
        .eq("id", currentItem.id);

      const { error: error2 } = await supabase
        .from("teachers")
        .update({ sort_order: targetItem.sort_order })
        .eq("id", targetItem.id);

      if (error1 || error2) throw new Error("Database update failed");
    } catch (err) {
      console.error("Error reordering teachers:", err);
      fetchTeachers(); // Rollback
    }
  };

  // Add Article
  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addArticleTitle.trim() || !addArticleDescription.trim() || !addArticleContent.trim()) return;
    setIsAddingArticle(true);

    try {
      const slugVal = addArticleSlug.trim() || translit(addArticleTitle);
      const dateVal = addArticleDate.trim() || getUkDate();
      const contentArray = addArticleContent.split("\n").map(p => p.trim()).filter(Boolean);

      const { data, error } = await supabase
        .from("articles")
        .insert([
          {
            title: addArticleTitle.trim(),
            slug: slugVal,
            description: addArticleDescription.trim(),
            category: addArticleCategory.trim(),
            date: dateVal,
            content: contentArray
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setDbArticles(prev => [data[0], ...prev]);
      }
      setAddArticleTitle("");
      setAddArticleSlug("");
      setAddArticleDescription("");
      setAddArticleCategory("Ментальна арифметика");
      setAddArticleDate(getUkDate());
      setAddArticleContent("");
      setArticlesPage(1);
    } catch (err: any) {
      console.error("Error adding article:", err);
      alert(`Не вдалося зберегти статтю: ${err.message || err}`);
    } finally {
      setIsAddingArticle(false);
    }
  };

  // Edit Article handlers
  const handleStartEditArticle = (art: DBArticle) => {
    setEditingArticleId(art.id);
    setEditArticleTitle(art.title);
    setEditArticleSlug(art.slug);
    setEditArticleDescription(art.description);
    setEditArticleCategory(art.category);
    setEditArticleDate(art.date);
    setEditArticleContent(art.content ? art.content.join("\n") : "");
  };

  const handleCancelEditArticle = () => {
    setEditingArticleId(null);
    setEditArticleTitle("");
    setEditArticleSlug("");
    setEditArticleDescription("");
    setEditArticleCategory("");
    setEditArticleDate("");
    setEditArticleContent("");
  };

  const handleUpdateArticle = async (id: string) => {
    if (!editArticleTitle.trim() || !editArticleDescription.trim() || !editArticleContent.trim()) return;
    setIsUpdatingArticle(true);

    try {
      const slugVal = editArticleSlug.trim() || translit(editArticleTitle);
      const contentArray = editArticleContent.split("\n").map(p => p.trim()).filter(Boolean);

      const { error } = await supabase
        .from("articles")
        .update({
          title: editArticleTitle.trim(),
          slug: slugVal,
          description: editArticleDescription.trim(),
          category: editArticleCategory.trim(),
          date: editArticleDate.trim(),
          content: contentArray
        })
        .eq("id", id);

      if (error) throw error;

      setDbArticles(prev => prev.map(a => a.id === id ? {
        ...a,
        title: editArticleTitle.trim(),
        slug: slugVal,
        description: editArticleDescription.trim(),
        category: editArticleCategory.trim(),
        date: editArticleDate.trim(),
        content: contentArray
      } : a));

      setEditingArticleId(null);
      setEditArticleTitle("");
      setEditArticleSlug("");
      setEditArticleDescription("");
      setEditArticleCategory("");
      setEditArticleDate("");
      setEditArticleContent("");
    } catch (err: any) {
      console.error("Error updating article:", err);
      alert(`Не вдалося оновити статтю: ${err.message || err}`);
    } finally {
      setIsUpdatingArticle(false);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити статтю "${title}"?`)) return;

    try {
      setDbArticles(prev => prev.filter(a => a.id !== id));

      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("Не вдалося видалити статтю.");
      fetchArticles(); // Rollback
    }
  };

  const handleRefresh = () => {
    if (activeTab === "leads") {
      fetchLeads();
    } else if (activeTab === "reviews") {
      fetchReviews();
    } else if (activeTab === "pricing") {
      fetchPricingList();
    } else if (activeTab === "teachers") {
      fetchTeachers();
    } else if (activeTab === "articles") {
      fetchArticles();
    } else if (activeTab === "courses") {
      fetchCourses();
    } else if (activeTab === "gallery") {
      fetchGallery();
    }
  };

  // Stats calculation
  const totalCount = leads.length;
  const newCount = leads.filter(l => l.status === "new").length;
  const progressCount = leads.filter(l => l.status === "in_progress").length;
  const completedCount = leads.filter(l => l.status === "completed").length;

  // Filtering leads logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesCourse = courseFilter === "all" || lead.course === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Filtering reviews logic
  const filteredReviews = reviews.filter(rev => {
    return (
      rev.author.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      rev.text.toLowerCase().includes(reviewSearch.toLowerCase())
    );
  });

  // Reviews pagination calculations
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = isMobile ? 0 : indexOfLastReview - reviewsPerPage;
  const currentReviews = isMobile ? filteredReviews : filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#D9C1A6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
          <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            Завантаження...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D9C1A6] text-slate-900 flex flex-col p-4 sm:p-6">
      {/* Container */}
      <div className="w-full max-w-7xl mx-auto bg-[#F6D8AE] border-4 border-black rounded-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-[#0d5087] border-b-4 border-black text-white p-4 sm:p-6 flex justify-between items-center gap-4 relative">
          
          {/* Logo matching the main website header */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group select-none">
            <div className="relative h-14 w-14 flex-shrink-0 rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-active:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px] overflow-hidden">
              <img
                src="/genius_logo.svg"
                alt="Genius Land Logo"
                className="h-full w-full object-cover scale-110"
              />
            </div>

            <div className="text-left">
              <span className="text-base font-black tracking-tight text-white sm:text-lg uppercase block group-hover:text-[#facc15] transition-colors">
                GeniusLand Admin
              </span>
              <span className="block text-[9px] font-bold text-[#facc15] tracking-wide uppercase">
                Адмін: {userEmail}
              </span>
            </div>
          </Link>

          {/* Desktop buttons (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3 justify-end">
            <button
              onClick={handleRefresh}
              disabled={leadsLoading || reviewsLoading || pricingLoading || teachersLoading || articlesLoading || coursesLoading}
              className="bg-white text-black border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${(leadsLoading || reviewsLoading || pricingLoading || teachersLoading || articlesLoading || coursesLoading) ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Оновити</span>
            </button>
            <button
              onClick={handleSignOut}
              className="bg-rose-500 hover:bg-rose-600 text-white border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black uppercase"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Вийти</span>
            </button>
          </div>

          {/* Mobile Burger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden bg-[#facc15] text-black border-2 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 stroke-[3]" /> : <Menu className="h-5 w-5 stroke-[3]" />}
          </button>
        </header>

        {/* MOBILE BURGER MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0d5087] border-b-4 border-black text-white p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            {/* TABS MENU */}
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => {
                  setActiveTab("leads");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-left border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "leads" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                }`}
              >
                <span>📋 Заявки ({totalCount})</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("reviews");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-left border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "reviews" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                }`}
              >
                <span>💬 Відгуки ({reviews.length})</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("pricing");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-left border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "pricing" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                }`}
              >
                <span>💰 Тарифи ({pricingList.length})</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("teachers");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-left border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "teachers" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                }`}
              >
                <span>🎓 Викладачі ({teachers.length})</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("articles");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-left border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "articles" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                }`}
              >
                <span>📝 Статті ({dbArticles.length})</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("courses");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-left border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "courses" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                }`}
              >
                <span>🏫 Напрямки ({courses.length})</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("gallery");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-left border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer ${
                  activeTab === "gallery" ? "bg-[#facc15] text-black" : "bg-white text-slate-800"
                }`}
              >
                <span>🖼️ Галерея ({galleryPhotos.length})</span>
              </button>
            </div>

            {/* ACTION BUTTONS AT THE BOTTOM OF THE BURGER MENU */}
            <div className="flex gap-3 mt-2 pt-4 border-t-2 border-white/20">
              <button
                onClick={() => {
                  handleRefresh();
                  setIsMobileMenuOpen(false);
                }}
                disabled={leadsLoading || reviewsLoading || pricingLoading || teachersLoading || articlesLoading || coursesLoading || galleryLoading}
                className="flex-1 bg-white text-black border-2 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-black uppercase disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${(leadsLoading || reviewsLoading || pricingLoading || teachersLoading || articlesLoading || coursesLoading || galleryLoading) ? 'animate-spin' : ''}`} />
                <span>Оновити</span>
              </button>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 bg-rose-500 text-white border-2 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-black uppercase"
              >
                <LogOut className="h-4 w-4" />
                <span>Вийти</span>
              </button>
            </div>
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div className="hidden md:flex border-b-4 border-black bg-white overflow-x-auto scrollbar-none">
          <button 
            onClick={() => setActiveTab("leads")}
            className={`flex-shrink-0 sm:flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center border-r-4 border-black flex items-center justify-center gap-2 ${
              activeTab === "leads" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            📋 Заявки ({totalCount})
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`flex-shrink-0 sm:flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center border-r-4 border-black flex items-center justify-center gap-2 ${
              activeTab === "reviews" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            💬 Відгуки ({reviews.length})
          </button>
          <button 
            onClick={() => setActiveTab("pricing")}
            className={`flex-shrink-0 sm:flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center border-r-4 border-black flex items-center justify-center gap-2 ${
              activeTab === "pricing" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            💰 Тарифи ({pricingList.length})
          </button>
          <button 
            onClick={() => setActiveTab("teachers")}
            className={`flex-shrink-0 sm:flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center border-r-4 border-black flex items-center justify-center gap-2 ${
              activeTab === "teachers" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            🎓 Викладачі ({teachers.length})
          </button>
          <button 
            onClick={() => setActiveTab("articles")}
            className={`flex-shrink-0 sm:flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center border-r-4 border-black flex items-center justify-center gap-2 ${
              activeTab === "articles" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            📝 Статті ({dbArticles.length})
          </button>
          <button 
            onClick={() => setActiveTab("courses")}
            className={`flex-shrink-0 sm:flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center border-r-4 border-black flex items-center justify-center gap-2 ${
              activeTab === "courses" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            🏫 Напрямки ({courses.length})
          </button>
          <button 
            onClick={() => setActiveTab("gallery")}
            className={`flex-shrink-0 sm:flex-1 py-4 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2 ${
              activeTab === "gallery" ? "bg-[#facc15] text-black" : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            🖼️ Галерея ({galleryPhotos.length})
          </button>
        </div>

        {/* CURRENT TAB TITLE HEADER */}
        <div className="bg-[#facc15] border-b-4 border-black px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-black flex items-center gap-2 select-none">
            {activeTab === "leads" && "📋 Керування Заявками"}
            {activeTab === "reviews" && "💬 Керування Відгуками"}
            {activeTab === "pricing" && "💰 Керування Тарифами"}
            {activeTab === "teachers" && "🎓 Керування Викладачами"}
            {activeTab === "articles" && "📝 Керування Статтями блогу"}
            {activeTab === "courses" && "🏫 Керування Напрямками курсів"}
            {activeTab === "gallery" && "🖼️ Керування Галереєю фото"}
          </h2>
          <div className="text-[9px] font-black text-slate-900 bg-white/60 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-tight select-none">
            Розділ: {activeTab}
          </div>
        </div>

        {/* TAB 1: LEADS CONTENT */}
        {activeTab === "leads" && (
          <>
            {/* STATS */}
            <section className="grid grid-cols-2 md:grid-cols-4 border-b-4 border-black bg-white/40">
              <div className="p-4 border-r-2 border-b-2 md:border-b-0 border-black flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Всього заявок</span>
                <span className="text-3xl font-black mt-1 text-slate-900">{totalCount}</span>
              </div>
              <div className="p-4 border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-black flex flex-col justify-between bg-amber-50/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Нові</span>
                <span className="text-3xl font-black mt-1 text-amber-700">{newCount}</span>
              </div>
              <div className="p-4 border-r-2 border-black flex flex-col justify-between bg-blue-50/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">В роботі</span>
                <span className="text-3xl font-black mt-1 text-blue-700">{progressCount}</span>
              </div>
              <div className="p-4 flex flex-col justify-between bg-emerald-50/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Завершено</span>
                <span className="text-3xl font-black mt-1 text-emerald-700">{completedCount}</span>
              </div>
            </section>

            {/* FILTERS & SEARCH */}
            <section className="p-4 sm:p-6 border-b-4 border-black bg-white/80 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Пошук за ім'ям або телефоном..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-2 border-black bg-white pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                />
              </div>

              {/* Selector filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-full sm:w-44 rounded-xl border-2 border-black bg-white px-4 py-2.5 pr-10 text-xs font-black uppercase tracking-wider text-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                  >
                    <option value="all">Усі статуси</option>
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black stroke-[3] pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="appearance-none w-full sm:w-56 rounded-xl border-2 border-black bg-white px-4 py-2.5 pr-10 text-xs font-black uppercase tracking-wider text-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                  >
                    <option value="all">Усі напрямки</option>
                    <option value="">❓ Ще не визначились</option>
                    {Object.entries(courseMapping).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black stroke-[3] pointer-events-none" />
                </div>
              </div>
            </section>

            {/* LEADS LIST */}
            <main className="flex-1 bg-white/20">
              {leadsLoading ? (
                <div className="p-12 text-center flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
                  <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Завантаження даних...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
                  <AlertCircle className="h-10 w-10 text-slate-400 stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-wider">Заявок не знайдено</p>
                  <p className="text-xs font-medium">Спробуйте змінити фільтри пошуку.</p>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE VIEW */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b-2 border-black text-[10px] font-black uppercase tracking-wider text-slate-600">
                          <th className="p-4 border-r border-black/10">Дата</th>
                          <th className="p-4 border-r border-black/10">Клієнт</th>
                          <th className="p-4 border-r border-black/10">Напрямок</th>
                          <th className="p-4 border-r border-black/10">Коментар</th>
                          <th className="p-4 border-r border-black/10">Статус</th>
                          <th className="p-4 border-r border-black/10 w-64">Адмін Нотатки</th>
                          <th className="p-4 text-center">Дія</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="border-b-2 border-black/10 hover:bg-white/40 transition-colors">
                            <td className="p-4 text-xs font-bold text-slate-500 border-r border-black/10">
                              <span className="flex items-center gap-1 text-slate-500">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(lead.created_at)}
                              </span>
                            </td>
                            <td className="p-4 border-r border-black/10">
                              <p className="font-extrabold text-slate-900 text-sm">{lead.name}</p>
                              <a 
                                href={`tel:${lead.phone}`}
                                className="mt-0.5 text-xs text-slate-600 font-bold hover:underline hover:text-[#0d5087] flex items-center gap-1.5 w-max"
                              >
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </a>
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-700 border-r border-black/10 max-w-xs">
                              {getCourseLabel(lead.course)}
                            </td>
                            <td className="p-4 text-xs text-slate-600 font-semibold border-r border-black/10 max-w-xs italic leading-relaxed">
                              {lead.comment ? (
                                <div className="space-y-1 not-italic">
                                  {lead.comment.includes("[АКЦІЯ:") && (
                                    <span className="inline-block bg-yellow-300 text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none mb-1">
                                      Знижка -10%
                                    </span>
                                  )}
                                  <p className="italic">"{lead.comment.replace(/^\[АКЦІЯ:[^\]]+\]\s*/, "")}"</p>
                                </div>
                              ) : (
                                <span className="text-slate-400 not-italic">Немає</span>
                              )}
                            </td>
                            <td className="p-4 border-r border-black/10">
                              <div className="relative w-max">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                  className={`appearance-none rounded-xl border-2 border-black pl-3 pr-8 py-1.5 text-xs font-extrabold cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                    statusOptions.find(o => o.value === lead.status)?.bg || ""
                                  }`}
                                >
                                  {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black stroke-[3] pointer-events-none" />
                              </div>
                            </td>
                            <td className="p-4 border-r border-black/10 relative">
                              <textarea
                                defaultValue={lead.notes || ""}
                                placeholder="Додати примітку..."
                                onBlur={(e) => handleNotesBlur(lead.id, e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white/70 p-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-black focus:bg-white focus:outline-none transition-all resize-none min-h-[50px] leading-tight"
                                rows={2}
                              />
                              <div className="absolute right-5 bottom-5">
                                {savingNotesId === lead.id && (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0d5087]" />
                                )}
                                {savedNotesId === lead.id && (
                                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteLead(lead.id, lead.name)}
                                className="bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                                title="Видалити"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS VIEW */}
                  <div className="md:hidden p-4 space-y-4">
                    {filteredLeads.map((lead) => (
                      <div key={lead.id} className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(lead.created_at)}
                          </span>
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="text-rose-500 border border-slate-200 p-1.5 rounded-lg active:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{lead.name}</h4>
                          <a 
                            href={`tel:${lead.phone}`}
                            className="mt-1 text-xs text-[#0d5087] font-bold flex items-center gap-1 w-max bg-[#0d5087]/5 px-2.5 py-1 rounded-lg border border-[#0d5087]/10"
                          >
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </a>
                        </div>
                        <div className="text-xs">
                          <span className="font-black text-[10px] text-slate-500 uppercase block mb-0.5">Напрямок</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                            {getCourseLabel(lead.course)}
                          </span>
                        </div>
                        {lead.comment && (
                          <div className="text-xs bg-[#fbf0e3] border border-orange-200 p-2.5 rounded-xl text-slate-600 italic">
                            {lead.comment.includes("[АКЦІЯ:") && (
                              <span className="inline-block bg-yellow-300 text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] not-italic mb-1.5">
                                Знижка -10%
                              </span>
                            )}
                            <p className="leading-relaxed">"{lead.comment.replace(/^\[АКЦІЯ:[^\]]+\]\s*/, "")}"</p>
                          </div>
                        )}
                        <div>
                          <span className="font-black text-[10px] text-slate-500 uppercase block mb-1">Статус заявки</span>
                          <div className="relative w-full">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`appearance-none w-full rounded-xl border-2 border-black px-3 py-2 text-xs font-extrabold cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                statusOptions.find(o => o.value === lead.status)?.bg || ""
                              }`}
                            >
                              {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black stroke-[3] pointer-events-none" />
                          </div>
                        </div>
                        <div className="relative">
                          <span className="font-black text-[10px] text-slate-500 uppercase block mb-1">Примітка адміністратора</span>
                          <textarea
                            defaultValue={lead.notes || ""}
                            placeholder="Додати примітку..."
                            onBlur={(e) => handleNotesBlur(lead.id, e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white/70 p-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-black focus:bg-white focus:outline-none transition-all resize-none min-h-[60px] leading-tight"
                            rows={2}
                          />
                          <div className="absolute right-3.5 bottom-3.5">
                            {savingNotesId === lead.id && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0d5087]" />
                            )}
                            {savedNotesId === lead.id && (
                              <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </main>
          </>
        )}

        {/* TAB 2: REVIEWS CONTENT */}
        {activeTab === "reviews" && (
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN: ADD REVIEW FORM */}
            <div className="w-full lg:w-1/3 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4">
                ✍️ Додати відгук
              </h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Автор відгуку (наприклад: Мама Марка)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Мама Марка"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Текст відгуку
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Введіть відгук тут..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 p-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingReview}
                  className="w-full rounded-xl bg-[#facc15] py-3 text-xs font-black uppercase tracking-wider text-slate-900 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>{isAddingReview ? "Додавання..." : "Опублікувати відгук"}</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: LIST OF REVIEWS */}
            <div className="flex-1 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  💬 Список відгуків ({reviews.length})
                </h3>
                
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Пошук автора або тексту..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-white pl-8 pr-3 py-1.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {reviewsLoading ? (
                <div className="p-12 text-center flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
                  <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Оновлення списку відгуків...</p>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">Відгуків не знайдено</p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {currentReviews.map((rev, index) => {
                      const isEditing = editingReviewId === rev.id;
                      return (
                        <div 
                          key={rev.id} 
                          className="border-2 border-black rounded-xl p-4 flex justify-between items-start gap-4 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                        >
                          {isEditing ? (
                            <div className="flex-1 space-y-3 w-full">
                              <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                  Автор
                                </label>
                                <input
                                  type="text"
                                  value={editAuthor}
                                  onChange={(e) => setEditAuthor(e.target.value)}
                                  className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                  Текст відгуку
                                </label>
                                <textarea
                                  value={editReviewText}
                                  onChange={(e) => setEditReviewText(e.target.value)}
                                  rows={4}
                                  className="w-full rounded-lg border-2 border-black bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white resize-none leading-relaxed"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  disabled={isUpdatingReview}
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1.5 rounded-lg border-2 border-black bg-white font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                >
                                  Скасувати
                                </button>
                                <button
                                  type="button"
                                  disabled={isUpdatingReview}
                                  onClick={() => handleUpdateReview(rev.id)}
                                  className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#facc15] font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                >
                                  {isUpdatingReview ? "Збереження..." : "Зберегти"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-3">
                                <div className="w-11 h-11 rounded-full border-2 border-black bg-slate-100 flex items-center justify-center text-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 z-10 relative">
                                  {getAuthorEmoji(rev.author, index + indexOfFirstReview)}
                                </div>
                                <div>
                                  <p className="font-extrabold text-xs text-slate-900 uppercase leading-none mt-1">{rev.author}</p>
                                  <p className="text-xs font-semibold text-slate-700 italic mt-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    «{rev.text}»
                                  </p>
                                  <span className="text-[9px] text-slate-400 font-bold block mt-2">
                                    Створено: {formatDate(rev.created_at)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(rev)}
                                  className="text-slate-600 hover:text-black p-2 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                  title="Редагувати відгук"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReview(rev.id, rev.author)}
                                  className="text-rose-500 hover:text-rose-700 p-2 rounded-xl border border-slate-200 hover:bg-rose-50 flex-shrink-0 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                  title="Видалити відгук"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* PAGINATION CONTROLS */}
                  {!isMobile && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t-2 border-slate-100">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                      >
                        Назад
                      </button>
                      <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none">
                        Сторінка {currentPage} з {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                      >
                        Вперед
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: PRICING CONTENT */}
        {activeTab === "pricing" && (
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN: ADD PRICING FORM */}
            <div className="w-full lg:w-1/3 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4">
                ✍️ Додати новий тариф
              </h3>
              <form onSubmit={handleAddPrice} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Назва напрямку (наприклад: РЕПЕТИТОРСТВО)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="РЕПЕТИТОРСТВО"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Формат
                    </label>
                    <div className="relative">
                      <select
                        value={addBillingPlan}
                        onChange={(e) => setAddBillingPlan(e.target.value as "group" | "individual")}
                        className="appearance-none w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 pr-8 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white cursor-pointer"
                      >
                        <option value="group">Груповий</option>
                        <option value="individual">Індивідуальний</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-black stroke-[3] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Тривалість (хв)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="55"
                      value={addDuration}
                      onChange={(e) => setAddDuration(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Кількість занять
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="8 занять"
                      value={addLessons}
                      onChange={(e) => setAddLessons(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Вартість
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1620 грн"
                      value={addPrice}
                      onChange={(e) => setAddPrice(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 mt-3">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Альтернативний пакет (опціонально)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                        Кількість занять
                      </label>
                      <input
                        type="text"
                        placeholder="12 занять"
                        value={addAltLessons}
                        onChange={(e) => setAddAltLessons(e.target.value)}
                        className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                        Вартість
                      </label>
                      <input
                        type="text"
                        placeholder="4200 грн"
                        value={addAltPrice}
                        onChange={(e) => setAddAltPrice(e.target.value)}
                        className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAddingPrice}
                  className="w-full rounded-xl bg-[#facc15] py-3 text-xs font-black uppercase tracking-wider text-slate-900 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>{isAddingPrice ? "Додавання..." : "Зберегти тариф"}</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: LIST OF PRICING */}
            <div className="flex-1 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  💰 Список тарифів ({pricingList.length})
                </h3>

                {/* Switcher */}
                <div className="relative flex p-1 border-2 border-black bg-slate-50 rounded-xl">
                  <button
                    onClick={() => setPricingPlanFilter("group")}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                      pricingPlanFilter === "group"
                        ? "bg-[#0d5087] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        : "text-black border border-transparent hover:text-blue-700"
                    }`}
                  >
                    Групові
                  </button>
                  <button
                    onClick={() => setPricingPlanFilter("individual")}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                      pricingPlanFilter === "individual"
                        ? "bg-[#0d5087] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        : "text-black border border-transparent hover:text-blue-700"
                    }`}
                  >
                    Індивідуальні
                  </button>
                </div>
              </div>

              {pricingLoading ? (
                <div className="p-12 text-center flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
                  <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Оновлення тарифів...</p>
                </div>
              ) : pricingList.filter(p => p.billing_plan === pricingPlanFilter).length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">Тарифів не знайдено</p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {(() => {
                      const filteredPricing = pricingList
                        .filter(p => p.billing_plan === pricingPlanFilter)
                        .sort((a, b) => a.sort_order - b.sort_order);

                      const indexOfLastPrice = pricingPage * pricingPerPage;
                      const indexOfFirstPrice = isMobile ? 0 : indexOfLastPrice - pricingPerPage;
                      const currentPrices = isMobile ? filteredPricing : filteredPricing.slice(indexOfFirstPrice, indexOfLastPrice);
                      const totalPricingPages = Math.ceil(filteredPricing.length / pricingPerPage);

                      return (
                        <>
                          {currentPrices.map((price, idx, arr) => {
                            const isEditing = editingPriceId === price.id;
                            const globalIdx = indexOfFirstPrice + idx;
                            return (
                              <div 
                                key={price.id} 
                                className="border-2 border-black rounded-xl p-4 flex justify-between items-start gap-4 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                              >
                                {isEditing ? (
                                  <div className="flex-1 space-y-3 w-full">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Напрямок
                                        </label>
                                        <input
                                          type="text"
                                          value={editName}
                                          onChange={(e) => setEditName(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Тривалість (хв)
                                        </label>
                                        <input
                                          type="number"
                                          value={editDuration}
                                          onChange={(e) => setEditDuration(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Заняття
                                        </label>
                                        <input
                                          type="text"
                                          value={editLessons}
                                          onChange={(e) => setEditLessons(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Ціна
                                        </label>
                                        <input
                                          type="text"
                                          value={editPrice}
                                          onChange={(e) => setEditPrice(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-950 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-3">
                                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">
                                        Альтернативний пакет
                                      </span>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                            Заняття
                                          </label>
                                          <input
                                            type="text"
                                            value={editAltLessons}
                                            onChange={(e) => setEditAltLessons(e.target.value)}
                                            className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                            Ціна
                                          </label>
                                          <input
                                            type="text"
                                            value={editAltPrice}
                                            onChange={(e) => setEditAltPrice(e.target.value)}
                                            className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2">
                                      <button
                                        type="button"
                                        disabled={isUpdatingPrice}
                                        onClick={handleCancelEditPrice}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-white font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        Скасувати
                                      </button>
                                      <button
                                        type="button"
                                        disabled={isUpdatingPrice}
                                        onClick={() => handleUpdatePrice(price.id)}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#facc15] font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        {isUpdatingPrice ? "Збереження..." : "Зберегти"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-xs text-slate-900 uppercase">
                                          {price.name}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-[#0d5087] text-white">
                                          ⏱️ {price.duration} хв
                                        </span>
                                      </div>

                                      <div className="mt-2 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                                        <div>
                                          📦 Основний пакет: <span className="font-black text-slate-950">{price.lessons}</span> за <span className="font-black text-[#0d5087]">{price.price}</span>
                                        </div>
                                        {price.alt_lessons && price.alt_price && (
                                          <div>
                                            ✨ Додатковий пакет: <span className="font-black text-slate-950">{price.alt_lessons}</span> за <span className="font-black text-[#0d5087]">{price.alt_price}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-shrink-0 items-center">
                                      {/* Reordering */}
                                      <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]">
                                        <button
                                          type="button"
                                          disabled={globalIdx === 0}
                                          onClick={() => handleMovePrice(price.id, "up")}
                                          className="p-1 text-slate-600 hover:text-black hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                          title="Перемістити вгору"
                                        >
                                          <ArrowUp className="h-3 w-3" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={globalIdx === filteredPricing.length - 1}
                                          onClick={() => handleMovePrice(price.id, "down")}
                                          className="p-1 text-slate-600 hover:text-black hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                          title="Перемістити вниз"
                                        >
                                          <ArrowDown className="h-3 w-3" />
                                        </button>
                                      </div>

                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleStartEditPrice(price)}
                                          className="text-slate-600 hover:text-black p-2 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                          title="Редагувати тариф"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeletePrice(price.id, price.name)}
                                          className="text-rose-500 hover:text-rose-700 p-2 rounded-xl border border-slate-200 hover:bg-rose-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                          title="Видалити тариф"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {/* PAGINATION CONTROLS */}
                          {!isMobile && totalPricingPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t-2 border-slate-100">
                              <button
                                type="button"
                                disabled={pricingPage === 1}
                                onClick={() => setPricingPage(prev => Math.max(prev - 1, 1))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Назад
                              </button>
                              <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none">
                                Сторінка {pricingPage} з {totalPricingPages}
                              </span>
                              <button
                                type="button"
                                disabled={pricingPage === totalPricingPages}
                                onClick={() => setPricingPage(prev => Math.min(prev + 1, totalPricingPages))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Вперед
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: TEACHERS CONTENT */}
        {activeTab === "teachers" && (
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN: ADD TEACHER FORM */}
            <div className="w-full lg:w-1/3 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4">
                🎓 Додати викладача
              </h3>
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    ПІБ викладача
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Гайсенюк Марина"
                    value={addTeacherName}
                    onChange={(e) => setAddTeacherName(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Посада / Роль
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Засновниця GeniusLand"
                    value={addTeacherRole}
                    onChange={(e) => setAddTeacherRole(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Шлях до зображення (автоматично заповнюється при завантаженні нижче)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/teachers/maryna.jpg або URL"
                    value={addTeacherImage}
                    onChange={(e) => setAddTeacherImage(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Завантажити фото
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="hidden"
                        id="add-teacher-file"
                      />
                      <label
                        htmlFor="add-teacher-file"
                        className="w-full text-center block rounded-xl border-2 border-black bg-[#0d5087] text-white px-3 py-2 text-xs font-black uppercase cursor-pointer hover:bg-[#0c406c] active:translate-y-[1px] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {uploadingImage ? (
                          <span className="flex items-center justify-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" /> Завантаження...
                          </span>
                        ) : (
                          "Обрати файл"
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Досвід роботи
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4 роки роботи з дітьми"
                      value={addTeacherExperience}
                      onChange={(e) => setAddTeacherExperience(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                </div>

                {addTeacherImage && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border-2 border-black">
                    <img
                      src={addTeacherImage}
                      alt="Прев'ю"
                      className="w-10 h-10 rounded-full object-cover border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Прев'ю завантаженого фото</span>
                      <span className="block text-[10px] font-bold text-slate-700 truncate">{addTeacherImage}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Додатковий досвід / Освіта (опціонально)
                  </label>
                  <input
                    type="text"
                    placeholder="Профільна освіта з логопедії"
                    value={addTeacherSubExperience}
                    onChange={(e) => setAddTeacherSubExperience(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Спеціалізація (через кому)
                  </label>
                  <input
                    type="text"
                    placeholder="Ментальна арифметика, Швидкочитання, Репетиторство"
                    value={addTeacherBullets}
                    onChange={(e) => setAddTeacherBullets(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Цитата викладача
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Вірить, що навчання може бути в радість..."
                    value={addTeacherQuote}
                    onChange={(e) => setAddTeacherQuote(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 p-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingTeacher}
                  className="w-full rounded-xl bg-[#facc15] py-3 text-xs font-black uppercase tracking-wider text-slate-900 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>{isAddingTeacher ? "Додавання..." : "Зберегти викладача"}</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: LIST OF TEACHERS */}
            <div className="flex-1 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                🎓 Список викладачів ({teachers.length})
              </h3>

              {teachersLoading ? (
                <div className="p-12 text-center flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
                  <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Оновлення списку викладачів...</p>
                </div>
              ) : teachers.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">Викладачів не знайдено</p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {(() => {
                      const indexOfLastTeacher = teachersPage * teachersPerPage;
                      const indexOfFirstTeacher = isMobile ? 0 : indexOfLastTeacher - teachersPerPage;
                      const currentTeachersList = isMobile ? teachers : teachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
                      const totalTeachersPages = Math.ceil(teachers.length / teachersPerPage);

                      return (
                        <>
                          {currentTeachersList.map((t, idx) => {
                            const isEditing = editingTeacherId === t.id;
                            const globalIdx = indexOfFirstTeacher + idx;
                            return (
                              <div 
                                key={t.id || idx} 
                                className="border-2 border-black rounded-xl p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-4 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                              >
                                {isEditing ? (
                                  <div className="flex-1 space-y-3 w-full">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          ПІБ викладача
                                        </label>
                                        <input
                                          type="text"
                                          value={editTeacherName}
                                          onChange={(e) => setEditTeacherName(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Посада / Роль
                                        </label>
                                        <input
                                          type="text"
                                          value={editTeacherRole}
                                          onChange={(e) => setEditTeacherRole(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Шлях до зображення
                                        </label>
                                        <input
                                          type="text"
                                          value={editTeacherImage}
                                          onChange={(e) => setEditTeacherImage(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Завантажити нове фото
                                        </label>
                                        <div className="relative">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, true)}
                                            className="hidden"
                                            id={`edit-teacher-file-${t.id}`}
                                          />
                                          <label
                                            htmlFor={`edit-teacher-file-${t.id}`}
                                            className="w-full text-center block rounded-lg border-2 border-black bg-[#0d5087] text-white px-2.5 py-1.5 text-[10px] font-black uppercase cursor-pointer hover:bg-[#0c406c] active:translate-y-[1px] transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                                          >
                                            {uploadingImage ? (
                                              <span className="flex items-center justify-center gap-1">
                                                <Loader2 className="h-2.5 w-2.5 animate-spin" />...
                                              </span>
                                            ) : (
                                              "Обрати файл"
                                            )}
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="col-span-2">
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Досвід роботи
                                        </label>
                                        <input
                                          type="text"
                                          value={editTeacherExperience}
                                          onChange={(e) => setEditTeacherExperience(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    {editTeacherImage && (
                                      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                        <img
                                          src={editTeacherImage}
                                          alt="Прев'ю"
                                          className="w-8 h-8 rounded-full object-cover border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                        />
                                        <span className="text-[9px] font-bold text-slate-500 truncate flex-1">{editTeacherImage}</span>
                                      </div>
                                    )}

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Додатковий досвід / Освіта (опціонально)
                                      </label>
                                      <input
                                        type="text"
                                        value={editTeacherSubExperience}
                                        onChange={(e) => setEditTeacherSubExperience(e.target.value)}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Спеціалізація (через кому)
                                      </label>
                                      <input
                                        type="text"
                                        value={editTeacherBullets}
                                        onChange={(e) => setEditTeacherBullets(e.target.value)}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Цитата
                                      </label>
                                      <textarea
                                        value={editTeacherQuote}
                                        onChange={(e) => setEditTeacherQuote(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white resize-none leading-relaxed"
                                      />
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2">
                                      <button
                                        type="button"
                                        disabled={isUpdatingTeacher}
                                        onClick={handleCancelEditTeacher}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-white font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        Скасувати
                                      </button>
                                      <button
                                        type="button"
                                        disabled={isUpdatingTeacher}
                                        onClick={() => handleUpdateTeacher(t.id!)}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#facc15] font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        {isUpdatingTeacher ? "Збереження..." : "Зберегти"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex gap-3 flex-1">
                                      <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-slate-100 flex-shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] relative">
                                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="font-extrabold text-xs text-slate-900 uppercase">
                                            {t.name}
                                          </span>
                                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-[#0d5087] text-white uppercase">
                                            {t.role}
                                          </span>
                                        </div>

                                        <div className="mt-2 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                                          <div>
                                            🎓 Досвід: <span className="font-extrabold text-slate-900">{t.experience}</span>
                                          </div>
                                          {t.sub_experience && (
                                            <div>
                                              ✨ Освіта: <span className="text-slate-600">{t.sub_experience}</span>
                                            </div>
                                          )}
                                          <div>
                                            🎯 Спеціалізація: <span className="text-slate-800">{t.bullets ? t.bullets.join(", ") : ""}</span>
                                          </div>
                                          <div className="italic text-slate-500 pt-1 border-t border-slate-100 mt-1">
                                            «{t.quote}»
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex sm:flex-col justify-between sm:justify-start items-center gap-3 flex-shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                      {/* Reordering */}
                                      <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]">
                                        <button
                                          type="button"
                                          disabled={globalIdx === 0}
                                          onClick={() => handleMoveTeacher(t.id!, "up")}
                                          className="p-1 text-slate-600 hover:text-black hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                          title="Перемістити вгору"
                                        >
                                          <ArrowUp className="h-3 w-3" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={globalIdx === teachers.length - 1}
                                          onClick={() => handleMoveTeacher(t.id!, "down")}
                                          className="p-1 text-slate-600 hover:text-black hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                          title="Перемістити вниз"
                                        >
                                          <ArrowDown className="h-3 w-3" />
                                        </button>
                                      </div>

                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleStartEditTeacher(t)}
                                          className="text-slate-600 hover:text-black p-2 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                          title="Редагувати"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteTeacher(t.id!, t.name)}
                                          className="text-rose-500 hover:text-rose-700 p-2 rounded-xl border border-slate-200 hover:bg-rose-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                          title="Видалити"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {/* PAGINATION CONTROLS */}
                          {!isMobile && totalTeachersPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t-2 border-slate-100">
                              <button
                                type="button"
                                disabled={teachersPage === 1}
                                onClick={() => setTeachersPage(prev => Math.max(prev - 1, 1))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Назад
                              </button>
                              <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none">
                                Сторінка {teachersPage} з {totalTeachersPages}
                              </span>
                              <button
                                type="button"
                                disabled={teachersPage === totalTeachersPages}
                                onClick={() => setTeachersPage(prev => Math.min(prev + 1, totalTeachersPages))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Вперед
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: ARTICLES CONTENT */}
        {activeTab === "articles" && (
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN: ADD ARTICLE FORM */}
            <div className="w-full lg:w-1/3 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4">
                📝 Додати статтю
              </h3>
              <form onSubmit={handleAddArticle} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Заголовок статті
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Як ментальна арифметика..."
                    value={addArticleTitle}
                    onChange={(e) => {
                      setAddArticleTitle(e.target.value);
                      setAddArticleSlug(translit(e.target.value));
                    }}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Категорія
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ментальна арифметика"
                      value={addArticleCategory}
                      onChange={(e) => setAddArticleCategory(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Дата публікації
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="12 Червня, 2026"
                      value={addArticleDate}
                      onChange={(e) => setAddArticleDate(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Короткий опис (прев'ю картки)
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Короткий зміст статті для списку корисних матеріалів..."
                    value={addArticleDescription}
                    onChange={(e) => setAddArticleDescription(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 p-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Текст статті (кожен новий абзац починайте з нового рядка)
                  </label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Введіть повний вміст статті тут..."
                    value={addArticleContent}
                    onChange={(e) => setAddArticleContent(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 p-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingArticle}
                  className="w-full rounded-xl bg-[#facc15] py-3 text-xs font-black uppercase tracking-wider text-slate-900 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>{isAddingArticle ? "Додавання..." : "Опублікувати статтю"}</span>
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: LIST OF ARTICLES */}
            <div className="flex-1 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                📝 Список статей ({dbArticles.length})
              </h3>

              {articlesLoading ? (
                <div className="p-12 text-center flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
                  <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Оновлення списку статей...</p>
                </div>
              ) : dbArticles.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-500">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">Статей не знайдено</p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {(() => {
                      const indexOfLastArticle = articlesPage * articlesPerPage;
                      const indexOfFirstArticle = isMobile ? 0 : indexOfLastArticle - articlesPerPage;
                      const currentArticlesList = isMobile ? dbArticles : dbArticles.slice(indexOfFirstArticle, indexOfLastArticle);
                      const totalArticlesPages = Math.ceil(dbArticles.length / articlesPerPage);

                      return (
                        <>
                          {currentArticlesList.map((art) => {
                            const isEditing = editingArticleId === art.id;
                            return (
                              <div 
                                key={art.id} 
                                className="border-2 border-black rounded-xl p-4 flex justify-between items-start gap-4 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                              >
                                {isEditing ? (
                                  <div className="flex-1 space-y-3 w-full">
                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Заголовок статті
                                      </label>
                                      <input
                                        type="text"
                                        value={editArticleTitle}
                                        onChange={(e) => {
                                          setEditArticleTitle(e.target.value);
                                          setEditArticleSlug(translit(e.target.value));
                                        }}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Категорія
                                        </label>
                                        <input
                                          type="text"
                                          value={editArticleCategory}
                                          onChange={(e) => setEditArticleCategory(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Дата публікації
                                        </label>
                                        <input
                                          type="text"
                                          value={editArticleDate}
                                          onChange={(e) => setEditArticleDate(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Короткий опис
                                      </label>
                                      <textarea
                                        value={editArticleDescription}
                                        onChange={(e) => setEditArticleDescription(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white resize-none"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Текст статті (кожен новий абзац з нового рядка)
                                      </label>
                                      <textarea
                                        value={editArticleContent}
                                        onChange={(e) => setEditArticleContent(e.target.value)}
                                        rows={6}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white resize-none leading-relaxed"
                                      />
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2">
                                      <button
                                        type="button"
                                        disabled={isUpdatingArticle}
                                        onClick={handleCancelEditArticle}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-white font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        Скасувати
                                      </button>
                                      <button
                                        type="button"
                                        disabled={isUpdatingArticle}
                                        onClick={() => handleUpdateArticle(art.id)}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#facc15] font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        {isUpdatingArticle ? "Збереження..." : "Зберегти"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-extrabold text-xs text-slate-900 uppercase">
                                          {art.title}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-[#0d5087] text-white uppercase">
                                          {art.category}
                                        </span>
                                      </div>
                                      <div className="mt-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                                        <div className="text-slate-500 italic">
                                          «{art.description}»
                                        </div>
                                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 mt-1 flex justify-between">
                                          <span>📅 {art.date}</span>
                                          <span>📝 Абзаців: {art.content ? art.content.length : 0}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditArticle(art)}
                                        className="text-slate-600 hover:text-black p-2 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                        title="Редагувати статтю"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteArticle(art.id, art.title)}
                                        className="text-rose-500 hover:text-rose-700 p-2 rounded-xl border border-slate-200 hover:bg-rose-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                        title="Видалити статтю"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {/* PAGINATION CONTROLS */}
                          {!isMobile && totalArticlesPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t-2 border-slate-100">
                              <button
                                type="button"
                                disabled={articlesPage === 1}
                                onClick={() => setArticlesPage(prev => Math.max(prev - 1, 1))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Назад
                              </button>
                              <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none">
                                Сторінка {articlesPage} з {totalArticlesPages}
                              </span>
                              <button
                                type="button"
                                disabled={articlesPage === totalArticlesPages}
                                onClick={() => setArticlesPage(prev => Math.min(prev + 1, totalArticlesPages))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Вперед
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 6: COURSES CONTENT */}
        {activeTab === "courses" && (
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN: ADD COURSE FORM */}
            <div className="w-full lg:w-1/3 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] self-start">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4">
                ➕ Додати напрямок
              </h3>
              
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Назва курсу / напрямку
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Підготовка до школи"
                    value={addCourseTitle}
                    onChange={(e) => setAddCourseTitle(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Підзаголовок (необов'язково)
                  </label>
                  <input
                    type="text"
                    placeholder="Основні предмети 1–4 клас"
                    value={addCourseSubtitle}
                    onChange={(e) => setAddCourseSubtitle(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Вік (напр. 5+, 6-10)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="5+"
                      value={addCourseAge}
                      onChange={(e) => setAddCourseAge(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      К-сть занять / тиждень
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2 рази \ тиждень"
                      value={addCourseInfo}
                      onChange={(e) => setAddCourseInfo(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Режим навчання / онлайн
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+ онлайн заняття"
                    value={addCourseOnline}
                    onChange={(e) => setAddCourseOnline(e.target.value)}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Група (тривалість)
                    </label>
                    <input
                      type="text"
                      placeholder="55 хвилин — група"
                      value={addCourseGroupDuration}
                      onChange={(e) => setAddCourseGroupDuration(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                      Інд. заняття (тривалість)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="40 хвилин — індивідуально"
                      value={addCourseIndivDuration}
                      onChange={(e) => setAddCourseIndivDuration(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Програма курсу (через кому)
                  </label>
                  <textarea
                    required
                    placeholder="Читання, Письмо, Математика..."
                    value={addCoursePoints}
                    onChange={(e) => setAddCoursePoints(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Зображення фону (PNG/JPG)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCourseImageUpload(e, false)}
                      className="w-full text-xs font-bold text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-2 file:border-black file:text-xs file:font-black file:bg-[#facc15] file:text-black file:cursor-pointer hover:file:bg-[#e0b810] transition-all"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500">Або введіть шлях до локального файлу:</span>
                    </div>
                    <input
                      type="text"
                      placeholder="/courses-bg/school-prep.png"
                      value={addCourseBgImage}
                      onChange={(e) => setAddCourseBgImage(e.target.value)}
                      className="w-full rounded-xl border-2 border-black bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0d5087] transition-all"
                    />
                    {uploadingCourseImage && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#0d5087] font-black uppercase">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Завантаження фото...
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="addCourseIsFullWidth"
                    checked={addCourseIsFullWidth}
                    onChange={(e) => setAddCourseIsFullWidth(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-black text-[#0d5087] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="addCourseIsFullWidth" className="text-xs font-bold text-slate-700 select-none cursor-pointer">
                    Показувати на всю ширину на десктопі
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isAddingCourse || uploadingCourseImage}
                  className="w-full bg-[#facc15] hover:bg-[#e0b810] text-black border-2 border-black py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingCourse ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Створення...
                    </>
                  ) : (
                    "Додати напрямок"
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: COURSES LIST */}
            <div className="w-full lg:w-2/3 bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-slate-100">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  📋 Список напрямків ({courses.length})
                </h3>
              </div>

              {coursesLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Завантаження напрямків...</span>
                </div>
              ) : courses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-slate-400" />
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase mb-1">Не знайдено жодного напрямку в базі</h4>
                    <p className="text-xs text-slate-500">Створіть свій перший напрямок за допомогою форми ліворуч.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-4">
                    {(() => {
                      const totalCoursesPages = Math.ceil(courses.length / coursesPerPage);
                      const startIndex = isMobile ? 0 : (coursesPage - 1) * coursesPerPage;
                      const paginatedCourses = isMobile ? courses : courses.slice(startIndex, startIndex + coursesPerPage);

                      return (
                        <>
                          {paginatedCourses.map((c, idx) => {
                            const absoluteIndex = startIndex + idx;
                            const isEditing = editingCourseId === c.id;

                            return (
                              <div 
                                key={c.id} 
                                className="border-2 border-black rounded-xl p-4 flex justify-between items-start gap-4 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                              >
                                {isEditing ? (
                                  <div className="flex-1 space-y-3 w-full">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Назва напрямку
                                        </label>
                                        <input
                                          type="text"
                                          value={editCourseTitle}
                                          onChange={(e) => setEditCourseTitle(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Підзаголовок
                                        </label>
                                        <input
                                          type="text"
                                          value={editCourseSubtitle}
                                          onChange={(e) => setEditCourseSubtitle(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Вік (напр. 5+)
                                        </label>
                                        <input
                                          type="text"
                                          value={editCourseAge}
                                          onChange={(e) => setEditCourseAge(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          К-сть занять / тиждень
                                        </label>
                                        <input
                                          type="text"
                                          value={editCourseInfo}
                                          onChange={(e) => setEditCourseInfo(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Режим навчання / онлайн
                                      </label>
                                      <input
                                        type="text"
                                        value={editCourseOnline}
                                        onChange={(e) => setEditCourseOnline(e.target.value)}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Група (тривалість)
                                        </label>
                                        <input
                                          type="text"
                                          value={editCourseGroupDuration}
                                          onChange={(e) => setEditCourseGroupDuration(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                          Інд. заняття (тривалість)
                                        </label>
                                        <input
                                          type="text"
                                          value={editCourseIndivDuration}
                                          onChange={(e) => setEditCourseIndivDuration(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Програма курсу (через кому)
                                      </label>
                                      <textarea
                                        value={editCoursePoints}
                                        onChange={(e) => setEditCoursePoints(e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white resize-y"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">
                                        Зображення фону (PNG/JPG)
                                      </label>
                                      <div className="space-y-2">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleCourseImageUpload(e, true)}
                                          className="w-full text-xs font-bold text-slate-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-2 file:border-black file:text-[10px] file:font-black file:bg-[#facc15] file:text-black file:cursor-pointer hover:file:bg-[#e0b810] transition-all"
                                        />
                                        <input
                                          type="text"
                                          value={editCourseBgImage}
                                          onChange={(e) => setEditCourseBgImage(e.target.value)}
                                          className="w-full rounded-lg border-2 border-black bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                                        />
                                        {uploadingCourseImage && (
                                          <div className="flex items-center gap-1.5 text-[9px] text-[#0d5087] font-black uppercase">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Оновлення фото...
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 py-1">
                                      <input
                                        type="checkbox"
                                        id={`editCourseIsFullWidth_${c.id}`}
                                        checked={editCourseIsFullWidth}
                                        onChange={(e) => setEditCourseIsFullWidth(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-2 border-black text-[#0d5087] focus:ring-0 cursor-pointer"
                                      />
                                      <label htmlFor={`editCourseIsFullWidth_${c.id}`} className="text-[10px] font-bold text-slate-700 select-none cursor-pointer">
                                        Показувати на всю ширину на десктопі
                                      </label>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                      <button
                                        type="button"
                                        disabled={isUpdatingCourse}
                                        onClick={handleCancelEditCourse}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-white font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        Скасувати
                                      </button>
                                      <button
                                        type="button"
                                        disabled={isUpdatingCourse}
                                        onClick={() => handleUpdateCourse(c.id!)}
                                        className="px-3 py-1.5 rounded-lg border-2 border-black bg-[#facc15] font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                                      >
                                        {isUpdatingCourse ? "Збереження..." : "Зберегти"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex-grow min-w-0">
                                      <div className="flex items-start gap-2.5 flex-wrap">
                                        <h4 className="font-extrabold text-sm text-slate-900 uppercase">
                                          {c.title}
                                        </h4>
                                        {c.subtitle && (
                                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-900 text-[#facc15] uppercase border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                            {c.subtitle}
                                          </span>
                                        )}
                                      </div>

                                      <div className="mt-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                          <div>👶 Вік: <span className="text-slate-900">{c.age}</span></div>
                                          <div>📅 Розклад: <span className="text-slate-900">{c.info}</span></div>
                                          <div>🌐 Формат: <span className="text-slate-900">{c.online}</span></div>
                                          <div>📐 Ширина: <span className="text-slate-900">{c.is_full_width ? "Повна" : "Стандарт"}</span></div>
                                        </div>
                                        <div className="border-t border-slate-100 mt-1.5 pt-1.5 text-[10px] text-slate-500">
                                          <span className="font-extrabold text-[9px] uppercase text-slate-400 block mb-0.5">Булети програми:</span>
                                          {c.points && c.points.join(", ")}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditCourse(c)}
                                        className="text-slate-600 hover:text-black p-2 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                        title="Редагувати напрямок"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCourse(c.id!, c.title)}
                                        className="text-rose-500 hover:text-rose-700 p-2 rounded-xl border border-slate-200 hover:bg-rose-50 active:scale-95 transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px] bg-white cursor-pointer flex items-center justify-center"
                                        title="Видалити напрямок"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                      <div className="flex flex-col gap-1 mt-1 border-t border-slate-100 pt-1">
                                        <button
                                          type="button"
                                          disabled={absoluteIndex === 0}
                                          onClick={() => handleMoveCourse(c.id!, "up")}
                                          className="text-slate-500 hover:text-black hover:bg-slate-100 rounded-md p-1 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center cursor-pointer"
                                          title="Перемістити вгору"
                                        >
                                          <ArrowUp className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={absoluteIndex === courses.length - 1}
                                          onClick={() => handleMoveCourse(c.id!, "down")}
                                          className="text-slate-500 hover:text-black hover:bg-slate-100 rounded-md p-1 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center cursor-pointer"
                                          title="Перемістити вниз"
                                        >
                                          <ArrowDown className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {/* PAGINATION CONTROLS */}
                          {!isMobile && totalCoursesPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t-2 border-slate-100">
                              <button
                                type="button"
                                disabled={coursesPage === 1}
                                onClick={() => setCoursesPage(prev => Math.max(prev - 1, 1))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Назад
                              </button>
                              <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none">
                                Сторінка {coursesPage} з {totalCoursesPages}
                              </span>
                              <button
                                type="button"
                                disabled={coursesPage === totalCoursesPages}
                                onClick={() => setCoursesPage(prev => Math.min(prev + 1, totalCoursesPages))}
                                className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                              >
                                Вперед
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 7: GALLERY CONTENT */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-6">
            
            {/* UPLOAD PANEL */}
            <div className="border-4 border-black bg-[#facc15]/10 p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-black">
                    📥 Завантажити фотографії
                  </h3>
                  <p className="text-xs font-medium text-slate-700 mt-1">
                    Ви можете вибрати декілька фото одночасно. Підтримуються формати: JPEG, PNG, HEIC (iPhone).
                  </p>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    * Усі фотографії автоматично стискаються та конвертуються у формат .webp для швидкого завантаження.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="gallery-file-input"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    disabled={uploadingGallery}
                    className="hidden"
                  />
                  <label
                    htmlFor="gallery-file-input"
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-4 border-black bg-[#facc15] font-black text-xs sm:text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer select-none ${
                      uploadingGallery ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                    }`}
                  >
                    <Plus className="h-4.5 w-4.5 animate-pulse" />
                    Обрати файли
                  </label>
                </div>
              </div>

              {/* UPLOADING STATUS */}
              {uploadingGallery && (
                <div className="border-2 border-black bg-white p-3.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {uploadStatus || "Обробка та завантаження файлів..."}
                  </span>
                </div>
              )}
            </div>

            {/* PHOTOS GRID */}
            <div className="border-4 border-black bg-white p-4 sm:p-6 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {galleryLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-10 w-10 text-[#facc15] animate-spin" />
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Завантаження списку фотографій...
                  </p>
                </div>
              ) : galleryPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-black uppercase tracking-wider text-slate-500">
                    🖼️ Галерея порожня. Завантажте перші фотографії!
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {(() => {
                      const displayedPhotos = galleryPhotos.slice(
                        (galleryPage - 1) * galleryPerPage,
                        galleryPage * galleryPerPage
                      );

                      return displayedPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="border-4 border-black bg-white p-2.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2.5 group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-black bg-slate-50">
                            <img
                              src={photo.url}
                              alt="Gallery photo"
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex flex-col gap-1 border-t-2 border-black/5 pt-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                              Завантажено: {new Date(photo.created_at).toLocaleDateString("uk-UA", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryPhoto(photo.id, photo.storage_path)}
                              className="w-full bg-rose-500 text-white border-2 border-black py-1.5 px-3 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[10px] font-black uppercase"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Видалити</span>
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* PAGINATION CONTROLS */}
                  {(() => {
                    const totalGalleryPages = Math.ceil(galleryPhotos.length / galleryPerPage);
                    if (totalGalleryPages <= 1) return null;

                    return (
                      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t-2 border-slate-100">
                        <button
                          type="button"
                          disabled={galleryPage === 1}
                          onClick={() => setGalleryPage((prev) => Math.max(prev - 1, 1))}
                          className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                        >
                          Назад
                        </button>
                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none">
                          Сторінка {galleryPage} з {totalGalleryPages}
                        </span>
                        <button
                          type="button"
                          disabled={galleryPage === totalGalleryPages}
                          onClick={() => setGalleryPage((prev) => Math.min(prev + 1, totalGalleryPages))}
                          className="px-3.5 py-2 rounded-xl border-2 border-black bg-white font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 select-none"
                        >
                          Вперед
                        </button>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}
