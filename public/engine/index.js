
async function intializeLogin() {

    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    try {

        const response = await fetch('./engine/user.json');
        const users = await response.json();

        const userValided = users.find(u =>
            u.email === email &&
            u.password === senha
        );

        if (userValided) {

            localStorage.setItem('usuarioAtual', JSON.stringify(userValided));

            window.location.href = './dashboard.html';

        } else {

            alert('E-mail ou senha incorretos. Verifique seus dados.');

        }

    } catch (e) {

        console.error('Erro ao buscar os dados:', e);
        alert('Não foi possível realizar o login.');

    }
}


function loadUserStorage() {

    const loadUser = JSON.parse(localStorage.getItem('usuarioAtual'));

    if (!loadUser) {

        window.location.replace('./index.html');
        return;

    }

    const foto = document.getElementById('load-img');

    if (loadUser.photoUrl) {

        foto.innerHTML = `
            <img src="${loadUser.photoUrl}"
                alt="Foto de ${loadUser.name}"
                class="profile-image"
                onerror="this.style.display='none'">
        `;

    } else {

        foto.innerHTML = `
            <div class="text-center p-5">
                <i class="bi bi-person-circle"
                    style="font-size: 100px; color: #d58aa7;">
                </i>
            </div>
        `;

    }

    document.getElementById('load-nome').innerText = loadUser.name;
    document.getElementById('load-email').innerText = loadUser.email;

    document.getElementById('load-data').innerText =
        new Date().toLocaleDateString('pt-BR');


    const saldo = Number(loadUser.saldo) || 0;
    const pontos = Number(loadUser.pontos) || 0;

    const extrato = Array.isArray(loadUser.extrato)
        ? loadUser.extrato
        : [];


    document.getElementById('load-extrato').innerHTML = `

        <div class="col-md-6">

            <div class="info-card">

                <i class="bi bi-wallet2"></i>

                <h5>Saldo disponível</h5>

                <h3>R$ ${saldo.toFixed(2).replace('.', ',')}</h3>

            </div>

        </div>

        <div class="col-md-6">

            <div class="info-card">

                <i class="bi bi-stars"></i>

                <h5>Pontos acumulados</h5>

                <h3>${pontos.toFixed(2).replace('.', ',')}</h3>

            </div>

        </div>

    `;


    if (extrato.length === 0) {

        document.getElementById('login-extrato').innerHTML = `
            <div class="history-item p-4">
                Você ainda não possui movimentações.
            </div>
        `;

    } else {

        let historico = '';

        extrato.forEach(item => {

            const valor = Number(item.valor) || 0;

            historico += `

                <div class="history-item p-3">

                    <div class="d-flex justify-content-between flex-wrap">

                        <strong>
                            <i class="bi bi-receipt"></i>
                            ${item.descricao}
                        </strong>

                        <span>
                            ${valor.toFixed(2).replace('.', ',')}
                        </span>

                    </div>

                    <small>${item.data || ''}</small>

                </div>

            `;

        });

        document.getElementById('login-extrato').innerHTML = historico;

    }

}


function logoutUser() {

    localStorage.removeItem('usuarioAtual');

    window.location.href = './index.html';

}
