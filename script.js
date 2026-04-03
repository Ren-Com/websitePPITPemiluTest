// Simulasi kredensial login (username: admin, password: 1234)
const VALID_CREDENTIALS = { username: 'admin', password: '1234' };
const STORAGE_KEY = 'cakraprana_voting';
let currentCandidate = null;

// Cek status login dan voting saat halaman dimuat
window.addEventListener('load', function () {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const voteData = localStorage.getItem(STORAGE_KEY);

    if (isLoggedIn) {
        showVotingPage(voteData);
    }
});

// Handle login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username && password && username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        location.reload();
    } else {
        alert('Username atau password salah!');
    }
});

// Fungsi menampilkan halaman voting
function showVotingPage(voteData) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('votingPage').style.display = 'block';

    if (voteData) {
        const parsedVote = JSON.parse(voteData);
        disableAllButtonsExcept(parsedVote.candidate);
        showVotedMessage(parsedVote.candidate);
    }
}

// Handle klik tombol kandidat - MENAMPILKAN MODAL
document.querySelectorAll('.candidate-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (this.classList.contains('voted')) return;

        currentCandidate = this.dataset.candidate;
        const candidateName = this.textContent.trim();
        document.getElementById('modalQuestion').textContent =
            `Apakah anda yakin memilih ${candidateName}?`;

        document.getElementById('confirmModal').style.display = 'flex';
    });
});

// Konfirmasi voting (Ya, saya yakin)
document.getElementById('confirmVote').addEventListener('click', function () {
    if (!currentCandidate) return;

    const voteData = {
        candidate: currentCandidate,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(voteData));

    // Tutup modal
    document.getElementById('confirmModal').style.display = 'none';

    // Alert konfirmasi
    alert(`Terima kasih, Anda sudah memilih Kandidat ${currentCandidate}`);

    // Update UI
    disableAllButtonsExcept(currentCandidate);
    showVotedMessage(currentCandidate);

    currentCandidate = null;
});

// Batal voting (Tidak, kembali)
document.getElementById('cancelVote').addEventListener('click', function () {
    document.getElementById('confirmModal').style.display = 'none';
    currentCandidate = null;
});

// Tutup modal saat klik overlay
document.getElementById('confirmModal').addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = 'none';
        currentCandidate = null;
    }
});

// Nonaktifkan semua tombol kecuali yang dipilih
function disableAllButtonsExcept(selected) {
    document.querySelectorAll('.candidate-btn').forEach(btn => {
        if (btn.dataset.candidate !== selected) {
            btn.classList.add('voted');
            btn.disabled = true;
        }
    });
    document.querySelector(`[data-candidate="${selected}"]`).classList.add('voted');
}

// Tampilkan pesan voting berhasil
function showVotedMessage(candidate) {
    const message = document.getElementById('votedMessage');
    message.innerHTML = `✅ Terima kasih! Anda sudah memilih Kandidat ${candidate}. Suara Anda sangat berharga!`;
    message.style.display = 'block';
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
});