// ==================== 1. 权限拦截（必须放最前面） ====================
const token = localStorage.getItem('rapidocr_token');
if (!token) {
    // 使用 replace 防止用户点击浏览器“后退”按钮又回到历史页
    window.location.replace('login.html');
}

// ==================== 2. 本地 Mock 数据（后端就绪后替换为 fetch） ====================
const MOCK_HISTORY = [
    { id: 1, fileName: '增值税发票_2026Q2.jpg', time: '2026-06-22 10:30:00', status: 'success' },
    { id: 2, fileName: '劳动合同扫描件.png', time: '2026-06-21 15:20:00', status: 'success' },
    { id: 3, fileName: '手写笔记_模糊.pdf', time: '2026-06-20 09:15:00', status: 'fail' },
    { id: 4, fileName: '营业执照_正本.jpg', time: '2026-06-19 14:45:00', status: 'success' },
    { id: 5, fileName: '快递面单_破损.png', time: '2026-06-18 11:00:00', status: 'fail' },
];

// ==================== 3. 核心渲染逻辑 ====================
const listContainer = document.getElementById('historyList');
const paginationContainer = document.getElementById('pagination');

function renderTable(data) {
    if (!data || data.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <div class="empty-text">暂无识别记录</div>
            </div>`;
        paginationContainer.innerHTML = '';
        return;
    }

    const rows = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.fileName}</td>
            <td>${item.time}</td>
            <td>
                <span class="status-tag ${item.status === 'success' ? 'status-success' : 'status-fail'}">
                    ${item.status === 'success' ? '✅ 识别成功' : '❌ 识别失败'}
                </span>
            </td>
        </tr>
    `).join('');

    listContainer.innerHTML = `
        <table class="history-table">
            <thead>
                <tr>
                    <th style="width:80px">#</th>
                    <th>文件名</th>
                    <th style="width:180px">识别时间</th>
                    <th style="width:120px">状态</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// 简易分页渲染（演示用，固定显示当前第1页）
function renderPagination() {
    paginationContainer.innerHTML = `
        <button class="page-btn" disabled>&lt;</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">&gt;</button>`;
}

// ==================== 4. 初始化执行 ====================
renderTable(MOCK_HISTORY);
renderPagination();

// ==================== 5. 退出登录 ====================
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('rapidocr_token');
    window.location.replace('login.html');
});