// Buscando os elementos

const btnAdicionarTarefa = document.querySelector('.app__button--add-task')
const btnSalvarTarefa = document.querySelector('.app__form-footer__button--confirm')
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel')
const formAdicionarTarefa = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')
const ulTarefas = document.querySelector('.app__section-task-list')
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

//transforma a string em JSON, caso não haja essa lista, cria uma lista vazia
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

//
function criarElementoTarefa(tarefa) {
    //cria um li no html
    const li = document.createElement('li')
    //cria a classe css
    li.classList.add('app__section-task-list-item')

    //cria o elemento svg no html
    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
            
    `
    //cria um paragafo no html
    const paragrafo = document.createElement('p')
    //setamos para que o paragrafo receba o descricao da tarefa 
    paragrafo.textContent = tarefa.descricao
    //cria a classe css
    paragrafo.classList.add('app__section-task-list-item-description')
    
    //cria o elemento button
    const botao = document.createElement('button')
    //cria a classe css
    botao.classList.add('app_button-edit')

    //abre um prompt para editar a tarefa desejada. Esse botão foi criado aqui no JS
    botao.onclick = () => {
        //debugger
        const novaDescricao = prompt("Qual é o novo nome da tarefa?")
        if(novaDescricao) {
        //sobrescreve o texto do paragrafo pelo que foi colocado no prompt
        paragrafo.textContent = novaDescricao
        //atualiza o objeto tarefa (camada de dados) 
        tarefa.descricao = novaDescricao
        //atualiza na localStorage
        atualizarTarefas()
        }      
    }

    //cria o elemento img
    const imagemBotao = document.createElement('img')
    //definimos qual imagem será utilizada, primeiro vem o src, e depois o endereço da imagem
    imagemBotao.setAttribute('src', '/imagens/edit.png')

    //coloca a imagem dentro do botao
    botao.append(imagemBotao)
    
    //coloca os elementos dentro da li
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    //comportamento quando a tarefa for completa
    if(tarefa.completa) {
        //a classe complete é adicionada
        li.classList.add('app__section-task-list-item-complete')
        //buscamos a tag button dentro da li e desabilita o botão
        botao.setAttribute('disabled','disabled')
    } else {
        li.onclick = () => {
            //pega todos os elementos com a seguinte classe. coloquei essa parte antes do if porque esse trecho tem que executar sempre 
            document.querySelectorAll('.app__section-task-list-item-active')
            //itera sobre todos os elementos com essa classe
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
    
            //caso eu clique na tarefa que já está selecionada eu limpo o textContent do paragrafo
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                //coloco esse return para que não precise rodar o resto do código
                return
            }
    
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            //altera o texto do paragrafo para o texto da descrição da tarefa
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            
            li.classList.add('app__section-task-list-item-active')
        }
    }

    //função que altera o valor do parágrafo para a descrição
    

    return li
}

//Ao clicar no botão, a classe hidden é desabilitada por causa da propriedade 'toggle'
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')    
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    //impede que o comportamento do botão seja realizado, ou seja, a página não vai atualizar automaticamente
    evento.preventDefault();
    //guardamos o valor de textArea em um objeto 'tarefa' identifica a tarefa que está sendo cadastrada
    const tarefa = {
        descricao: textArea.value
    }
    //colocamos a tarefa recém criada no array tarefas, 'tarefas' é o array de tarefas contendo todas as tarefas
    tarefas.push(tarefa)
    //cria uma const que chama a função
    const elementoTarefa = criarElementoTarefa(tarefa)
    //coloca o elemento dentro da ul
    ulTarefas.append(elementoTarefa)

    // colocando um item no localStorage, é necessário usar o stringify
    atualizarTarefas()
    //limpa a área de texto
    textArea.value = ''
    //esconde o formulário
    formAdicionarTarefa.classList.add('hidden')
})

btnSalvarTarefa.addEventListener('click', () => {
    
})

btnCancelarTarefa.addEventListener('click', () => {
    //esconde o menu de adicionar tarefas
    formAdicionarTarefa.classList.toggle('hidden')
    //limpa o textarea
    textArea.value = ''
})

//percorre o array
tarefas.forEach(tarefa => {
    //cria uma const que chama a função com a tarefa como parametro
    const elementoTarefa = criarElementoTarefa(tarefa)
    //coloca o elemento dentro da ul 
    ulTarefas.append(elementoTarefa)
});

//escuta quando o evento de foco for finalizado
document.addEventListener('FocoFinalizado', () => {
    //caso tarefaSelecionada e liTarefaSelecionada não estejam nulos, entra no if
    if (tarefaSelecionada && liTarefaSelecionada) {
        //a classe active é removida
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        //a classe complete é adicionada
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        //buscamos a tag button dentro da li e desabilita o botão
        liTarefaSelecionada.querySelector('button').setAttribute('disabled','disabled')
        //atualiza a tarefa na localStorage
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

//botao de remover todas as tarefas concluidas
btnRemoverConcluidas.onclick = () => {
    //aqui selecionamos a classe que precisa ter nos elementos que queremos excluir
    const seletor = '.app__section-task-list-item-complete'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = tarefas.filter(tarefa => !tarefa.completa)
    atualizarTarefas()
}

//botao de remover todas as tarefas
btnRemoverTodas.onclick = () => {
    const seletor = '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = []
    atualizarTarefas()
}
