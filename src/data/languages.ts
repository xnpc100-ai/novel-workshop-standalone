/**
 * 全球主要语言表（含中英枢纽路由）
 * PRD 1.1：所有非中英文互译必须以中文或英文为枢纽
 *
 * 字段：
 * - code: 内部短码
 * - iso: ISO 639-1
 * - name: 中文名
 * - nameEn: 英文名
 * - native: 本语种写法
 * - family: 语系
 * - hub: 翻译时以哪个枢纽中转（'zh' | 'en' | 'both'）
 *
 * 注：仅"zh"↔"en"互译为直译链路；其他语言以"zh"为优先枢纽（覆盖全球98%+市场）
 */

export type HubLang = 'zh' | 'en' | 'both';

export interface LanguageDef {
  code: string;
  iso: string;
  name: string;
  nameEn: string;
  native: string;
  family: string;
  hub: HubLang;
  /** 翻译提示词里的指令短句 */
  promptHint: string;
}

export const LANGUAGES: LanguageDef[] = [
  // === 核心枢纽（直译链路）===
  { code: 'zh',   iso: 'zh', name: '中文（简体）',    nameEn: 'Chinese (Simplified)',  native: '简体中文',  family: '汉藏语系',    hub: 'both', promptHint: '中文（简体中文）。文化概念按大陆当代读者习惯本土化。' },
  { code: 'en',   iso: 'en', name: '英语',           nameEn: 'English',                native: 'English',  family: '印欧语系',   hub: 'both', promptHint: 'English. Natural idiomatic American/British English; cultural concepts localized for global readers.' },

  // === 第一梯队：2024对华贸易额TOP20 ===
  { code: 'ja',   iso: 'ja', name: '日语',           nameEn: 'Japanese',               native: '日本語',    family: '扶余语系',    hub: 'zh',  promptHint: '日本語。文体可为だ/である体，文学性强。敬语按上下文自然处理。' },
  { code: 'ko',   iso: 'ko', name: '韩语',           nameEn: 'Korean',                 native: '한국어',     family: '扶余语系',    hub: 'zh',  promptHint: '한국어. 해체/합쇼체 按文体自然选择。文化意象按韩国当代读者习惯本土化。' },
  { code: 'vi',   iso: 'vi', name: '越南语',         nameEn: 'Vietnamese',             native: 'Tiếng Việt', family: '南亚语系',  hub: 'zh',  promptHint: 'Tiếng Việt. Di sản văn hóa Trung Hoa dùng từ Hán Việt tự nhiên.' },
  { code: 'th',   iso: 'th', name: '泰语',           nameEn: 'Thai',                   native: 'ภาษาไทย',   family: '壮侗语系',  hub: 'zh',  promptHint: 'ภาษาไทย. แปลอย่างเป็นธรรมชาติ หลีกเลี่ยงการแปลตรงตัว' },
  { code: 'id',   iso: 'id', name: '印度尼西亚语',   nameEn: 'Indonesian',             native: 'Bahasa Indonesia', family: '南岛语系', hub: 'zh', promptHint: 'Bahasa Indonesia. Gaya bahasa sastra modern, hindari kalke.' },
  { code: 'ms',   iso: 'ms', name: '马来语',         nameEn: 'Malay',                  native: 'Bahasa Melayu', family: '南岛语系', hub: 'zh', promptHint: 'Bahasa Melayu. Baku dan sastera.' },
  { code: 'hi',   iso: 'hi', name: '印地语',         nameEn: 'Hindi',                  native: 'हिन्दी',        family: '印欧语系',   hub: 'en',  promptHint: 'Hindi (Devanagari). आधुनिक साहित्यिक हिन्दी, संस्कृतनिष्ठ शब्दों से बचें।' },
  { code: 'ru',   iso: 'ru', name: '俄语',           nameEn: 'Russian',                native: 'Русский',    family: '印欧语系',   hub: 'en',  promptHint: 'Russian. Литературный русский язык; избегайте машинного стиля.' },
  { code: 'de',   iso: 'de', name: '德语',           nameEn: 'German',                 native: 'Deutsch',    family: '印欧语系',   hub: 'en',  promptHint: 'Deutsch. Literarisch, idiomatisch; chinesische Kulturbegriffe sinngemäß übertragen.' },
  { code: 'fr',   iso: 'fr', name: '法语',           nameEn: 'French',                 native: 'Français',   family: '印欧语系',   hub: 'en',  promptHint: 'Français. Littéraire et idiomatique ; adapter les concepts culturels chinois.' },
  { code: 'es',   iso: 'es', name: '西班牙语',       nameEn: 'Spanish',                native: 'Español',    family: '印欧语系',   hub: 'en',  promptHint: 'Español. Castellano literario neutro; localizar conceptos culturales chinos.' },
  { code: 'pt',   iso: 'pt', name: '葡萄牙语',       nameEn: 'Portuguese',             native: 'Português',  family: '印欧语系',   hub: 'en',  promptHint: 'Português. Variante brasileira/neutra literária; localizar conceitos culturais.' },
  { code: 'it',   iso: 'it', name: '意大利语',       nameEn: 'Italian',                native: 'Italiano',   family: '印欧语系',   hub: 'en',  promptHint: 'Italiano. Letterario, scorrevole; adattare i concetti culturali cinesi.' },
  { code: 'nl',   iso: 'nl', name: '荷兰语',         nameEn: 'Dutch',                  native: 'Nederlands', family: '印欧语系',   hub: 'en',  promptHint: 'Nederlands. Stijlvol en idiomatisch.' },
  { code: 'pl',   iso: 'pl', name: '波兰语',         nameEn: 'Polish',                 native: 'Polski',     family: '印欧语系',   hub: 'en',  promptHint: 'Polski. Literacki, idiomatyczny.' },
  { code: 'tr',   iso: 'tr', name: '土耳其语',       nameEn: 'Turkish',                native: 'Türkçe',     family: '突厥语系',   hub: 'en',  promptHint: 'Türkçe. Edebi ve doğal.' },
  { code: 'ar',   iso: 'ar', name: '阿拉伯语',       nameEn: 'Arabic',                 native: 'العربية',     family: '闪米特语系', hub: 'en',  promptHint: 'Arabic (Modern Standard). فصحى معاصرة أدبية.' },
  { code: 'he',   iso: 'he', name: '希伯来语',       nameEn: 'Hebrew',                 native: 'עברית',        family: '闪米特语系', hub: 'en',  promptHint: 'עברית. ספרותי ושוטף.' },

  // === 第二梯队：亚洲其他主要语言 ===
  { code: 'bn',   iso: 'bn', name: '孟加拉语',       nameEn: 'Bengali',                native: 'বাংলা',       family: '印欧语系',   hub: 'en',  promptHint: 'Bengali (Bangla). সাহিত্যিক বাংলা.' },
  { code: 'ur',   iso: 'ur', name: '乌尔都语',       nameEn: 'Urdu',                   native: 'اردو',        family: '印欧语系',   hub: 'en',  promptHint: 'Urdu. ادبی اردو.' },
  { code: 'fa',   iso: 'fa', name: '波斯语',         nameEn: 'Persian',                native: 'فارسی',       family: '印欧语系',   hub: 'en',  promptHint: 'فارسی. ادبی و روان.' },
  { code: 'ta',   iso: 'ta', name: '泰米尔语',       nameEn: 'Tamil',                  native: 'தமிழ்',       family: '达罗毗荼语系',hub: 'en',  promptHint: 'Tamil. இலக்கிய தமிழ்.' },
  { code: 'te',   iso: 'te', name: '泰卢固语',       nameEn: 'Telugu',                 native: 'తెలుగు',     family: '达罗毗荼语系',hub: 'en',  promptHint: 'Telugu. సాహిత్యిక తెలుగు.' },
  { code: 'mr',   iso: 'mr', name: '马拉地语',       nameEn: 'Marathi',                native: 'मराठी',        family: '印欧语系',   hub: 'en',  promptHint: 'Marathi. साहित्यिक मराठी.' },
  { code: 'gu',   iso: 'gu', name: '古吉拉特语',     nameEn: 'Gujarati',               native: 'ગુજરાતી',    family: '印欧语系',   hub: 'en',  promptHint: 'Gujarati. સાહિત્યિક ગુજરાતી.' },
  { code: 'pa',   iso: 'pa', name: '旁遮普语',       nameEn: 'Punjabi',                native: 'ਪੰਜਾਬੀ',      family: '印欧语系',   hub: 'en',  promptHint: 'Punjabi (Gurmukhi). ਸਾਹਿਤਕ ਪੰਜਾਬੀ.' },
  { code: 'sw',   iso: 'sw', name: '斯瓦希里语',     nameEn: 'Swahili',                native: 'Kiswahili',  family: '尼日尔-刚果语系',hub: 'en', promptHint: 'Kiswahili. Kiswahili sanifu cha kisasa.' },
  { code: 'my',   iso: 'my', name: '缅甸语',         nameEn: 'Burmese',                native: 'မြန်မာ',      family: '汉藏语系',    hub: 'zh',  promptHint: 'မြန်မာ. စာပိုဒ်ဆန်း မြန်မာစာ' },
  { code: 'km',   iso: 'km', name: '高棉语',         nameEn: 'Khmer',                  native: 'ខ្មែរ',       family: '南亚语系',   hub: 'zh',  promptHint: 'ខ្មែរ. អក្សរសាស្ត្រខ្មែរ' },
  { code: 'lo',   iso: 'lo', name: '老挝语',         nameEn: 'Lao',                    native: 'ລາວ',         family: '壮侗语系',  hub: 'zh',  promptHint: 'ລາວ. ວັນນະຄະດີລາວ' },
  { code: 'mn',   iso: 'mn', name: '蒙古语',         nameEn: 'Mongolian',              native: 'Монгол',     family: '阿尔泰语系', hub: 'zh',  promptHint: 'Монгол. Орчин цагийн утга зохиолын монгол.' },
  { code: 'ne',   iso: 'ne', name: '尼泊尔语',       nameEn: 'Nepali',                 native: 'नेपाली',       family: '印欧语系',   hub: 'en',  promptHint: 'Nepali. साहित्यिक नेपाली.' },
  { code: 'si',   iso: 'si', name: '僧伽罗语',       nameEn: 'Sinhala',                native: 'සිංහල',       family: '印欧语系',   hub: 'en',  promptHint: 'සිංහල. සාහිත්‍යමය සිංහල.' },

  // === 第三梯队：欧洲其他主要语言 ===
  { code: 'uk',   iso: 'uk', name: '乌克兰语',       nameEn: 'Ukrainian',              native: 'Українська', family: '印欧语系',   hub: 'en',  promptHint: 'Ukrainian. Літературна українська.' },
  { code: 'cs',   iso: 'cs', name: '捷克语',         nameEn: 'Czech',                  native: 'Čeština',    family: '印欧语系',   hub: 'en',  promptHint: 'Čeština. Spisovná čeština, literární.' },
  { code: 'ro',   iso: 'ro', name: '罗马尼亚语',     nameEn: 'Romanian',               native: 'Română',     family: '印欧语系',   hub: 'en',  promptHint: 'Română. Literară, fluentă.' },
  { code: 'hu',   iso: 'hu', name: '匈牙利语',       nameEn: 'Hungarian',              native: 'Magyar',     family: '乌拉尔语系', hub: 'en',  promptHint: 'Magyar. Irodalmi, természetes.' },
  { code: 'el',   iso: 'el', name: '希腊语',         nameEn: 'Greek',                  native: 'Ελληνικά',   family: '印欧语系',   hub: 'en',  promptHint: 'Ελληνικά. Λογοτεχνική νέα ελληνικά.' },
  { code: 'sv',   iso: 'sv', name: '瑞典语',         nameEn: 'Swedish',                native: 'Svenska',    family: '印欧语系',   hub: 'en',  promptHint: 'Svenska. Litterär, idiomatisk.' },
  { code: 'no',   iso: 'no', name: '挪威语',         nameEn: 'Norwegian',              native: 'Norsk',      family: '印欧语系',   hub: 'en',  promptHint: 'Norsk. Bokmål litterær.' },
  { code: 'da',   iso: 'da', name: '丹麦语',         nameEn: 'Danish',                 native: 'Dansk',      family: '印欧语系',   hub: 'en',  promptHint: 'Dansk. Litterær, naturlig.' },
  { code: 'fi',   iso: 'fi', name: '芬兰语',         nameEn: 'Finnish',                native: 'Suomi',      family: '乌拉尔语系', hub: 'en',  promptHint: 'Suomi. Kirjakieli, kirjallinen.' },
  { code: 'bg',   iso: 'bg', name: '保加利亚语',     nameEn: 'Bulgarian',              native: 'Български',  family: '印欧语系',   hub: 'en',  promptHint: 'Български. Литературен български.' },
  { code: 'sr',   iso: 'sr', name: '塞尔维亚语',     nameEn: 'Serbian',                native: 'Српски',     family: '印欧语系',   hub: 'en',  promptHint: 'Српски. Књижевни српски.' },
  { code: 'hr',   iso: 'hr', name: '克罗地亚语',     nameEn: 'Croatian',               native: 'Hrvatski',   family: '印欧语系',   hub: 'en',  promptHint: 'Hrvatski. Književni, tečan.' },
  { code: 'sk',   iso: 'sk', name: '斯洛伐克语',     nameEn: 'Slovak',                 native: 'Slovenčina', family: '印欧语系',   hub: 'en',  promptHint: 'Slovenčina. Spisovná, literárna.' },
  { code: 'sl',   iso: 'sl', name: '斯洛文尼亚语',   nameEn: 'Slovenian',              native: 'Slovenščina',family: '印欧语系',   hub: 'en',  promptHint: 'Slovenščina. Knjižna, tekoča.' },
  { code: 'lt',   iso: 'lt', name: '立陶宛语',       nameEn: 'Lithuanian',             native: 'Lietuvių',   family: '印欧语系',   hub: 'en',  promptHint: 'Lietuvių. Literatūrinė.' },
  { code: 'lv',   iso: 'lv', name: '拉脱维亚语',     nameEn: 'Latvian',                native: 'Latviešu',   family: '印欧语系',   hub: 'en',  promptHint: 'Latviešu. Literāra.' },
  { code: 'et',   iso: 'et', name: '爱沙尼亚语',     nameEn: 'Estonian',               native: 'Eesti',      family: '乌拉尔语系', hub: 'en',  promptHint: 'Eesti. Kirjanduslik.' },

  // === 第四梯队：美洲/非洲/大洋洲主要语言 ===
  { code: 'az',   iso: 'az', name: '阿塞拜疆语',     nameEn: 'Azerbaijani',            native: 'Azərbaycan', family: '突厥语系',   hub: 'en',  promptHint: 'Azərbaycan. Ədəbi dil.' },
  { code: 'kk',   iso: 'kk', name: '哈萨克语',       nameEn: 'Kazakh',                 native: 'Қазақ',      family: '突厥语系',   hub: 'zh',  promptHint: 'Қазақ. Әдеби қазақ тілі.' },
  { code: 'uz',   iso: 'uz', name: '乌兹别克语',     nameEn: 'Uzbek',                  native: 'Oʻzbek',     family: '突厥语系',   hub: 'en',  promptHint: 'Oʻzbek. Adabiy oʻzbek tili.' },
  { code: 'ky',   iso: 'ky', name: '吉尔吉斯语',     nameEn: 'Kyrgyz',                 native: 'Кыргыз',     family: '突厥语系',   hub: 'en',  promptHint: 'Кыргыз. Адабий кыргыз тили.' },
  { code: 'ka',   iso: 'ka', name: '格鲁吉亚语',     nameEn: 'Georgian',               native: 'ქართული',  family: '南高加索语系',hub: 'en',  promptHint: 'ქართული. ლიტერატურული ქართული.' },
  { code: 'hy',   iso: 'hy', name: '亚美尼亚语',     nameEn: 'Armenian',               native: 'Հայերեն',    family: '印欧语系',   hub: 'en',  promptHint: 'Հայերեն. Գրական հայերեն.' },
  { code: 'af',   iso: 'af', name: '南非语',         nameEn: 'Afrikaans',              native: 'Afrikaans',  family: '印欧语系',   hub: 'en',  promptHint: 'Afrikaans. Letterkundig.' },
];

// 工具：按 code 查
export const LANG_BY_CODE: Record<string, LanguageDef> =
  Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));

/**
 * PRD 1.1 路由决策：根据 src→tgt 计算实际翻译路径
 * - 直译：src和tgt至少一个是zh或en，且双方含zh或en
 * - 中转：否则必须经枢纽（默认用src或tgt中与zh/en最接近的那个）
 * 返回 { path: 'direct' | 'via-zh' | 'via-en', hops: LangCode[] }
 */
export function routeTranslation(
  src: string,
  tgt: string
): { path: 'direct' | 'via-zh' | 'via-en'; hops: string[]; note: string } {
  const s = LANG_BY_CODE[src];
  const t = LANG_BY_CODE[tgt];
  if (!s || !t) return { path: 'direct', hops: [src, tgt], note: '未知语言' };

  const involvesHub = (c: LanguageDef) => c.code === 'zh' || c.code === 'en';

  // 直接链路：src是zh或en 且 tgt是zh或en
  if (involvesHub(s) && involvesHub(t)) {
    return { path: 'direct', hops: [src, tgt], note: '中英核心链路' };
  }

  // 中文枢纽：src或tgt中带zh，或者hub偏好为zh
  const preferZh = s.code === 'zh' || t.code === 'zh' || s.hub === 'zh' || t.hub === 'zh';
  if (preferZh) {
    return { path: 'via-zh', hops: [src, 'zh', tgt], note: '经中文枢纽' };
  }
  return { path: 'via-en', hops: [src, 'en', tgt], note: '经英文枢纽' };
}
