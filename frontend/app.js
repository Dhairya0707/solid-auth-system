const API_URL = "http://localhost:3000/api"; // Adjust port if needed

// DOM Elements
const authView = document.getElementById("auth-view");
const dashboardView = document.getElementById("dashboard-view");
const authForm = document.getElementById("auth-form");
const nameGroup = document.getElementById("name-group");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const submitBtn = document.getElementById("submit-btn");
const toggleForm = document.getElementById("toggle-form");
const toggleText = document.getElementById("toggle-text");
const statusMsg = document.getElementById("status-msg");

const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userId = document.getElementById("user-id");
const logoutBtn = document.getElementById("logout-btn");

let isLogin = true;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    showDashboard();
  }
});

// Toggle between Login and Register
toggleForm.addEventListener("click", () => {
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = "Welcome";
    formSubtitle.textContent = "Continue to your Auth0 workspace.";
    nameGroup.classList.add("hidden");
    submitBtn.textContent = "Sign In";
    toggleText.innerHTML =
      "New to Auth0? <span id='toggle-form' class='text-brand-primary cursor-pointer hover:text-brand-black font-bold transition-colors ml-2 underline underline-offset-8 decoration-2 decoration-brand-primary/30 hover:decoration-brand-black'>Create Account</span>";
  } else {
    formTitle.textContent = "Join Auth0";
    formSubtitle.textContent = "Create your secure workspace.";
    nameGroup.classList.remove("hidden");
    submitBtn.textContent = "Create Account";
    toggleText.innerHTML =
      "Already a member? <span id='toggle-form' class='text-brand-primary cursor-pointer hover:text-brand-black font-bold transition-colors ml-2 underline underline-offset-8 decoration-2 decoration-brand-primary/30 hover:decoration-brand-black'>Sign In</span>";
  }

  // Re-attach listener because innerHTML wipes it
  document
    .getElementById("toggle-form")
    .addEventListener("click", () => toggleForm.click());
  statusMsg.className = "hidden";
});

// Handle Form Submission
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;

  const endpoint = isLogin ? "/auth/login" : "/auth/register";
  const payload = isLogin ? { email, password } : { name, email, password };

  showStatus("Processing...", "info");

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // Essential for receiving HttpOnly cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    if (isLogin) {
      localStorage.setItem("accessToken", data.accessToken);
      // refreshToken is now handled by HttpOnly cookie automatically
      showStatus("Login successful!", "success");
      setTimeout(showDashboard, 1000);
    } else {
      showStatus("Account created! Please sign in.", "success");
      isLogin = false;
      toggleForm.click();
    }
  } catch (error) {
    showStatus(error.message, "error");
  }
});

// Show Dashboard
async function showDashboard() {
  authView.classList.add("hidden");
  authView.classList.remove("opacity-100");
  dashboardView.classList.remove("hidden");
  // slight delay for fade-in effect
  setTimeout(() => dashboardView.classList.add("opacity-100"), 50);

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include", // Ensure cookies are sent if needed by backend (though /me relies on accessToken)
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Try refresh if access token is invalid/expired
        await handleRefresh();
        return;
      }
      throw new Error(data.message);
    }

    userName.textContent = data.user.name;
    userEmail.textContent = data.user.email;
    // userId.textContent = data.user._id;
  } catch (error) {
    logout();
  }
}

// Handle Token Refresh
async function handleRefresh() {
  try {
    // We don't read refreshToken from localStorage anymore.
    // The browser will automatically send the HttpOnly cookie.
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Crucial: Sends the HttpOnly refreshToken cookie
      // body is empty because token is in the cookie
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Refresh failed");

    localStorage.setItem("accessToken", data.accessToken);
    // New refreshToken cookie is automatically set by the response
    showDashboard();
  } catch (error) {
    logout();
  }
}

// Logout
logoutBtn.addEventListener("click", logout);

async function logout() {
  const token = localStorage.getItem("accessToken");

  // Call backend logout to clear the HttpOnly cookie and nullify DB token
  try {
    await fetch(`${API_URL}/user/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include", // Ensure cookie clearing works
    });
  } catch (e) {
    console.error("Logout API failed", e);
  }

  localStorage.removeItem("accessToken");
  // No need to clear refreshToken from localStorage as it's not there
  window.location.reload();
}

// Helper: Show Status Message
function showStatus(msg, type) {
  statusMsg.textContent = msg;
  statusMsg.className = "p-5 mb-10 text-sm font-semibold rounded-xl border-2";
  
  if (type === 'error') {
    statusMsg.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
  } else if (type === 'success') {
    statusMsg.classList.add('bg-green-50', 'text-green-700', 'border-green-200');
  } else {
    statusMsg.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200');
  }
}
