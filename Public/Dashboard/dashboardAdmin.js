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
// 🌐 INICIALIZACIÓN Y CARGA DE DATOS
// ===================================================

document.addEventListener("DOMContentLoaded", async () => {
    const EditModal = new bootstrap.Modal(document.getElementById('miModal'));
    if (!token) {
        return window.location.href = "../Login/login.html";
    }

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

    document.getElementById("user-name-sidebar").textContent = data.msg[0].nombre
    document.getElementById("user-name-modal").textContent = data.msg[0].nombre

    const loadFormData = () => {
        document.getElementById("input-name").value = data.msg[0].nombre;
        document.getElementById("input-email").value = data.msg[0].correo;
        document.getElementById("password-update").value = data.msg[0].contraseña;
        document.getElementById("confirm-password-update").value = data.msg[0].contraseña;
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
            const password = document.getElementById("password-update").value;
            const confirmPassword = document.getElementById("confirm-password-update").value;

            if (password !== confirmPassword) {
                return Swal.fire({
                    icon: "error",
                    title: "Las contraseñas no coinciden",
                    confirmButtonColor: 'ffdf00'
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
                    nombre: name, correo: email, contraseña: password, persona: data.msg
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
// 🟦 MODAL LATERAL: Inicialización y control responsivo
// ===================================================

const btnToggleSidebarModal = document.getElementById('logoModalLauncher');
const sidebarModal = new bootstrap.Modal(document.getElementById('miModalLateral'));

btnToggleSidebarModal.addEventListener('click', () => {
    if (window.innerWidth < 1200) {
        sidebarModal.show();
    }
});

// ===================================================
// 👤 GESTIÓN DE USUARIOS - REGISTRO
// ===================================================

let valido = false;

document.getElementById("register").addEventListener("click", async (e) => {
    e.preventDefault();

    const Name = document.getElementById("nombre-reg").value.trim();
    const Email = document.getElementById("email-reg").value.trim();
    const Password = document.getElementById("contraseña-reg").value;
    const ConfirmPassword = document.getElementById("confi_contraseña-reg").value;
    const Rol = document.getElementById("select-reg").value;

    validation(Name, Email, Password, ConfirmPassword, Rol);

    if (valido) {
        await register(Name, Email, Password, Rol);
    }
});

const register = async (Name, Email, Password, Rol) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("/api/registrar/usuario/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({ Name, Email, Password, Rol })
        });

        const data = await response.json();

        if (data.errors) {
            return Swal.fire({
                icon: "error",
                title: "Error",
                text: data.errors?.[0]?.msg || "Ocurrió un error inesperado",
                confirmButtonColor: '#ffdf00'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: data.message || "Registro exitoso",
                showConfirmButton: false,
                confirmButtonColor: '#ffdf00',
                timer: 1500
            });
        }

        document.getElementById("nombre-reg").value = "";
        document.getElementById("email-reg").value = "";
        document.getElementById("contraseña-reg").value = "";
        document.getElementById("confi_contraseña-reg").value = "";
        document.getElementById("select-reg").selectedIndex = 0;

        const modal = bootstrap.Modal.getInstance(document.getElementById('miModalAdmin'));
        modal.hide();

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: error.message,
            confirmButtonColor: '#ffdf00'
        });
    }
};

// ===================================================
// 🚪 FUNCIONALIDAD DE LOGOUT
// ===================================================

const logoutButtons = document.querySelectorAll("#btn-logout-admin, #btn-logout-admin2");

logoutButtons.forEach(btn => {
    if (btn) {
        btn.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            window.location.replace(`/Login/login.html`);
        });
    }
});

// ===================================================
// 🔐 VALIDACIÓN DE FORMULARIOS
// ===================================================

const validation = (Name, Email, Password, ConfirmPassword, Rol) => {
    valido = false;

    const tieneMayuscula = /[A-ZÑ]/.test(Password);
    const tieneMinuscula = /[a-zñ]/.test(Password);
    const tieneNumero = /[0-9]/.test(Password);
    const tieneSimbolo = /[^A-Za-z0-9]/.test(Password);
    const validarCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email);

    if (Rol === "SELECCIONE EL ROL DE LA PERSONA") {
        return Swal.fire({
            icon: "error",
            title: "Selecciona un rol",
            text: "Debes asignar un rol al usuario",
            confirmButtonColor: '#ffdf00'
        });
    } else if (Name === "") {
        return Swal.fire({
            icon: "error",
            title: "Campo vacío",
            text: "Completa el campo nombre",
            confirmButtonColor: '#ffdf00'
        });
    } else if (Email === "") {
        return Swal.fire({
            icon: "error",
            title: "Campo vacío",
            text: "Completa el campo email",
            confirmButtonColor: '#ffdf00'
        });
    } else if (!validarCorreo) {
        return Swal.fire({
            icon: "error",
            title: "Correo inválido",
            text: "Formato de correo incorrecto",
            confirmButtonColor: '#ffdf00'
        });
    } else if (Password.length < 8) {
        return Swal.fire({
            icon: "error",
            title: "Contraseña débil",
            text: "Debe tener al menos 8 caracteres",
            confirmButtonColor: '#ffdf00'
        });
    } else if (!tieneMayuscula) {
        return Swal.fire({
            icon: "error",
            title: "Contraseña",
            text: "Debe contener mayúsculas",
            confirmButtonColor: '#ffdf00'
        });
    } else if (!tieneMinuscula) {
        return Swal.fire({
            icon: "error",
            title: "Contraseña",
            text: "Debe contener minúsculas",
            confirmButtonColor: '#ffdf00'
        });
    } else if (!tieneNumero) {
        return Swal.fire({
            icon: "error",
            title: "Contraseña",
            text: "Debe contener números",
            confirmButtonColor: '#ffdf00'
        });
    } else if (!tieneSimbolo) {
        return Swal.fire({
            icon: "error",
            title: "Contraseña",
            text: "Debe contener caracteres especiales",
            confirmButtonColor: '#ffdf00'
        });
    } else if (Password !== ConfirmPassword) {
        return Swal.fire({
            icon: "error",
            title: "Contraseñas distintas",
            text: "Verifica que coincidan",
            confirmButtonColor: '#ffdf00'
        });
    }

    valido = true;
};

// ===================================================
// 👁️ MOSTRAR/OCULTAR CONTRASEÑAS
// ===================================================

const eye = document.getElementById("eye");
const password = document.getElementById("contraseña-reg");

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
const passwordCon = document.getElementById("confi_contraseña-reg");

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

const eyeUpdate = document.getElementById("eye-update");
const passwordUpdate = document.getElementById("password-update");

eyeUpdate.addEventListener("click", () => {
    if (passwordUpdate.type === "password") {
        passwordUpdate.type = "text";
        eyeUpdate.classList.remove("bi-eye");
        eyeUpdate.classList.add("bi-eye-slash");
    } else {
        passwordUpdate.type = "password";
        eyeUpdate.classList.remove("bi-eye-slash");
        eyeUpdate.classList.add("bi-eye");
    }
});

const eyeConUpdate = document.getElementById("eyeCon-update");
const passwordConUpdate = document.getElementById("confirm-password-update");

eyeConUpdate.addEventListener("click", () => {
    if (passwordConUpdate.type == "password") {
        passwordConUpdate.type = "text";
        eyeConUpdate.classList.remove("bi-eye");
        eyeConUpdate.classList.add("bi-eye-slash");
    } else {
        passwordConUpdate.type = "password";
        eyeConUpdate.classList.remove("bi-eye-slash");
        eyeConUpdate.classList.add("bi-eye");
    }
});