const txtTarefa = window.document.getElementById('txtTarefa');
const btnAdicionar = window.document.getElementById('btnAdicionar');
const btnLimpar = window.document.getElementById('btnlimpar');
const lista = window.document.getElementById('ulLista');
const todos = window.document.getElementById('span-todos');
const pend = window.document.getElementById('span-pendente');
const conc = window.document.getElementById('span-concluido');

const modal = window.document.querySelector('.modal-container');
const btnFechar = window.document.getElementById('btnFechar');
const btnSalvar = window.document.getElementById('btnSalvar');
const inputModal = window.document.getElementById('inputModal');

let tarefas = [];
let index = 0;
let concluido = 'concluído';
let pendente = 'pendente';



/* ===== Carrega as tarefas assim que a aplicação inicia ===== */
function carregarTarefas() {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    if(ConsultaDados === null){
        return;
    }else {

        lista.innerHTML = '';

        ConverteDados.forEach((item) => {
            addTarefas(item.Tarefa);
        });

        carregaChecados();
    }
}
carregarTarefas();
habilitarBtnLimpar();

/* ===== Salva as tarefas ===== */
function salvaTarefas() {

    let texto = txtTarefa.value;
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    tarefas.push({'Tarefa':texto, 'status':pendente});
    console.log(tarefas);

    if(ConsultaDados === null){

        localStorage.setItem('db_tasks', JSON.stringify(tarefas));
        
        lista.innerHTML = '';
        addTarefas(texto);

    }else {

        let novoObjt = {'Tarefa':texto, 'status':pendente};

        ConverteDados.push(novoObjt);
        localStorage.setItem('db_tasks', JSON.stringify(ConverteDados));

        addTarefas(texto);

    }
}

/* ===== Exclui tarefas do localStorage ===== */
function delTarefas(index) {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    ConverteDados.splice(index, 1);

    localStorage.setItem('db_tasks', JSON.stringify(ConverteDados));
    console.log(ConverteDados);

    excluirTarefas();
    carregarTarefas();
    //carregaChecados();
    addFrase();
}

/* ===== Editar tarefas ===== */
function editarTarefas(index) {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);
    let editTarefa;

    modal.style.display = 'flex';
    inputModal.focus();
    btnSalvar.disabled = false;

    inputModal.value = ConverteDados[index].Tarefa;
    editTarefa = inputModal.value;

    inputModal.addEventListener('input', (e)=> {
        editTarefa = e.target.value;
        habilitarBtnSalvar();
    });
    

    btnSalvar.addEventListener('click', ()=> {
    
        ConverteDados[index].Tarefa = editTarefa;
        localStorage.setItem('db_tasks', JSON.stringify(ConverteDados));

        excluirTarefas();
        carregarTarefas();
    
        modal.style.display = 'none';
        txtTarefa.focus();
    });

}


/* ===== Adiciona as tarefas na lista ===== */
function addTarefas(textotarefa) {
    let tarefa = document.createElement('li');
    tarefa.setAttribute('class', 'item');
    tarefa.setAttribute('type', 'none');
    tarefa.setAttribute('id', `${index}`);

    tarefa.innerHTML = `<div class="div-itens">
                            <input type="checkbox" id="cbox-${index}" onclick="statusCheck(this.id)">
                            <label class="abas" for="cbox-${index}" id="lbl-${index}">${textotarefa}</label>
                        </div>
                        <div class="botoes">
                            <button class="btnEditar" id="${index}" onclick="editarTarefas(this.id)">
                            <i class="bx bxs-edit"></i></button>
                            <button class="btnExcluir" id="${index}" onclick="delTarefas(this.id)">
                            <i class="bx bxs-trash"></i></button>
                        </div>`

    lista.appendChild(tarefa);
    index = index + 1;
}

/* ===== Exclui tarefas da lista ===== */
function excluirTarefas() {
    let itensLista = window.document.querySelectorAll('#ulLista li');

    itensLista.forEach((item)=> {
        item.parentNode.removeChild(item);
        index = 0;
    });
}

/* ===== Adiciona mensagem e desabilita o botão de limpar quando localStorage for limpo ===== */
function addFrase() {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    if(ConverteDados.length === 0){
        localStorage.removeItem('db_tasks');

        lista.innerHTML = '<li id="frase"> Você ainda não tem nenhuma tarefa</li>';
    }

    habilitarBtnLimpar();
}

/* ===== Tachar texto se o checkbox for checked ===== */
function statusCheck(id) {
    const checkbox = window.document.getElementById(id);
    const label = window.document.querySelectorAll('.div-itens label');
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    let separar = id.replace(/[^0-9]/g, ''); //separando números dos caracteres
    let converter = parseInt(separar);

    if(checkbox.checked){

       label[converter].style.textDecoration = 'line-through'; //tacha texto

       //Adiciona a propriedade 'status' no obj com o valor 'conc' no armazenamento
       ConverteDados[converter]['status'] = concluido;
       localStorage.setItem('db_tasks', JSON.stringify(ConverteDados));
    }else {

        label[converter].style.textDecoration = 'none';

        //Adiciona a propriedade 'status' no obj com o valor 'pen' no armazenamento
        ConverteDados[converter]['status'] = pendente;
        localStorage.setItem('db_tasks', JSON.stringify(ConverteDados));
    }
}

/* ===== Armazena checkbox checados e carrega quando inicia ===== */
function carregaChecados() {
    const checkbox = window.document.querySelectorAll('.div-itens input');
    const label = window.document.querySelectorAll('.div-itens label');
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);
    let indexItem;

        ConverteDados.forEach((item)=> {
            if(item.status === concluido){
                indexItem = ConverteDados.indexOf(item);
            
                checkbox[indexItem].checked = true;
                label[indexItem].style.textDecoration = 'line-through';
            }
        });
}

/* ===== Adicionar pendentes na tela ===== */
function addPendentes() {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    ConverteDados.forEach((item)=> {
        if(item.status === pendente){
            addTarefas(item.Tarefa);
        }
    });
}

/* ===== Desabilita itens na aba pendentes ===== */
function desabilitaPendente() {
    const checkbox = window.document.querySelectorAll('.div-itens input');
    const label = window.document.querySelectorAll('.div-itens label');
    const divBotoes = window.document.querySelectorAll('.botoes button');

    checkbox.forEach((item)=> {
        item.disabled = true;
    });

    label.forEach((item)=> {
        item.style.cursor = 'default';
    });

    divBotoes.forEach((item)=> {
        item.disabled = true;
    });
}

/* ===== Adiciona concluídos na tela ===== */
function addConcluidos() {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    ConverteDados.forEach((item)=> {
        if(item.status === concluido){
            addTarefas(item.Tarefa);
        }
    });
}

/* ===== Marca os concluídos quando são carregados ===== */
function marcaConcluidos(){
    const checkbox = window.document.querySelectorAll('.div-itens input');
    const label = window.document.querySelectorAll('.div-itens label');
    const divBotoes = window.document.querySelectorAll('.botoes button');

    checkbox.forEach((item)=> {
        item.checked = true;
        item.disabled = true;
    });

    label.forEach((item)=> {
        item.style.textDecoration = 'line-through';
        item.style.cursor = 'default';
    });

    divBotoes.forEach((item)=> {
        item.disabled = true;
    });
}

/* ===== Habilita o botão adicionar ===== */
function habilitaBtnAdc() {

    if(txtTarefa.value.length != 0){
        btnAdicionar.disabled = false;
    }else {
        btnAdicionar.disabled = true;
    }

}

/* ===== Habilita o botão limpar ===== */
function habilitarBtnLimpar() {
    let itensLista = window.document.querySelectorAll('#ulLista li');

    itensLista.forEach((item)=> {

        if(item.id === 'frase'){
            btnLimpar.disabled = true;
            pend.style.visibility = 'hidden';
            conc.style.visibility = 'hidden';
            todos.style.cursor = 'default';
        }else {
            btnLimpar.disabled = false;
            pend.style.visibility = 'visible';
            conc.style.visibility = 'visible';
            todos.style.cursor = 'pointer';
        }

    });
}

/* ===== Habilita o botão Salvar ===== */
function habilitarBtnSalvar() {

    if(inputModal.value.length === 0){
        btnSalvar.disabled = true;
    }else {
        btnSalvar.disabled = false;
    }

}

/* ===== Salva a tarefa ao pressionar a tecla enter no teclado ===== */
document.addEventListener('keypress', function(e) {

    if(e.key === 'Enter'){

        btnAdicionar.click();
    }

});


/* ===== Atribuição de eventos dos botões ===== */
btnAdicionar.addEventListener('click', ()=> {
    salvaTarefas();
    habilitarBtnLimpar();
    tarefas = [];

    txtTarefa.value = '';
    txtTarefa.focus();
    btnAdicionar.disabled = true;

});

btnLimpar.addEventListener('click', ()=> {

    localStorage.removeItem('db_tasks');
    tarefas = [];
    index = 0;

    lista.innerHTML = '';
    lista.innerHTML = '<li id="frase"> Você ainda não tem nenhuma tarefa</li>';

    habilitarBtnLimpar();
});

btnFechar.addEventListener('click', ()=> {
    modal.style.display = 'none';
    txtTarefa.focus();
});

todos.addEventListener('click', ()=> {

    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);

    if(ConverteDados === null){
        return;
    }else {
        excluirTarefas();
        carregarTarefas();
        //carregaChecados();

        todos.style.color = 'rgb(125, 0, 220)';
        conc.style.color = 'rgba(0, 0, 0, 0.7)';
        pend.style.color = 'rgba(0, 0, 0, 0.7)';
        btnLimpar.disabled = false;
    }

   
});

pend.addEventListener('click', ()=> {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);
    let contador = 0;

    //Contando a quantidade de pendentes
    ConverteDados.forEach((item)=> {
        if(item.status === pendente){
            contador = contador + 1;
        }
    });

    if(contador == 0){
        lista.innerHTML = '<li id="frase"> Você não tem nenhuma tarefa pendente</li>';
    }else {

        excluirTarefas();
        addPendentes();
        desabilitaPendente();
    }

    pend.style.color = 'rgb(125, 0, 220)';
    todos.style.color = 'rgba(0, 0, 0, 0.7)';
    conc.style.color = 'rgba(0, 0, 0, 0.7)';
    btnLimpar.disabled = true;
});

conc.addEventListener('click', ()=> {
    let ConsultaDados = localStorage.getItem('db_tasks');
    let ConverteDados = JSON.parse(ConsultaDados);
    let contador = 0;

    //Contando a quantidade de concluídos
    ConverteDados.forEach((item)=> {
        if(item.status === concluido){
            contador = contador + 1;
        }
    });

    if(contador == 0){
        lista.innerHTML = '<li id="frase"> Você não tem nenhuma tarefa concluída</li>';
    }else {

        excluirTarefas();
        addConcluidos();
        marcaConcluidos();
    }

    conc.style.color = 'rgb(125, 0, 220)';
    todos.style.color = 'rgba(0, 0, 0, 0.7)';
    pend.style.color = 'rgb(0, 0, 0, 0.7)';
    btnLimpar.disabled = true;
});