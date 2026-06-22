// === 通用工具函数 ===
const showError = (elementId, message) => {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
};
const clearErrors = (...ids) => ids.forEach(id => showError(id, ''));

// === 登录逻辑 ===
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors('usernameError', 'passwordError');

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        let hasError = false;

        if (!username) { showError('usernameError', '请输入用户名'); hasError = true; }
        if (!password) { showError('passwordError', '请输入密码'); hasError = true; }
        if (hasError) return;

        const btn = document.getElementById('loginBtn');
        btn.disabled = true;
        btn.textContent = '登录中...';

        try {
            // TODO: 替换为实际后端API地址
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem('rapidocr_token', data.token);
                localStorage.setItem('rapidocr_user', username);

                // 👇 【唯一修改处】登录成功后跳转到Flask首页路由
                // index.html是Jinja2模板，必须通过后端"/"路由渲染，不可用文件相对路径
                window.location.href = '/';
            } else {
                showError('passwordError', data.message || '登录失败，请检查用户名和密码');
            }
        } catch (err) {
            showError('passwordError', '网络异常，请稍后重试');
        } finally {
            btn.disabled = false;
            btn.textContent = '登 录';
        }
    });
}

// === 注册逻辑 ===
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors('regUsernameError', 'regPasswordError', 'confirmPasswordError');

        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        let hasError = false;

        // 前端校验规则
        if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            showError('regUsernameError', '用户名需3-20位字母、数字或下划线');
            hasError = true;
        }
        if (!password || password.length < 6 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            showError('regPasswordError', '密码至少6位，需包含字母和数字');
            hasError = true;
        }
        if (password !== confirmPassword) {
            showError('confirmPasswordError', '两次输入的密码不一致');
            hasError = true;
        }
        if (hasError) return;

        const btn = document.getElementById('registerBtn');
        btn.disabled = true;
        btn.textContent = '注册中...';

        try {
            // TODO: 替换为实际后端API地址
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                alert('注册成功！即将跳转至登录页...');
                setTimeout(() => window.location.href = './login.html', 1000);
            } else {
                showError('regUsernameError', data.message || '注册失败');
            }
        } catch (err) {
            showError('regUsernameError', '网络异常，请稍后重试');
        } finally {
            btn.disabled = false;
            btn.textContent = '注 册';
        }
    });
}