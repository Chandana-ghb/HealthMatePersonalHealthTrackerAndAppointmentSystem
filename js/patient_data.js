document.addEventListener('DOMContentLoaded', async () => {
  const contentArea = document.getElementById('contentArea');
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  // Get user ID and role from localStorage
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  // Redirect to login if not authenticated
  if (!userId || userRole !== 'PATIENT') {
    alert("Unauthorized access. Please login as a patient.");
    window.location.href = "create_account.html";
    return;
  }

  // Fetch and display user profile
  async function loadUserProfile() {
    try {
      const response = await fetch(`https://healthmatepersonalhealthtrackerandappoin.onrender.com/user/getuses/${userId}`);
      if (!response.ok) throw new Error("User not found");

      const user = await response.json();
      contentArea.innerHTML = `
        <h2>Profile</h2>
        <div class="card p-3 mt-3">
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role}</p>
        </div>
      `;
    } catch (err) {
      contentArea.innerHTML = `<p class="text-danger">Failed to load profile: ${err.message}</p>`;
    }
  }

  // Handle sidebar click events
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-content');

      switch (section) {
        case 'dashboard':
          contentArea.innerHTML = `
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard. Here is your latest activity overview.</p>
          `;
          break;
        case 'profile':
          loadUserProfile();
          break;
        case 'appointments':
          contentArea.innerHTML = `<h2>Appointments</h2><p>Your upcoming appointments will be shown here.</p>`;
          break;
        case 'prescription':
          contentArea.innerHTML = `<h2>Prescription</h2><p>Your prescriptions will be shown here.</p>`;
          break;
        case 'logout':
          localStorage.clear();
          window.location.href = "create_account.html";
          break;
        default:
          contentArea.innerHTML = `<h2>Welcome</h2>`;
      }
    });
  });
});
