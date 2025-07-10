// ===================================================
// 🔐 CONFIGURACIÓN DE AUTENTICACIÓN
// ===================================================

const token = sessionStorage.getItem("token")

if (!token) {
    window.location.replace("Login/login.html")
} else {
    setupAutoLogout(token);
}

// ===================================================
// ⏰ FUNCIÓN DE AUTO-LOGOUT
// ===================================================

function setupAutoLogout(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const timeUntilExpiry = expirationTime - Date.now();

    setTimeout(() => {
        Swal.fire({
            icon: "warning",
            title: "Sesión Expirada",
            text: "Tu sesión ha caducado por seguridad. Serás redirigido al login.",
            confirmButtonText: "Entendido",
            confirmButtonColor: '#ffdf00',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: false
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('token');
                window.location.replace('/Login/login.html');
            }
        });
    }, timeUntilExpiry);
}

// ===================================================
// 🎨 CONFIGURACIÓN DE INTERFAZ RESPONSIVE
// ===================================================

const btnToggleSidebarModal = document.getElementById('logoModalLauncher');
const EditModal = new bootstrap.Modal(document.getElementById('miModal'));
const sidebarModal = new bootstrap.Modal(document.getElementById('miModalLateral'));

btnToggleSidebarModal.addEventListener('click', () => {
    const isSmallScreen = window.innerWidth < 1200;

    if (isSmallScreen) {
        sidebarModal.show();
    }
});

// ===================================================
// 👁️ FUNCIONALIDAD MOSTRAR/OCULTAR CONTRASEÑAS
// ===================================================

const eye = document.getElementById("eye");
const password = document.getElementById("input-password");

eye.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        eye.classList.remove("bi-eye");
        eye.classList.add("bi-eye-slash");
    } else {
        password.type = "password";
        eye.classList.remove("bi-eye-slash");
        eye.classList.add("bi-eye");
    }
});

const eyeCon = document.getElementById("eyeCon");
const passwordCon = document.getElementById("input-confirm-password");

eyeCon.addEventListener("click", () => {
    if (passwordCon.type == "password") {
        passwordCon.type = "text";
        eyeCon.classList.remove("bi-eye");
        eyeCon.classList.add("bi-eye-slash");
    } else {
        passwordCon.type = "password";
        eyeCon.classList.remove("bi-eye-slash");
        eyeCon.classList.add("bi-eye");
    }
});

// ===================================================
// 🔄 GESTIÓN DE DATOS DE USUARIO
// ===================================================

function resertForm() {
    document.getElementById("input-name").value = "";
    document.getElementById("input-email").value = "";
    document.getElementById("input-password").value = "";
    document.getElementById("input-confirm-password").value = "";
}

// ===================================================
// 🌐 INICIALIZACIÓN Y CARGA DE DATOS
// ===================================================

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/das/dash", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            token: token
        }
    })

    if (response.status == 401) {
        sessionStorage.removeItem("token")
        window.location.replace("/Login/login.html");
    }

    const data = await response.json()
    console.log(data.msg);

    // ===================================================
    // 🖥️ ACTUALIZAR INTERFAZ CON DATOS DEL USUARIO
    // ===================================================

    document.getElementById("user-name-sidebar").textContent = data.msg[0].nombre
    document.getElementById("user-name-modal").textContent = data.msg[0].nombre

    // ===================================================
    // 📝 CONFIGURAR FORMULARIO DE EDICIÓN
    // ===================================================

    const loadFormData = () => {
        document.getElementById("input-name").value = data.msg[0].nombre;
        document.getElementById("input-email").value = data.msg[0].correo;
        document.getElementById("input-password").value = data.msg[0].contraseña;
        document.getElementById("input-confirm-password").value = data.msg[0].contraseña;
    }

    document.getElementById("btn-edit").addEventListener("click", loadFormData)
    document.getElementById("btn-edit-responsive").addEventListener("click", loadFormData)

    // ===================================================
    // 💾 FUNCIONALIDAD DE GUARDAR CAMBIOS
    // ===================================================

    document.getElementById('save').addEventListener("click", async () => {
        try {
            const name = document.getElementById("input-name").value;
            const email = document.getElementById("input-email").value;
            const password = document.getElementById("input-password").value;
            const confirmPassword = document.getElementById("input-confirm-password").value;

            if (password !== confirmPassword) {
                return Swal.fire({
                    icon: "error",
                    confirmButtonColor: '#ffdf00',
                    title: "Las contraseñas no coinciden",
                });
            }
            else if (password == "" || confirmPassword == "") {
                return Swal.fire({
                    icon: "error",
                    title: "CAMPO VACIO",
                    text: "COMPLETA EL CAMPO CONTRASEÑA",
                    confirmButtonColor: '#ffdf00',
                });
            }
            else if (name === "") {
                return Swal.fire({
                    icon: "error",
                    title: "CAMPO VACIO",
                    text: "COMPLETA EL CAMPO NOMBRE",
                    confirmButtonColor: '#ffdf00',
                });
            }

            else if (email === "") {
                return Swal.fire({
                    icon: "error",
                    title: "CAMPO VACIO",
                    text: "COMPLETA EL CAMPO EMAIL",
                    confirmButtonColor: '#ffdf00',
                });
            }

            const resposeOne = await fetch("/das/actualizar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: token
                },
                body: JSON.stringify({
                    nombre: name,
                    correo: email,
                    contraseña: password,
                    persona: data.msg
                })
            });

            const updateData = await resposeOne.json();
            if (updateData.error) {
                return Swal.fire({
                    title: updateData.error,
                    icon: "error"
                })
            }

            Swal.fire({
                icon: "success",
                confirmButtonColor: '#ffdf00',
                title: "Datos actualizados exitosamente"
            });
            resertForm()
            document.getElementById("user-name-sidebar").textContent = updateData.usuario.nombre;
            document.getElementById("user-name-modal").textContent = updateData.usuario.nombre;

            data.msg[0].nombre = updateData.usuario.nombre;
            data.msg[0].correo = updateData.usuario.correo;
            data.msg[0].contraseña = updateData.usuario.contraseña;
            EditModal.hide()

        }
        catch {
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error al actualizar los datos",
                confirmButtonColor: '#ffdf00',
            });
        }

    });
})

// ===================================================
// 🚪 FUNCIONALIDAD DE LOGOUT
// ===================================================

const logoutButtons = document.querySelectorAll("#btn-logout-user, #btn-logout-user2");

logoutButtons.forEach(btn => {
    if (btn) {
        btn.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            window.location.replace(`/Login/login.html`);
        });
    }
});