class RegistroHoras {
    constructor() {
        this.registros = JSON.parse(localStorage.getItem('registros')) || [];
        this.form = document.getElementById('registroForm');
        this.table = document.getElementById('registrosBody');
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.notificationContainer = document.getElementById('notificationContainer');

        this.initEventListeners();
        this.renderRegistros();
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.registrarHoras();
        });

        this.searchButton.addEventListener('click', () => this.buscarRegistros());
    }

    registrarHoras() {
        const nombre = document.getElementById('nombre').value;
        const rango = document.getElementById('rango').value;
        const fecha = document.getElementById('fecha').value;
        const horaEntrada = document.getElementById('horaEntrada').value;
        const horaSalida = document.getElementById('horaSalida').value;

        const tiempoTrabajado = this.calcularTiempoTrabajado(horaEntrada, horaSalida);
        const estado = this.validarTiempoTrabajado(tiempoTrabajado);

        const registro = {
            nombre,
            rango,
            fecha,
            horaEntrada,
            horaSalida,
            tiempoTrabajado,
            estado
        };

        this.registros.push(registro);
        this.guardarRegistros();
        this.renderRegistros();
        this.form.reset();

        if (estado === 'incumplido') {
            this.mostrarNotificacion(`${nombre} no cumplió con las 3 horas mínimas`);
        }
    }

    calcularTiempoTrabajado(entrada, salida) {
        const [entradaHoras, entradaMinutos] = entrada.split(':').map(Number);
        const [salidaHoras, salidaMinutos] = salida.split(':').map(Number);

        let totalMinutos = (salidaHoras * 60 + salidaMinutos) - (entradaHoras * 60 + entradaMinutos);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        return `${horas}h ${minutos}m`;
    }

    validarTiempoTrabajado(tiempo) {
        const [horas] = tiempo.split('h').map(Number);
        return horas >= 3 ? 'cumplido' : 'incumplido';
    }

    renderRegistros(filtro = '') {
        this.table.innerHTML = '';
        const registrosFiltrados = this.registros.filter(registro => 
            registro.nombre.toLowerCase().includes(filtro.toLowerCase())
        );

        registrosFiltrados.forEach(registro => {
            const row = document.createElement('tr');
            row.classList.add(registro.estado);
            row.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.rango}</td>
                <td>${registro.fecha}</td>
                <td>${registro.horaEntrada}</td>
                <td>${registro.horaSalida}</td>
                <td>${registro.tiempoTrabajado}</td>
                <td>${registro.estado === 'cumplido' ? '✓' : '✗'}</td>
            `;
            this.table.appendChild(row);
        });
    }

    buscarRegistros() {
        const filtro = this.searchInput.value;
        this.renderRegistros(filtro);
    }

    guardarRegistros() {
        localStorage.setItem('registros', JSON.stringify(this.registros));
    }

    mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.classList.add('notification');
        notificacion.textContent = mensaje;
        this.notificationContainer.appendChild(notificacion);

        setTimeout(() => {
            this.notificationContainer.removeChild(notificacion);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegistroHoras();
});