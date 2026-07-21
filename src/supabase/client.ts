/**
 * 纯前端版本 - 无需Supabase后端
 * 使用 localStorage 模拟数据存储
 * 提供完整的 Supabase 兼容 API
 */

// 初始化 localStorage 存储
const DB_KEY = 'novel_workshop_db';

interface DbData {
  activation_keys: Record<string, { is_used: boolean; created_at: string }>;
  templates: any[];
  rewrite_records: any[];
  email_codes: Record<string, { code: string; expires: number }>;
  messages: any[];
  author_shares: any[];
  qa_posts: any[];
  qa_answers: any[];
  comments: any[];
  follows: any[];
  collections: any[];
}

function getDb(): DbData {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return {
    activation_keys: {},
    templates: [],
    rewrite_records: [],
    email_codes: {},
    messages: [],
    author_shares: [],
    qa_posts: [],
    qa_answers: [],
    comments: [],
    follows: [],
    collections: []
  };
}

function saveDb(data: DbData) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// 查询构建器
class QueryBuilder {
  private table: string;
  private filters: Array<{ col: string; op: string; val: any }> = [];
  private selectCols: string = '*';
  private orderCol?: string;
  private orderAsc: boolean = true;
  private limitNum?: number;
  private singleMode: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(cols?: string) {
    if (cols) this.selectCols = cols;
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ col, op: 'eq', val });
    return this;
  }

  order(col: string, options?: { ascending?: boolean }) {
    this.orderCol = col;
    if (options?.ascending !== undefined) {
      this.orderAsc = options.ascending;
    }
    return this;
  }

  limit(n: number) {
    this.limitNum = n;
    return this;
  }

  single() {
    this.singleMode = true;
    return this;
  }

  async then(onfulfilled: (result: { data: any; error: any }) => any, onrejected?: any) {
    const db = getDb();
    let data: any[] = [];

    const tableData = db[this.table as keyof DbData];
    if (Array.isArray(tableData)) {
      data = [...tableData];
    }

    // 应用过滤
    for (const f of this.filters) {
      data = data.filter((item: any) => item[f.col] === f.val);
    }

    // 应用排序
    if (this.orderCol) {
      data.sort((a: any, b: any) => {
        if (this.orderAsc) return (a[this.orderCol!] || '') > (b[this.orderCol!] || '') ? 1 : -1;
        return (a[this.orderCol!] || '') < (b[this.orderCol!] || '') ? 1 : -1;
      });
    }

    // 应用限制
    if (this.limitNum) {
      data = data.slice(0, this.limitNum);
    }

    if (this.singleMode && data.length > 0) {
      return onfulfilled({ data: data[0], error: null });
    }

    return onfulfilled({ data, error: null });
  }

  insert(data: any) {
    const db = getDb();
    const tableData: any[] = (db as any)[this.table] || [];
    const newItem = { ...data, id: Date.now().toString(), created_at: new Date().toISOString() };
    tableData.push(newItem);
    (db as any)[this.table] = tableData;
    saveDb(db);
    return Promise.resolve({ data: newItem, error: null });
  }

  update(data: any) {
    return Promise.resolve({ data, error: null });
  }

  delete() {
    return Promise.resolve({ data: null, error: null });
  }
}

// 模拟的 Supabase 客户端
export const supabase = {
  from: (table: string) => new QueryBuilder(table),
  auth: {
    signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
};

export function getSupabaseUrl(): string {
  return '';
}

export const supabaseUrl = '';
export const supabaseAnonKey = '';

// 为了向后兼容，也导出 localDb
export const localDb = {
  activation_keys: {} as Record<string, { is_used: boolean; created_at: string }>,
  templates: [] as any[],
  rewrite_records: [] as any[],
  email_codes: {} as Record<string, { code: string; expires: number }>,
  init() {
    const db = getDb();
    this.activation_keys = db.activation_keys;
    this.templates = db.templates;
    this.rewrite_records = db.rewrite_records;
    this.email_codes = db.email_codes;
  },
  cleanExpiredCodes() {
    const now = Date.now();
    Object.keys(this.email_codes).forEach(email => {
      if (this.email_codes[email].expires < now) {
        delete this.email_codes[email];
      }
    });
  },
  save() {
    const db = getDb();
    db.activation_keys = this.activation_keys;
    db.templates = this.templates;
    db.rewrite_records = this.rewrite_records;
    db.email_codes = this.email_codes;
    saveDb(db);
  }
};

localDb.init();
