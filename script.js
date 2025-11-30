// ======================================
// نظام إدارة عقود الاعتماد الأكاديمي
// ملف البرمجة الرئيسي
// ======================================

// المتغيرات العامة
let allContracts = [];
let filteredContracts = [];
let universities = {};
let departments = {};

// تحميل البيانات عند بدء الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
});

// تهيئة النظام
function initializeSystem() {
    // تحميل البيانات
    allContracts = contractsData || [];
    
    // تحليل البيانات
    analyzeData();
    
    // عرض الإحصائيات
    displayStatistics();
    
    // عرض نظرة عامة (التبويب الافتراضي)
    displayOverview();
    
    // عرض التصنيف حسب الانتهاء
    displayExpiryClassification();
    
    // عرض الجامعات
    displayUniversities();
    
    // عرض الأقسام
    displayDepartments();
    
    // تهيئة التبويبات
    initializeTabs();
    
    // تهيئة البحث
    initializeSearch();
}

// تحليل البيانات
function analyzeData() {
    universities = {};
    departments = {};
    
    allContracts.forEach(contract => {
        // تحليل الجامعات
        if (!universities[contract.university]) {
            universities[contract.university] = {
                name: contract.university,
                contracts: [],
                count: 0
            };
        }
        universities[contract.university].contracts.push(contract);
        universities[contract.university].count++;
        
        // تحليل الأقسام
        if (!departments[contract.department]) {
            departments[contract.department] = {
                name: contract.department,
                contracts: [],
                count: 0
            };
        }
        departments[contract.department].contracts.push(contract);
        departments[contract.department].count++;
    });
}

// عرض الإحصائيات الرئيسية
function displayStatistics() {
    const totalContracts = allContracts.length;
    const totalUniversities = Object.keys(universities).length;
    const totalDepartments = Object.keys(departments).length;
    
    document.getElementById('totalContracts').textContent = totalContracts;
    document.getElementById('totalUniversities').textContent = totalUniversities;
    document.getElementById('totalDepartments').textContent = totalDepartments;
}

// تحويل التاريخ من النص إلى كائن Date
function parseDate(dateStr) {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    // التنسيق: DD/MM/YYYY
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// عرض نظرة عامة
function displayOverview() {
    // عرض الإحصائيات الرئيسية
    document.getElementById('overview-total').textContent = allContracts.length;
    document.getElementById('overview-universities').textContent = Object.keys(universities).length;
    document.getElementById('overview-departments').textContent = Object.keys(departments).length;
    
    // التوزيع حسب تاريخ الانتهاء
    const expiryData = getExpiryData();
    const expirySummaryHTML = `
        <div class="overview-expiry-item">
            <div class="overview-expiry-count">${expiryData.before2024}</div>
            <div class="overview-expiry-label">قبل نهاية 2024</div>
        </div>
        <div class="overview-expiry-item">
            <div class="overview-expiry-count">${expiryData.h1_2025}</div>
            <div class="overview-expiry-label">النصف الأول 2025</div>
        </div>
        <div class="overview-expiry-item">
            <div class="overview-expiry-count">${expiryData.h2_2025}</div>
            <div class="overview-expiry-label">النصف الثاني 2025</div>
        </div>
        <div class="overview-expiry-item">
            <div class="overview-expiry-count">${expiryData.from2026}</div>
            <div class="overview-expiry-label">من 2026 فصاعداً</div>
        </div>
    `;
    document.getElementById('overview-expiry-summary').innerHTML = expirySummaryHTML;
    
    // أكبر 5 جامعات
    const sortedUniversities = Object.values(universities).sort((a, b) => b.count - a.count);
    const top5Universities = sortedUniversities.slice(0, 5);
    const topUniversitiesHTML = top5Universities.map((uni, index) => `
        <div class="overview-top-item">
            <span class="overview-top-rank">${index + 1}.</span>
            <span class="overview-top-name">${uni.name}</span>
            <span class="overview-top-count">${uni.count}</span>
        </div>
    `).join('');
    document.getElementById('overview-top-universities').innerHTML = topUniversitiesHTML;
    
    // التوزيع حسب التخصصات
    const sortedDepartments = Object.values(departments).sort((a, b) => b.count - a.count);
    const departmentsHTML = sortedDepartments.map(dept => `
        <div class="overview-dept-item">
            <span class="overview-dept-name">${dept.name}</span>
            <span class="overview-dept-count">${dept.count}</span>
        </div>
    `).join('');
    document.getElementById('overview-departments-summary').innerHTML = departmentsHTML;
}

// الحصول على بيانات الانتهاء
function getExpiryData() {
    let before2024 = 0;
    let h1_2025 = 0;
    let h2_2025 = 0;
    let from2026 = 0;
    
    allContracts.forEach(contract => {
        const endDate = parseDate(contract.contractEnd);
        
        if (endDate < new Date('2024-12-31')) {
            before2024++;
        } else if (endDate >= new Date('2025-01-01') && endDate <= new Date('2025-06-30')) {
            h1_2025++;
        } else if (endDate >= new Date('2025-07-01') && endDate <= new Date('2025-12-31')) {
            h2_2025++;
        } else {
            from2026++;
        }
    });
    
    return { before2024, h1_2025, h2_2025, from2026 };
}

// التصنيف حسب تاريخ الانتهاء
function displayExpiryClassification() {
    const before2024 = [];
    const h1_2025 = [];
    const h2_2025 = [];
    const from2026 = [];
    
    allContracts.forEach(contract => {
        const endDate = parseDate(contract.contractEnd);
        
        if (endDate < new Date('2024-12-31')) {
            before2024.push(contract);
        } else if (endDate >= new Date('2025-01-01') && endDate <= new Date('2025-06-30')) {
            h1_2025.push(contract);
        } else if (endDate >= new Date('2025-07-01') && endDate <= new Date('2025-12-31')) {
            h2_2025.push(contract);
        } else {
            from2026.push(contract);
        }
    });
    
    // تحديث العدادات
    document.getElementById('count-before-2024').textContent = before2024.length;
    document.getElementById('count-h1-2025').textContent = h1_2025.length;
    document.getElementById('count-h2-2025').textContent = h2_2025.length;
    document.getElementById('count-2026-plus').textContent = from2026.length;
    
    // عرض العقود
    displayContractsList('contracts-before-2024', before2024);
    displayContractsList('contracts-h1-2025', h1_2025);
    displayContractsList('contracts-h2-2025', h2_2025);
    displayContractsList('contracts-2026-plus', from2026);
}

// عرض قائمة العقود
function displayContractsList(containerId, contracts) {
    const container = document.getElementById(containerId);
    
    if (contracts.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">لا توجد عقود في هذه الفئة</p>';
        return;
    }
    
    container.innerHTML = contracts.map(contract => `
        <div class="contract-card" onclick="showContractDetails(${contract.id})">
            <div class="contract-header">
                <span class="contract-id">العقد #${contract.id}</span>
                <span class="contract-status ${getStatusClass(contract.status)}">
                    ${contract.status}
                </span>
            </div>
            <div class="contract-info">
                <div class="info-item">
                    <span class="info-label">🏛️ الجامعة:</span>
                    <span>${contract.university}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📚 القسم:</span>
                    <span>${contract.department}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🎓 الدرجة:</span>
                    <span>${contract.degree}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📅 تاريخ الانتهاء:</span>
                    <span>${contract.contractEnd}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📊 التقدم:</span>
                    <span>${contract.progress}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// الحصول على فئة الحالة
function getStatusClass(status) {
    if (status.includes('تحت الإجراء') || status.includes('قيد المراجعة')) {
        return 'status-pending';
    }
    return 'status-active';
}

// عرض الجامعات
function displayUniversities() {
    const container = document.getElementById('universities-list');
    const filterSelect = document.getElementById('university-filter');
    
    // ترتيب الجامعات حسب عدد العقود (تنازلياً)
    const sortedUniversities = Object.values(universities).sort((a, b) => b.count - a.count);
    
    // ملء قائمة الفلتر
    filterSelect.innerHTML = '<option value="all">جميع الجامعات والكليات</option>';
    sortedUniversities.forEach(uni => {
        filterSelect.innerHTML += `<option value="${uni.name}">${uni.name} (${uni.count})</option>`;
    });
    
    // عرض بطاقات الجامعات
    container.innerHTML = sortedUniversities.map(uni => `
        <div class="university-card" onclick="showUniversityContracts('${uni.name}')">
            <div class="university-name">${uni.name}</div>
            <div class="university-stats">
                <div class="university-stat">
                    <div class="stat-number">${uni.count}</div>
                    <div class="stat-text">عدد العقود</div>
                </div>
                <div class="university-stat">
                    <div class="stat-number">${getUniversityUrgentCount(uni.contracts)}</div>
                    <div class="stat-text">عقود متاخرة</div>
                </div>
            </div>
        </div>
    `).join('');
}

// حساب عدد العقود الحرجة لجامعة
function getUniversityUrgentCount(contracts) {
    return contracts.filter(contract => {
        const endDate = parseDate(contract.contractEnd);
        return endDate < new Date('2025-06-30');
    }).length;
}

// عرض عقود جامعة معينة
function showUniversityContracts(universityName) {
    const university = universities[universityName];
    const detailsSection = document.getElementById('university-contracts-details');
    const nameElement = document.getElementById('selected-university-name');
    
    nameElement.textContent = `${universityName} (${university.count} عقد)`;
    displayContractsList('university-contracts-list', university.contracts);
    
    detailsSection.style.display = 'block';
    detailsSection.scrollIntoView({ behavior: 'smooth' });
}

// إغلاق تفاصيل الجامعة
function closeUniversityDetails() {
    document.getElementById('university-contracts-details').style.display = 'none';
}

// عرض الأقسام
function displayDepartments() {
    const container = document.getElementById('departments-list');
    
    // ترتيب الأقسام حسب عدد العقود (تنازلياً)
    const sortedDepartments = Object.values(departments).sort((a, b) => b.count - a.count);
    
    container.innerHTML = sortedDepartments.map(dept => `
        <div class="department-card">
            <div class="department-name">${dept.name}</div>
            <div class="department-stats">
                <div class="dept-stat">
                    <div class="dept-stat-value">${dept.count}</div>
                    <div class="dept-stat-label">إجمالي العقود</div>
                </div>
                <div class="dept-stat">
                    <div class="dept-stat-value">${getDepartmentActiveCount(dept.contracts)}</div>
                    <div class="dept-stat-label">عقود نشطة</div>
                </div>
            </div>
        </div>
    `).join('');
}

// حساب عدد العقود النشطة في قسم
function getDepartmentActiveCount(contracts) {
    return contracts.filter(c => c.status.includes('تحت الإجراء')).length;
}

// عرض تفاصيل العقد في نافذة منبثقة
function showContractDetails(contractId) {
    const contract = allContracts.find(c => c.id === contractId);
    if (!contract) return;
    
    const modal = document.getElementById('contract-modal');
    const detailsContainer = document.getElementById('contract-details');
    
    detailsContainer.innerHTML = `
        <h2 style="color: var(--primary-color); margin-bottom: 30px;">
            📋 تفاصيل العقد #${contract.id}
        </h2>
        <div class="contract-detail-grid">
            <div class="detail-item">
                <div class="detail-label">🏛️ الجامعة</div>
                <div class="detail-value">${contract.university}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">📚 القسم</div>
                <div class="detail-value">${contract.department}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">📖 البرنامج</div>
                <div class="detail-value">${contract.program}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">🎓 الدرجة العلمية</div>
                <div class="detail-value">${contract.degree}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">📊 الحالة</div>
                <div class="detail-value">${contract.status}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">📅 تاريخ البداية</div>
                <div class="detail-value">${contract.contractStart}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">📅 تاريخ الانتهاء</div>
                <div class="detail-value">${contract.contractEnd}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">📈 نسبة التقدم</div>
                <div class="detail-value">${contract.progress}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">📄 تاريخ استلام الوثائق</div>
                <div class="detail-value">${contract.docsReceived || 'غير محدد'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">✅ حالة الوثائق</div>
                <div class="detail-value">${contract.docsComplianceStatus || 'غير محدد'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">🗓️ موعد الزيارة</div>
                <div class="detail-value">${contract.visitScheduled || 'غير محدد'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">🔍 حالة الزيارة</div>
                <div class="detail-value">${contract.visitComplianceStatus || 'غير محدد'}</div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('contract-modal').style.display = 'none';
}

// إغلاق النافذة عند النقر خارجها
window.onclick = function(event) {
    const modal = document.getElementById('contract-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// تهيئة التبويبات
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // إزالة الفئة النشطة من جميع التبويبات
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // عرض جميع العقود إذا كان التبويب النشط
            if (tabName === 'all-contracts') {
                displayAllContracts();
            }
        });
    });
}

// عرض جميع العقود
function displayAllContracts() {
    displayContractsList('all-contracts-list', allContracts);
}

// تهيئة البحث
function initializeSearch() {
    // البحث في الجامعات
    const universitySearch = document.getElementById('university-search');
    universitySearch.addEventListener('input', function() {
        filterUniversities(this.value);
    });
    
    // الفلتر حسب الجامعة
    const universityFilter = document.getElementById('university-filter');
    universityFilter.addEventListener('change', function() {
        if (this.value === 'all') {
            displayUniversities();
        } else {
            showUniversityContracts(this.value);
        }
    });
    
    // البحث في جميع العقود
    const allContractsSearch = document.getElementById('all-contracts-search');
    allContractsSearch.addEventListener('input', function() {
        searchAllContracts(this.value);
    });
}

// فلترة الجامعات
function filterUniversities(searchTerm) {
    const cards = document.querySelectorAll('.university-card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const universityName = card.querySelector('.university-name').textContent.toLowerCase();
        if (universityName.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// البحث في جميع العقود
function searchAllContracts(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allContracts.filter(contract => {
        return contract.university.toLowerCase().includes(term) ||
               contract.department.toLowerCase().includes(term) ||
               contract.program.toLowerCase().includes(term) ||
               contract.degree.toLowerCase().includes(term) ||
               contract.status.toLowerCase().includes(term);
    });
    
    displayContractsList('all-contracts-list', filtered);
}

// إعادة تعيين الفلاتر
function resetFilters() {
    document.getElementById('university-search').value = '';
    document.getElementById('university-filter').value = 'all';
    displayUniversities();
    closeUniversityDetails();
}
