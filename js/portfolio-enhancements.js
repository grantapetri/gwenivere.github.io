(function () {
  "use strict";

  const path = window.location.pathname.replace(/\\/g, "/");
  const isEngineeringPage = /\/engineering\//.test(path) && !/\/engineering\/index\.html$/.test(path);
  const isProjectPage = /\/projects\//.test(path) && !/\/projects\/index\.html$/.test(path);
  const isNestedPage = isEngineeringPage || isProjectPage;
  const rootPrefix = isNestedPage ? "../" : "";

  let videoManifestPromise;

  const graph = {
    projects: {
      "site-23.html": {
        engineering: [
          "procedural-map-generation.html",
          "smart-ai-group-pathfinding.html",
          "functional-gameplay-architecture.html"
        ]
      },
      "data-hunters.html": {
        engineering: [
          "dynamic-weapon-sway.html",
          "server-authoritative-hit-validation.html",
          "modular-weapon-framework.html",
          "projectile-simulation.html",
          "persistent-player-data.html",
          "matchmaking-lobby-system.html"
        ]
      },
      "your-shadow.html": {
        engineering: [
          "procedural-map-generation.html",
          "smart-ai-group-pathfinding.html",
          "functional-gameplay-architecture.html"
        ]
      },
      "rps.html": {
        engineering: [
          "functional-gameplay-architecture.html",
          "modular-weapon-framework.html"
        ]
      },
      "slime-dungeon.html": {
        engineering: [
          "functional-gameplay-architecture.html",
          "procedural-map-generation.html"
        ]
      }
    },
    engineering: {
      "dynamic-weapon-sway.html": {
        projects: ["data-hunters.html"],
        engineering: ["modular-weapon-framework.html", "projectile-simulation.html"]
      },
      "server-authoritative-hit-validation.html": {
        projects: ["data-hunters.html"],
        engineering: ["projectile-simulation.html", "modular-weapon-framework.html"]
      },
      "smart-ai-group-pathfinding.html": {
        projects: ["data-hunters.html", "your-shadow.html"],
        engineering: ["procedural-map-generation.html", "server-authoritative-hit-validation.html"]
      },
      "procedural-map-generation.html": {
        projects: ["site-23.html", "your-shadow.html"],
        engineering: ["smart-ai-group-pathfinding.html", "functional-gameplay-architecture.html"]
      },
      "projectile-simulation.html": {
        projects: ["data-hunters.html"],
        engineering: ["dynamic-weapon-sway.html", "server-authoritative-hit-validation.html"]
      },
      "functional-gameplay-architecture.html": {
        projects: ["site-23.html", "data-hunters.html"],
        engineering: ["modular-weapon-framework.html", "matchmaking-lobby-system.html"]
      },
      "modular-weapon-framework.html": {
        projects: ["data-hunters.html"],
        engineering: ["dynamic-weapon-sway.html", "projectile-simulation.html"]
      },
      "matchmaking-lobby-system.html": {
        projects: ["data-hunters.html"],
        engineering: ["persistent-player-data.html", "functional-gameplay-architecture.html"]
      },
      "persistent-player-data.html": {
        projects: ["data-hunters.html"],
        engineering: ["matchmaking-lobby-system.html", "functional-gameplay-architecture.html"]
      },
      "sandbox-placement-system.html": {
        projects: ["site-23.html"],
        engineering: ["functional-gameplay-architecture.html", "procedural-map-generation.html"]
      }
    }
  };

  const titleFromFile = (file) =>
    file
      .replace(/\.html$/i, "")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const makeLinkCards = (items, hrefPrefix) => {
    const grid = document.createElement("div");
    grid.className = "eng-link-grid";

    items.forEach((file) => {
      const card = document.createElement("article");
      card.className = "eng-link-card";

      const h4 = document.createElement("h4");
      h4.textContent = titleFromFile(file);

      const p = document.createElement("p");
      p.textContent = "Explore implementation details and architecture notes.";

      const a = document.createElement("a");
      a.href = hrefPrefix + file;
      a.textContent = "Open Page";

      card.appendChild(h4);
      card.appendChild(p);
      card.appendChild(a);
      grid.appendChild(card);
    });

    return grid;
  };

  const makeSection = (heading, className) => {
    const section = document.createElement("section");
    section.className = className;

    const h2 = document.createElement("h2");
    h2.textContent = heading;

    section.appendChild(h2);
    return section;
  };

  const resolveAssetPath = (assetPath) => {
    if (!assetPath) return "";
    if (/^(?:https?:)?\/\//.test(assetPath) || assetPath.startsWith("/")) {
      return assetPath;
    }

    return rootPrefix + assetPath;
  };

  const loadVideoManifest = () => {
    if (videoManifestPromise) return videoManifestPromise;

    videoManifestPromise = new Promise((resolve) => {
      if (window.PORTFOLIO_VIDEO_MANIFEST) {
        resolve(window.PORTFOLIO_VIDEO_MANIFEST);
        return;
      }

      const script = document.createElement("script");
      script.src = `${rootPrefix}videos/manifest.js`;
      script.async = true;
      script.onload = () => resolve(window.PORTFOLIO_VIDEO_MANIFEST || {});
      script.onerror = () => resolve({});
      document.head.appendChild(script);
    });

    return videoManifestPromise;
  };

  const initShowcaseVideo = async () => {
    if (!isEngineeringPage && !isProjectPage) return;

    const stack = document.querySelector(".eng-content") || document.querySelector(".case-study-stack");
    if (!stack) return;
    if (stack.querySelector("[data-generated-showcase-video='true']")) return;

    const pageKey = (path.split("/").pop() || "").replace(/\.html$/i, "");
    const manifest = await loadVideoManifest();
    const entries = isProjectPage ? manifest.projects : manifest.engineering;
    const entry = entries && entries[pageKey];

    if (!entry) return;

    const sectionClass = stack.classList.contains("eng-content") ? "eng-section" : "case-study-section";

    const buildVideoSection = (videoEntry, dataAttr) => {
      const section = makeSection(videoEntry.title || "Showcase Video", sectionClass);
      section.setAttribute(dataAttr, "true");

      const shell = document.createElement("div");
      shell.className = "showcase-video-shell";

      const video = document.createElement("video");
      video.className = "showcase-video-player";
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;

      if (videoEntry.poster) {
        video.poster = resolveAssetPath(videoEntry.poster);
      }

      videoEntry.sources.forEach((item) => {
        if (!item || !item.src) return;
        const source = document.createElement("source");
        source.src = resolveAssetPath(item.src);
        if (item.type) source.type = item.type;
        video.appendChild(source);
      });

      shell.appendChild(video);

      if (videoEntry.description || videoEntry.caption) {
        const meta = document.createElement("div");
        meta.className = "showcase-video-meta";
        if (videoEntry.description) {
          const p = document.createElement("p");
          p.textContent = videoEntry.description;
          meta.appendChild(p);
        }
        if (videoEntry.caption) {
          const span = document.createElement("span");
          span.textContent = videoEntry.caption;
          meta.appendChild(span);
        }
        shell.appendChild(meta);
      }

      section.appendChild(shell);
      return section;
    };

    const firstSection = stack.querySelector(":scope > section");
    let insertAfter = firstSection || null;

    const insertSection = (section) => {
      if (insertAfter) {
        insertAfter.insertAdjacentElement("afterend", section);
        insertAfter = section;
      } else {
        stack.prepend(section);
        insertAfter = section;
      }
    };

    if (entry.enabled && Array.isArray(entry.sources) && entry.sources.length) {
      insertSection(buildVideoSection(entry, "data-generated-showcase-video"));
    }

    const tech = entry.technical;
    if (tech && tech.enabled && Array.isArray(tech.sources) && tech.sources.length) {
      insertSection(buildVideoSection(tech, "data-generated-technical-video"));
    }
  };

  const initNavState = () => {
    const nav = document.querySelector(".topbar");
    if (!nav) return;

    const update = () => {
      if (window.scrollY > 8) {
        nav.classList.add("topbar-scrolled");
      } else {
        nav.classList.remove("topbar-scrolled");
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  };

  const initReveal = () => {
    const targets = document.querySelectorAll(
      ".card, .engineering-card, .case-study-section, .eng-section, .focus-card, .philosophy-card, .contact-card, .eng-link-card, .eng-card, .hero-panel, .sidebar-panel, .eng-side-panel"
    );

    targets.forEach((el, index) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", `${Math.min(index, 12) * 35}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1
      }
    );

    targets.forEach((el) => observer.observe(el));
  };

  const initToc = () => {
    if (!isEngineeringPage) return;

    const stack = document.querySelector(".eng-content") || document.querySelector(".case-study-stack");
    if (!stack) return;

    const headings = Array.from(stack.querySelectorAll("section h2"));
    if (headings.length < 2) return;

    const links = headings
      .map((heading) => {
        const section = heading.closest("section");
        if (!section) return null;

        if (!section.id) {
          section.id = heading.textContent
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
        }

        return {
          href: `#${section.id}`,
          text: heading.textContent.replace(/^\d+\.\s*/, "")
        };
      })
      .filter(Boolean);

    let side = document.querySelector(".eng-side") || document.querySelector(".case-study-sidebar");
    if (!side) return;

    if (!side.querySelector("[data-generated-toc='true']")) {
      const panel = document.createElement("div");
      panel.className = side.classList.contains("eng-side") ? "eng-side-panel" : "sidebar-panel";
      panel.setAttribute("data-generated-toc", "true");

      const title = document.createElement("h3");
      title.textContent = "On This Page";

      const linkWrap = document.createElement("div");
      linkWrap.className = side.classList.contains("eng-side") ? "eng-links" : "topic-links";

      links.forEach((item) => {
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.text;
        a.setAttribute("data-toc-link", "true");
        linkWrap.appendChild(a);
      });

      panel.appendChild(title);
      panel.appendChild(linkWrap);
      side.insertBefore(panel, side.firstChild);
    }

    const tocLinks = Array.from(side.querySelectorAll("a[data-toc-link='true']"));
    if (!tocLinks.length || !("IntersectionObserver" in window)) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = tocLinks.find((node) => node.getAttribute("href") === `#${id}`);
          if (!link) return;

          if (entry.isIntersecting) {
            tocLinks.forEach((node) => node.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    links.forEach((item) => {
      const target = document.querySelector(item.href);
      if (target) sectionObserver.observe(target);
    });
  };

  const ensureEngineeringEndSections = () => {
    if (!isEngineeringPage) return;

    const file = path.split("/").pop();
    const map = graph.engineering[file];
    if (!map) return;

    const stack = document.querySelector(".eng-content") || document.querySelector(".case-study-stack");
    if (!stack) return;

    const sectionClass = stack.classList.contains("eng-content") ? "eng-section" : "case-study-section";

    const hasRelatedProject = Array.from(stack.querySelectorAll("section h2")).some((h) =>
      /related project/i.test(h.textContent)
    );

    const hasRelatedEngineering = Array.from(stack.querySelectorAll("section h2")).some((h) =>
      /related engineering/i.test(h.textContent)
    );

    if (!hasRelatedProject && map.projects && map.projects.length) {
      const section = makeSection("Related Project", sectionClass);
      section.appendChild(makeLinkCards(map.projects, "../projects/"));
      stack.appendChild(section);
    }

    if (!hasRelatedEngineering && map.engineering && map.engineering.length) {
      const section = makeSection("Related Engineering", sectionClass);
      section.appendChild(makeLinkCards(map.engineering, ""));
      stack.appendChild(section);
    }
  };

  const ensureProjectHighlights = () => {
    if (!isProjectPage) return;

    const file = path.split("/").pop();
    const map = graph.projects[file];
    if (!map || !map.engineering || !map.engineering.length) return;

    const stack = document.querySelector(".eng-content");
    const mainSection = document.querySelector("body > section.container") || document.querySelector("section.container");

    const target = stack || mainSection;
    if (!target) return;

    const hasHighlights = Array.from(target.querySelectorAll("h2")).some((h) => /engineering highlights/i.test(h.textContent));
    if (hasHighlights) return;

    const sectionClass = stack ? "eng-section" : "case-study-section";
    const section = makeSection("Engineering Highlights", sectionClass);
    section.appendChild(makeLinkCards(map.engineering, "../engineering/"));
    target.appendChild(section);
  };

  const buildArchitectureDiagrams = () => {
    if (!isEngineeringPage) return;

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      const h2 = section.querySelector("h2");
      if (!h2) return;
      if (!/architecture/i.test(h2.textContent)) return;
      if (section.querySelector(".eng-diagram")) return;

      const diagram = document.createElement("div");
      diagram.className = "eng-diagram";
      diagram.setAttribute("aria-label", "Architecture flow diagram");

      const labels = ["Inputs", "Rules", "State Update", "Validation", "Output"];
      labels.forEach((label, index) => {
        const node = document.createElement("div");
        node.className = "eng-node";
        node.textContent = label;
        diagram.appendChild(node);

        if (index < labels.length - 1) {
          const arrow = document.createElement("div");
          arrow.className = "eng-arrow";
          diagram.appendChild(arrow);
        }
      });

      const firstParagraph = section.querySelector("p");
      if (firstParagraph) {
        firstParagraph.insertAdjacentElement("afterend", diagram);
      } else {
        section.appendChild(diagram);
      }
    });
  };

  const initTimeline = () => {
    document.querySelectorAll(".case-study-stack").forEach((stack) => {
      stack.classList.add("timeline-stack");
      stack.querySelectorAll(".case-study-section").forEach((item) => item.classList.add("timeline-item"));
    });
  };

  const highlightCode = () => {
    const keywords = /\b(local|function|if|then|end|for|in|do|while|repeat|until|return|nil|true|false|and|or|not|break)\b/g;
    const globals = /\b(math|string|table|pairs|ipairs|Vector3|CFrame|Instance|workspace)\b/g;
    const numbers = /\b\d+(?:\.\d+)?\b/g;
    const comments = /--[^\n]*/g;

    const blocks = document.querySelectorAll("pre code");
    blocks.forEach((block) => {
      if (block.getAttribute("data-enhanced") === "true") return;

      const raw = block.textContent || "";
      const escaped = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const withTokens = escaped
        .replace(comments, '<span class="tok-comment">$&</span>')
        .replace(keywords, '<span class="tok-keyword">$&</span>')
        .replace(globals, '<span class="tok-global">$&</span>')
        .replace(numbers, '<span class="tok-number">$&</span>');

      block.innerHTML = withTokens;
      block.setAttribute("data-enhanced", "true");
    });
  };

  const boot = async () => {
    ensureEngineeringEndSections();
    ensureProjectHighlights();
    buildArchitectureDiagrams();
    await initShowcaseVideo();
    initTimeline();
    initToc();
    highlightCode();
    initReveal();
  };

  document.documentElement.classList.add("js-ready");
  initNavState();
  boot();
})();
