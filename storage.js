/*SPRINT 3 - Repositório local + seed
 Por quê? Antecipar o padrão MVC 
*/

//chaves usadas no localStorage
const DB_KEYS ={
    recursos: 'sr_recursos',
    reservas: 'sr_reservas',
    usuarios: 'sr_usuarios'
};

//repositório para a manipulação dos arrays no localStorage
const repo = {
    get(key){
        //lê a coleção; se não existir, retorna array vazio
        return JSON.parse(localStorage.getItem(key) || '[]');
    },
    set(key,arr){
        localStorage.setItem(key,JSON.stringify(arr));
    },
    push(key,item){
        const arr = repo.get(key);
        arr.push(item);
        repo.set(key,arr);
        return item;
    },
    updateById(key,id,updater){
        const arr = repo.get(key);
        const ix = arr.findIndex(x=>x.id ===id);
        if(ix>=0){
            arr[ix]=updater(arr[ix]);
            repo.set(key,arr);
            return arr[ix];
        }
        return null;
    }
};

//dados iniciais (seed) - executa uma única vez no navegador
function seedSeNecessario(){
    if(!localStorage.getItem(DB_KEYS.recursos)){
        repo.set(DB_KEYS.recursos,[
            {id: 1, nome: "Laboratório 1", tipo: "sala", status: "ativo"},
            {id: 2, nome: "Laboratório 2", tipo: "sala", status: "ativo"},
            {id: 3, nome: "Projetor 4K", tipo: "equip", status: "ativo"},
            {id: 4, nome: "Espaço de Reuniões", tipo: "sala", status: "ativo"}
        ]);
    }
    if(!localStorage.getItem(DB_KEYS.reservas)) repo.set(DB_KEYS.reservas,[]);
    if(!localStorage.getItem(DB_KEYS.usuarios)) repo.set(DB_KEYS.usuarios,[]);
}

//nome do recurso (evita ficar procurando a cada renderização)
function mapRecursos(){
    return Object.fromEntries(repo.get(DB_KEYS.recursos).map(r=>[r.id,r.nome]));
}

//Preenchimento dinâmico do select
function popularRecursos(){
    const sel = document.getElementById('campoRecurso');
    if(!sel) return;
    const recursos = repo.get(DB_KEYS.recursos);
    sel.innerHTML = '<option value="">Selecione...</option>' +
    recursos.map(r =>`<option value="${r.id}">${r.nome}</option>`).join('');
}

//carrega histórico
function carregarHistorico(){
    const ul = document.getElementById('listaReservas');
    if(!ul) return;
    ul.innerHTML ='';
    const recursosMap=mapRecursos();
    repo.get(DB_KEYS.reservas).forEach(r => {
        renderItemReservaPersistida(r,recursosMap);    
    });
}

//sobe seed e popula a UI assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded',()=>{
    seedSeNecessario();
    popularRecursos();
    carregarHistorico();
});