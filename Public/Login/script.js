const rol = document.getElementById("rol")
const correo = document.getElementById("email")
const password = document.getElementById("contraseña")

document.getElementById("btn").addEventListener("click", () => {
    if (correo.value == "") {
        Swal.fire({
            title: "CAMPO VACIO",
            text: "COMPLETA EL CAMPO DE CORREO",
            icon: "warning",
            confirmButtonColor: '#ffdf00',
        })
    }
    else if (password.value == "") {
        Swal.fire({
            title: "CAMPO VACIO",
            text: "COMPLETA EL CAMPO DE CONTRASEÑA",
            confirmButtonColor: '#ffdf00',
            icon: "warning"
        })
    } else {
        login()

    }
})

const login = async () => {
    try {
        const response = await fetch("/apiLogin/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: correo.value, password: password.value })
        })

        const data = await response.json()
        if (data.errors) {
            return Swal.fire({
                title: "ERROR",
                html: data.errors[0].msg,
                icon: "error",
                confirmButtonColor: '#ffdf00',
            });
        }

        else if (data.estado == 0) {
            ShowAlertBlock(data.tiempo, data.motivo);
        }

        else if (data.msg == 0) {
            Swal.fire({
                title: "UPS",
                text: "CONTRASEÑA INCORRECTA",
                confirmButtonColor: '#ffdf00',
                icon: "error",
            })

        } else {
            sessionStorage.setItem("token", data.token)
            Swal.fire({
                title: "ACCESO APROBADO",
                confirmButtonColor: '#ffdf00',
                icon: "success",
                showConfirmButton: false
            })

            setTimeout(() => {
                window.location.href = data.redirect
            }, 1100)
        }
    }
    catch {
        Swal.fire({
            title: "ERROR",
            text: "HUBO UN ERROR AL HACER EL LOGIN",
            icon: "error",
            confirmButtonColor: '#ffdf00',
        })
    }
}


const ShowAlertBlock = (tiempo, motivo) => {
    Swal.fire({
        title: "BLOQUEADO",
        text: motivo,
        footer: `<span id="tiempo-restante"></span>`,
        icon: "error",
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: tiempo,
        timerProgressBar: true,
        confirmButtonColor: '#ffdf00',
        didOpen: () => {
            const intervalo = setInterval(() => {
                const restante = Swal.getTimerLeft();
                if (restante !== null) {
                    const minutos = Math.floor(restante / 1000 / 60);
                    const segundos = Math.floor((restante / 1000) % 60);
                    document.getElementById("tiempo-restante").textContent = `Tiempo restante: ${minutos} Minutos ${segundos} Segundos`;
                } else {
                    clearInterval(intervalo);
                }
            }, 100);
        }
    });
}

const eye = document.getElementById("eye")
eye.addEventListener("click", () => {
    if (password.type == "password") {
        password.type = "text"
        eye.classList.remove("bi-eye");
        eye.classList.add("bi-eye-slash")
    } else {
        eye.classList.remove("bi-eye-slash");
        eye.classList.add("bi-eye");
        password.type = "password"
    }
});

