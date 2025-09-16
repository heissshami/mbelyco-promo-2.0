/* Seeded demo data and interactions for the MBELYCO Promo v2.0 HTML prototype */
(function(){
    const state = {
        theme: 'dark',
        batches: [],
        codes: [],
        activity: [],
        codesPage: 1,
        activeTab: 'dashboard',
        user: null,
        isAuthenticated: false
    };

    const el = (id)=>document.getElementById(id);
    const qs = (sel, root=document)=>root.querySelector(sel);
    const qsa = (sel, root=document)=>Array.from(root.querySelectorAll(sel));

    // Util: date formatting
    function fmtDate(d){
        const pad = (n)=>String(n).padStart(2,'0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
    function fmtDateTime(d){
        const pad = (n)=>String(n).padStart(2,'0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    // Demo users for authentication
    const demoUsers = [
        {
            id: 'admin',
            email: 'elysembonye@gmail.com',
            password: 'admin123',
            name: 'Elyse Mbonyumukunzi',
            role: 'admin',
            permissions: ['read', 'write', 'delete', 'admin']
        },
        {
            id: 'manager',
            email: 'manager@mbelyco.com',
            password: 'manager123',
            name: 'Manager User',
            role: 'manager',
            permissions: ['read', 'write']
        },
        {
            id: 'user',
            email: 'user@mbelyco.com',
            password: 'user123',
            name: 'Regular User',
            role: 'user',
            permissions: ['read']
        },
        {
            id: 'beathe',
            email: 'umwalib@mbelyco.com',
            password: 'umwali@1',
            name: 'Beathe Umwali',
            role: 'manager',
            permissions: ['read', 'write']
        },
        {
            id: 'mrselyse',
            email: 'misselyse@mbelyco.com',
            password: 'misselyse@mbelyco.com',
            name: 'Mrs. Elyse',
            role: 'admin',
            permissions: ['read', 'write', 'delete', 'admin']
        }
    ];

    // Seed data according to PRD patterns
    function randomCodePart(len){
        const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let out = '';
        for(let i=0;i<len;i++) out += CHARS[Math.floor(Math.random()*CHARS.length)];
        return out;
    }
    function generateCode(createdAt){
        const YY = String(createdAt.getFullYear()).slice(-2);
        const MM = String(createdAt.getMonth()+1).padStart(2,'0');
        const DD = String(createdAt.getDate()).padStart(2,'0');
        return `${randomCodePart(4)}-${randomCodePart(2)}${YY}-${randomCodePart(2)}${MM}-${randomCodePart(2)}${DD}`;
    }

    function seed(){
        const today = new Date();
        state.batches = [
            { id: 'b1', name: 'SUMMER_PROMO', description: 'Summer 2025 Promo', total_codes: 1200, amount_per_code: 500, currency: 'RWF', expiration_date: new Date(today.getFullYear(), today.getMonth()+2, 1), assigned_user: 'Alice', status: 'active', created_at: today },
            { id: 'b2', name: 'LAUNCH_WAVE_A', description: 'Product Launch Wave A', total_codes: 800, amount_per_code: 1000, currency: 'RWF', expiration_date: new Date(today.getFullYear(), today.getMonth()+1, 15), assigned_user: 'Bob', status: 'active', created_at: today },
            { id: 'b3', name: 'Q4_RETENTION', description: 'Retention push', total_codes: 600, amount_per_code: 700, currency: 'RWF', expiration_date: new Date(today.getFullYear(), today.getMonth()-1, 28), assigned_user: 'Carol', status: 'expired', created_at: today },
            { id: 'b4', name: 'PARTNER_CAMPAIGN', description: 'Partner co-brand', total_codes: 300, amount_per_code: 1500, currency: 'RWF', expiration_date: new Date(today.getFullYear(), today.getMonth()+3, 5), assigned_user: 'Diana', status: 'active', created_at: today }
        ];

        const statuses = ['active','used','redeemed','expired','blocked'];
        state.codes = [];
        state.batches.forEach(b => {
            // Create codes to match the batch total_codes count
            for(let i=0;i<b.total_codes;i++){
                const created = new Date(today.getTime() - Math.floor(Math.random()*86400000*30));
                const st = statuses[Math.floor(Math.random()*statuses.length)];
                state.codes.push({
                    id: `${b.id}-${i}`,
                    code: generateCode(created),
                    batch_id: b.id,
                    batch_name: b.name,
                    amount: b.amount_per_code,
                    currency: b.currency,
                    status: st,
                    created_at: created
                });
            }
        });

        state.activity = [
            { icon:'✅', title:'Redemption completed', time:'Just now', desc:'RWF 500 sent to 2507***12' },
            { icon:'📦', title:'Batch generated', time:'2m ago', desc:'1,200 codes created for SUMMER_PROMO' },
            { icon:'⚠️', title:'Retry scheduled', time:'14m ago', desc:'MoMo disbursement retry in 5 min' },
            { icon:'🔐', title:'Role updated', time:'1h ago', desc:'Alice granted Campaign Manager' }
        ];

        // Debug logging
        console.log('Seed function completed:', {
            batches: state.batches.length,
            codes: state.codes.length,
            totalCodesFromBatches: state.batches.reduce((sum, b) => sum + b.total_codes, 0)
        });

    }

    // Rendering
    function renderKPIs(){
        if (state.kpis) {
            const { total_codes = 0, redemptions = 0, active_batches = 0, disbursed = 0 } = state.kpis || {};
            const totalCodesEl = el('kpiTotalCodes'); if(totalCodesEl) totalCodesEl.textContent = Number(total_codes).toLocaleString();
            const redemptionsEl = el('kpiRedemptions'); if(redemptionsEl) redemptionsEl.textContent = Number(redemptions).toLocaleString();
            const activeBatchesEl = el('kpiActiveBatches'); if(activeBatchesEl) activeBatchesEl.textContent = String(active_batches);
            const disbursedEl = el('kpiDisbursed'); if(disbursedEl) disbursedEl.textContent = Number(disbursed).toLocaleString();
            return;
        }
        const totalCodes = state.batches.reduce((s,b)=>s+b.total_codes,0);
        const redemptions = state.codes.filter(c=>c.status==='redeemed').length;
        const activeBatches = state.batches.filter(b=>b.status==='active').length;
        const disbursed = state.codes.filter(c=>c.status==='redeemed').reduce((s,c)=>s+c.amount,0);
        el('kpiTotalCodes').textContent = totalCodes.toLocaleString();
        el('kpiRedemptions').textContent = redemptions.toLocaleString();
        el('kpiActiveBatches').textContent = String(activeBatches);
        el('kpiDisbursed').textContent = disbursed.toLocaleString();
    }

    function renderActivity(){
        const host = el('activityFeed'); host.innerHTML='';
        state.activity.forEach(a=>{
            const li = document.createElement('li');
            const icon = mapActivityIcon(a.icon);
            li.innerHTML = `<div class="activity-icon"><i data-lucide="${icon}"></i></div>
        <div class="activity-meta">
          <div class="activity-title">${a.title}</div>
          <div class="activity-time">${a.time}</div>
          <div class="activity-desc">${a.desc}</div>
        </div>`;
            host.appendChild(li);
        });
        if(window.lucide) window.lucide.createIcons();
    }

    function badgeStatus(st){
        if(st==='redeemed' || st==='used') return 'success';
        if(st==='expired') return 'muted';
        if(st==='blocked') return 'blocked';
        return 'warn';
    }

    function getActiveBatchStatus(){
        const t = qs('#btStatusTabs .status-tab.active');
        return t ? (t.getAttribute('data-status') || '') : '';
    }

    function renderBatches(filter=''){
        const body = el('batchesTbody');
        if(!body) {
            console.error('batchesTbody element not found!');
            return;
        }
        body.innerHTML='';
        const q = filter.toLowerCase();
        const st = getActiveBatchStatus();
        const filtered = state.batches
            .filter(b=>!q || b.name.toLowerCase().includes(q))
            .filter(b=>!st || b.status===st);

        // Debug logging
        console.log('renderBatches debug:', {
            totalBatches: state.batches.length,
            filtered: filtered.length,
            filter: q,
            statusFilter: st
        });
        filtered.forEach(b=>{
            const tr = document.createElement('tr');
            const expires = b.expiration_date ? fmtDate(b.expiration_date) : 'N/A';
            // Use backend redeemed_count when available, fallback to local calc
            const redeemed = (typeof b.redeemed_count === 'number')
                ? b.redeemed_count
                : state.codes.filter(c=>c.batch_id===b.id && (c.status==='redeemed' || c.status==='used')).length;
            const total = Math.max(0, Number(b.total_codes) || 0);
            const pct = total>0 ? Math.min(100, Math.round((redeemed / total) * 100)) : 0;
            const statusChip = b.status==='active'?'success':(b.status==='expired'?'muted':(b.status==='completed'?'success':'warn'));
            const actionLabel = b.status === 'blocked' ? 'Enable' : 'Block';
            const actionKey = b.status === 'blocked' ? 'enable' : 'block';
            tr.innerHTML = `
          <td>${b.name || 'N/A'}</td>
          <td>${(b.total_codes || 0).toLocaleString()}</td>
          <td>${(b.amount_per_code || 0).toLocaleString()} ${b.currency || 'RWF'}</td>
          <td>
            <div class="progress">
              <div class="progress-bar" aria-label="Progress" title="${pct}%">
                <span style="width:${pct}%"></span>
              </div>
              <span class="progress-text">${redeemed.toLocaleString()}/${(b.total_codes || 0).toLocaleString()}</span>
            </div>
          </td>
          <td><span class="status ${statusChip}">${capitalize(b.status || 'unknown')}</span></td>
          <td>${b.assigned_user || 'Unassigned'}</td>
          <td>${expires}</td>
          <td>
            <div class="cell-actions">
              <button class="btn" data-action="download" data-batch="${b.id}">Download</button>
            </div>
          </td>
          <td>
            <div class="cell-actions center">
              <button class="icon-btn more" data-action="more" data-batch="${b.id}" aria-label="More options"><i data-lucide="more-vertical"></i></button>
              <div class="menu" id="menu-${b.id}">
                <button data-menu="edit" data-batch="${b.id}">Edit</button>
                <button data-menu="view" data-batch="${b.id}">View</button>
                <button data-menu="${actionKey}" data-batch="${b.id}">${actionLabel}</button>
              </div>
            </div>
          </td>`;
            body.appendChild(tr);
        });
        if(window.lucide) window.lucide.createIcons();
        fixSelectIcons();
        // update counts and items
        updateBatchCounts();
        const btItems = el('btItemsCount'); if(btItems) btItems.textContent = String(filtered.length);
    }

    function updateBatchCounts(){
        const counts = { all: state.batches.length, active:0, expired:0, blocked:0 };
        state.batches.forEach(b=>{ if(counts[b.status]!==undefined) counts[b.status]++; });
        const map = [['btCountAll','all'],['btCountActive','active'],['btCountExpired','expired'],['btCountBlocked','blocked']];
        map.forEach(([id,key])=>{ const n = el(id); if(n) n.textContent = String(counts[key]); });
    }

    const CODES_PAGE_SIZE = 12;

    function getActiveStatus(){
        const activeTab = qs('#pcStatusTabs .status-tab.active');
        return activeTab ? (activeTab.getAttribute('data-status') || '') : '';
    }

    function renderCodes(search='', statusFilter=''){
        const body = el('codesTbody');
        if(!body) {
            console.error('codesTbody element not found!');
            return;
        }
        body.innerHTML='';

        const params = new URLSearchParams();
        params.set('page', String(state.codesPage || 1));
        params.set('pageSize', String(CODES_PAGE_SIZE));
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);

        fetch(`/api/promo-codes?${params.toString()}`)
            .then(r=>r.json())
            .then(data=>{
                const items = (data && data.items) ? data.items : [];
                state.codes = items.map(c=>({
                    id: c.id,
                    code: c.code,
                    batch_id: c.batch_id,
                    batch_name: c.batch_name,
                    amount: Number(c.amount),
                    currency: c.currency || 'RWF',
                    status: c.status,
                    created_at: c.created_at ? new Date(c.created_at) : new Date()
                }));
                state.codeCounts = data && data.counts ? data.counts : null;

                const totalItems = (state.codeCounts && typeof state.codeCounts.total === 'number') ? state.codeCounts.total : state.codes.length;
                const totalPages = Math.max(1, Math.ceil(totalItems / CODES_PAGE_SIZE));
                if(state.codesPage > totalPages) state.codesPage = totalPages;
                if(state.codesPage < 1) state.codesPage = 1;

                // Debug logging
                console.log('renderCodes fetch debug:', {
                    totalItems, totalPages, currentPage: state.codesPage, pageItems: state.codes.length
                });

                state.codes.forEach(c=>{
                    const tr = document.createElement('tr');
                    const actionLabel = c.status === 'blocked' ? 'Enable' : 'Block';
                    const actionKey = c.status === 'blocked' ? 'enable' : 'block';
                    tr.innerHTML = `
            <td><input type="checkbox" data-id="${c.id}" /></td>
            <td>
              <div class="code-pill">
                <span class="code-value">${c.code}</span>
                <button class="copy-code" data-copy="${c.code}" aria-label="Copy code"><i data-lucide="copy"></i> <span>Copy</span></button>
              </div>
            </td>
            <td>${c.amount.toLocaleString()} ${c.currency}</td>
            <td>${c.batch_name || ''}</td>
            <td><span class="status ${badgeStatus(c.status)}">${c.status}</span></td>
            <td>${fmtDate(c.created_at)}</td>
            <td>
              <div class="row-actions center">
                <button class="icon-btn" data-code-more="${c.id}" aria-label="More options"><i data-lucide="more-vertical"></i></button>
                <div class="menu" id="code-menu-${c.id}">
                  <button data-code-menu="view" data-code="${c.id}">View</button>
                  <button data-code-menu="${actionKey}" data-code="${c.id}">${actionLabel}</button>
                  <button data-code-menu="copy" data-code="${c.code}">Copy Code</button>
                </div>
              </div>
            </td>`;
                    body.appendChild(tr);
                });

                if(window.lucide) window.lucide.createIcons();
                fixSelectIcons();
                // update counts and items
                updatePromoCounts();
                const pcItems = el('pcItemsCount'); if(pcItems) pcItems.textContent = Number(totalItems).toLocaleString();
                const pcPageIdx = el('pcPageIndex'); if(pcPageIdx) pcPageIdx.textContent = String(state.codesPage);
                const pcPageTotal = el('pcPageTotal'); if(pcPageTotal) pcPageTotal.textContent = String(totalPages);
                const prevBtn = el('pcPagePrev'); if(prevBtn) prevBtn.disabled = state.codesPage <= 1;
                const nextBtn = el('pcPageNext'); if(nextBtn) nextBtn.disabled = state.codesPage >= totalPages;
            })
            .catch(err=>{
                console.error('Failed to load promo codes', err);
            });
    }

    function updatePromoCounts(){
        if (state.codeCounts) {
            const map = [
                ['pcCountAll','total'],['pcCountActive','active'],['pcCountUsed','used'],['pcCountRedeemed','redeemed'],['pcCountExpired','expired'],['pcCountBlocked','blocked']
            ];
            map.forEach(([id,key])=>{ const n = el(id); if(n) n.textContent = Number(state.codeCounts[key] || 0).toLocaleString(); });
            return;
        }
        const counts = { all: state.codes.length, active:0, used:0, redeemed:0, expired:0, blocked:0 };
        state.codes.forEach(c=>{ if(counts[c.status]!==undefined) counts[c.status]++; });
        const fallbackMap = [
            ['pcCountAll','all'],['pcCountActive','active'],['pcCountUsed','used'],['pcCountRedeemed','redeemed'],['pcCountExpired','expired'],['pcCountBlocked','blocked']
        ];
        fallbackMap.forEach(([id,key])=>{ const n = el(id); if(n) n.textContent = counts[key].toLocaleString(); });
    }

    // Monitoring removed

    // Tabs
    function initTabs(){
        // Load saved tab state
        const savedTab = localStorage.getItem('mbelyco-active-tab');
        if(savedTab) {
            state.activeTab = savedTab;
        }

        // Set initial active tab
        setActiveTab(state.activeTab);

        qsa('.tab').forEach(btn=>{
            btn.addEventListener('click',()=>{
                const target = btn.getAttribute('data-target');
                setActiveTab(target);
                // Save to localStorage
                localStorage.setItem('mbelyco-active-tab', target);
                state.activeTab = target;
            });
        });
    }

    function setActiveTab(target){
        qsa('.tab').forEach(b=>b.classList.remove('active'));
        qsa('.view').forEach(v=>v.classList.remove('active'));

        const activeTabBtn = qs(`[data-target="${target}"]`);
        const activeView = qs(`#${target}`);

        if(activeTabBtn) activeTabBtn.classList.add('active');
        if(activeView) activeView.classList.add('active');

        // ensure icons are drawn for dynamically visible sections
        if(window.lucide) window.lucide.createIcons();
        fixSelectIcons();
        // attach card delegates on target view (batches or promo-codes)
        bindCardDelegatesFor(target);
        if(target==='batches') initBatchStatusTabs();

        // Force re-render data when switching to batches or promo-codes tabs
        if(target === 'batches') {
            console.log('Switching to batches tab, re-rendering...');
            renderBatches('');
        } else if(target === 'promo-codes') {
            console.log('Switching to promo-codes tab, re-rendering...');
            renderCodes('', '');
        }
    }

    function bindCardDelegatesFor(sectionId){
        const container = qs(`#${sectionId}`);
        if(!container || container.__cardsBound) return; // avoid rebinding
        container.addEventListener('click', (e)=>{
            const card = e.target.closest('[data-card-action]');
            if(!card) return;
            const action = card.getAttribute('data-card-action');
            if(action==='generate') openGenerateForm();
            if(action==='import') openModal('importModal');
            if(action==='download') openDownloadModal();
        });
        container.addEventListener('keydown', (e)=>{
            const card = e.target.closest('[data-card-action]');
            if(!card) return;
            if(e.key==='Enter' || e.key===' '){
                e.preventDefault(); card.click();
            }
        });
        container.__cardsBound = true;
    }

    // Theme
    function initTheme(){
        // Load saved theme state
        const savedTheme = localStorage.getItem('mbelyco-theme');
        if(savedTheme) {
            state.theme = savedTheme;
        }

        if(state.theme==='light') document.body.classList.add('theme-light');
        el('themeToggle').addEventListener('click',()=>{
            document.body.classList.toggle('theme-light');
            state.theme = document.body.classList.contains('theme-light') ? 'light' : 'dark';
            localStorage.setItem('mbelyco-theme', state.theme);
            toast('Theme toggled');
            syncThemeIcon();
            if(window.lucide) window.lucide.createIcons();
            fixSelectIcons();
        });
        syncThemeIcon();
        if(window.lucide) window.lucide.createIcons();
        fixSelectIcons();
    }

    function syncThemeIcon(){
        const isLight = document.body.classList.contains('theme-light');
        const icon = el('themeIcon');
        if(icon){ icon.setAttribute('data-lucide', isLight ? 'sun' : 'moon'); }
    }

    // Search & filters
    function initSearch(){
        // Load saved page state
        const savedPage = localStorage.getItem('mbelyco-codes-page');
        if(savedPage) {
            state.codesPage = parseInt(savedPage) || 1;
        }

        el('batchSearch').addEventListener('input', (e)=>{
            renderBatches(e.target.value);
        });
        const codesSearch = el('codesSearch');
        if(codesSearch){
            codesSearch.addEventListener('input', (e)=>{
                state.codesPage = 1;
                localStorage.setItem('mbelyco-codes-page', '1');
                const st = getActiveStatus();
                renderCodes(e.target.value, st);
            });
        }
        el('codesSelectAll').addEventListener('change', (e)=>{
            qsa('#codesTbody input[type="checkbox"]').forEach(cb=>{ cb.checked = e.target.checked; });
        });
        const selAllBatches = el('batchesSelectAll');
        if(selAllBatches){
            selAllBatches.addEventListener('change', (e)=>{
                qsa('#batchesTbody input[type="checkbox"]').forEach(cb=>{ cb.checked = e.target.checked; });
            });
        }
    }

    // Download modal
    const modal = {
        node: null,
        previouslyFocused: null,
        open(){
            if(!this.node) this.node = qs('#downloadModal');
            this.previouslyFocused = document.activeElement;
            this.node.classList.add('show');
            document.body.classList.add('no-scroll');
            this.node.removeAttribute('aria-hidden');
            const first = this.node.querySelector('select,button,[href],input,[tabindex]:not([tabindex="-1"])');
            if(first) first.focus();
            this.trapFocus(true);
        },
        close(){
            if(!this.node) this.node = qs('#downloadModal');
            this.node.classList.remove('show');
            document.body.classList.remove('no-scroll');
            this.node.setAttribute('aria-hidden','true');
            this.trapFocus(false);
            if(this.previouslyFocused && this.previouslyFocused.focus) this.previouslyFocused.focus();
        },
        onKeydown(e){
            if(e.key === 'Escape'){ modal.close(); }
            if(e.key === 'Tab'){
                const focusable = modal.getFocusable();
                if(!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length-1];
                if(e.shiftKey && document.activeElement === first){
                    e.preventDefault(); last.focus();
                } else if(!e.shiftKey && document.activeElement === last){
                    e.preventDefault(); first.focus();
                }
            }
        },
        getFocusable(){
            if(!this.node) this.node = qs('#downloadModal');
            return Array.from(this.node.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(el=>!el.hasAttribute('disabled'));
        },
        trapFocus(enable){
            if(enable) document.addEventListener('keydown', this.onKeydown);
            else document.removeEventListener('keydown', this.onKeydown);
        }
    };
    function initDownload(){

        function openFromAction(e){
            const trg = e.target.closest('button[data-action="download"]');
            if(!trg) return;
            openDownloadModal(trg.getAttribute('data-batch'));
        }

        el('btnDownloadCodes') && el('btnDownloadCodes').addEventListener('click', ()=> openDownloadModal());
        el('btnCodesDownload') && el('btnCodesDownload').addEventListener('click', ()=> openDownloadModal());

        // Handle format selection visual feedback
        const formatGroup = el('dlFormatGroup');
        if(formatGroup) {
            // Handle radio button changes
            formatGroup.addEventListener('change', (e) => {
                if(e.target.type === 'radio') {
                    // Remove selected class from all option cards
                    formatGroup.querySelectorAll('.option-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    // Add selected class to the checked option card
                    const checkedCard = e.target.closest('.option-card');
                    if(checkedCard) {
                        checkedCard.classList.add('selected');
                    }
                }
            });

            // Handle card clicks to ensure radio selection
            formatGroup.addEventListener('click', (e) => {
                const card = e.target.closest('.option-card');
                if(card) {
                    // First, uncheck all radio inputs
                    formatGroup.querySelectorAll('input[type="radio"]').forEach(input => {
                        input.checked = false;
                    });

                    // Remove selected class from all cards
                    formatGroup.querySelectorAll('.option-card').forEach(c => {
                        c.classList.remove('selected');
                    });

                    // Find the radio input in the clicked card and check it
                    const radioInput = card.querySelector('input[type="radio"]');
                    if(radioInput) {
                        radioInput.checked = true;
                        card.classList.add('selected');
                    }
                }
            });

            // Initialize selection on modal open
            const initFormatSelection = () => {
                // Remove all selections first
                formatGroup.querySelectorAll('.option-card').forEach(card => {
                    card.classList.remove('selected');
                });

                // Uncheck all radio inputs first
                formatGroup.querySelectorAll('input[type="radio"]').forEach(input => {
                    input.checked = false;
                });

                // Check the first option (PDF) by default
                const firstInput = formatGroup.querySelector('input[type="radio"]');
                if(firstInput) {
                    firstInput.checked = true;
                    const firstCard = firstInput.closest('.option-card');
                    if(firstCard) {
                        firstCard.classList.add('selected');
                    }
                }
            };

            // Set up modal open listener
            const downloadModal = el('downloadModal');
            if(downloadModal) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if(mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            if(downloadModal.classList.contains('show')) {
                                // Small delay to ensure DOM is ready
                                setTimeout(initFormatSelection, 50);
                            }
                        }
                    });
                });
                observer.observe(downloadModal, { attributes: true });
            }
        }
        // import handler
        const importInput = el('importFile');
        const importTrigger = el('btnImportCodes') || el('cardImport');
        importTrigger && importTrigger.addEventListener('click', ()=> openModal('importModal'));
        importTrigger && importTrigger.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openModal('importModal'); } });
        if(importInput){ importInput.addEventListener('change', async (e)=>{ const f = e.target.files && e.target.files[0]; if(f){ await handleImportFile(f); e.target.value=''; } }); }
        // import modal interactions
        const importClose = el('importClose');
        const importCancel = el('importCancel');
        const importDrop = el('importDrop');
        const importFileModal = el('importFileModal');
        if(importClose) importClose.addEventListener('click', ()=> closeModal('importModal'));
        if(importCancel) importCancel.addEventListener('click', ()=> closeModal('importModal'));
        if(importDrop){
            const openPicker = ()=> importFileModal && importFileModal.click();
            importDrop.addEventListener('click', openPicker);
            importDrop.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openPicker(); } });
            importDrop.addEventListener('dragover', (e)=>{ e.preventDefault(); });
            importDrop.addEventListener('drop', async (e)=>{ e.preventDefault(); const f = e.dataTransfer.files[0]; if(f){ await handleImportFile(f); } });
        }
        if(importFileModal){
            importFileModal.addEventListener('change', async (e)=>{ const f = e.target.files && e.target.files[0]; if(f){ await handleImportFile(f); e.target.value=''; closeModal('importModal'); }});
        }
        // Import button handler
        const importBtn = el('importBtn');
        if(importBtn) {
            importBtn.addEventListener('click', () => {
                importCodesWithProgress();
            });
        }
        const dlTemplate = el('downloadCsvTemplate');
        if(dlTemplate){ dlTemplate.addEventListener('click', ()=>{
            const headers = ['code','batch','amount','currency','status','created'];
            const example = [['ABCD-12' + new Date().getFullYear().toString().slice(-2) + '-34' + String(new Date().getMonth()+1).padStart(2,'0') + '-56' + String(new Date().getDate()).padStart(2,'0'),'TEMPLATE_BATCH','500','RWF','active', new Date().toISOString()]];
            const csv = [headers.join(','), ...example.map(r=>r.join(','))].join('\n');
            const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='MBL_TEMPLATE_yyyyMMdd_HHmm.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        }); }
        // generate handler => open form modal
        const genTrigger = el('btnGenerateCodes') || el('cardGenerate');
        genTrigger && genTrigger.addEventListener('click', ()=> openGenerateForm());
        genTrigger && genTrigger.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openGenerateForm(); } });
        setupGenerateForm();
        const dlTrigger = el('cardDownload');
        dlTrigger && dlTrigger.addEventListener('click', ()=> openDownloadModal());
        dlTrigger && dlTrigger.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openDownloadModal(); } });
        el('downloadClose').addEventListener('click', ()=> modal.close());
        el('downloadCancel').addEventListener('click', ()=> modal.close());
        qs('#downloadModal').addEventListener('click', (e)=>{ if(e.target === qs('#downloadModal')) modal.close(); });
        el('downloadConfirm').addEventListener('click', handleDownloadConfirm);
        el('batchesTbody').addEventListener('click', openFromAction);
        // Handle more menu toggle and actions
        el('batchesTbody').addEventListener('click', (e)=>{
            const moreBtn = e.target.closest('button[data-action="more"]');
            if(moreBtn){
                const id = moreBtn.getAttribute('data-batch');
                const menu = document.getElementById(`menu-${id}`);
                qsa('#batchesTbody .menu.open').forEach(m=>{ if(m!==menu) m.classList.remove('open'); });
                const wrapper = moreBtn.closest('.cell-actions');
                if(wrapper) wrapper.style.position = 'relative';
                if(menu){ positionDropdown(moreBtn, menu, 'expiration'); menu.classList.toggle('open'); }
                return;
            }
            const menuItem = e.target.closest('.menu button');
            if(menuItem){
                const id = menuItem.getAttribute('data-batch');
                const type = menuItem.getAttribute('data-menu');
                const menu = document.getElementById(`menu-${id}`);
                if(menu) menu.classList.remove('open');
                if(type==='view'){
                    toast(`Viewing batch ${id}`);
                } else if(type==='edit'){
                    toast(`Editing batch ${id}`);
                } else if(type==='block'){
                    const b = state.batches.find(x=>x.id===id);
                    if(b){ b.status = 'blocked'; renderBatches(el('batchSearch').value); }
                    toast('Batch blocked', 'warn');
                } else if(type==='enable'){
                    const b = state.batches.find(x=>x.id===id);
                    if(b){ b.status = 'active'; renderBatches(el('batchSearch').value); }
                    toast('Batch enabled', 'success');
                }
            }
        });
        // Close menus on outside click
        document.addEventListener('click', (e)=>{
            if(!e.target.closest('#batchesTbody .cell-actions')){
                qsa('#batchesTbody .menu.open').forEach(m=>m.classList.remove('open'));
            }
        });
    }

    function openGenerateForm(){
        openModal('generateFormModal');
    }
    function openModal(id){
        const m = el(id); if(!m) return; m.classList.add('show'); document.body.classList.add('no-scroll'); m.removeAttribute('aria-hidden');
    }
    function closeModal(id){
        const m = el(id); if(!m) return; m.classList.remove('show'); document.body.classList.remove('no-scroll'); m.setAttribute('aria-hidden','true');
    }

    function setupGenerateForm(){
        const close = ()=> closeModal('generateFormModal');
        el('generateFormClose').addEventListener('click', close);
        el('generateFormCancel').addEventListener('click', close);
        el('generateFormSubmit').addEventListener('click', onGenerateSubmit);
        // allow ESC to close
        document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
    }

    function onGenerateSubmit(){
        const name = el('gfName').value.trim();
        const total = Number(el('gfTotal').value);
        const amount = Number(el('gfAmount').value);
        const expiry = el('gfExpiry').value;
        if(!name || !total || !amount || !expiry){ toast('Fill required fields', 'warn'); return; }
        closeModal('generateFormModal');
        startGenerating({ name, total, amount, currency: el('gfCurrency').value || 'RWF', expiry });
    }

    function startGenerating({ name, total, amount, currency, expiry }){
        const id = `b${state.batches.length+1}`;
        const batch = { id, name, description: el('gfDesc').value || 'Generated batch', total_codes: total, amount_per_code: amount, currency, expiration_date: new Date(expiry), assigned_user: el('gfUser').value || 'Generator', status:'active', created_at: new Date() };
        state.batches.unshift(batch);
        // progress modal
        openModal('generatingModal');
        let generated = 0;
        const start = Date.now();
        const targetMs = Math.min(8000, Math.max(1500, total * 10));
        const fill = el('genProgressFill');
        const txt = el('genProgressText');
        const eta = el('genEtaText');

        console.log('Generate progress elements:', { fill, txt, eta });
        function tick(){
            const elapsed = Date.now() - start;
            const progress = Math.min(1, elapsed / targetMs);
            generated = Math.floor(total * progress);
            if(fill) {
                fill.style.width = `${Math.round(progress*100)}%`;
                fill.style.transition = 'width 0.1s ease';
            }
            if(txt) txt.textContent = `${generated.toLocaleString()} of ${total.toLocaleString()} codes generated`;
            const remaining = Math.max(0, targetMs - elapsed);
            if(eta) eta.textContent = `ETA: ${Math.ceil(remaining/1000)}s`;
            if(progress >= 1){
                // Ensure progress bar reaches 100%
                if(fill) fill.style.width = '100%';

                for(let i=0;i<total;i++){
                    state.codes.unshift({ id:`${id}-gen-${i}`, code: generateCode(new Date()), batch_id: id, batch_name: name, amount, currency, status:'active', created_at:new Date() });
                }
                closeModal('generatingModal');
                renderBatches(el('batchSearch').value);
                renderCodes(el('codesSearch').value, getActiveStatus());
                toast(`Generated ${total} codes in ${name}`, 'success');
            } else {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    // CSV generation
    function downloadCSV(batch){
        const headers = ['code','batch','amount','currency','status','created'];
        const rows = state.codes
            .filter(c=>c.batch_id===batch.id)
            .map(c=>[c.code, batch.name, c.amount, c.currency, c.status, fmtDateTime(c.created_at)]);
        const csv = [headers.join(','), ...rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'\"')}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date();
        a.href = url;
        a.download = formatDownloadName(batch.name, 'csv', ts);
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        toast('CSV download started', 'success');
    }

    // PDF generation (12 per A4) to match A4_PDF_download_template.html
    function renderCodesPdf({ batchName, generatedAt, items }){
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
        const page = { width:210, height:297 };

        // Template layout:
        // Header at 25mm from top (centered), footer at 25mm from bottom (centered)
        // Content between 50mm top and 50mm bottom, grid centered inside
        const headerY = 25;
        const footerY = page.height - 25;
        const contentTop = 50;
        const contentBottom = 50;
        const availableH = page.height - contentTop - contentBottom; // 197mm

        // Grid: 3 cols x 4 rows, each cell 40mm x 40mm, gap 8mm
        const grid = { cols:3, rows:4, colGap:8, rowGap:8, cellW:40, cellH:40 };
        const gridW = grid.cellW * grid.cols + grid.colGap * (grid.cols - 1); // 136mm
        const gridH = grid.cellH * grid.rows + grid.rowGap * (grid.rows - 1); // 184mm
        const startX = (page.width - gridW) / 2; // centered horizontally
        const startY = contentTop + (availableH - gridH) / 2; // centered vertically within content area
        const perPage = grid.cols * grid.rows;
        const pages = Math.max(1, Math.ceil(items.length / perPage));

        const drawHeader = (currentPage)=>{
            // Header: ~20px => ~15pt
            doc.setFont('helvetica','bold');
            doc.setFontSize(15);
            doc.text(String(batchName||'').toUpperCase(), page.width/2, headerY, { align:'center' });
            // Footer page indicator centered (~12px => ~9pt)
            doc.setFont('helvetica','bold');
            doc.setFontSize(9);
            doc.text(`${currentPage}/${pages}`, page.width/2, footerY, { align:'center' });
        };

        const drawCell = (ix, iy, code, amount)=>{
            const x = startX + ix * (grid.cellW + grid.colGap);
            const y = startY + iy * (grid.cellH + grid.rowGap);

            // Centered in the cell: amount on top, code below (both ~10px => ~8pt)
            const centerX = x + grid.cellW / 2;
            const codeY = y + grid.cellH / 2 + 2;
            const amountY = codeY - 6;

            doc.setFont('helvetica','bold');
            doc.setFontSize(8);
            doc.text(String(amount||''), centerX, amountY, { align:'center' });

            doc.setFont('helvetica','bold');
            doc.setFontSize(8);
            doc.text(String(code||'').toUpperCase(), centerX, codeY, { align:'center' });
        };
        items.forEach((item, idx)=>{
            const pageIdx = Math.floor(idx / perPage);
            if(idx % perPage === 0){
                if(pageIdx>0) doc.addPage();
                drawHeader(pageIdx+1);
            }
            const within = idx % perPage;
            const row = Math.floor(within / grid.cols);
            const col = within % grid.cols;
            drawCell(col, row, item.code, `${item.amount.toLocaleString()} RWF`);
        });
        return doc;
    }

    function downloadPDF(batch){
        const items = state.codes.filter(c=>c.batch_id===batch.id);
        const doc = renderCodesPdf({
            batchName: batch.name,
            generatedAt: fmtDateTime(new Date()),
            items
        });
        const ts = new Date();
        const name = formatDownloadName(batch.name, 'pdf', ts);
        doc.save(name);
        toast('PDF download started', 'success');
    }

    function handleDownloadConfirm(){
        // Validate form first
        if (!validateDownloadForm()) {
            return; // Stop if validation fails
        }

        // Get form values
        const batchId = el('downloadBatch').value;
        const format = document.querySelector('input[name="dlFormat"]:checked').value;
        const batch = state.batches.find(b=>b.id===batchId);

        // Start download with progress popup
        downloadCodesWithProgress(format, batch);
    }

    function openDownloadModal(batchId){
        const sel = el('downloadBatch');
        sel.innerHTML = '';
        state.batches.forEach(b=>{
            const opt = document.createElement('option');
            opt.value = b.id; opt.textContent = `${b.name} (${b.total_codes})`;
            sel.appendChild(opt);
        });
        if(batchId){ sel.value = batchId; }
        modal.open();
    }

    // Download Codes with Progress (Separate Popup)
    function downloadCodesWithProgress(format, batch) {
        // Close the download form modal
        closeModal('downloadModal');

        // Open the separate progress modal
        openModal('downloadProgressModal');

        const totalCodes = state.codes.filter(c=>c.batch_id===batch.id).length;

        // Progress animation like Generate Codes
        let processed = 0;
        const start = Date.now();
        const targetMs = Math.min(6000, Math.max(2000, totalCodes * 5)); // 2-6 seconds
        const fill = el('downloadProgressFill');
        const txt = el('downloadProgressText');
        const eta = el('downloadEtaText');

        console.log('Download progress elements:', { fill, txt, eta });

        function tick(){
            const elapsed = Date.now() - start;
            const progress = Math.min(1, elapsed / targetMs);
            processed = Math.floor(totalCodes * progress);
            if(fill) {
                fill.style.width = `${Math.round(progress*100)}%`;
                fill.style.transition = 'width 0.1s ease';
            }
            if(txt) txt.textContent = `${processed.toLocaleString()} of ${totalCodes.toLocaleString()} codes processed`;
            const remaining = Math.max(0, targetMs - elapsed);
            if(eta) eta.textContent = `ETA: ${Math.ceil(remaining/1000)}s`;

            if(progress < 1){
                requestAnimationFrame(tick);
            } else {
                // Ensure progress bar reaches 100%
                if(fill) fill.style.width = '100%';

                // Actually perform the download
                if(format==='csv') {
                    downloadCSV(batch);
                } else {
                    downloadPDF(batch);
                }

                setTimeout(() => {
                    // Show success message
                    showSuccessMessage(`${format.toUpperCase()} file downloaded successfully!`);

                    // Close progress modal
                    closeModal('downloadProgressModal');
                }, 500);
            }
        }
        tick();
    }

    // Validate Download Form
    function validateDownloadForm() {
        const format = document.querySelector('input[name="dlFormat"]:checked');
        const batch = el('downloadBatch').value;

        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        clearFormErrors('downloadModal');

        if (!format) {
            isValid = false;
            errorMessage = 'Please select a download format (PDF or CSV)';
            showFormError('downloadModal', 'format', errorMessage);
        }

        if (!batch) {
            isValid = false;
            errorMessage = 'Please select a batch to download';
            showFormError('downloadModal', 'batch', errorMessage);
        }

        return isValid;
    }

    // Show form error
    function showFormError(modalId, field, message) {
        const modal = document.getElementById(modalId);
        const fieldElement = modal.querySelector(`[name="${field}"], #${field}`);
        if (fieldElement) {
            fieldElement.classList.add('error');
            // Add error message below the field
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '14px';
            errorDiv.style.marginTop = '4px';
            fieldElement.parentNode.appendChild(errorDiv);
        }
    }

    // Clear form errors
    function clearFormErrors(modalId) {
        const modal = document.getElementById(modalId);
        const errorElements = modal.querySelectorAll('.error');
        const errorMessages = modal.querySelectorAll('.error-message');

        errorElements.forEach(el => el.classList.remove('error'));
        errorMessages.forEach(el => el.remove());
    }

    // Import Codes with Progress
    function importCodesWithProgress() {
        const modal = document.getElementById('importModal');
        const progressContainer = modal.querySelector('.progress-container');
        const importBtn = modal.querySelector('#importBtn');
        const cancelBtn = modal.querySelector('#cancelImportBtn');

        // Show progress container
        progressContainer.style.display = 'block';
        importBtn.style.display = 'none';
        cancelBtn.style.display = 'inline-flex';

        // Simulate import progress
        const totalCodes = Math.floor(Math.random() * 500) + 100; // 100-600 codes

        // Progress animation like Generate Codes
        let imported = 0;
        const start = Date.now();
        const targetMs = Math.min(5000, Math.max(2000, totalCodes * 8)); // 2-5 seconds
        const fill = el('importProgressFill');
        const txt = el('importProgressText');
        const eta = el('importEtaText');

        console.log('Import progress elements:', { fill, txt, eta });

        function tick(){
            const elapsed = Date.now() - start;
            const progress = Math.min(1, elapsed / targetMs);
            imported = Math.floor(totalCodes * progress);
            if(fill) {
                fill.style.width = `${Math.round(progress*100)}%`;
                fill.style.transition = 'width 0.1s ease';
            }
            if(txt) txt.textContent = `${imported.toLocaleString()} of ${totalCodes.toLocaleString()} codes imported`;
            const remaining = Math.max(0, targetMs - elapsed);
            if(eta) eta.textContent = `ETA: ${Math.ceil(remaining/1000)}s`;

            if(progress < 1){
                requestAnimationFrame(tick);
            } else {
                // Ensure progress bar reaches 100%
                if(fill) fill.style.width = '100%';

                setTimeout(() => {
                    // Hide progress and show success
                    progressContainer.style.display = 'none';
                    importBtn.style.display = 'inline-flex';
                    cancelBtn.style.display = 'none';

                    // Show success message
                    showSuccessMessage('Codes imported successfully!');

                    // Close modal
                    closeModal('importModal');
                }, 500);
            }
        }
        tick();
    }

    // Success Message Function
    function showSuccessMessage(message) {
        // Create success toast
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
      <div class="toast-content">
        <i data-lucide="check-circle"></i>
        <span>${message}</span>
      </div>
    `;

        // Add to body
        document.body.appendChild(toast);

        // Create icons
        window.lucide.createIcons();

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Toasts
    function toast(msg, type='info'){
        const host = el('toastHost');
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.textContent = msg;
        host.appendChild(t);
        setTimeout(()=>{ t.style.opacity = '0'; t.style.transform = 'translateY(4px)'; }, 2400);
        setTimeout(()=>{ t.remove(); }, 2800);
    }

    // Position a dropdown menu relative to a button without causing viewport scrollbars
    function positionDropdown(anchorBtn, menuEl, alignToColumn = null){
        if(!anchorBtn || !menuEl) return;
        const rect = anchorBtn.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const menuHeight = Math.min(menuEl.offsetHeight || 200, 240);
        const spaceBelow = vh - rect.bottom;
        const openUp = spaceBelow < (menuHeight + 12);

        // If aligning to a specific column, find that column's position
        if(alignToColumn) {
            const table = anchorBtn.closest('table');
            if(table) {
                const headers = table.querySelectorAll('thead th');
                let targetHeader = null;
                for(let i = 0; i < headers.length; i++) {
                    const headerText = headers[i].textContent.trim().toLowerCase();
                    if(headerText.includes(alignToColumn.toLowerCase())) {
                        targetHeader = headers[i];
                        break;
                    }
                }
                if(targetHeader) {
                    const headerRect = targetHeader.getBoundingClientRect();
                    const btnRect = anchorBtn.getBoundingClientRect();
                    const offset = headerRect.left - btnRect.left;
                    // Ensure menu doesn't go too far left and overlap other elements
                    const minLeft = -btnRect.left + 20; // Leave some margin from viewport edge
                    const finalOffset = Math.max(offset, minLeft);
                    menuEl.style.left = `${finalOffset}px`;
                    menuEl.style.right = 'auto';
                    // Reset any existing positioning
                    menuEl.style.transformOrigin = openUp ? 'bottom left' : 'top left';
                }
            }
        } else {
            // Default positioning when not aligning to column
            if(vw - rect.right < 220){
                menuEl.style.right = 'auto';
                menuEl.style.left = '0px';
                menuEl.style.transformOrigin = openUp ? 'bottom left' : 'top left';
            } else {
                menuEl.style.left = 'auto';
                menuEl.style.right = '0px';
                menuEl.style.transformOrigin = openUp ? 'bottom right' : 'top right';
            }
        }

        if(openUp){
            menuEl.style.top = 'auto';
            menuEl.style.bottom = '36px';
        } else {
            menuEl.style.bottom = 'auto';
            menuEl.style.top = '36px';
        }
    }

    // Simulate live monitoring updates
    // Monitoring simulation removed

    // Wire bulk action examples
    function initBulkActions(){
        // legacy buttons may not exist after redesign
        const btnBlock = el('btnBulkBlock');
        const btnDelete = el('btnBulkDelete');
        if(btnBlock){ btnBlock.addEventListener('click',()=>{
            const selected = qsa('#codesTbody input[type="checkbox"]:checked').map(cb=>cb.getAttribute('data-id'));
            if(!selected.length) return toast('No codes selected', 'warn');
            state.codes.forEach(c=>{ if(selected.includes(c.id)) c.status='blocked'; });
            const activeTab = qs('#pcStatusTabs .status-tab.active');
            const st = activeTab ? activeTab.getAttribute('data-status') : '';
            renderCodes(el('codesSearch').value, st);
            toast('Selected codes blocked', 'success');
        }); }
        if(btnDelete){ btnDelete.addEventListener('click',()=>{
            const selected = qsa('#codesTbody input[type="checkbox"]:checked').map(cb=>cb.getAttribute('data-id'));
            if(!selected.length) return toast('No codes selected', 'warn');
            state.codes = state.codes.filter(c=>!selected.includes(c.id));
            const activeTab = qs('#pcStatusTabs .status-tab.active');
            const st = activeTab ? activeTab.getAttribute('data-status') : '';
            renderCodes(el('codesSearch').value, st);
            toast('Selected codes deleted', 'success');
        }); }

        // new unified bulk apply
        const apply = el('pcApplyBulk');
        if(apply){
            apply.addEventListener('click',()=>{
                const action = (el('pcBulkSelect') && el('pcBulkSelect').value) || '';
                const selected = qsa('#codesTbody input[type="checkbox"]:checked').map(cb=>cb.getAttribute('data-id'));
                if(!selected.length) return toast('No codes selected', 'warn');
                if(!action) return toast('Choose bulk action', 'warn');
                if(action==='block'){ state.codes.forEach(c=>{ if(selected.includes(c.id)) c.status='blocked'; }); }
                if(action==='delete'){ state.codes = state.codes.filter(c=>!selected.includes(c.id)); }
                const st = getActiveStatus();
                renderCodes(el('codesSearch').value, st);
                toast(`Bulk ${action} applied`, 'success');
            });
        }

        // pagination controls
        const prev = el('pcPagePrev');
        const next = el('pcPageNext');
        if(prev){ prev.addEventListener('click', ()=>{ if(state.codesPage>1){ state.codesPage -= 1; localStorage.setItem('mbelyco-codes-page', state.codesPage.toString()); renderCodes(el('codesSearch').value, getActiveStatus()); }}); }
        if(next){ next.addEventListener('click', ()=>{ state.codesPage += 1; localStorage.setItem('mbelyco-codes-page', state.codesPage.toString()); renderCodes(el('codesSearch').value, getActiveStatus()); }); }
    }

    // Code row menu interactions
    document.addEventListener('click', (e)=>{
        const copyBtn = e.target.closest('button[data-copy]');
        if(copyBtn){
            const text = copyBtn.getAttribute('data-copy') || '';
            navigator.clipboard && navigator.clipboard.writeText(text).then(()=>{
                toast('Code copied', 'success');
            }).catch(()=>{
                toast('Copy failed', 'error');
            });
            return;
        }
        const more = e.target.closest('button[data-code-more]');
        if(more){
            const codeId = more.getAttribute('data-code-more');
            const menu = el(`code-menu-${codeId}`);
            qsa('.menu.open').forEach(m=>{ if(m!==menu) m.classList.remove('open'); });
            // ensure menu anchor wrapper is positioned
            const wrapper = more.closest('.row-actions');
            if(wrapper) wrapper.style.position = 'relative';
            if(menu){ positionDropdown(more, menu, 'expiration'); }
            if(menu) menu.classList.toggle('open');
            return;
        }

        // close code menus on outside click
        if(!e.target.closest('#codesTbody .row-actions') && !e.target.closest('#codesTbody .menu')){
            qsa('#codesTbody .menu.open').forEach(m=>m.classList.remove('open'));
        }
        const item = e.target.closest('.menu button[data-code-menu]');
        if(item){
            const id = item.getAttribute('data-code');
            const type = item.getAttribute('data-code-menu');
            const menu = el(`code-menu-${id}`);
            if(menu) menu.classList.remove('open');
            if(type==='view'){
                toast(`Viewing code ${id}`);
            } else if(type==='block'){
                const c = state.codes.find(x=>x.id===id);
                if(c){ c.status='blocked'; renderCodes(el('codesSearch').value, getActiveStatus()); }
                toast('Code blocked', 'warn');
            } else if(type==='enable'){
                const c = state.codes.find(x=>x.id===id);
                if(c){ c.status='active'; renderCodes(el('codesSearch').value, getActiveStatus()); }
                toast('Code enabled', 'success');
            } else if(type==='copy'){
                const text = item.getAttribute('data-code') || '';
                navigator.clipboard && navigator.clipboard.writeText(text).then(()=>{
                    toast('Code copied', 'success');
                }).catch(()=> toast('Copy failed', 'error'));
            }
        }
    });

    function initPromoStatusTabs(){
        const tabs = qsa('#pcStatusTabs .status-tab');
        if(!tabs.length) return;
        tabs.forEach(tab=>{
            tab.addEventListener('click',()=>{
                tabs.forEach(t=>t.classList.remove('active'));
                tab.classList.add('active');
                const st = tab.getAttribute('data-status') || '';
                state.codesPage = 1;
                localStorage.setItem('mbelyco-codes-page', '1');
                renderCodes(el('codesSearch').value, st);
            });
        });
        updatePromoCounts();
    }

    function initBatchStatusTabs(){
        const tabs = qsa('#btStatusTabs .status-tab');
        if(!tabs.length) return;
        tabs.forEach(tab=>{
            tab.addEventListener('click',()=>{
                tabs.forEach(t=>t.classList.remove('active'));
                tab.classList.add('active');
                renderBatches(el('batchSearch').value);
            });
        });
        updateBatchCounts();
    }

    // Authentication functions
    function initAuth(){
        // If already authenticated, just set up UI and return
        if (state.isAuthenticated && state.user) {
            updateAuthUI();
            updateFeatureAccess();

            // User menu
            const userToggle = el('userToggle');
            if (userToggle) userToggle.addEventListener('click', toggleUserMenu);
            const logoutBtn = el('logoutBtn');
            if (logoutBtn) logoutBtn.addEventListener('click', logout);

            // Close user menu on outside click
            document.addEventListener('click', (e) => {
                const userMenu = el('userMenu');
                if (userMenu && !userMenu.contains(e.target)) {
                    const dd = el('userDropdown');
                    if (dd) dd.classList.remove('open');
                }
            });
            return;
        }

        // Check for existing session (new + legacy)
        const rawSession = localStorage.getItem('mbelyco-session')
            || sessionStorage.getItem('mbelyco-session')
            || sessionStorage.getItem('loggedInUser'); // legacy fallback

        if (rawSession) {
            try {
                const parsed = JSON.parse(rawSession);
                const hasWrapper = parsed && typeof parsed === 'object' && 'user' in parsed;
                const user = hasWrapper ? parsed.user : parsed;
                const ts = hasWrapper ? parsed.timestamp : Date.now(); // legacy has no timestamp
                // Validate 24h window only if timestamp exists
                if (!hasWrapper || (Date.now() - ts < 24 * 60 * 60 * 1000)) {
                    state.user = user;
                    state.isAuthenticated = true;
                    updateAuthUI();
                    updateFeatureAccess();
                } else {
                    // Session expired, redirect to login
                    redirectToLogin();
                }
            } catch (e) {
                // Invalid session data, redirect to login
                redirectToLogin();
            }
        } else {
            // No session, redirect to login
            redirectToLogin();
        }

        // User menu
        const userToggle = el('userToggle');
        if (userToggle) userToggle.addEventListener('click', toggleUserMenu);
        const logoutBtn = el('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);

        // Close user menu on outside click
        document.addEventListener('click', (e) => {
            const userMenu = el('userMenu');
            if (userMenu && !userMenu.contains(e.target)) {
                const dd = el('userDropdown');
                if (dd) dd.classList.remove('open');
            }
        });
    }

    function redirectToLogin() {
        window.location.href = 'login.html';
    }

    function logout() {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('mbelyco-session');
        sessionStorage.removeItem('mbelyco-session');
        sessionStorage.removeItem('loggedInUser'); // legacy cleanup
        redirectToLogin();
    }

    function updateAuthUI() {
        const userMenu = el('userMenu');
        const userName = el('userName');

        if (state.isAuthenticated) {
            if (userMenu) userMenu.style.display = 'flex';
            if (userName && state.user) userName.textContent = state.user.name;
        } else {
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    function toggleUserMenu(){
        const dropdown = el('userDropdown');
        dropdown.classList.toggle('open');
    }

    function updateFeatureAccess() {
        if (!state.isAuthenticated) {
            return;
        }

        const user = state.user;

        // Enable/disable features based on permissions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.classList.remove('auth-required');
        });

        // Download buttons
        document.querySelectorAll('button[data-action="download"]').forEach(btn => {
            btn.disabled = !user.permissions.includes('download');
            btn.style.opacity = user.permissions.includes('download') ? '1' : '0.5';
        });

        // Generate codes
        const generateCards = document.querySelectorAll('[data-action="generate"]');
        generateCards.forEach(card => {
            if (!user.permissions.includes('create')) {
                card.classList.add('auth-required');
            }
        });

        // Import codes
        const importCards = document.querySelectorAll('[data-action="import"]');
        importCards.forEach(card => {
            if (!user.permissions.includes('import')) {
                card.classList.add('auth-required');
            }
        });
    }

    // Settings functionality
    function initSettings() {

        // Settings navigation
        const settingsNavItems = document.querySelectorAll('.settings-nav-item');
        const settingsPanels = document.querySelectorAll('.settings-panel');

        settingsNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');

                // Add loading state
                const settingsContainer = document.querySelector('.settings-container');
                settingsContainer.classList.add('settings-loading');

                // Update navigation with animation
                settingsNavItems.forEach(nav => {
                    nav.classList.remove('active');
                    nav.setAttribute('aria-selected', 'false');
                });
                item.classList.add('active');
                item.setAttribute('aria-selected', 'true');

                // Update panels with fade animation
                settingsPanels.forEach(panel => {
                    panel.classList.remove('active');
                });

                setTimeout(() => {
                    const targetPanel = document.getElementById(target);
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                        targetPanel.style.animation = 'fadeInUp 0.3s ease';
                    }
                    settingsContainer.classList.remove('settings-loading');
                }, 150);
            });
        });

        // Color picker synchronization
        const colorInputs = document.querySelectorAll('input[type="color"]');
        colorInputs.forEach(colorInput => {
            const textInput = document.getElementById(colorInput.id + 'Text');
            if (textInput) {
                colorInput.addEventListener('input', () => {
                    textInput.value = colorInput.value;
                    updateThemeColors();
                });
                textInput.addEventListener('input', () => {
                    if (/^#[0-9A-F]{6}$/i.test(textInput.value)) {
                        colorInput.value = textInput.value;
                        updateThemeColors();
                    }
                });
            }
        });

        // Range slider value display
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(rangeInput => {
            const valueDisplay = rangeInput.parentElement.querySelector('.range-value');
            if (valueDisplay) {
                rangeInput.addEventListener('input', () => {
                    valueDisplay.textContent = rangeInput.value + 'px';
                });
            }
        });

        // Save settings
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveSettings);
        }

        // Reset settings
        const resetBtn = document.getElementById('resetSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetSettings);
        }

        // Export settings
        const exportBtn = document.getElementById('exportSettings');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportSettings);
        }

        // Import settings
        const importInput = document.getElementById('importSettings');
        if (importInput) {
            importInput.addEventListener('change', importSettings);
        }

        // Settings search functionality
        const searchInput = document.getElementById('settingsSearch');
        const clearSearchBtn = document.getElementById('clearSearch');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const navItems = document.querySelectorAll('.settings-nav-item');

                if (query.length > 0) {
                    clearSearchBtn.style.display = 'flex';

                    navItems.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        const icon = item.querySelector('i').getAttribute('data-lucide');

                        if (text.includes(query) || icon.includes(query)) {
                            item.style.display = 'flex';
                            item.style.animation = 'slideInRight 0.3s ease';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                } else {
                    clearSearchBtn.style.display = 'none';
                    navItems.forEach(item => {
                        item.style.display = 'flex';
                        item.style.animation = 'none';
                    });
                }
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                clearSearchBtn.style.display = 'none';
                const navItems = document.querySelectorAll('.settings-nav-item');
                navItems.forEach(item => {
                    item.style.display = 'flex';
                    item.style.animation = 'none';
                });
            });
        }

        // Enhanced form validation
        initFormValidation();

        // Initialize role permissions
        initRolePermissions();

        // Load saved settings
        loadSettings();
    }

    function updateThemeColors() {
        const primaryColor = document.getElementById('primaryColor')?.value || '#15a000';
        const secondaryColor = document.getElementById('secondaryColor')?.value || '#0f7a00';
        const accentColor = document.getElementById('accentColor')?.value || '#15a000';

        document.documentElement.style.setProperty('--color-primary', primaryColor);
        document.documentElement.style.setProperty('--color-primary-2', secondaryColor);
        document.documentElement.style.setProperty('--color-accent', accentColor);
    }

    function saveSettings() {
        const saveBtn = document.getElementById('saveSettings');
        const originalText = saveBtn.textContent;

        // Add loading state
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        saveBtn.classList.add('settings-loading');

        // Simulate save delay for better UX
        setTimeout(() => {
            const settings = {
                branding: {
                    companyName: document.getElementById('companyName')?.value || 'MBELYCO',
                    companyTagline: document.getElementById('companyTagline')?.value || 'Promo Code Management System',
                    companyEmail: document.getElementById('companyEmail')?.value || 'contact@mbelyco.com',
                    companyPhone: document.getElementById('companyPhone')?.value || '+250 788 123 456',
                    primaryColor: document.getElementById('primaryColor')?.value || '#15a000',
                    secondaryColor: document.getElementById('secondaryColor')?.value || '#0f7a00',
                    accentColor: document.getElementById('accentColor')?.value || '#15a000',
                    primaryFont: document.getElementById('primaryFont')?.value || 'Montserrat',
                    bodyFontSize: document.getElementById('bodyFontSize')?.value || '16'
                },
                ussd: {
                    ussdCode: document.getElementById('ussdCode')?.value || '*123#',
                    ussdProvider: document.getElementById('ussdProvider')?.value || 'mtn',
                    ussdTimeout: document.getElementById('ussdTimeout')?.value || '30',
                    ussdMaxRetries: document.getElementById('ussdMaxRetries')?.value || '3',
                    welcomeMessage: document.getElementById('welcomeMessage')?.value || 'Welcome to MBELYCO Promo Codes!',
                    errorMessage: document.getElementById('errorMessage')?.value || 'Invalid input. Please try again.',
                    successMessage: document.getElementById('successMessage')?.value || 'Operation completed successfully!',
                    requirePin: document.getElementById('requirePin')?.checked || false,
                    enableRateLimit: document.getElementById('enableRateLimit')?.checked || true,
                    rateLimitRequests: document.getElementById('rateLimitRequests')?.value || '10',
                    ussdApiUrl: document.getElementById('ussdApiUrl')?.value || 'https://api.mbelyco.com/ussd',
                    ussdApiKey: document.getElementById('ussdApiKey')?.value || '',
                    enableUssdLogging: document.getElementById('enableUssdLogging')?.checked || true
                },
                payments: {
                    momoBaseUrl: document.getElementById('momoBaseUrl')?.value || 'https://sandbox.momodeveloper.mtn.com',
                    momoApiUser: document.getElementById('momoApiUser')?.value || '',
                    momoApiKey: document.getElementById('momoApiKey')?.value || '',
                    momoSubscriptionKey: document.getElementById('momoSubscriptionKey')?.value || '',
                    momoEnvironment: document.getElementById('momoEnvironment')?.value || 'sandbox',
                    momoCurrency: document.getElementById('momoCurrency')?.value || 'RWF',
                    momoMaxAmount: document.getElementById('momoMaxAmount')?.value || '100000',
                    momoMinAmount: document.getElementById('momoMinAmount')?.value || '100',
                    autoRetryEnabled: document.getElementById('autoRetryEnabled')?.checked || true,
                    maxRetryAttempts: document.getElementById('maxRetryAttempts')?.value || '3',
                    manualApprovalRequired: document.getElementById('manualApprovalRequired')?.checked || false,
                    approvalThreshold: document.getElementById('approvalThreshold')?.value || '50000',
                    dailyTransactionLimit: document.getElementById('dailyTransactionLimit')?.value || '1000000',
                    monthlyTransactionLimit: document.getElementById('monthlyTransactionLimit')?.value || '30000000',
                    perUserDailyLimit: document.getElementById('perUserDailyLimit')?.value || '100000',
                    perUserMonthlyLimit: document.getElementById('perUserMonthlyLimit')?.value || '3000000'
                },
                business: {
                    codeFormat: document.getElementById('codeFormat')?.value || 'XXXX-XXYY-XXMM-XXDD',
                    codeLength: document.getElementById('codeLength')?.value || '16',
                    characterSet: document.getElementById('characterSet')?.value || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                    codePrefix: document.getElementById('codePrefix')?.value || 'MBL',
                    codeSuffix: document.getElementById('codeSuffix')?.value || '',
                    codeSeparator: document.getElementById('codeSeparator')?.value || '-',
                    includeTimestamp: document.getElementById('includeTimestamp')?.checked || true,
                    includeChecksum: document.getElementById('includeChecksum')?.checked || false,
                    formatValidation: document.getElementById('formatValidation')?.checked || true,
                    uniquenessCheck: document.getElementById('uniquenessCheck')?.checked || true,
                    expirationCheck: document.getElementById('expirationCheck')?.checked || true,
                    statusCheck: document.getElementById('statusCheck')?.checked || true,
                    batchValidation: document.getElementById('batchValidation')?.checked || true,
                    defaultExpirationDays: document.getElementById('defaultExpirationDays')?.value || '30',
                    maxExpirationDays: document.getElementById('maxExpirationDays')?.value || '365',
                    minExpirationDays: document.getElementById('minExpirationDays')?.value || '1',
                    autoExpireEnabled: document.getElementById('autoExpireEnabled')?.checked || true,
                    gracePeriodHours: document.getElementById('gracePeriodHours')?.value || '24',
                    allowMultipleRedemptions: document.getElementById('allowMultipleRedemptions')?.checked || false,
                    maxRedemptionsPerUser: document.getElementById('maxRedemptionsPerUser')?.value || '1',
                    maxRedemptionsPerCode: document.getElementById('maxRedemptionsPerCode')?.value || '1',
                    cooldownPeriodMinutes: document.getElementById('cooldownPeriodMinutes')?.value || '60',
                    fraudDetectionEnabled: document.getElementById('fraudDetectionEnabled')?.checked || true
                },
                security: {
                    sessionTimeout: document.getElementById('sessionTimeout')?.value || '60',
                    maxLoginAttempts: document.getElementById('maxLoginAttempts')?.value || '5',
                    lockoutDuration: document.getElementById('lockoutDuration')?.value || '15',
                    twoFactorEnabled: document.getElementById('twoFactorEnabled')?.checked || false,
                    twoFactorRequired: document.getElementById('twoFactorRequired')?.checked || false,
                    minPasswordLength: document.getElementById('minPasswordLength')?.value || '8',
                    requireUppercase: document.getElementById('requireUppercase')?.checked || true,
                    requireLowercase: document.getElementById('requireLowercase')?.checked || true,
                    requireNumbers: document.getElementById('requireNumbers')?.checked || true,
                    requireSpecialChars: document.getElementById('requireSpecialChars')?.checked || false,
                    passwordMaxAge: document.getElementById('passwordMaxAge')?.value || '90',
                    apiRequestsPerMinute: document.getElementById('apiRequestsPerMinute')?.value || '60',
                    apiRequestsPerHour: document.getElementById('apiRequestsPerHour')?.value || '1000',
                    ussdRequestsPerMinute: document.getElementById('ussdRequestsPerMinute')?.value || '30',
                    ussdRequestsPerHour: document.getElementById('ussdRequestsPerHour')?.value || '500',
                    loginAttemptsPerMinute: document.getElementById('loginAttemptsPerMinute')?.value || '5',
                    fileUploadsPerHour: document.getElementById('fileUploadsPerHour')?.value || '10',
                    ipWhitelist: document.getElementById('ipWhitelist')?.value || '',
                    ipBlacklist: document.getElementById('ipBlacklist')?.value || '',
                    timeBasedAccess: document.getElementById('timeBasedAccess')?.checked || false,
                    allowedHours: document.getElementById('allowedHours')?.value || '08:00-18:00',
                    timezone: document.getElementById('timezone')?.value || 'Africa/Kigali',
                    logAllActions: document.getElementById('logAllActions')?.checked || true,
                    logFailedAttempts: document.getElementById('logFailedAttempts')?.checked || true,
                    logDataChanges: document.getElementById('logDataChanges')?.checked || true,
                    retentionDays: document.getElementById('retentionDays')?.value || '90',
                    realTimeAlerts: document.getElementById('realTimeAlerts')?.checked || true
                },
                notifications: {
                    emailEnabled: document.getElementById('emailEnabled')?.checked || true,
                    emailProvider: document.getElementById('emailProvider')?.value || 'smtp',
                    smtpHost: document.getElementById('smtpHost')?.value || '',
                    smtpPort: document.getElementById('smtpPort')?.value || '587',
                    smtpUsername: document.getElementById('smtpUsername')?.value || '',
                    smtpPassword: document.getElementById('smtpPassword')?.value || '',
                    smtpSecure: document.getElementById('smtpSecure')?.checked || true,
                    fromEmail: document.getElementById('fromEmail')?.value || 'noreply@mbelyco.com',
                    fromName: document.getElementById('fromName')?.value || 'MBELYCO System',
                    replyTo: document.getElementById('replyTo')?.value || 'support@mbelyco.com',
                    smsEnabled: document.getElementById('smsEnabled')?.checked || true,
                    smsProvider: document.getElementById('smsProvider')?.value || 'africas_talking',
                    smsApiKey: document.getElementById('smsApiKey')?.value || '',
                    smsUsername: document.getElementById('smsUsername')?.value || '',
                    fromNumber: document.getElementById('fromNumber')?.value || '+250788123456',
                    webhooksEnabled: document.getElementById('webhooksEnabled')?.checked || false,
                    webhookUrl: document.getElementById('webhookUrl')?.value || '',
                    webhookSecret: document.getElementById('webhookSecret')?.value || '',
                    webhookRetryAttempts: document.getElementById('webhookRetryAttempts')?.value || '3',
                    lowBalanceAlert: document.getElementById('lowBalanceAlert')?.checked || true,
                    lowBalanceThreshold: document.getElementById('lowBalanceThreshold')?.value || '100000',
                    lowBalanceRecipients: document.getElementById('lowBalanceRecipients')?.value || '',
                    highFailureRateAlert: document.getElementById('highFailureRateAlert')?.checked || true,
                    failureRateThreshold: document.getElementById('failureRateThreshold')?.value || '10',
                    systemDownAlert: document.getElementById('systemDownAlert')?.checked || true,
                    systemDownRecipients: document.getElementById('systemDownRecipients')?.value || ''
                },
                'sms-email': {
                    emailEnabled: document.getElementById('emailEnabled')?.checked || true,
                    emailProvider: document.getElementById('emailProvider')?.value || 'smtp',
                    smtpHost: document.getElementById('smtpHost')?.value || 'smtp.gmail.com',
                    smtpPort: document.getElementById('smtpPort')?.value || '587',
                    smtpUsername: document.getElementById('smtpUsername')?.value || '',
                    smtpPassword: document.getElementById('smtpPassword')?.value || '',
                    smtpSecure: document.getElementById('smtpSecure')?.checked || true,
                    fromEmail: document.getElementById('fromEmail')?.value || 'noreply@mbelyco.com',
                    fromName: document.getElementById('fromName')?.value || 'MBELYCO System',
                    replyTo: document.getElementById('replyTo')?.value || 'support@mbelyco.com',
                    smsEnabled: document.getElementById('smsEnabled')?.checked || true,
                    smsProvider: document.getElementById('smsProvider')?.value || 'africas_talking',
                    smsApiKey: document.getElementById('smsApiKey')?.value || '',
                    smsUsername: document.getElementById('smsUsername')?.value || '',
                    fromNumber: document.getElementById('fromNumber')?.value || '+250788123456',
                    welcomeEmailTemplate: document.getElementById('welcomeEmailTemplate')?.value || '',
                    promoCodeEmailTemplate: document.getElementById('promoCodeEmailTemplate')?.value || '',
                    passwordResetEmailTemplate: document.getElementById('passwordResetEmailTemplate')?.value || '',
                    welcomeSmsTemplate: document.getElementById('welcomeSmsTemplate')?.value || '',
                    promoCodeSmsTemplate: document.getElementById('promoCodeSmsTemplate')?.value || '',
                    otpSmsTemplate: document.getElementById('otpSmsTemplate')?.value || '',
                    emailRetryAttempts: document.getElementById('emailRetryAttempts')?.value || '3',
                    smsRetryAttempts: document.getElementById('smsRetryAttempts')?.value || '3',
                    emailDelaySeconds: document.getElementById('emailDelaySeconds')?.value || '5',
                    smsDelaySeconds: document.getElementById('smsDelaySeconds')?.value || '2',
                    queueMessages: document.getElementById('queueMessages')?.checked || true,
                    trackDelivery: document.getElementById('trackDelivery')?.checked || true
                },
                integrations: {
                    apiBaseUrl: document.getElementById('apiBaseUrl')?.value || 'https://api.mbelyco.com',
                    apiVersion: document.getElementById('apiVersion')?.value || 'v1',
                    apiRateLimiting: document.getElementById('apiRateLimiting')?.checked || true,
                    apiRequestsPerMinute: document.getElementById('apiRequestsPerMinute')?.value || '100',
                    apiRequestsPerHour: document.getElementById('apiRequestsPerHour')?.value || '1000',
                    apiAuthType: document.getElementById('apiAuthType')?.value || 'jwt',
                    corsEnabled: document.getElementById('corsEnabled')?.checked || true,
                    allowedOrigins: document.getElementById('allowedOrigins')?.value || '',
                    allowedMethods: document.getElementById('allowedMethods')?.value || 'GET,POST,PUT,DELETE',
                    allowedHeaders: document.getElementById('allowedHeaders')?.value || 'Content-Type,Authorization',
                    paymentGatewayEnabled: document.getElementById('paymentGatewayEnabled')?.checked || true,
                    paymentGatewayName: document.getElementById('paymentGatewayName')?.value || 'MTN MoMo',
                    paymentGatewayApiKey: document.getElementById('paymentGatewayApiKey')?.value || '',
                    smsGatewayEnabled: document.getElementById('smsGatewayEnabled')?.checked || true,
                    smsGatewayName: document.getElementById('smsGatewayName')?.value || 'Africa\'s Talking',
                    smsGatewayApiKey: document.getElementById('smsGatewayApiKey')?.value || '',
                    emailServiceEnabled: document.getElementById('emailServiceEnabled')?.checked || true,
                    emailServiceName: document.getElementById('emailServiceName')?.value || 'SendGrid',
                    emailServiceApiKey: document.getElementById('emailServiceApiKey')?.value || '',
                    dataSyncEnabled: document.getElementById('dataSyncEnabled')?.checked || false,
                    syncFrequency: document.getElementById('syncFrequency')?.value || 'daily',
                    syncDirection: document.getElementById('syncDirection')?.value || 'inbound',
                    syncEndpoint: document.getElementById('syncEndpoint')?.value || '',
                    syncApiKey: document.getElementById('syncApiKey')?.value || ''
                },
                backup: {
                    databaseBackupEnabled: document.getElementById('databaseBackupEnabled')?.checked || true,
                    backupFrequency: document.getElementById('backupFrequency')?.value || 'daily',
                    backupRetention: document.getElementById('backupRetention')?.value || '30',
                    backupCompression: document.getElementById('backupCompression')?.checked || true,
                    backupEncryption: document.getElementById('backupEncryption')?.checked || true,
                    backupStorage: document.getElementById('backupStorage')?.value || 'local',
                    backupStoragePath: document.getElementById('backupStoragePath')?.value || '/backups',
                    fileBackupEnabled: document.getElementById('fileBackupEnabled')?.checked || true,
                    fileBackupFrequency: document.getElementById('fileBackupFrequency')?.value || 'daily',
                    fileBackupRetention: document.getElementById('fileBackupRetention')?.value || '90',
                    includeUploads: document.getElementById('includeUploads')?.checked || true,
                    includeLogs: document.getElementById('includeLogs')?.checked || false,
                    includeConfig: document.getElementById('includeConfig')?.checked || true,
                    maintenanceEnabled: document.getElementById('maintenanceEnabled')?.checked || true,
                    maintenanceDay: document.getElementById('maintenanceDay')?.value || 'saturday',
                    maintenanceTime: document.getElementById('maintenanceTime')?.value || '02:00',
                    maintenanceTimezone: document.getElementById('maintenanceTimezone')?.value || 'Africa/Kigali',
                    cleanupLogs: document.getElementById('cleanupLogs')?.checked || true,
                    optimizeDatabase: document.getElementById('optimizeDatabase')?.checked || true,
                    clearCache: document.getElementById('clearCache')?.checked || true,
                    updateStatistics: document.getElementById('updateStatistics')?.checked || true,
                    beforeMaintenanceNotification: document.getElementById('beforeMaintenanceNotification')?.checked || true,
                    afterMaintenanceNotification: document.getElementById('afterMaintenanceNotification')?.checked || true,
                    failureNotification: document.getElementById('failureNotification')?.checked || true,
                    maintenanceRecipients: document.getElementById('maintenanceRecipients')?.value || '',
                    monitoringEnabled: document.getElementById('monitoringEnabled')?.checked || true,
                    databaseMonitoring: document.getElementById('databaseMonitoring')?.checked || true,
                    redisMonitoring: document.getElementById('redisMonitoring')?.checked || true,
                    externalApisMonitoring: document.getElementById('externalApisMonitoring')?.checked || true,
                    diskSpaceMonitoring: document.getElementById('diskSpaceMonitoring')?.checked || true,
                    memoryUsageMonitoring: document.getElementById('memoryUsageMonitoring')?.checked || true,
                    diskSpaceThreshold: document.getElementById('diskSpaceThreshold')?.value || '80',
                    memoryUsageThreshold: document.getElementById('memoryUsageThreshold')?.value || '85',
                    responseTimeThreshold: document.getElementById('responseTimeThreshold')?.value || '5000',
                    emailAlerts: document.getElementById('emailAlerts')?.checked || true,
                    smsAlerts: document.getElementById('smsAlerts')?.checked || false,
                    webhookAlerts: document.getElementById('webhookAlerts')?.checked || false,
                    alertRecipients: document.getElementById('alertRecipients')?.value || ''
                },
                permissions: {
                    requireRoleApproval: document.getElementById('requireRoleApproval')?.checked || true,
                    autoExpireRoles: document.getElementById('autoExpireRoles')?.checked || false,
                    roleExpirationDays: document.getElementById('roleExpirationDays')?.value || '90',
                    logRoleChanges: document.getElementById('logRoleChanges')?.checked || true,
                    roleChangeNotification: document.getElementById('roleChangeNotification')?.value || 'elysembonye@gmail.com'
                }
            };

            localStorage.setItem('mbelyco-settings', JSON.stringify(settings));

            // Add success state
            saveBtn.textContent = 'Saved!';
            saveBtn.classList.remove('settings-loading');
            saveBtn.classList.add('settings-success');

            // Show success toast
            toast('Settings saved successfully!', 'success');

            // Reset button after delay
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
                saveBtn.classList.remove('settings-success');
            }, 2000);
        }, 800);
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('mbelyco-settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);

                // Load all settings categories
                const categories = ['branding', 'ussd', 'payments', 'business', 'security', 'sms-email', 'notifications', 'integrations', 'backup', 'permissions'];

                categories.forEach(category => {
                    if (settings[category]) {
                        Object.keys(settings[category]).forEach(key => {
                            const element = document.getElementById(key);
                            if (element) {
                                if (element.type === 'checkbox') {
                                    element.checked = settings[category][key];
                                } else {
                                    element.value = settings[category][key];
                                }
                            }
                        });
                    }
                });

                updateThemeColors();
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
    }

    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
            const resetBtn = document.getElementById('resetSettings');
            const originalText = resetBtn.textContent;

            // Add loading state
            resetBtn.textContent = 'Resetting...';
            resetBtn.disabled = true;
            resetBtn.classList.add('settings-loading');

            setTimeout(() => {
                localStorage.removeItem('mbelyco-settings');

                // Reset form values to defaults with animation
                const formElements = [
                    // Branding
                    { id: 'companyName', value: 'MBELYCO' },
                    { id: 'companyTagline', value: 'Promo Code Management System' },
                    { id: 'companyEmail', value: 'contact@mbelyco.com' },
                    { id: 'companyPhone', value: '+250 788 123 456' },
                    { id: 'primaryColor', value: '#15a000' },
                    { id: 'secondaryColor', value: '#0f7a00' },
                    { id: 'accentColor', value: '#15a000' },
                    { id: 'primaryFont', value: 'Montserrat' },
                    { id: 'bodyFontSize', value: '16' },
                    // USSD
                    { id: 'ussdCode', value: '*123#' },
                    { id: 'ussdProvider', value: 'mtn' },
                    { id: 'ussdTimeout', value: '30' },
                    { id: 'ussdMaxRetries', value: '3' },
                    { id: 'welcomeMessage', value: 'Welcome to MBELYCO Promo Codes!\n1. Check Balance\n2. Redeem Code\n3. Help\n0. Exit' },
                    { id: 'errorMessage', value: 'Invalid input. Please try again.\nPress 0 to go back.' },
                    { id: 'successMessage', value: 'Operation completed successfully!\nThank you for using MBELYCO!' },
                    { id: 'rateLimitRequests', value: '10' },
                    { id: 'ussdApiUrl', value: 'https://api.mbelyco.com/ussd' },
                    { id: 'ussdApiKey', value: '' },
                    // Payments
                    { id: 'momoBaseUrl', value: 'https://sandbox.momodeveloper.mtn.com' },
                    { id: 'momoApiUser', value: '' },
                    { id: 'momoApiKey', value: '' },
                    { id: 'momoSubscriptionKey', value: '' },
                    { id: 'momoEnvironment', value: 'sandbox' },
                    { id: 'momoCurrency', value: 'RWF' },
                    { id: 'momoMaxAmount', value: '100000' },
                    { id: 'momoMinAmount', value: '100' },
                    { id: 'maxRetryAttempts', value: '3' },
                    { id: 'approvalThreshold', value: '50000' },
                    { id: 'dailyTransactionLimit', value: '1000000' },
                    { id: 'monthlyTransactionLimit', value: '30000000' },
                    { id: 'perUserDailyLimit', value: '100000' },
                    { id: 'perUserMonthlyLimit', value: '3000000' },
                    // Business Logic
                    { id: 'codeFormat', value: 'XXXX-XXYY-XXMM-XXDD' },
                    { id: 'codeLength', value: '16' },
                    { id: 'characterSet', value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
                    { id: 'codePrefix', value: 'MBL' },
                    { id: 'codeSuffix', value: '' },
                    { id: 'codeSeparator', value: '-' },
                    { id: 'defaultExpirationDays', value: '30' },
                    { id: 'maxExpirationDays', value: '365' },
                    { id: 'minExpirationDays', value: '1' },
                    { id: 'gracePeriodHours', value: '24' },
                    { id: 'maxRedemptionsPerUser', value: '1' },
                    { id: 'maxRedemptionsPerCode', value: '1' },
                    { id: 'cooldownPeriodMinutes', value: '60' },
                    // Security
                    { id: 'sessionTimeout', value: '60' },
                    { id: 'maxLoginAttempts', value: '5' },
                    { id: 'lockoutDuration', value: '15' },
                    { id: 'minPasswordLength', value: '8' },
                    { id: 'passwordMaxAge', value: '90' },
                    { id: 'apiRequestsPerMinute', value: '60' },
                    { id: 'apiRequestsPerHour', value: '1000' },
                    { id: 'ussdRequestsPerMinute', value: '30' },
                    { id: 'ussdRequestsPerHour', value: '500' },
                    { id: 'loginAttemptsPerMinute', value: '5' },
                    { id: 'fileUploadsPerHour', value: '10' },
                    { id: 'ipWhitelist', value: '' },
                    { id: 'ipBlacklist', value: '' },
                    { id: 'allowedHours', value: '08:00-18:00' },
                    { id: 'timezone', value: 'Africa/Kigali' },
                    { id: 'retentionDays', value: '90' },
                    // Notifications
                    { id: 'emailProvider', value: 'smtp' },
                    { id: 'smtpHost', value: '' },
                    { id: 'smtpPort', value: '587' },
                    { id: 'smtpUsername', value: '' },
                    { id: 'smtpPassword', value: '' },
                    { id: 'fromEmail', value: 'noreply@mbelyco.com' },
                    { id: 'fromName', value: 'MBELYCO System' },
                    { id: 'replyTo', value: 'support@mbelyco.com' },
                    { id: 'smsProvider', value: 'africas_talking' },
                    { id: 'smsApiKey', value: '' },
                    { id: 'smsUsername', value: '' },
                    { id: 'fromNumber', value: '+250788123456' },
                    { id: 'webhookUrl', value: '' },
                    { id: 'webhookSecret', value: '' },
                    { id: 'webhookRetryAttempts', value: '3' },
                    { id: 'lowBalanceThreshold', value: '100000' },
                    { id: 'lowBalanceRecipients', value: '' },
                    { id: 'failureRateThreshold', value: '10' },
                    { id: 'systemDownRecipients', value: '' },
                    // SMS and E-mail
                    { id: 'smtpHost', value: 'smtp.gmail.com' },
                    { id: 'smtpPort', value: '587' },
                    { id: 'smtpUsername', value: '' },
                    { id: 'smtpPassword', value: '' },
                    { id: 'fromEmail', value: 'noreply@mbelyco.com' },
                    { id: 'fromName', value: 'MBELYCO System' },
                    { id: 'replyTo', value: 'support@mbelyco.com' },
                    { id: 'smsApiKey', value: '' },
                    { id: 'smsUsername', value: '' },
                    { id: 'fromNumber', value: '+250788123456' },
                    { id: 'welcomeEmailTemplate', value: 'Welcome to MBELYCO!\n\nYour account has been created successfully. You can now access the system and manage promo codes.\n\nBest regards,\nMBELYCO Team' },
                    { id: 'promoCodeEmailTemplate', value: 'Hello {{user_name}},\n\nYour promo code {{promo_code}} is ready for use!\n\nAmount: {{amount}} RWF\nExpires: {{expiration_date}}\n\nThank you for using MBELYCO!' },
                    { id: 'passwordResetEmailTemplate', value: 'Hello {{user_name}},\n\nYou requested a password reset. Click the link below to reset your password:\n\n{{reset_link}}\n\nThis link will expire in 24 hours.\n\nIf you didn\'t request this, please ignore this email.' },
                    { id: 'welcomeSmsTemplate', value: 'Welcome to MBELYCO! Your account is ready. Start managing promo codes now!' },
                    { id: 'promoCodeSmsTemplate', value: 'Your promo code {{promo_code}} is ready! Amount: {{amount}} RWF. Expires: {{expiration_date}}' },
                    { id: 'otpSmsTemplate', value: 'Your MBELYCO OTP code is: {{otp_code}}. Valid for 5 minutes.' },
                    { id: 'emailRetryAttempts', value: '3' },
                    { id: 'smsRetryAttempts', value: '3' },
                    { id: 'emailDelaySeconds', value: '5' },
                    { id: 'smsDelaySeconds', value: '2' },
                    // Integrations
                    { id: 'apiBaseUrl', value: 'https://api.mbelyco.com' },
                    { id: 'apiVersion', value: 'v1' },
                    { id: 'apiRequestsPerMinute', value: '100' },
                    { id: 'apiRequestsPerHour', value: '1000' },
                    { id: 'apiAuthType', value: 'jwt' },
                    { id: 'allowedOrigins', value: '' },
                    { id: 'allowedMethods', value: 'GET,POST,PUT,DELETE' },
                    { id: 'allowedHeaders', value: 'Content-Type,Authorization' },
                    { id: 'paymentGatewayName', value: 'MTN MoMo' },
                    { id: 'paymentGatewayApiKey', value: '' },
                    { id: 'smsGatewayName', value: 'Africa\'s Talking' },
                    { id: 'smsGatewayApiKey', value: '' },
                    { id: 'emailServiceName', value: 'SendGrid' },
                    { id: 'emailServiceApiKey', value: '' },
                    { id: 'syncFrequency', value: 'daily' },
                    { id: 'syncDirection', value: 'inbound' },
                    { id: 'syncEndpoint', value: '' },
                    { id: 'syncApiKey', value: '' },
                    // Backup
                    { id: 'backupFrequency', value: 'daily' },
                    { id: 'backupRetention', value: '30' },
                    { id: 'backupStorage', value: 'local' },
                    { id: 'backupStoragePath', value: '/backups' },
                    { id: 'fileBackupFrequency', value: 'daily' },
                    { id: 'fileBackupRetention', value: '90' },
                    { id: 'maintenanceDay', value: 'saturday' },
                    { id: 'maintenanceTime', value: '02:00' },
                    { id: 'maintenanceTimezone', value: 'Africa/Kigali' },
                    { id: 'maintenanceRecipients', value: '' },
                    { id: 'diskSpaceThreshold', value: '80' },
                    { id: 'memoryUsageThreshold', value: '85' },
                    { id: 'responseTimeThreshold', value: '5000' },
                    { id: 'alertRecipients', value: '' },
                    // Permissions
                    { id: 'roleExpirationDays', value: '90' },
                    { id: 'roleChangeNotification', value: 'elysembonye@gmail.com' }
                ];

                const checkboxElements = [
                    // USSD
                    { id: 'requirePin', checked: false },
                    { id: 'enableRateLimit', checked: true },
                    { id: 'enableUssdLogging', checked: true },
                    // Payments
                    { id: 'autoRetryEnabled', checked: true },
                    { id: 'manualApprovalRequired', checked: false },
                    // Business Logic
                    { id: 'includeTimestamp', checked: true },
                    { id: 'includeChecksum', checked: false },
                    { id: 'formatValidation', checked: true },
                    { id: 'uniquenessCheck', checked: true },
                    { id: 'expirationCheck', checked: true },
                    { id: 'statusCheck', checked: true },
                    { id: 'batchValidation', checked: true },
                    { id: 'autoExpireEnabled', checked: true },
                    { id: 'allowMultipleRedemptions', checked: false },
                    { id: 'fraudDetectionEnabled', checked: true },
                    // Security
                    { id: 'twoFactorEnabled', checked: false },
                    { id: 'twoFactorRequired', checked: false },
                    { id: 'requireUppercase', checked: true },
                    { id: 'requireLowercase', checked: true },
                    { id: 'requireNumbers', checked: true },
                    { id: 'requireSpecialChars', checked: false },
                    { id: 'timeBasedAccess', checked: false },
                    { id: 'logAllActions', checked: true },
                    { id: 'logFailedAttempts', checked: true },
                    { id: 'logDataChanges', checked: true },
                    { id: 'realTimeAlerts', checked: true },
                    // Notifications
                    { id: 'emailEnabled', checked: true },
                    { id: 'smtpSecure', checked: true },
                    { id: 'smsEnabled', checked: true },
                    { id: 'webhooksEnabled', checked: false },
                    { id: 'lowBalanceAlert', checked: true },
                    { id: 'highFailureRateAlert', checked: true },
                    { id: 'systemDownAlert', checked: true },
                    // SMS and E-mail
                    { id: 'emailEnabled', checked: true },
                    { id: 'smtpSecure', checked: true },
                    { id: 'smsEnabled', checked: true },
                    { id: 'queueMessages', checked: true },
                    { id: 'trackDelivery', checked: true },
                    // Integrations
                    { id: 'apiRateLimiting', checked: true },
                    { id: 'corsEnabled', checked: true },
                    { id: 'paymentGatewayEnabled', checked: true },
                    { id: 'smsGatewayEnabled', checked: true },
                    { id: 'emailServiceEnabled', checked: true },
                    { id: 'dataSyncEnabled', checked: false },
                    // Backup
                    { id: 'databaseBackupEnabled', checked: true },
                    { id: 'backupCompression', checked: true },
                    { id: 'backupEncryption', checked: true },
                    { id: 'fileBackupEnabled', checked: true },
                    { id: 'includeUploads', checked: true },
                    { id: 'includeLogs', checked: false },
                    { id: 'includeConfig', checked: true },
                    { id: 'maintenanceEnabled', checked: true },
                    { id: 'cleanupLogs', checked: true },
                    { id: 'optimizeDatabase', checked: true },
                    { id: 'clearCache', checked: true },
                    { id: 'updateStatistics', checked: true },
                    { id: 'beforeMaintenanceNotification', checked: true },
                    { id: 'afterMaintenanceNotification', checked: true },
                    { id: 'failureNotification', checked: true },
                    { id: 'monitoringEnabled', checked: true },
                    { id: 'databaseMonitoring', checked: true },
                    { id: 'redisMonitoring', checked: true },
                    { id: 'externalApisMonitoring', checked: true },
                    { id: 'diskSpaceMonitoring', checked: true },
                    { id: 'memoryUsageMonitoring', checked: true },
                    { id: 'emailAlerts', checked: true },
                    { id: 'smsAlerts', checked: false },
                    { id: 'webhookAlerts', checked: false },
                    // Permissions
                    { id: 'requireRoleApproval', checked: true },
                    { id: 'autoExpireRoles', checked: false },
                    { id: 'logRoleChanges', checked: true }
                ];

                formElements.forEach(({ id, value }, index) => {
                    setTimeout(() => {
                        const element = document.getElementById(id);
                        if (element) {
                            element.value = value;
                            element.style.transform = 'scale(0.95)';
                            element.style.transition = 'transform 0.2s ease';
                            setTimeout(() => {
                                element.style.transform = 'scale(1)';
                            }, 100);
                        }
                    }, index * 50);
                });

                checkboxElements.forEach(({ id, checked }, index) => {
                    setTimeout(() => {
                        const element = document.getElementById(id);
                        if (element) {
                            element.checked = checked;
                            element.style.transform = 'scale(0.95)';
                            element.style.transition = 'transform 0.2s ease';
                            setTimeout(() => {
                                element.style.transform = 'scale(1)';
                            }, 100);
                        }
                    }, (formElements.length + index) * 50);
                });

                // Update color text inputs
                setTimeout(() => {
                    document.getElementById('primaryColorText').value = '#15a000';
                    document.getElementById('secondaryColorText').value = '#0f7a00';
                    document.getElementById('accentColorText').value = '#15a000';

                    // Update range value display
                    const rangeValue = document.querySelector('.range-value');
                    if (rangeValue) {
                        rangeValue.textContent = '16px';
                    }

                    updateThemeColors();
                }, 500);

                // Add success state
                resetBtn.textContent = 'Reset!';
                resetBtn.classList.remove('settings-loading');
                resetBtn.classList.add('settings-success');

                // Show success toast
                toast('Settings reset to defaults!', 'success');

                // Reset button after delay
                setTimeout(() => {
                    resetBtn.textContent = originalText;
                    resetBtn.disabled = false;
                    resetBtn.classList.remove('settings-success');
                }, 2000);
            }, 600);
        }
    }

    // Enhanced form validation
    function initFormValidation() {
        const formInputs = document.querySelectorAll('#settings input, #settings select, #settings textarea');

        formInputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('focus', () => clearFieldError(input));
        });
    }

    function validateField(field) {
        const formRow = field.closest('.form-row');
        if (!formRow) return;

        // Remove existing validation classes
        formRow.classList.remove('error', 'success');

        // Remove existing validation message
        const existingMessage = formRow.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        let isValid = true;
        let message = '';

        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value && !emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // URL validation
        if (field.type === 'url') {
            try {
                if (field.value && !new URL(field.value)) {
                    isValid = false;
                    message = 'Please enter a valid URL';
                }
            } catch {
                isValid = false;
                message = 'Please enter a valid URL';
            }
        }

        // Phone validation
        if (field.id === 'companyPhone') {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (field.value && !phoneRegex.test(field.value.replace(/\s/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        // Number validation
        if (field.type === 'number') {
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            const value = parseInt(field.value);

            if (field.value && (isNaN(value) || (min && value < parseInt(min)) || (max && value > parseInt(max)))) {
                isValid = false;
                message = `Please enter a number between ${min || '0'} and ${max || '∞'}`;
            }
        }

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Color validation
        if (field.type === 'color') {
            const colorRegex = /^#[0-9A-F]{6}$/i;
            if (field.value && !colorRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid hex color';
            }
        }

        // Apply validation result
        if (field.value && !isValid) {
            formRow.classList.add('error');
            showValidationMessage(formRow, message);
        } else if (field.value && isValid) {
            formRow.classList.add('success');
        }
    }

    function clearFieldError(field) {
        const formRow = field.closest('.form-row');
        if (formRow) {
            formRow.classList.remove('error');
            const message = formRow.querySelector('.validation-message');
            if (message) {
                message.remove();
            }
        }
    }

    function showValidationMessage(formRow, message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'validation-message';
        messageEl.textContent = message;
        formRow.appendChild(messageEl);
    }

    // Settings import/export functionality
    function exportSettings() {
        const settings = localStorage.getItem('mbelyco-settings');
        if (!settings) {
            toast('No settings to export', 'warning');
            return;
        }

        const blob = new Blob([settings], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mbelyco-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast('Settings exported successfully!', 'success');
    }

    function importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                localStorage.setItem('mbelyco-settings', JSON.stringify(settings));
                loadSettings();
                toast('Settings imported successfully!', 'success');
            } catch (error) {
                toast('Invalid settings file', 'error');
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    // Reports
    function initReports() {
        // Sample reports data
        const sampleReports = [
            {
                id: 1,
                name: 'Monthly Batch Performance Report',
                type: 'batch-performance',
                generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                status: 'completed',
                size: '2.4 MB'
            },
            {
                id: 2,
                name: 'Financial Reconciliation Report',
                type: 'financial',
                generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                status: 'completed',
                size: '1.8 MB'
            },
            {
                id: 3,
                name: 'User Engagement Analytics',
                type: 'user-engagement',
                generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                status: 'completed',
                size: '3.2 MB'
            }
        ];

        // Sample top batches data
        const topBatches = [
            { name: 'Holiday Campaign 2024', redemptions: 1247, conversion: '89.2%' },
            { name: 'New Year Promo', redemptions: 892, conversion: '76.5%' },
            { name: 'Valentine Special', redemptions: 634, conversion: '82.1%' },
            { name: 'Easter Campaign', redemptions: 445, conversion: '71.3%' },
            { name: 'Summer Sale', redemptions: 378, conversion: '68.9%' }
        ];

        // Render recent reports
        function renderRecentReports() {
            const container = document.getElementById('recentReportsList');
            if (!container) return;

            container.innerHTML = sampleReports.map(report => `
        <div class="report-item">
          <div class="report-info">
            <div class="report-name">${report.name}</div>
            <div class="report-meta">
              Generated ${formatDate(report.generatedAt)} • ${report.size}
            </div>
          </div>
          <div class="report-actions">
            <button class="btn ghost" onclick="downloadReport(${report.id})">
              <i data-lucide="download"></i>
            </button>
            <button class="btn ghost" onclick="viewReport(${report.id})">
              <i data-lucide="eye"></i>
            </button>
          </div>
        </div>
      `).join('');

            // Re-initialize Lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
                fixSelectIcons();
            }
        }

        // Render top batches
        function renderTopBatches() {
            const container = document.getElementById('topBatchesList');
            if (!container) return;

            container.innerHTML = topBatches.map(batch => `
        <div class="batch-item">
          <span class="batch-name">${batch.name}</span>
          <span class="batch-metric">${batch.redemptions} redemptions (${batch.conversion})</span>
        </div>
      `).join('');
        }

        // Format date helper
        function formatDate(date) {
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) return 'yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            return date.toLocaleDateString();
        }

        // Report generation handlers
        function handleReportGeneration(reportType) {
            showToast(`Generating ${reportType} report...`, 'info');

            // Simulate report generation
            setTimeout(() => {
                showToast(`${reportType} report generated successfully!`, 'success');
                // Add to recent reports
                const newReport = {
                    id: Date.now(),
                    name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
                    type: reportType,
                    generatedAt: new Date(),
                    status: 'completed',
                    size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
                };
                sampleReports.unshift(newReport);
                if (sampleReports.length > 5) sampleReports.pop();
                renderRecentReports();
            }, 2000);
        }

        // Custom report generation
        function handleCustomReport() {
            showToast('Opening custom report builder...', 'info');
            // In a real implementation, this would open a modal with report builder
        }

        // Schedule report
        function handleScheduleReport() {
            showToast('Opening report scheduler...', 'info');
            // In a real implementation, this would open a modal with scheduling options
        }

        // Download report
        window.downloadReport = function(reportId) {
            const report = sampleReports.find(r => r.id === reportId);
            if (report) {
                showToast(`Downloading ${report.name}...`, 'info');
                // In a real implementation, this would trigger actual download
                setTimeout(() => {
                    showToast('Report downloaded successfully!', 'success');
                }, 1000);
            }
        };

        // View report
        window.viewReport = function(reportId) {
            const report = sampleReports.find(r => r.id === reportId);
            if (report) {
                showToast(`Opening ${report.name}...`, 'info');
                // In a real implementation, this would open the report in a new tab/modal
            }
        };

        // Event listeners
        document.addEventListener('click', (e) => {
            // Report type cards
            if (e.target.closest('.report-type-card')) {
                const card = e.target.closest('.report-type-card');
                const reportType = card.dataset.reportType;
                if (reportType) {
                    handleReportGeneration(reportType);
                }
            }

            // Custom report button
            if (e.target.closest('#generateCustomReport')) {
                handleCustomReport();
            }

            // Schedule report button
            if (e.target.closest('#scheduleReport')) {
                handleScheduleReport();
            }

            // View all reports
            if (e.target.closest('#viewAllReports')) {
                showToast('Opening all reports view...', 'info');
            }
        });

        // Initialize reports data
        renderRecentReports();
        renderTopBatches();

        // Update metrics periodically (simulate real-time updates)
        setInterval(() => {
            // Update metric values with slight variations
            const totalRedemptions = document.getElementById('totalRedemptions');
            const totalDisbursed = document.getElementById('totalDisbursed');
            const activeUsers = document.getElementById('activeUsers');
            const conversionRate = document.getElementById('conversionRate');

            if (totalRedemptions) {
                const current = parseInt(totalRedemptions.textContent.replace(/,/g, ''));
                const variation = Math.floor(Math.random() * 10) - 5;
                totalRedemptions.textContent = (current + variation).toLocaleString();
            }

            if (activeUsers) {
                const current = parseInt(activeUsers.textContent.replace(/,/g, ''));
                const variation = Math.floor(Math.random() * 6) - 3;
                activeUsers.textContent = (current + variation).toLocaleString();
            }

            if (conversionRate) {
                const current = parseFloat(conversionRate.textContent);
                const variation = (Math.random() * 2) - 1;
                const newRate = Math.max(0, Math.min(100, current + variation));
                conversionRate.textContent = newRate.toFixed(1) + '%';
            }
        }, 30000); // Update every 30 seconds
    }

    // Redemptions
    function initRedemptions() {
        // Sample redemptions data
        const sampleRedemptions = [
            {
                id: 'TXN001',
                code: 'MBL2024ABC123',
                user: 'John Doe',
                phone: '+250788123456',
                amount: 5000,
                status: 'completed',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000),
                paymentMethod: 'MTN MoMo'
            },
            {
                id: 'TXN002',
                code: 'MBL2024DEF456',
                user: 'Jane Smith',
                phone: '+250788654321',
                amount: 10000,
                status: 'pending',
                date: new Date(Date.now() - 1 * 60 * 60 * 1000),
                paymentMethod: 'Airtel Money'
            },
            {
                id: 'TXN003',
                code: 'MBL2024GHI789',
                user: 'Bob Johnson',
                phone: '+250788987654',
                amount: 2500,
                status: 'failed',
                date: new Date(Date.now() - 30 * 60 * 1000),
                paymentMethod: 'MTN MoMo'
            }
        ];

        // Render redemptions table
        function renderRedemptions(redemptions = sampleRedemptions) {
            const tbody = document.getElementById('redemptionsTbody');
            if (!tbody) return;

            tbody.innerHTML = redemptions.map(redemption => `
        <tr>
          <td><input type="checkbox" class="redemption-select" data-id="${redemption.id}" /></td>
          <td>${redemption.id}</td>
          <td><span class="code-pill">${redemption.code}</span></td>
          <td>
            <div>
              <div class="font-medium">${redemption.user}</div>
              <div class="text-sm text-muted">${redemption.phone}</div>
            </div>
          </td>
          <td>RWF ${redemption.amount.toLocaleString()}</td>
          <td><span class="status-badge status-${redemption.status}">${redemption.status}</span></td>
          <td>${redemption.date.toLocaleDateString()}</td>
          <td>${redemption.paymentMethod}</td>
          <td>
            <div class="menu-container">
              <button class="menu-trigger" data-id="${redemption.id}">
                <i data-lucide="more-horizontal"></i>
              </button>
              <div class="menu" data-target="${redemption.id}">
                <button class="menu-item" data-action="view">
                  <i data-lucide="eye"></i> View Details
                </button>
                <button class="menu-item" data-action="retry">
                  <i data-lucide="refresh-cw"></i> Retry
                </button>
                <button class="menu-item" data-action="export">
                  <i data-lucide="download"></i> Export
                </button>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

            window.lucide.createIcons();
            fixSelectIcons();
        }

        // Initialize redemptions
        renderRedemptions();

        // Status tabs functionality
        const statusTabs = document.getElementById('redemptionStatusTabs');
        if (statusTabs) {
            statusTabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('status-tab')) {
                    // Remove active class from all tabs
                    statusTabs.querySelectorAll('.status-tab').forEach(tab => {
                        tab.classList.remove('active');
                        tab.setAttribute('aria-selected', 'false');
                    });

                    // Add active class to clicked tab
                    e.target.classList.add('active');
                    e.target.setAttribute('aria-selected', 'true');

                    // Filter redemptions based on status
                    const status = e.target.dataset.status;
                    const filtered = status ? sampleRedemptions.filter(r => r.status === status) : sampleRedemptions;
                    renderRedemptions(filtered);
                }
            });
        }
    }

    // Payments
    function initPayments() {
        // Sample payments data
        const samplePayments = [
            {
                id: 'PAY001',
                user: 'John Doe',
                phone: '+250788123456',
                amount: 5000,
                status: 'completed',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000),
                paymentMethod: 'MTN MoMo',
                reference: 'REF123456'
            },
            {
                id: 'PAY002',
                user: 'Jane Smith',
                phone: '+250788654321',
                amount: 10000,
                status: 'pending',
                date: new Date(Date.now() - 1 * 60 * 60 * 1000),
                paymentMethod: 'Airtel Money',
                reference: 'REF123457'
            },
            {
                id: 'PAY003',
                user: 'Bob Johnson',
                phone: '+250788987654',
                amount: 2500,
                status: 'failed',
                date: new Date(Date.now() - 30 * 60 * 1000),
                paymentMethod: 'MTN MoMo',
                reference: 'REF123458'
            }
        ];

        // Render payments table
        function renderPayments(payments = samplePayments) {
            const tbody = document.getElementById('paymentsTbody');
            if (!tbody) return;

            tbody.innerHTML = payments.map(payment => `
        <tr>
          <td><input type="checkbox" class="payment-select" data-id="${payment.id}" /></td>
          <td>${payment.id}</td>
          <td>
            <div>
              <div class="font-medium">${payment.user}</div>
              <div class="text-sm text-muted">${payment.phone}</div>
            </div>
          </td>
          <td>RWF ${payment.amount.toLocaleString()}</td>
          <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
          <td>${payment.date.toLocaleDateString()}</td>
          <td>${payment.paymentMethod}</td>
          <td>${payment.reference}</td>
          <td>
            <div class="menu-container">
              <button class="menu-trigger" data-id="${payment.id}">
                <i data-lucide="more-horizontal"></i>
              </button>
              <div class="menu" data-target="${payment.id}">
                <button class="menu-item" data-action="view">
                  <i data-lucide="eye"></i> View Details
                </button>
                <button class="menu-item" data-action="retry">
                  <i data-lucide="refresh-cw"></i> Retry
                </button>
                <button class="menu-item" data-action="reconcile">
                  <i data-lucide="check-circle"></i> Reconcile
                </button>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

            window.lucide.createIcons();
            fixSelectIcons();
        }

        // Initialize payments
        renderPayments();

        // Status tabs functionality
        const statusTabs = document.getElementById('paymentStatusTabs');
        if (statusTabs) {
            statusTabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('status-tab')) {
                    // Remove active class from all tabs
                    statusTabs.querySelectorAll('.status-tab').forEach(tab => {
                        tab.classList.remove('active');
                        tab.setAttribute('aria-selected', 'false');
                    });

                    // Add active class to clicked tab
                    e.target.classList.add('active');
                    e.target.setAttribute('aria-selected', 'true');

                    // Filter payments based on status
                    const status = e.target.dataset.status;
                    const filtered = status ? samplePayments.filter(p => p.status === status) : samplePayments;
                    renderPayments(filtered);
                }
            });
        }
    }

    // Frauds
    function initFrauds() {
        // Sample frauds data
        const sampleFrauds = [
            {
                id: 'FRAUD001',
                type: 'Duplicate Redemption',
                description: 'Same code used multiple times',
                status: 'pending',
                priority: 'high',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000),
                reporter: 'System'
            },
            {
                id: 'FRAUD002',
                type: 'Suspicious Activity',
                description: 'Unusual redemption pattern detected',
                status: 'investigating',
                priority: 'medium',
                date: new Date(Date.now() - 4 * 60 * 60 * 1000),
                reporter: 'Elyse Mbonyumukunzi'
            },
            {
                id: 'FRAUD003',
                type: 'Invalid Code',
                description: 'Code generated outside normal parameters',
                status: 'resolved',
                priority: 'low',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000),
                reporter: 'Jane Manager'
            }
        ];

        // Render frauds table
        function renderFrauds(frauds = sampleFrauds) {
            const tbody = document.getElementById('fraudsTbody');
            if (!tbody) return;

            tbody.innerHTML = frauds.map(fraud => `
        <tr>
          <td><input type="checkbox" class="fraud-select" data-id="${fraud.id}" /></td>
          <td>${fraud.id}</td>
          <td>${fraud.type}</td>
          <td>${fraud.description}</td>
          <td><span class="status-badge status-${fraud.status}">${fraud.status}</span></td>
          <td><span class="priority-badge priority-${fraud.priority}">${fraud.priority}</span></td>
          <td>${fraud.date.toLocaleDateString()}</td>
          <td>${fraud.reporter}</td>
          <td>
            <div class="menu-container">
              <button class="menu-trigger" data-id="${fraud.id}">
                <i data-lucide="more-horizontal"></i>
              </button>
              <div class="menu" data-target="${fraud.id}">
                <button class="menu-item" data-action="view">
                  <i data-lucide="eye"></i> View Details
                </button>
                <button class="menu-item" data-action="investigate">
                  <i data-lucide="search"></i> Investigate
                </button>
                <button class="menu-item" data-action="resolve">
                  <i data-lucide="check-circle"></i> Mark Resolved
                </button>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

            window.lucide.createIcons();
            fixSelectIcons();
        }

        // Initialize frauds
        renderFrauds();

        // Status tabs functionality
        const statusTabs = document.getElementById('fraudStatusTabs');
        if (statusTabs) {
            statusTabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('status-tab')) {
                    // Remove active class from all tabs
                    statusTabs.querySelectorAll('.status-tab').forEach(tab => {
                        tab.classList.remove('active');
                        tab.setAttribute('aria-selected', 'false');
                    });

                    // Add active class to clicked tab
                    e.target.classList.add('active');
                    e.target.setAttribute('aria-selected', 'true');

                    // Filter frauds based on status
                    const status = e.target.dataset.status;
                    const filtered = status ? sampleFrauds.filter(f => f.status === status) : sampleFrauds;
                    renderFrauds(filtered);
                }
            });
        }
    }

    // Alerts
    function initAlerts() {
        // Sample alerts data
        const sampleAlerts = [
            {
                id: 'ALERT001',
                type: 'System Error',
                message: 'Payment gateway connection failed',
                severity: 'critical',
                status: 'active',
                date: new Date(Date.now() - 30 * 60 * 1000),
                source: 'Payment System'
            },
            {
                id: 'ALERT002',
                type: 'High Usage',
                message: 'Unusual spike in redemption requests',
                severity: 'warning',
                status: 'acknowledged',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000),
                source: 'Analytics'
            },
            {
                id: 'ALERT003',
                type: 'Maintenance',
                message: 'Scheduled maintenance completed successfully',
                severity: 'info',
                status: 'resolved',
                date: new Date(Date.now() - 4 * 60 * 60 * 1000),
                source: 'System'
            }
        ];

        // Render alerts table
        function renderAlerts(alerts = sampleAlerts) {
            const tbody = document.getElementById('alertsTbody');
            if (!tbody) return;

            tbody.innerHTML = alerts.map(alert => `
        <tr>
          <td><input type="checkbox" class="alert-select" data-id="${alert.id}" /></td>
          <td>${alert.id}</td>
          <td>${alert.type}</td>
          <td>${alert.message}</td>
          <td><span class="severity-badge severity-${alert.severity}">${alert.severity}</span></td>
          <td><span class="status-badge status-${alert.status}">${alert.status}</span></td>
          <td>${alert.date.toLocaleDateString()}</td>
          <td>${alert.source}</td>
          <td>
            <div class="menu-container">
              <button class="menu-trigger" data-id="${alert.id}">
                <i data-lucide="more-horizontal"></i>
              </button>
              <div class="menu" data-target="${alert.id}">
                <button class="menu-item" data-action="view">
                  <i data-lucide="eye"></i> View Details
                </button>
                <button class="menu-item" data-action="acknowledge">
                  <i data-lucide="check-circle"></i> Acknowledge
                </button>
                <button class="menu-item" data-action="resolve">
                  <i data-lucide="check"></i> Mark Resolved
                </button>
              </div>
            </div>
          </td>
        </tr>
      `).join('');

            window.lucide.createIcons();
            fixSelectIcons();
        }

        // Initialize alerts
        renderAlerts();

        // Status tabs functionality
        const statusTabs = document.getElementById('alertStatusTabs');
        if (statusTabs) {
            statusTabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('status-tab')) {
                    // Remove active class from all tabs
                    statusTabs.querySelectorAll('.status-tab').forEach(tab => {
                        tab.classList.remove('active');
                        tab.setAttribute('aria-selected', 'false');
                    });

                    // Add active class to clicked tab
                    e.target.classList.add('active');
                    e.target.setAttribute('aria-selected', 'true');

                    // Filter alerts based on status
                    const status = e.target.dataset.status;
                    const filtered = status ? sampleAlerts.filter(a => a.severity === status) : sampleAlerts;
                    renderAlerts(filtered);
                }
            });
        }
    }

    // Enhanced Dashboard
    function initEnhancedDashboard() {
        // Initialize new dashboard components
        initQuickActions();
        initSystemHealth();
        initConversionFunnel();

        // Real-time metrics update simulation
        function updateMetrics() {
            const metrics = {
                totalCodes: document.getElementById('kpiTotalCodes'),
                redemptions: document.getElementById('kpiRedemptions'),
                totalDisbursed: document.getElementById('kpiTotalDisbursed'),
                activeUsers: document.getElementById('kpiActiveUsers')
            };

            // Simulate real-time updates with small variations
            if (metrics.totalCodes) {
                const current = parseInt(metrics.totalCodes.textContent.replace(/,/g, ''));
                const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
                metrics.totalCodes.textContent = (current + variation).toLocaleString();
            }

            if (metrics.redemptions) {
                const current = parseInt(metrics.redemptions.textContent.replace(/,/g, ''));
                const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
                metrics.redemptions.textContent = (current + variation).toLocaleString();
            }

            if (metrics.activeUsers) {
                const current = parseInt(metrics.activeUsers.textContent.replace(/,/g, ''));
                const variation = Math.floor(Math.random() * 4) - 2; // -2 to +2
                metrics.activeUsers.textContent = (current + variation).toLocaleString();
            }
        }

        // Top batches interaction
        const viewAllBatchesBtn = document.getElementById('viewAllBatches');
        if (viewAllBatchesBtn) {
            viewAllBatchesBtn.addEventListener('click', () => {
                // Switch to batches tab
                const batchesTab = document.querySelector('[data-target="batches"]');
                if (batchesTab) {
                    batchesTab.click();
                }
            });
        }

        // Batch items interaction
        const batchItems = document.querySelectorAll('.batch-item');
        batchItems.forEach(item => {
            item.addEventListener('click', () => {
                // Add visual feedback
                item.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 150);

                // Switch to batches tab
                const batchesTab = document.querySelector('[data-target="batches"]');
                if (batchesTab) {
                    batchesTab.click();
                }
            });
        });

        // Date range picker
        const dateRangeSelect = document.getElementById('dashboardDateRange');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                const range = e.target.value;
                // Simulate data refresh based on date range
                console.log('Date range changed to:', range);
                updateMetrics();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    refreshBtn.style.transform = 'rotate(0deg)';
                    updateMetrics();
                }, 500);
            });
        }

        // Activity feed updates
        function addActivityItem(title, description, icon = 'bell') {
            const activityFeed = document.getElementById('activityFeed');
            if (!activityFeed) return;

            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
        <div class="activity-icon">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">${title}</div>
          <div class="activity-description">${description}</div>
          <div class="activity-time">Just now</div>
        </div>
      `;

            // Add to top of feed
            activityFeed.insertBefore(activityItem, activityFeed.firstChild);

            // Remove oldest item if more than 4
            const items = activityFeed.querySelectorAll('.activity-item');
            if (items.length > 4) {
                activityFeed.removeChild(items[items.length - 1]);
            }

            // Recreate icons
            window.lucide.createIcons();
        }

        // Simulate periodic activity updates
        setInterval(() => {
            const activities = [
                { title: 'New redemption', description: 'Code redeemed successfully', icon: 'check-circle' },
                { title: 'Batch updated', description: 'Batch status changed to active', icon: 'package' },
                { title: 'User login', description: 'New user session started', icon: 'user' },
                { title: 'System check', description: 'Automated health check completed', icon: 'shield-check' }
            ];

            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            addActivityItem(randomActivity.title, randomActivity.description, randomActivity.icon);
        }, 30000); // Every 30 seconds


        // Security metrics updates
        function updateSecurityMetrics() {
            const securityMetrics = {
                fraudRate: document.querySelector('.security-metric .security-value'),
                activeAlerts: document.querySelectorAll('.security-metric .security-value')[1]
            };

            if (securityMetrics.fraudRate) {
                const currentRate = parseFloat(securityMetrics.fraudRate.textContent);
                const variation = (Math.random() * 0.2) - 0.1; // -0.1 to +0.1
                const newRate = Math.max(0.1, Math.min(1.0, currentRate + variation));
                securityMetrics.fraudRate.textContent = newRate.toFixed(1) + '%';
            }

            if (securityMetrics.activeAlerts) {
                const currentAlerts = parseInt(securityMetrics.activeAlerts.textContent);
                const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
                const newAlerts = Math.max(5, Math.min(20, currentAlerts + variation));
                securityMetrics.activeAlerts.textContent = newAlerts;
            }
        }

        // Payment methods updates
        function updatePaymentMethods() {
            const paymentMethods = document.querySelectorAll('.payment-method');
            paymentMethods.forEach(method => {
                const amountElement = method.querySelector('.method-amount');
                if (amountElement) {
                    const currentAmount = parseFloat(amountElement.textContent.replace(/[^\d.]/g, ''));
                    const variation = (Math.random() * 0.1) - 0.05; // -5% to +5%
                    const newAmount = currentAmount * (1 + variation);

                    if (currentAmount >= 1000000) {
                        amountElement.textContent = 'RWF ' + (newAmount / 1000000).toFixed(1) + 'M';
                    } else {
                        amountElement.textContent = 'RWF ' + (newAmount / 1000).toFixed(0) + 'K';
                    }
                }
            });
        }

        // Start real-time updates
        setInterval(updateMetrics, 15000); // Update metrics every 15 seconds
        setInterval(updateSecurityMetrics, 25000); // Update security metrics every 25 seconds
        setInterval(updatePaymentMethods, 30000); // Update payment methods every 30 seconds
    }

    // Entry
    async function init() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);

        // Check auth status first
        try {
            const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
            if (user) {
                state.user = user;
                state.isAuthenticated = true;
            }
        } catch (e) {
            // It's normal for this to fail if the user is not logged in.
            state.isAuthenticated = false;
        }

        if (!state.isAuthenticated) {
            // If not on login page, and not on verify page, redirect to login
            if (page !== 'login.html' && page !== 'verify.html') {
                window.location.href = './login.html';
                return; // Stop execution after redirect
            }
            // On login page, just init the login form
            if (page === 'login.html') {
                try {
                    initAuth();
                } catch (e) {
                    console.error("Error initializing auth on login page:", e);
                }
            }
            return;
        }

        // If authenticated, but on login page, redirect to main app
        if (page === 'login.html') {
            window.location.href = './index.html';
            return;
        }

        // Main app initialization for authenticated users (only on index.html)
        if (page === 'index.html' || page === '') {
            await initApp();
        }
    }

    async function initApp() {
        console.log('Initializing application...');

        // Helper to safely run initialization functions
        const safeInit = (name, fn) => {
            try {
                fn();
            } catch (e) {
                console.error(`Error during ${name} initialization:`, e);
            }
        };

        const initialStatus = getActiveStatus ? getActiveStatus() : '';
        const searchVal = (el('codesSearch') && el('codesSearch').value) || '';

        Promise.all([
            fetch('/api/kpis').then(r=>r.json()).catch(()=>null),
            fetch('/api/batches').then(r=>r.json()).catch(()=>[])
        ]).then(([kpis, batches])=> {
            if (kpis) state.kpis = kpis;
            const batchArr = Array.isArray(batches) ? batches : [];
            state.batches = batchArr.map(b=>({
                id: b.id,
                name: b.name,
                description: b.description,
                total_codes: b.total_codes,
                amount_per_code: Number(b.amount_per_code),
                currency: b.currency||'RWF',
                expiration_date: b.expiration_date ? new Date(b.expiration_date) : null,
                assigned_user: b.assigned_user_id || 'Unassigned',
                status: b.status,
                created_at: b.created_at ? new Date(b.created_at) : null,
                redeemed_count: b.redeemed_count || 0
            }));

            safeInit('Auth', initAuth);
            safeInit('Tabs', initTabs);
            safeInit('Theme', initTheme);
            safeInit('Search', initSearch);
            safeInit('Download', initDownload);
            safeInit('Bulk Actions', initBulkActions);
            safeInit('Promo Status Tabs', initPromoStatusTabs);
            safeInit('Settings', initSettings);
            safeInit('User Management', initUserManagement);
            safeInit('Reports', initReports);
            safeInit('Redemptions', initRedemptions);
            safeInit('Payments', initPayments);
            safeInit('Frauds', initFrauds);
            safeInit('Alerts', initAlerts);
            safeInit('Enhanced Dashboard', initEnhancedDashboard);

            safeInit('Card Delegates for Batches', () => bindCardDelegatesFor('batches'));
            safeInit('Batch Status Tabs', initBatchStatusTabs);
            safeInit('Card Delegates for Promo Codes', () => bindCardDelegatesFor('promo-codes'));

            safeInit('KPIs Rendering', renderKPIs);
            safeInit('Activity Rendering', renderActivity);
            safeInit('Batches Rendering', () => renderBatches(''));
            safeInit('Codes Rendering', () => renderCodes(searchVal, initialStatus));

            if(window.lucide) {
                try {
                    window.lucide.createIcons();
                } catch (e) {
                    console.error("Error creating lucide icons:", e);
                }
            }
            safeInit('Select Icons Fix', fixSelectIcons);

        }).catch(err=>{
            console.error('Failed to load initial data', err);
        });
    }

    // Initialize Quick Actions
    function initQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                handleQuickAction(action);
            });
        });
    }

    // Handle Quick Actions
    function handleQuickAction(action) {
        switch(action) {
            case 'generate':
                showModal('generateModal');
                break;
            case 'import':
                showModal('importModal');
                break;
            case 'export':
                exportAllData();
                break;
            case 'analytics':
                showToast('Analytics view coming soon!', 'info');
                break;
            default:
                showToast('Action not implemented yet', 'warning');
        }
    }



    // Initialize System Health
    function initSystemHealth() {
        updateSystemHealth();

        // Update system health every 30 seconds
        setInterval(updateSystemHealth, 30000);
    }

    // Update System Health
    function updateSystemHealth() {
        const healthMetrics = document.querySelectorAll('.health-metric');

        healthMetrics.forEach((metric, index) => {
            setTimeout(() => {
                metric.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    metric.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });

        // Simulate real-time updates
        updateHealthValues();
    }

    // Update Health Values
    function updateHealthValues() {
        const healthValues = document.querySelectorAll('.health-value');

        healthValues.forEach(value => {
            const currentValue = value.textContent;
            if (currentValue.includes('%')) {
                // Simulate small fluctuations in percentage values
                const numValue = parseFloat(currentValue);
                const variation = (Math.random() - 0.5) * 2; // ±1% variation
                const newValue = Math.max(0, Math.min(100, numValue + variation));
                value.textContent = newValue.toFixed(1) + '%';
            } else if (currentValue.includes('ms')) {
                // Simulate response time variations
                const numValue = parseInt(currentValue);
                const variation = Math.floor((Math.random() - 0.5) * 10); // ±5ms variation
                const newValue = Math.max(10, numValue + variation);
                value.textContent = newValue + 'ms';
            }
        });
    }

    // Initialize Conversion Funnel
    function initConversionFunnel() {
        updateConversionFunnel();
    }

    // Update Conversion Funnel
    function updateConversionFunnel() {
        const funnelStages = document.querySelectorAll('.funnel-stage');

        funnelStages.forEach((stage, index) => {
            setTimeout(() => {
                stage.style.transform = 'translateX(10px)';
                stage.style.opacity = '0.8';
                setTimeout(() => {
                    stage.style.transform = 'translateX(0)';
                    stage.style.opacity = '1';
                }, 300);
            }, index * 200);
        });
    }

    document.addEventListener('DOMContentLoaded', init);

    // Debug function to test data loading
    window.debugData = function() {
        console.log('=== DEBUG DATA ===');
        console.log('State:', state);
        console.log('Batches:', state.batches);
        console.log('Codes:', state.codes.slice(0, 5), '... (showing first 5)');
        console.log('Total codes:', state.codes.length);
        console.log('Batches table body:', document.getElementById('batchesTbody'));
        console.log('Codes table body:', document.getElementById('codesTbody'));

        // Test rendering
        console.log('Testing renderBatches...');
        renderBatches('');
        console.log('Testing renderCodes...');
        renderCodes('', '');
    };

    // Fix for select dropdown icons - ensure only one icon is visible
    function fixSelectIcons() {
        document.querySelectorAll('.select-wrap').forEach(wrap => {
            const icons = wrap.querySelectorAll('i[data-lucide], svg');
            if (icons.length > 1) {
                for (let i = 1; i < icons.length; i++) {
                    icons[i].style.display = 'none';
                }
            }
        });
    }

    // User Management functionality
    function initUserManagement() {
        // Sample users data
        const users = [
            { id: 1, name: 'Elyse Mbonyumukunzi', email: 'elysembonye@gmail.com', role: 'super-admin', status: 'active', lastLogin: '2024-01-15', created: '2024-01-01' },
            { id: 2, name: 'Beathe Umwali', email: 'umwalib@mbelyco.com', role: 'batch-manager', status: 'active', lastLogin: '2024-01-14', created: '2024-01-02' },
            { id: 3, name: 'Beathe Umwali', email: 'umwalib@mbelyco.com', role: 'batch-manager', status: 'active', lastLogin: '', created: '2024-07-22' }
        ];

        let filteredUsers = [...users];

        // Render users table
        function renderUsersTable() {
            const usersTbody = document.getElementById('usersTbody');
            if (!usersTbody) return;

            usersTbody.innerHTML = '';

            filteredUsers.forEach(user => {
                const tr = document.createElement('tr');
                const statusChip = user.status === 'active' ? 'success' : (user.status === 'inactive' ? 'muted' : 'warn');
                const roleChip = user.role === 'super-admin' ? 'success' : (user.role === 'batch-manager' ? 'primary' : 'muted');

                tr.innerHTML = `
          <td>
            <div style="font-weight: 500;">${user.name}</div>
            <div style="font-size: 12px; color: var(--color-muted);">ID: ${user.id}</div>
          </td>
          <td>${user.email}</td>
          <td><span class="status ${roleChip}">${user.role}</span></td>
          <td><span class="status ${statusChip}">${user.status}</span></td>
          <td style="font-size: 12px; color: var(--color-muted);">${user.lastLogin}</td>
          <td style="font-size: 12px; color: var(--color-muted);">${user.created}</td>
          <td>
            <div class="cell-actions">
              <button class="action-btn" onclick="editUser('${user.id}')" title="Edit User">
                <i data-lucide="edit"></i>
              </button>
              <button class="action-btn" onclick="changeUserRole('${user.id}')" title="Change Role">
                <i data-lucide="user-check"></i>
              </button>
              <button class="action-btn" onclick="toggleUserStatus('${user.id}')" title="Toggle Status">
                <i data-lucide="${user.status === 'active' ? 'user-x' : 'user-check'}"></i>
              </button>
            </div>
          </td>
        `;
                usersTbody.appendChild(tr);
            });

            if (window.lucide) window.lucide.createIcons();
        }

        // Update user statistics
        function updateUserStats() {
            const totalUsers = users.length;
            const activeUsers = users.filter(u => u.status === 'active').length;
            const adminUsers = users.filter(u => u.role === 'super-admin').length;
            const recentLogins = users.filter(u => {
                const lastLogin = new Date(u.lastLogin);
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                return lastLogin > threeDaysAgo;
            }).length;

            const totalUsersEl = document.getElementById('totalUsers');
            const activeUsersEl = document.getElementById('activeUsers');
            const adminUsersEl = document.getElementById('adminUsers');
            const recentLoginsEl = document.getElementById('recentLogins');

            if (totalUsersEl) totalUsersEl.textContent = totalUsers;
            if (activeUsersEl) activeUsersEl.textContent = activeUsers;
            if (adminUsersEl) adminUsersEl.textContent = adminUsers;
            if (recentLoginsEl) recentLoginsEl.textContent = recentLogins;

            // Update user count in table header
            const userCountEl = document.getElementById('userCount');
            if (userCountEl) userCountEl.textContent = `${filteredUsers.length} users`;
        }

        // Filter users based on search and filters
        function filterUsers() {
            const searchQuery = document.getElementById('userSearchInput')?.value.toLowerCase() || '';
            const roleFilter = document.getElementById('userRoleFilter')?.value || '';
            const statusFilter = document.getElementById('userStatusFilter')?.value || '';

            filteredUsers = users.filter(user => {
                const matchesSearch = !searchQuery ||
                    user.name.toLowerCase().includes(searchQuery) ||
                    user.email.toLowerCase().includes(searchQuery) ||
                    user.role.toLowerCase().includes(searchQuery);

                const matchesRole = !roleFilter || user.role === roleFilter;
                const matchesStatus = !statusFilter || user.status === statusFilter;

                return matchesSearch && matchesRole && matchesStatus;
            });

            renderUsersTable();
            updateUserStats();
        }

        // Populate user select dropdowns
        function populateUserSelects() {
            const assignUserSelect = document.getElementById('assignUserSelect');
            if (assignUserSelect) {
                assignUserSelect.innerHTML = '<option value="">Choose a user...</option>' +
                    users.map(user => `<option value="${user.id}">${user.name} (${user.email})</option>`).join('');
            }
        }

        // Initialize user management
        renderUsersTable();
        updateUserStats();
        populateUserSelects();

        // Add event listeners
        const userSearchInput = document.getElementById('userSearchInput');
        if (userSearchInput) {
            userSearchInput.addEventListener('input', filterUsers);
        }

        const userRoleFilter = document.getElementById('userRoleFilter');
        if (userRoleFilter) {
            userRoleFilter.addEventListener('change', filterUsers);
        }

        const userStatusFilter = document.getElementById('userStatusFilter');
        if (userStatusFilter) {
            userStatusFilter.addEventListener('change', filterUsers);
        }

        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                if (userSearchInput) userSearchInput.value = '';
                if (userRoleFilter) userRoleFilter.value = '';
                if (userStatusFilter) userStatusFilter.value = '';
                filterUsers();
            });
        }

        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                toast('Add User functionality would be implemented here', 'info');
            });
        }

        const assignRoleBtn = document.getElementById('assignRoleBtn');
        if (assignRoleBtn) {
            assignRoleBtn.addEventListener('click', () => {
                const userId = document.getElementById('assignUserSelect')?.value;
                const role = document.getElementById('assignRoleSelect')?.value;
                const expirationDate = document.getElementById('roleExpirationDate')?.value;

                if (userId && role) {
                    const user = users.find(u => u.id == userId);
                    if (user) {
                        user.role = role;
                        renderUsersTable();
                        updateUserStats();
                        toast(`Role ${role} assigned to ${user.name}${expirationDate ? ` (expires: ${expirationDate})` : ''}`, 'success');
                    }
                } else {
                    toast('Please select both user and role', 'error');
                }
            });
        }

        const exportUsersBtn = document.getElementById('exportUsersBtn');
        if (exportUsersBtn) {
            exportUsersBtn.addEventListener('click', () => {
                const csvContent = [
                    ['Name', 'Email', 'Role', 'Status', 'Last Login', 'Created At'],
                    ...filteredUsers.map(user => [user.name, user.email, user.role, user.status, user.lastLogin, user.createdAt])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `mbelyco-users-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
                toast('Users exported successfully', 'success');
            });
        }
    }

    // Role Permissions functionality
    function initRolePermissions() {
        // Sample roles data
        const roles = [
            {
                id: 'super-admin',
                name: 'Super Admin',
                description: 'Full system access with all permissions',
                userCount: 1,
                permissions: ['all']
            },
            {
                id: 'batch-manager',
                name: 'Batch Manager',
                description: 'Management access for batches and codes',
                userCount: 1,
                permissions: ['batches.create', 'batches.edit', 'batches.delete', 'codes.create', 'codes.edit', 'codes.delete', 'reports.view']
            }
        ];

        // Sample users data
        const users = [
            { id: 1, name: 'Elyse Mbonyumukunzi', email: 'elysembonye@gmail.com', role: 'super-admin', status: 'active' },
            { id: 2, name: 'Beathe Umwali', email: 'umwalib@mbelyco.com', role: 'batch-manager', status: 'active' }
        ];

        // Permission categories
        const permissions = [
            { category: 'Batches', permissions: [
                    { id: 'batches.view', name: 'View Batches' },
                    { id: 'batches.create', name: 'Create Batches' },
                    { id: 'batches.edit', name: 'Edit Batches' },
                    { id: 'batches.delete', name: 'Delete Batches' }
                ]},
            { category: 'Promo Codes', permissions: [
                    { id: 'codes.view', name: 'View Codes' },
                    { id: 'codes.create', name: 'Create Codes' },
                    { id: 'codes.edit', name: 'Edit Codes' },
                    { id: 'codes.delete', name: 'Delete Codes' }
                ]},
            { category: 'Users', permissions: [
                    { id: 'users.view', name: 'View Users' },
                    { id: 'users.create', name: 'Create Users' },
                    { id: 'users.edit', name: 'Edit Users' },
                    { id: 'users.delete', name: 'Delete Users' },
                    { id: 'users.manage', name: 'Manage Users' }
                ]},
            { category: 'Settings', permissions: [
                    { id: 'settings.view', name: 'View Settings' },
                    { id: 'settings.edit', name: 'Edit Settings' },
                    { id: 'settings.read', name: 'Read Settings' }
                ]},
            { category: 'Reports', permissions: [
                    { id: 'reports.view', name: 'View Reports' },
                    { id: 'reports.export', name: 'Export Reports' }
                ]}
        ];

        // Render roles list
        function renderRoles() {
            const rolesList = document.getElementById('rolesList');
            if (!rolesList) return;

            rolesList.innerHTML = roles.map(role => `
        <div class="role-card">
          <div class="role-card-header">
            <div class="role-name">${role.name}</div>
            <div class="role-actions">
              <button onclick="editRole('${role.id}')" title="Edit Role">
                <i data-lucide="edit"></i>
              </button>
              <button onclick="deleteRole('${role.id}')" title="Delete Role">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
          <div class="role-description">${role.description}</div>
          <div class="role-stats">
            <div class="role-stat">
              <i data-lucide="users"></i>
              <span>${role.userCount} users</span>
            </div>
            <div class="role-stat">
              <i data-lucide="shield"></i>
              <span>${role.permissions.length} permissions</span>
            </div>
          </div>
        </div>
      `).join('');

            if (window.lucide) window.lucide.createIcons();
        }

        // Render permission matrix
        function renderPermissionMatrix() {
            const roleColumns = document.getElementById('roleColumns');
            const permissionMatrix = document.getElementById('permissionMatrix');

            if (!roleColumns || !permissionMatrix) return;

            // Render role columns header
            roleColumns.innerHTML = roles.map(role => `
        <div class="role-column">${role.name}</div>
      `).join('');

            // Render permission rows
            permissionMatrix.innerHTML = permissions.map(category => `
        <div class="permission-category-header" style="font-weight: 600; color: var(--color-text); padding: 8px 16px; background: rgba(255,255,255,.02); border-bottom: 1px solid rgba(255,255,255,.06);">
          ${category.category}
        </div>
        ${category.permissions.map(permission => `
          <div class="permission-row">
            <div class="permission-name">${permission.name}</div>
            <div class="permission-checkboxes">
              ${roles.map(role => `
                <div class="permission-checkbox">
                  <input type="checkbox" 
                    id="${permission.id}-${role.id}" 
                    ${role.permissions.includes(permission.id) || role.permissions.includes('all') ? 'checked' : ''}
                    onchange="updatePermission('${permission.id}', '${role.id}', this.checked)">
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      `).join('');
        }

        // Render users table
        function renderUsers() {
            const usersTable = document.getElementById('usersTable');
            if (!usersTable) return;

            usersTable.innerHTML = `
        <div class="users-table-header">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div class="users-table-body">
          ${users.map(user => `
            <div class="user-row">
              <div>${user.name}</div>
              <div>${user.email}</div>
              <div><span class="user-role">${user.role}</span></div>
              <div>${user.status}</div>
              <div class="user-actions">
                <button onclick="editUser('${user.id}')" title="Edit User">
                  <i data-lucide="edit"></i>
                </button>
                <button onclick="changeUserRole('${user.id}')" title="Change Role">
                  <i data-lucide="user-check"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

            if (window.lucide) window.lucide.createIcons();
        }

        // Initialize role permissions
        renderRoles();
        renderPermissionMatrix();
        renderUsers();

        // Add event listeners
        const addRoleBtn = document.getElementById('addRoleBtn');
        if (addRoleBtn) {
            addRoleBtn.addEventListener('click', () => {
                toast('Add Role functionality would be implemented here', 'info');
            });
        }

        const assignRoleBtn = document.getElementById('assignRoleBtn');
        if (assignRoleBtn) {
            assignRoleBtn.addEventListener('click', () => {
                const user = document.getElementById('assignUser').value;
                const role = document.getElementById('assignRole').value;
                if (user && role) {
                    toast(`Role ${role} assigned to user ${user}`, 'success');
                } else {
                    toast('Please select both user and role', 'error');
                }
            });
        }

        // User search functionality
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                // Filter users based on search query
                toast(`Searching for: ${query}`, 'info');
            });
        }
    }

    // Global functions for role management
    window.editRole = function(roleId) {
        toast(`Edit role: ${roleId}`, 'info');
    };

    window.deleteRole = function(roleId) {
        if (confirm(`Are you sure you want to delete the role: ${roleId}?`)) {
            toast(`Role ${roleId} deleted`, 'success');
        }
    };

    window.updatePermission = function(permissionId, roleId, checked) {
        toast(`Permission ${permissionId} ${checked ? 'granted' : 'revoked'} for role ${roleId}`, 'info');
    };

    window.editUser = function(userId) {
        toast(`Edit user: ${userId}`, 'info');
    };

    window.changeUserRole = function(userId) {
        toast(`Change role for user: ${userId}`, 'info');
    };

    // Global functions for user management
    window.toggleUserStatus = function(userId) {
        // This would be implemented to toggle user status
        toast(`Toggle status for user: ${userId}`, 'info');
    };

    function mapActivityIcon(emoji){
        switch(emoji){
            case '✅': return 'check-circle';
            case '📦': return 'package';
            case '⚠️': return 'alert-triangle';
            case '🔐': return 'shield';
            case '🔄': return 'rotate-cw';
            case '💳': return 'credit-card';
            case '📈': return 'trending-up';
            case '🛰️': return 'satellite';
            case '🧮': return 'calculator';
            default: return 'info';
        }
    }

    // Helpers for file naming per spec: MBL_BATCH-NAME_yyyyMMdd_HHmm.ext
    function formatDownloadName(batchName, ext, date){
        const ts = date instanceof Date ? date : new Date();
        const pad = (n)=>String(n).padStart(2,'0');
        const stamp = `${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}`;
        const name = sanitizeBatchName(batchName);
        return `MBL_${name}_${stamp}.${ext}`;
    }
    function sanitizeBatchName(name){
        return String(name || '')
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g,'-')
            .replace(/^-+|-+$/g,'');
    }

    function capitalize(s){
        s = String(s||'');
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    async function handleImportFile(file){
        try{
            const text = await file.text();
            const lines = text.split(/\r?\n/).filter(Boolean);
            const header = lines.shift();
            const cols = (header||'').split(',').map(s=>s.replace(/\"/g,'"').replace(/^"|"$/g,''));
            const idx = { code: cols.indexOf('code'), batch: cols.indexOf('batch'), amount: cols.indexOf('amount'), currency: cols.indexOf('currency'), status: cols.indexOf('status'), created: cols.indexOf('created') };
            let batchName = null;
            const imported = [];
            for(const line of lines){
                const parts = line.split(',').map(s=>s.replace(/\"/g,'"').replace(/^"|"$/g,''));
                const code = parts[idx.code];
                const bn = parts[idx.batch];
                const amount = Number(parts[idx.amount]||0);
                const currency = parts[idx.currency]||'RWF';
                const status = parts[idx.status]||'active';
                const created = parts[idx.created] ? new Date(parts[idx.created]) : new Date();
                batchName = batchName || bn || 'IMPORTED_BATCH';
                if(code) imported.push({ code, bn: bn||batchName, amount, currency, status, created });
            }
            if(!imported.length) throw new Error('No rows');
            let batch = state.batches.find(b=>b.name===batchName);
            if(!batch){
                batch = { id: `b${state.batches.length+1}`, name: batchName, description: 'Imported CSV', total_codes: 0, amount_per_code: imported[0].amount||0, currency: imported[0].currency||'RWF', expiration_date: new Date(new Date().getFullYear(), new Date().getMonth()+3, 1), assigned_user: 'Importer', status: 'active', created_at: new Date() };
                state.batches.unshift(batch);
            }
            imported.forEach((row, i)=>{
                state.codes.unshift({ id:`${batch.id}-imp-${Date.now()}-${i}`, code: row.code, batch_id: batch.id, batch_name: batch.name, amount: row.amount, currency: row.currency, status: row.status, created_at: row.created });
            });
            batch.total_codes += imported.length;
            renderBatches(el('batchSearch').value);
            renderCodes(el('codesSearch').value, getActiveStatus());
            toast(`Imported ${imported.length} codes into ${batch.name}`, 'success');
        }catch(err){ console.error(err); toast('Failed to import CSV', 'error'); }
    }
//
})();