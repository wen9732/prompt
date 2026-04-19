const SAMPLE_PROMPTS = [
  {
    id: "portrait-lab",
    title: "电影级人物肖像控制台",
    category: "Portrait",
    model: "Midjourney v7",
    style: "Hyperreal",
    tags: ["电影灯光", "8K", "脸部细节"],
    description: "针对商业人物肖像和品牌 KV 的高一致性提示词，适合广告视觉和创作者主页封面。",
    author: "@PIXEL_WIZARD",
    likes: "2.8K",
    saves: "1.2K",
    status: "已上线",
    score: "高",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    prompt: "cinematic portrait of a confident founder, neon rim light, high contrast shadows, photoreal skin texture, editorial framing, subtle chromatic aberration, volumetric haze, premium product campaign, ultra-detailed face, 85mm lens, clean dark background"
  },
  {
    id: "neo-architecture",
    title: "未来建筑夜景模板",
    category: "Architecture",
    model: "DALL·E 3",
    style: "Cyber Urban",
    tags: ["建筑", "雨夜", "发光体"],
    description: "为未来城市、品牌空间和展陈概念图准备的建筑 prompt，强调叙事灯光和材质层次。",
    author: "@NEON_ARCH",
    likes: "1.9K",
    saves: "726",
    status: "审核中",
    score: "中",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
    prompt: "futuristic mixed-use tower in a rainy neon district, reflective pavement, cinematic dusk sky, layered signage, ambient fog, people silhouettes for scale, polished concrete and smoked glass, editorial architecture photography"
  },
  {
    id: "product-clay",
    title: "电商产品悬浮构图",
    category: "Product",
    model: "Stable Diffusion XL",
    style: "Soft Studio",
    tags: ["产品", "电商", "柔光"],
    description: "适合产品详情页头图和营销素材，默认包含材质细节、光线方向和 CTA 留白。",
    author: "@CLAY_MASTER",
    likes: "3.6K",
    saves: "1.4K",
    status: "草稿",
    score: "高",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    prompt: "hero product shot floating above layered paper forms, softbox lighting, realistic contact shadow, premium ecommerce visual, clean composition, negative space for typography, tactile material contrast"
  },
  {
    id: "campaign-system",
    title: "品牌营销全链路提示词",
    category: "Strategy",
    model: "GPT-4.1 / GPT-5",
    style: "Marketing Ops",
    tags: ["营销", "策略", "社媒"],
    description: "把品牌定位、目标受众、渠道矩阵和行动计划组装成可复用 prompt system。",
    author: "@STRAT_GURU",
    likes: "1.3K",
    saves: "608",
    status: "已上线",
    score: "高",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    prompt: "act as a senior growth strategist, build a 30-day campaign system with audience personas, channel priorities, hooks, content series, measurement loops, and weekly optimization checkpoints"
  }
];

const STORAGE_KEY = "prompt_curator_library";
const UPLOAD_KEY = "prompt_curator_upload_queue";
const ACTIVE_PAGE = document.body.dataset.page || "";

function getStoredLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStoredLibrary(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getLibraryItems() {
  return [...getStoredLibrary(), ...SAMPLE_PROMPTS];
}

function byId(id) {
  return getLibraryItems().find((item) => item.id === id) || SAMPLE_PROMPTS[0];
}

function numberLabel(value) {
  return typeof value === "number" ? value.toLocaleString("zh-CN") : value;
}

function icon(name) {
  const icons = {
    spark: "✦",
    pulse: "◉",
    upload: "⇪",
    ai: "AI",
    data: "▣",
    flow: "↗",
    star: "★"
  };
  return icons[name] || "•";
}

function renderHeader() {
  const links = [
    ["index.html", "首页", "home"],
    ["library.html", "提示词库", "library"],
    ["detail.html", "详情页", "detail"],
    ["create.html", "创作者工作台", "create"],
    ["admin.html", "后台", "admin"]
  ];
  const nav = links
    .map(([href, label, key]) => {
      const active = key === "admin" ? ACTIVE_PAGE.startsWith("admin") : ACTIVE_PAGE === key;
      return `<a href="${href}" class="${active ? "is-active" : ""}">${label}</a>`;
    })
    .join("");
  const mobileNav = links
    .map(([href, label, key]) => {
      const active = key === "admin" ? ACTIVE_PAGE.startsWith("admin") : ACTIVE_PAGE === key;
      return `<a href="${href}" class="${active ? "is-active" : ""}">${label}</a>`;
    })
    .join("");

  const shell = document.createElement("header");
  shell.className = "site-header";
  shell.innerHTML = `
    <div class="site-header__bar">
      <div class="brand">
        <div>
          <div class="brand__title">Prompt Curator</div>
          <div class="brand__meta">Neon Prompt System</div>
        </div>
      </div>
      <nav class="main-nav">${nav}</nav>
      <div class="header-actions">
        <span class="pill hide-mobile">${icon("pulse")} 批量上传就绪</span>
        <button class="icon-button hide-mobile" type="button" data-open-command>${icon("spark")}</button>
        <button class="icon-button mobile-toggle" type="button" aria-label="打开菜单" data-mobile-toggle>☰</button>
      </div>
    </div>
    <div class="mobile-sheet" data-mobile-sheet>${mobileNav}</div>
  `;
  document.body.prepend(shell);
}

function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="shell footer__bar">
      <div>
        <div class="brand__title">Prompt Curator</div>
        <p class="muted">面向提示词资产化、批量管理和创作者分发的响应式站点原型。</p>
      </div>
      <div class="toolbar">
        <a class="ghost-link" href="library.html">提示词库</a>
        <a class="ghost-link" href="admin-upload.html">批量上传</a>
        <a class="ghost-link" href="admin-library.html">内容管理</a>
      </div>
    </div>
  `;
  document.body.append(footer);
}

function setupMobileMenu() {
  const toggle = document.querySelector("[data-mobile-toggle]");
  const sheet = document.querySelector("[data-mobile-sheet]");
  if (!toggle || !sheet) return;
  toggle.addEventListener("click", () => {
    sheet.classList.toggle("is-open");
  });
}

function setupCommandButton() {
  const button = document.querySelector("[data-open-command]");
  if (!button) return;
  button.addEventListener("click", () => {
    const target = ACTIVE_PAGE.startsWith("admin") ? "admin-upload.html" : "create.html";
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = target;
      });
    } else {
      window.location.href = target;
    }
  });
}

function createFeedCard(item) {
  return `
    <article class="feed-card">
      <div class="feed-card__media">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="feed-card__body">
        <div class="tag-row" style="margin-bottom: 12px;">
          <span class="tag">${item.model}</span>
          <span class="tag">${item.category}</span>
        </div>
        <h3 class="feed-card__title">${item.title}</h3>
        <p class="muted">${item.description}</p>
        <div class="tag-row" style="margin: 14px 0 18px;">
          ${item.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
        </div>
        <div class="feed-card__footer">
          <span class="muted">${item.author}</span>
          <a class="secondary-btn" href="detail.html?id=${item.id}">查看详情</a>
        </div>
      </div>
    </article>
  `;
}

function renderHomepage() {
  const host = document.querySelector("[data-home-root]");
  if (!host) return;
  const items = getLibraryItems().slice(0, 4);
  host.innerHTML = `
    <section class="hero">
      <div class="shell hero__grid">
        <div class="hero-card surface--glow">
          <div class="hero__badge pill">实时同步 图像与提示词资产</div>
          <div class="eyebrow">Prompt Commerce System</div>
          <h1 class="hero__title">找到你的下一个 <span class="gradient-text">提示词核心。</span></h1>
          <p class="hero__copy">把首页的赛博策展风格延展成一整套前后台体验。这里不仅展示 Prompt，还能自动整理图像、解析文案文件、批量入库并同步到后台内容中心。</p>
          <div class="search-frame">
            <span aria-hidden="true">${icon("spark")}</span>
            <input type="text" placeholder="搜索 人像、电商、建筑、短视频脚本..." />
            <button class="primary-btn" type="button" onclick="window.location.href='library.html'">进入库</button>
          </div>
          <div class="chip-row" style="margin-top: 22px;">
            <span class="chip">${icon("upload")} 拖拽上传图片</span>
            <span class="chip">${icon("ai")} CSV / JSON / TXT 自动解析</span>
            <span class="chip">${icon("data")} 按文件名自动匹配</span>
          </div>
        </div>
        <div class="hero__panel">
          <div class="small-card small-card--cyan">
            <div class="eyebrow">Batch Pipeline</div>
            <h3 style="margin: 10px 0 8px;">一键导入图像与提示词</h3>
            <p class="muted">支持多图拖拽、多格式 prompt 文件，自动合并预览，移动端也可直接选取相册。</p>
            <div class="inline-metrics" style="margin-top: 18px;">
              <strong>98%</strong>
              <span class="muted">自动匹配命中率</span>
            </div>
          </div>
          <div class="small-card small-card--pink">
            <div class="eyebrow">Creator Workspace</div>
            <h3 style="margin: 10px 0 8px;">创作者侧上传工作台</h3>
            <p class="muted">单条编辑、标签配置、封面优化、变量 Token 标注都在同一块面板里完成。</p>
            <div class="inline-metrics" style="margin-top: 18px;">
              <strong>12s</strong>
              <span class="muted">平均建包时间</span>
            </div>
          </div>
          <div class="small-card small-card--violet">
            <div class="eyebrow">Admin Review</div>
            <h3 style="margin: 10px 0 8px;">后台审核与内容治理</h3>
            <p class="muted">上线状态、质量评分、上传队列、异常条目都被拉进统一管理台，方便团队运营。</p>
            <div class="inline-metrics" style="margin-top: 18px;">
              <strong>24/7</strong>
              <span class="muted">响应式监控面板</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="shell content-grid">
        <div>
          <div class="section-header">
            <div>
              <div class="eyebrow">Featured Logs</div>
              <h2 class="section-title"><span class="gradient-text">精选提示词 / Featured</span></h2>
            </div>
            <div class="toolbar">
              <a class="ghost-btn" href="library.html">浏览全部</a>
              <a class="secondary-btn" href="create.html">进入上传台</a>
            </div>
          </div>
          <div class="feed-grid">
            ${items.map(createFeedCard).join("")}
          </div>
        </div>
        <aside class="side-panel">
          <div class="eyebrow">趋势标签</div>
          <h3 style="margin-top: 10px;">本周高热度 Prompt 方向</h3>
          <div class="chip-row" style="margin: 18px 0 28px;">
            <span class="chip">#品牌人像</span>
            <span class="chip">#视频脚本</span>
            <span class="chip">#产品渲染</span>
            <span class="chip">#建筑概念图</span>
            <span class="chip">#AIGC 电商</span>
          </div>
          <div class="eyebrow">顶级创作者</div>
          <div class="creator-list" style="margin-top: 16px;">
            ${items
              .slice(0, 3)
              .map(
                (item) => `
                  <div class="creator">
                    <div class="creator__avatar"><img src="${item.image}" alt="${item.author}"></div>
                    <div>
                      <strong>${item.author}</strong>
                      <div class="muted">${item.category} / ${item.model}</div>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="cta-card">
            <div class="eyebrow">Join Upload Flow</div>
            <h3 style="margin-top: 10px;">把你的图像与提示词批量上线</h3>
            <p class="muted">直接进入批量上传页，导入图片和提示词文件后，系统会自动生成待发布内容包。</p>
            <div class="toolbar" style="margin-top: 18px;">
              <a class="primary-btn" href="admin-upload.html">打开批量上传</a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderLibrary() {
  const host = document.querySelector("[data-library-root]");
  if (!host) return;
  const items = getLibraryItems();
  host.innerHTML = `
    <section class="section">
      <div class="shell">
        <div class="section-header">
          <div>
            <div class="eyebrow">Prompt Library</div>
            <h1 class="admin-title">按风格与模型筛选你的提示词资产</h1>
            <p class="section-copy">前台子页延续首页霓虹策展风格，同时加强检索、标签、使用场景和转化动作。</p>
          </div>
          <div class="toolbar">
            <a class="primary-btn" href="create.html">上传新内容</a>
            <a class="ghost-btn" href="admin-library.html">去后台管理</a>
          </div>
        </div>
        <div class="chip-row" style="margin-bottom: 22px;">
          <span class="chip">全部模型</span>
          <span class="chip">Midjourney</span>
          <span class="chip">GPT 系统提示词</span>
          <span class="chip">电商视觉</span>
          <span class="chip">视频脚本</span>
          <span class="chip">品牌策略</span>
        </div>
        <div class="library-grid">
          ${items.map(createFeedCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderDetail() {
  const host = document.querySelector("[data-detail-root]");
  if (!host) return;
  const params = new URLSearchParams(window.location.search);
  const item = byId(params.get("id"));
  host.innerHTML = `
    <section class="section">
      <div class="shell detail-grid">
        <div>
          <div class="detail-hero"><img src="${item.image}" alt="${item.title}"></div>
          <div class="detail-card" style="margin-top: 18px;">
            <div class="eyebrow">${item.model}</div>
            <h1 class="admin-title" style="margin-top: 12px;">${item.title}</h1>
            <p class="section-copy">${item.description}</p>
            <div class="tag-row" style="margin-top: 16px;">
              ${item.tags.map((tag) => `<span class="tag">#${tag}</span>`).join("")}
            </div>
            <div class="detail-action-bar">
              <button class="primary-btn" type="button" data-copy-prompt>复制提示词</button>
              <a class="secondary-btn" href="create.html">套用并改写</a>
              <a class="ghost-btn" href="admin-library.html">后台查看记录</a>
            </div>
            <div class="prompt-block" data-prompt-block>${item.prompt}</div>
          </div>
        </div>
        <aside class="detail-card">
          <h3 class="detail-card__title">元信息</h3>
          <div class="detail-side-list">
            <div class="metric-row"><span class="muted">作者</span><strong>${item.author}</strong></div>
            <div class="metric-row"><span class="muted">分类</span><strong>${item.category}</strong></div>
            <div class="metric-row"><span class="muted">风格</span><strong>${item.style}</strong></div>
            <div class="metric-row"><span class="muted">点赞</span><strong>${item.likes}</strong></div>
            <div class="metric-row"><span class="muted">收藏</span><strong>${item.saves}</strong></div>
          </div>
          <h3 class="detail-card__title" style="margin-top: 28px;">使用建议</h3>
          <p class="muted">推荐把主语、画面情绪、灯光参数和材质描述拆成变量 Token，在后台内容管理里可以进一步配置成模板字段。</p>
          <div class="chip-row" style="margin-top: 16px;">
            <span class="chip">[主体]</span>
            <span class="chip">[风格]</span>
            <span class="chip">[镜头]</span>
            <span class="chip">[材质]</span>
          </div>
        </aside>
      </div>
    </section>
  `;

  const copyButton = host.querySelector("[data-copy-prompt]");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(item.prompt);
      copyButton.textContent = "已复制";
      setTimeout(() => {
        copyButton.textContent = "复制提示词";
      }, 1600);
    });
  }
}

function renderCreate() {
  const host = document.querySelector("[data-create-root]");
  if (!host) return;
  host.innerHTML = `
    <section class="section">
      <div class="shell">
        <div class="section-header">
          <div>
            <div class="eyebrow">Creator Workspace</div>
            <h1 class="admin-title">创作者上传工作台</h1>
            <p class="section-copy">这里是前台创作者页，适合上传单条内容、编辑元信息，再跳转到后台继续批量入库和审核。</p>
          </div>
          <div class="toolbar">
            <a class="secondary-btn" href="admin-upload.html">切到批量上传</a>
            <a class="ghost-btn" href="library.html">返回内容库</a>
          </div>
        </div>
        <div class="management-grid">
          <div class="editor-card">
            <div class="form-grid">
              <div class="field">
                <label for="title">标题</label>
                <input id="title" type="text" value="赛博品牌 KV 提示词" />
              </div>
              <div class="field">
                <label for="model">模型</label>
                <select id="model">
                  <option>Midjourney v7</option>
                  <option>GPT-5</option>
                  <option>Stable Diffusion XL</option>
                </select>
              </div>
              <div class="field field--full">
                <label for="prompt">提示词正文</label>
                <textarea id="prompt">cinematic brand key visual, iridescent neon reflections, premium product hero, responsive composition, layered typography negative space, futuristic mood</textarea>
              </div>
              <div class="field">
                <label for="tags">标签</label>
                <input id="tags" type="text" value="品牌, KV, 赛博, 电商" />
              </div>
              <div class="field">
                <label for="cover">封面图</label>
                <input id="cover" type="file" accept="image/*" />
              </div>
            </div>
            <div class="upload-actions" style="margin-top: 20px;">
              <button class="primary-btn" type="button">保存草稿</button>
              <a class="secondary-btn" href="admin-library.html">提交到内容管理</a>
            </div>
          </div>
          <aside class="detail-card">
            <div class="eyebrow">Workflow</div>
            <h3 class="detail-card__title" style="margin-top: 10px;">推荐工作流</h3>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div><strong>1. 上传图像与 Prompt</strong><div class="muted">支持创作者先做单条编辑与封面确认。</div></div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div><strong>2. 批量整理入库</strong><div class="muted">切换到后台批量上传页，自动匹配多个文件。</div></div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div><strong>3. 审核与发布</strong><div class="muted">内容团队在后台统一修改状态与评分。</div></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;
}

function renderAdminDashboard() {
  const host = document.querySelector("[data-admin-root]");
  if (!host) return;
  const uploads = (() => {
    try {
      const raw = localStorage.getItem(UPLOAD_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  host.innerHTML = `
    <div class="shell admin-layout">
      <aside class="admin-sidebar surface">
        <div class="eyebrow">Admin Control</div>
        <h2 style="margin-top: 10px;">后台导航</h2>
        <div class="admin-menu">
          <a class="is-active" href="admin.html">总览</a>
          <a href="admin-library.html">内容管理</a>
          <a href="admin-upload.html">批量上传</a>
          <a href="library.html">返回前台</a>
        </div>
      </aside>
      <main class="admin-main">
        <section class="stats-card">
          <div class="section-header">
            <div>
              <div class="eyebrow">Operations Board</div>
              <h1 class="admin-title">后台总览 / Review Pipeline</h1>
            </div>
            <div class="toolbar">
              <a class="primary-btn" href="admin-upload.html">新建上传任务</a>
            </div>
          </div>
          <div class="kpi-grid">
            <article class="kpi surface">
              <div class="eyebrow">内容总量</div>
              <div class="kpi__value">${numberLabel(getLibraryItems().length)}</div>
              <div class="muted">已聚合前台样例与本地上传数据</div>
            </article>
            <article class="kpi surface">
              <div class="eyebrow">待审核</div>
              <div class="kpi__value">${numberLabel(uploads.length)}</div>
              <div class="muted">来自批量上传页的本地任务队列</div>
            </article>
            <article class="kpi surface">
              <div class="eyebrow">高分资产</div>
              <div class="kpi__value">68%</div>
              <div class="muted">适合首页推荐和专题页运营</div>
            </article>
            <article class="kpi surface">
              <div class="eyebrow">设备适配</div>
              <div class="kpi__value">Responsive</div>
              <div class="muted">桌面、平板与移动端统一体验</div>
            </article>
          </div>
        </section>
        <div class="admin-grid" style="grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);">
          <section class="timeline-card">
            <div class="eyebrow">Recent Actions</div>
            <h3 class="detail-card__title" style="margin-top: 10px;">上传和审核流程</h3>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div><strong>批量上传支持图片 + CSV/JSON/TXT</strong><div class="muted">系统会按文件名自动匹配 prompt 与图像，并生成可编辑队列。</div></div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div><strong>前台与后台风格保持一致</strong><div class="muted">首页的赛博发光语义被延展到内容库、详情页和后台面板。</div></div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot"></span>
                <div><strong>本地入库模拟完成</strong><div class="muted">上传成功后会同步到本地内容库，前台列表和后台管理页都会立刻可见。</div></div>
              </div>
            </div>
          </section>
          <section class="timeline-card">
            <div class="eyebrow">Quick Entry</div>
            <h3 class="detail-card__title" style="margin-top: 10px;">推荐下一步</h3>
            <div class="toolbar" style="flex-direction: column; align-items: stretch; margin-top: 18px;">
              <a class="primary-btn" href="admin-upload.html">进入批量上传</a>
              <a class="secondary-btn" href="admin-library.html">管理内容状态</a>
              <a class="ghost-btn" href="create.html">创作者单条上传</a>
            </div>
          </section>
        </div>
      </main>
    </div>
  `;
}

function renderAdminLibrary() {
  const host = document.querySelector("[data-admin-library-root]");
  if (!host) return;
  const rows = getLibraryItems();
  host.innerHTML = `
    <div class="shell admin-layout">
      <aside class="admin-sidebar surface">
        <div class="eyebrow">Content Center</div>
        <h2 style="margin-top: 10px;">内容管理</h2>
        <div class="admin-menu">
          <a href="admin.html">总览</a>
          <a class="is-active" href="admin-library.html">内容管理</a>
          <a href="admin-upload.html">批量上传</a>
          <a href="index.html">前台首页</a>
        </div>
      </aside>
      <main class="admin-main">
        <section class="table-shell">
          <div class="section-header">
            <div>
              <div class="eyebrow">Library Control</div>
              <h1 class="admin-title">提示词内容管理页</h1>
            </div>
            <div class="toolbar">
              <a class="primary-btn" href="admin-upload.html">导入新内容</a>
              <a class="ghost-btn" href="library.html">查看前台</a>
            </div>
          </div>
          <div class="table-head">
            <span>标题</span>
            <span>模型</span>
            <span>状态</span>
            <span>质量</span>
            <span>操作</span>
          </div>
          ${rows
            .map((item) => {
              const statusClass =
                item.status === "已上线" ? "status--live" : item.status === "审核中" ? "status--review" : "status--draft";
              const scoreClass = item.score === "高" ? "score--high" : item.score === "中" ? "score--mid" : "score--low";
              return `
                <div class="table-row">
                  <div>
                    <strong>${item.title}</strong>
                    <div class="muted">${item.category} / ${item.author}</div>
                  </div>
                  <span>${item.model}</span>
                  <span class="status ${statusClass}">${item.status}</span>
                  <span class="score ${scoreClass}">${item.score || "中"}</span>
                  <a class="ghost-btn" href="detail.html?id=${item.id}">查看</a>
                </div>
              `;
            })
            .join("")}
        </section>
      </main>
    </div>
  `;
}

function init() {
  renderHeader();
  renderFooter();
  setupMobileMenu();
  setupCommandButton();
  renderHomepage();
  renderLibrary();
  renderDetail();
  renderCreate();
  renderAdminDashboard();
  renderAdminLibrary();
}

document.addEventListener("DOMContentLoaded", init);
