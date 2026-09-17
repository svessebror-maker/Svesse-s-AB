/* ================================
   LocalAI Hub — Interactive Script
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // 6 Local AI Tools data
    const tools = [
        {
            name: 'ComfyUI',
            tags: ['generate'],
            desc: 'The most powerful modular AI engine for images, video, audio, and 3D. Build complex workflows with a node graph interface and run everything offline.',
            specs: 'Images · Video · 3D · Audio',
            license: 'GPL-3.0',
            url: 'https://www.comfy.org/download'
        },
        {
            name: 'Ollama',
            tags: ['chat'],
            desc: 'The simplest way to run large language models locally. One command to download and chat with Llama, Mistral, Qwen, and many uncensored variants.',
            specs: 'LLMs · CLI · API',
            license: 'MIT',
            url: 'https://ollama.com'
        },
        {
            name: 'LM Studio',
            tags: ['chat', 'interface'],
            desc: 'A beautiful desktop app for discovering, downloading, and running local LLMs. Great UI, model search, and built-in chat interface.',
            specs: 'LLMs · GUI · Cross-Platform',
            license: 'Freeware',
            url: 'https://lmstudio.ai'
        },
        {
            name: 'Stable Diffusion WebUI Forge',
            tags: ['generate'],
            desc: 'A fast, optimized fork of AUTOMATIC1111 for local image generation. Supports SD 1.5, SDXL, Flux, ControlNet, LoRAs, and more.',
            specs: 'Image Gen · Optimized · Extensions',
            license: 'AGPL-3.0',
            url: 'https://github.com/lllyasviel/stable-diffusion-webui-forge'
        },
        {
            name: 'Pinokio',
            tags: ['interface'],
            desc: 'A local AI browser that lets you install and run open-source AI apps with one click. No terminal, no dependencies, no friction.',
            specs: 'App Browser · One-Click Install',
            license: 'Freeware',
            url: 'https://pinokio.computer'
        },
        {
            name: 'Text Generation WebUI',
            tags: ['chat', 'interface'],
            desc: 'A flexible web interface for running LLMs locally. Supports many model formats, extensions, and advanced generation parameters.',
            specs: 'LLMs · Web UI · Extensions',
            license: 'AGPL-3.0',
            url: 'https://github.com/oobabooga/text-generation-webui'
        }
    ];

    // Render 6 tools
    const toolsGrid = document.getElementById('toolsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderTools(filter = 'all') {
        toolsGrid.innerHTML = '';
        const filtered = filter === 'all'
            ? tools
            : tools.filter(t => t.tags.includes(filter));

        filtered.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'model-card';
            card.innerHTML = `
                <div class="model-header">
                    <div class="model-name">${tool.name}</div>
                    <div class="model-tags">
                        ${tool.tags.map(tag => `<span class="model-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <p class="model-desc">${tool.desc}</p>
                <div class="model-meta">
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                        ${tool.specs}
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        ${tool.license}
                    </span>
                </div>
                <div class="model-actions">
                    <a href="${tool.url}" target="_blank" rel="noopener" class="btn btn-primary">Download</a>
                    <a href="#download" class="btn btn-secondary">How to Run</a>
                </div>
            `;
            toolsGrid.appendChild(card);
        });

        // Animate cards in
        const cards = toolsGrid.querySelectorAll('.model-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 80);
        });
    }

    renderTools();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTools(btn.dataset.filter);
        });
    });

    // FAQ data
    const faqs = [
        {
            question: 'Is running local AI actually private?',
            answer: 'Yes. When you run a model locally, your prompts and generated outputs never leave your device. There is no cloud API, no remote logging, and no data collection. Your conversations stay on your hardware.'
        },
        {
            question: 'What hardware do I need?',
            answer: 'It depends on the model. Small models (3B–8B parameters) run well on modern CPUs and entry-level GPUs with 8–16 GB RAM. Larger models (70B+) need powerful GPUs with 24–48 GB VRAM. Quantized versions reduce memory requirements significantly.'
        },
        {
            question: 'Are these models completely uncensored?',
            answer: 'We list models that are fine-tuned to minimize refusals and corporate alignment filters. However, "uncensored" means fewer restrictions, not zero behavior. Each model still has its own training biases and limitations.'
        },
        {
            question: 'Is it legal to use uncensored AI?',
            answer: 'Running open-weight models locally is legal in most jurisdictions. You are responsible for complying with your local laws and using the technology ethically. We encourage responsible, lawful use.'
        },
        {
            question: 'Can I use local AI for commercial projects?',
            answer: 'Many open models allow commercial use, but licenses vary. Check each model\'s license (e.g., Apache 2.0, MIT, Llama 3) before using outputs commercially. We link to official sources for every model.'
        },
        {
            question: 'How do I get started quickly?',
            answer: 'Pick one of the 6 featured tools. For chat, try Ollama or LM Studio. For image/video generation, try ComfyUI or Stable Diffusion WebUI Forge. Most handle model downloading and setup automatically.'
        }
    ];

    // Render FAQ
    const faqList = document.getElementById('faqList');
    faqs.forEach((faq, index) => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `
            <button class="faq-question" aria-expanded="false">
                ${faq.question}
                <span class="faq-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </span>
            </button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        `;
        faqList.appendChild(item);

        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked if it was closed
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Modal logic
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    const modalContent = {
        terms: {
            title: 'Terms of Use',
            body: `
                <p>By using LocalAI Hub, you agree that the information provided is for educational and informational purposes. We do not host models or software directly.</p>
                <p>You are solely responsible for how you use local AI models. Always comply with applicable laws in your jurisdiction, respect intellectual property, and avoid generating harmful, illegal, or abusive content.</p>
                <p>External links to Ollama, Hugging Face, LM Studio, and other projects are subject to those platforms' own terms and licenses.</p>
            `
        },
        privacy: {
            title: 'Privacy Policy',
            body: `
                <p>LocalAI Hub does not collect, store, or process any personal data. This is a static informational website.</p>
                <p>We do not use analytics cookies, trackers, or third-party advertising. External links may lead to services with their own privacy policies.</p>
            `
        },
        responsible: {
            title: 'Responsible Use',
            body: `
                <p>Uncensored local AI gives you freedom, and with that freedom comes responsibility. We encourage users to:</p>
                <p>• Use models lawfully and ethically.<br>• Respect the rights and dignity of others.<br>• Avoid creating content that violates local laws or platform policies.<br>• Verify factual claims produced by AI before acting on them.</p>
                <p>LocalAI Hub is not responsible for user-generated content or misuse of the tools and models referenced.</p>
            `
        }
    };

    document.querySelectorAll('.legal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const key = link.dataset.modal;
            const content = modalContent[key];
            if (content) {
                modalBody.innerHTML = `<h2>${content.title}</h2>${content.body}`;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Dynamic year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .download-card, .why-local-content, .why-local-visual, .comparison-table-wrapper, .cta-box').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});
