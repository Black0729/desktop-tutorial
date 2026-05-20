const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

const categoryBtn = $("#categoryBtn");
const categoryMenu = $("#categoryMenu");
categoryBtn.addEventListener("click", () => categoryMenu.classList.toggle("open"));
categoryMenu.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  categoryBtn.innerHTML = `${button.dataset.type} <span>⌄</span>`;
  categoryMenu.classList.remove("open");
  showToast(`已切换到${button.dataset.type}检索`);
});

const userMenuBtn = $("#userMenuBtn");
const userMenu = $("#userMenu");
const mobileNavToggle = $(".mobile-nav-toggle");
const navLinks = $(".nav-links");
userMenuBtn.addEventListener("click", () => userMenu.classList.toggle("open"));

mobileNavToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const expanded = navLinks.classList.contains("open");
  mobileNavToggle.setAttribute("aria-expanded", expanded);
  showToast(expanded ? "已展开导航菜单" : "已收起导航菜单");
});

document.addEventListener("click", (event) => {
  if (!categoryBtn.contains(event.target) && !categoryMenu.contains(event.target)) {
    categoryMenu.classList.remove("open");
  }
  if (!userMenuBtn.contains(event.target) && !userMenu.contains(event.target)) {
    userMenu.classList.remove("open");
  }
  if (!mobileNavToggle.contains(event.target) && !navLinks.contains(event.target)) {
    navLinks.classList.remove("open");
    mobileNavToggle.setAttribute("aria-expanded", false);
  }
});

$$(".nav-link").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".nav-link").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const target = button.dataset.target && document.getElementById(button.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

$("#topSearch").addEventListener("click", () => {
  $("#searchInput").focus();
  showToast("可以直接输入关键词检索");
});

$("#noticeBtn").addEventListener("click", () => {
  showToast("暂无新的系统通知");
});

const loginModal = $("#loginModal");
$("#loginBtn").addEventListener("click", () => {
  loginModal.classList.add("open");
  loginModal.setAttribute("aria-hidden", "false");
  $("#phoneInput").focus();
});

$("#closeModal").addEventListener("click", closeModal);
loginModal.addEventListener("click", (event) => {
  if (event.target === loginModal) closeModal();
});

function closeModal() {
  loginModal.classList.remove("open");
  loginModal.setAttribute("aria-hidden", "true");
}

$("#confirmLogin").addEventListener("click", () => {
  $("#loginTitle").textContent = "欢迎回来";
  $("#loginBtn").textContent = "进入我的书架";
  closeModal();
  showToast("登录成功，专属阅读服务已开启");
});

$$(".hot-words button").forEach((button) => {
  button.addEventListener("click", () => {
    $("#searchInput").value = button.textContent;
    runSearch(button.textContent);
  });
});

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch($("#searchInput").value.trim());
});

$(".advanced").addEventListener("click", () => {
  showToast("高级检索：可按作者、学科、年份组合筛选");
});

function runSearch(keyword) {
  const term = keyword.toLowerCase();
  const targets = $$("[data-searchable]");
  if (!term) {
    targets.forEach((item) => item.dataset.hidden = "false");
    showToast("已显示全部内容");
    return;
  }
  let matches = 0;
  targets.forEach((item) => {
    const hit = item.dataset.searchable.toLowerCase().includes(term);
    item.dataset.hidden = String(!hit);
    if (hit) matches += 1;
  });
  showToast(matches ? `找到 ${matches} 个相关内容` : "当前页未找到匹配内容");
}

$$(".feature-card").forEach((card) => {
  card.addEventListener("click", () => {
    showToast(`已进入「${$("strong", card).textContent}」`);
  });
});

$("#sceneGrid").addEventListener("click", (event) => {
  const card = event.target.closest(".scene-card");
  if (!card) return;
  $$(".scene-card").forEach((item) => item.classList.remove("active"));
  card.classList.add("active");
  showToast(`已选择${card.dataset.scene}场景`);
});

$$(".rank-card li").forEach((item) => {
  item.addEventListener("click", () => showToast(`打开书目：${item.textContent.replace(/\s+/g, " ").trim()}`));
});

const slider = $("#hotSlider");
$("#prevHot").addEventListener("click", () => {
  slider.scrollBy({ left: -340, behavior: "smooth" });
  showToast("已切换上一组热点");
});
$("#nextHot").addEventListener("click", () => {
  slider.scrollBy({ left: 340, behavior: "smooth" });
  showToast("已切换下一组热点");
});

const deepData = {
  classic: [
    ["时序收敛的艺术", "霍斯普 · 张冰山", "./assets/covers/deep-01.svg"],
    ["Verilog 数字...", "李宏荣", "./assets/covers/deep-02.svg"],
    ["先进VLSI技术", "谢量 · 巴尔加丘...", "./assets/covers/deep-03.svg"],
    ["SystemVerilog...", "瓦伊巴夫 · 海拉特", "./assets/covers/deep-04.svg"],
    ["组合数学及应用", "刘大俊", "./assets/covers/deep-05.svg"]
  ],
  academic: [
    ["院士谈创新方法", "陈嘉庚", "./assets/covers/deep-03.svg"],
    ["材料科学前沿", "周建华", "./assets/covers/deep-01.svg"],
    ["地球系统导论", "吴青峰", "./assets/covers/deep-05.svg"],
    ["现代生态工程", "李文森", "./assets/covers/deep-04.svg"],
    ["能源科学概论", "赵明", "./assets/covers/deep-02.svg"]
  ],
  ai: [
    ["智能计算基础", "王衍", "./assets/covers/deep-04.svg"],
    ["机器学习导读", "赵可", "./assets/covers/deep-03.svg"],
    ["大模型应用研究", "刘安", "./assets/covers/deep-01.svg"],
    ["科学智能方法", "李蕴", "./assets/covers/deep-05.svg"],
    ["生成式科研工具", "宋澜", "./assets/covers/deep-02.svg"]
  ]
};

function renderDeepBooks(type) {
  $("#deepBooks").innerHTML = deepData[type].map(([title, author, cover]) => `
    <article class="deep-book" data-searchable="${title} ${author}">
      <img class="book-cover-img" src="${cover}" alt="${title}封面" />
      <h3>${title}</h3>
      <p>${author}</p>
    </article>
  `).join("");
}

renderDeepBooks("classic");

$("#deepTabs").addEventListener("click", (event) => {
  const tab = event.target.closest("button");
  if (!tab) return;
  $$("#deepTabs button").forEach((button) => button.classList.remove("active"));
  tab.classList.add("active");
  renderDeepBooks(tab.dataset.tab);
  showToast(`已切换到${tab.textContent}`);
});

$$(".resource button, .friend-grid a, .news-list article, .book-item, .banner").forEach((item) => {
  item.addEventListener("click", () => showToast("已打开详情预览"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    categoryMenu.classList.remove("open");
    userMenu.classList.remove("open");
  }
});
