const UPLOAD_STORAGE_KEY = "prompt_curator_upload_queue";
const LIBRARY_STORAGE_KEY = "prompt_curator_library";

function normalizeBaseName(name = "") {
  return name.replace(/\.[^.]+$/, "").trim().toLowerCase();
}

function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || `item-${Date.now()}`;
}

function loadQueue() {
  try {
    const raw = localStorage.getItem(UPLOAD_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(queue));
}

function loadLibrary() {
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLibrary(items) {
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];
  const headers = splitCSVLine(lines.shift()).map((header) => header.trim());
  return lines.map((line) => {
    const values = splitCSVLine(line);
    return headers.reduce((record, header, index) => {
      record[header] = (values[index] || "").trim();
      return record;
    }, {});
  });
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}

function parseTXT(text) {
  return text
    .split(/\n-{3,}\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split(/\r?\n/).filter(Boolean);
      const meta = {};
      let promptLines = [];
      for (const line of lines) {
        const match = line.match(/^([\w\u4e00-\u9fa5_-]+)\s*:\s*(.+)$/);
        if (match && promptLines.length === 0) {
          meta[match[1].trim()] = match[2].trim();
        } else {
          promptLines.push(line);
        }
      }
      return {
        title: meta.title || meta.标题 || `TXT 导入 ${index + 1}`,
        fileName: meta.fileName || meta.filename || meta.image || meta.图片 || "",
        model: meta.model || meta.模型 || "",
        category: meta.category || meta.分类 || "",
        tags: meta.tags || meta.标签 || "",
        prompt: promptLines.join("\n").trim()
      };
    });
}

function toQueueRecord(record) {
  return {
    id: record.id || `${slugify(record.title || record.fileName || "upload")}-${Math.random().toString(36).slice(2, 7)}`,
    title: record.title || record.fileName || "未命名提示词",
    fileName: record.fileName || record.filename || record.image || "",
    prompt: record.prompt || record.content || record.text || "",
    model: record.model || "未指定模型",
    category: record.category || "未分类",
    tags: Array.isArray(record.tags)
      ? record.tags
      : String(record.tags || "")
          .split(/[，,]/)
          .map((tag) => tag.trim())
          .filter(Boolean),
    status: "待上传",
    progress: 0,
    imageName: "",
    imageUrl: "",
    description: record.description || "由批量上传工作流生成，可在内容管理页继续编辑。"
  };
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function parsePromptFiles(files) {
  const records = [];
  for (const file of files) {
    const text = await readFileAsText(file);
    const lower = file.name.toLowerCase();
    if (lower.endsWith(".json")) {
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed) ? parsed : parsed.items || [];
      items.forEach((item) => records.push(toQueueRecord(item)));
      continue;
    }
    if (lower.endsWith(".csv")) {
      parseCSV(text).forEach((row) => records.push(toQueueRecord(row)));
      continue;
    }
    parseTXT(text).forEach((row) => records.push(toQueueRecord(row)));
  }
  return records;
}

async function parseImageFiles(files) {
  const images = [];
  for (const file of files) {
    images.push({
      file,
      baseName: normalizeBaseName(file.name),
      imageName: file.name,
      imageUrl: await readFileAsDataUrl(file)
    });
  }
  return images;
}

function renderQueue(queue) {
  const host = document.querySelector("[data-queue-list]");
  const empty = document.querySelector("[data-empty-state]");
  const count = document.querySelector("[data-upload-count]");
  const matched = document.querySelector("[data-match-count]");
  const ready = document.querySelector("[data-ready-count]");
  if (!host || !count || !matched || !ready || !empty) return;

  count.textContent = String(queue.length);
  matched.textContent = String(queue.filter((item) => item.imageUrl).length);
  ready.textContent = String(queue.filter((item) => item.status === "已入库").length);
  host.innerHTML = "";
  empty.hidden = queue.length > 0;

  queue.forEach((item) => {
    const card = document.createElement("article");
    card.className = "queue-card";
    card.innerHTML = `
      <div class="queue-card__top">
        <div class="queue-card__thumb">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}">` : ""}
        </div>
        <div>
          <div class="inline-metrics">
            <strong>${item.title}</strong>
            <span class="status ${item.status === "已入库" ? "status--live" : item.status === "上传中" ? "status--review" : "status--draft"}">${item.status}</span>
          </div>
          <p class="muted">${item.description}</p>
          <div class="tag-row">
            <span class="tag">${item.model}</span>
            <span class="tag">${item.category}</span>
            ${item.imageName ? `<span class="tag">${item.imageName}</span>` : `<span class="tag">等待图片匹配</span>`}
          </div>
        </div>
      </div>
      <div style="margin-top: 14px;">
        <div class="progress"><span style="width: ${item.progress || 0}%"></span></div>
        <div class="inline-metrics" style="margin-top: 8px;">
          <span class="muted">${item.prompt ? item.prompt.slice(0, 96) : "尚未导入提示词内容"}</span>
          <button class="ghost-btn" type="button" data-remove-id="${item.id}">移除</button>
        </div>
      </div>
    `;
    host.append(card);
  });

  host.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextQueue = loadQueue().filter((item) => item.id !== button.dataset.removeId);
      saveQueue(nextQueue);
      renderQueue(nextQueue);
      renderExport(nextQueue);
    });
  });
}

function renderExport(queue) {
  const target = document.querySelector("[data-export-json]");
  if (!target) return;
  const payload = queue.map((item) => ({
    id: item.id,
    title: item.title,
    imageName: item.imageName,
    model: item.model,
    category: item.category,
    tags: item.tags,
    prompt: item.prompt,
    status: item.status
  }));
  target.textContent = JSON.stringify(payload, null, 2);
}

async function mergeFiles(imageFiles, promptFiles) {
  const current = loadQueue();
  const queue = [...current];
  const images = await parseImageFiles(imageFiles);
  const promptRecords = await parsePromptFiles(promptFiles);
  const imageMap = new Map(images.map((item) => [item.baseName, item]));

  if (promptRecords.length) {
    promptRecords.forEach((record) => {
      const key = normalizeBaseName(record.fileName || record.title);
      const image = imageMap.get(key);
      queue.push({
        ...record,
        imageName: image?.imageName || "",
        imageUrl: image?.imageUrl || "",
        status: "待上传",
        progress: 0
      });
      if (image) imageMap.delete(key);
    });
  }

  imageMap.forEach((image) => {
    queue.push({
      id: `${slugify(image.baseName)}-${Math.random().toString(36).slice(2, 7)}`,
      title: image.baseName,
      fileName: image.imageName,
      prompt: "",
      model: "未指定模型",
      category: "待补充",
      tags: [],
      status: "待上传",
      progress: 0,
      imageName: image.imageName,
      imageUrl: image.imageUrl,
      description: "仅导入了图像，稍后可在管理页补充 prompt。"
    });
  });

  saveQueue(queue);
  renderQueue(queue);
  renderExport(queue);
}

function simulateUpload() {
  const queue = loadQueue();
  if (!queue.length) return;
  let index = 0;
  const tick = () => {
    if (index >= queue.length) {
      saveQueue(queue);
      renderQueue(queue);
      renderExport(queue);
      return;
    }
    const item = queue[index];
    item.status = "上传中";
    const interval = setInterval(() => {
      item.progress = Math.min((item.progress || 0) + 20, 100);
      saveQueue(queue);
      renderQueue(queue);
      if (item.progress >= 100) {
        clearInterval(interval);
        item.status = "已入库";
        index += 1;
        const existing = loadLibrary();
        const nextLibrary = [
          {
            id: item.id,
            title: item.title,
            category: item.category,
            model: item.model,
            style: "Batch Upload",
            tags: item.tags,
            description: item.description,
            author: "@UPLOAD_PIPELINE",
            likes: "NEW",
            saves: "0",
            status: "已上线",
            score: item.prompt ? "高" : "中",
            image: item.imageUrl || "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
            prompt: item.prompt || "待补充提示词内容"
          },
          ...existing.filter((entry) => entry.id !== item.id)
        ];
        saveLibrary(nextLibrary);
        saveQueue(queue);
        renderQueue(queue);
        renderExport(queue);
        setTimeout(tick, 260);
      }
    }, 180);
  };
  tick();
}

function clearAll() {
  saveQueue([]);
  renderQueue([]);
  renderExport([]);
}

function setupDropzone(selector, callback) {
  const zone = document.querySelector(selector);
  if (!zone) return;
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("is-dragover");
  });
  zone.addEventListener("dragleave", () => {
    zone.classList.remove("is-dragover");
  });
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("is-dragover");
    callback(Array.from(event.dataTransfer.files || []));
  });
}

function downloadExport() {
  const queue = loadQueue();
  const payload = JSON.stringify(queue, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "prompt-upload-package.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function initUploadPage() {
  const root = document.querySelector("[data-upload-root]");
  if (!root) return;

  const imageInput = document.querySelector("[data-image-input]");
  const promptInput = document.querySelector("[data-prompt-input]");
  const mergeButton = document.querySelector("[data-merge]");
  const uploadButton = document.querySelector("[data-upload]");
  const clearButton = document.querySelector("[data-clear]");
  const exportButton = document.querySelector("[data-download]");

  let imageFiles = [];
  let promptFiles = [];

  const onImageFiles = (files) => {
    imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const label = document.querySelector("[data-image-label]");
    if (label) label.textContent = imageFiles.length ? `已选择 ${imageFiles.length} 张图片` : "拖拽或选择多张图片";
  };

  const onPromptFiles = (files) => {
    promptFiles = files.filter((file) => /\.(csv|json|txt)$/i.test(file.name));
    const label = document.querySelector("[data-prompt-label]");
    if (label) label.textContent = promptFiles.length ? `已选择 ${promptFiles.length} 个提示词文件` : "拖拽或选择 CSV / JSON / TXT";
  };

  if (imageInput) {
    imageInput.addEventListener("change", () => onImageFiles(Array.from(imageInput.files || [])));
  }
  if (promptInput) {
    promptInput.addEventListener("change", () => onPromptFiles(Array.from(promptInput.files || [])));
  }

  setupDropzone("[data-image-dropzone]", onImageFiles);
  setupDropzone("[data-prompt-dropzone]", onPromptFiles);

  if (mergeButton) {
    mergeButton.addEventListener("click", async () => {
      await mergeFiles(imageFiles, promptFiles);
    });
  }
  if (uploadButton) {
    uploadButton.addEventListener("click", simulateUpload);
  }
  if (clearButton) {
    clearButton.addEventListener("click", clearAll);
  }
  if (exportButton) {
    exportButton.addEventListener("click", downloadExport);
  }

  const existing = loadQueue();
  renderQueue(existing);
  renderExport(existing);
}

document.addEventListener("DOMContentLoaded", initUploadPage);
