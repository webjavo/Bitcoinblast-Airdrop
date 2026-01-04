const modal = document.getElementById("modalContainer");
const overlay = document.getElementById("modalOverlay");

function openModal(html) {
  modal.innerHTML = html;
  overlay.style.display = "block";
  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
  overlay.style.display = "none";
}

/* =========================
   AUTH POPUPS
========================= */
function loginPopup() {
  openModal(`
    <h2>Login</h2>
    <input placeholder="Email" />
    <input placeholder="Password" type="password" />
    <div class="modal-actions">
      <button class="btn cancel" onclick="closeModal()">Cancel</button>
      <button class="btn confirm">Login</button>
    </div>
  `);
}

function registerPopup() {
  openModal(`
    <h2>Create Account</h2>
    <input placeholder="Username" />
    <input placeholder="Phone Number" />
    <input placeholder="Email" />
    <input placeholder="Password" type="password" />
    <input placeholder="Pet (Security Answer)" />
    <div class="modal-actions">
      <button class="btn cancel" onclick="closeModal()">Cancel</button>
      <button class="btn confirm">Submit</button>
    </div>
  `);
}

function forgotPopup() {
  openModal(`
    <h2>Reset Password</h2>
    <input placeholder="Username" />
    <input placeholder="Pet" />
    <input placeholder="New Password" type="password" />
    <div class="modal-actions">
      <button class="btn cancel" onclick="closeModal()">Cancel</button>
      <button class="btn confirm">Reset</button>
    </div>
  `);
}
