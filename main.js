// cria quadro de desenho do canvas
const canvas = document.querySelector("canvas");

// cria "pincel" que é utilizado para desenhar no canvas; utiliza efeito 2D, mas existe 3D também
const ctx = canvas.getContext("2d");

// define dimensões do quadro de desenho. Nesse caso, é do tamanho da janela interna do usuário 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// variáveis utilizadas no programa
let bolinhaPosicaoY = canvas.height/2 - 14;
let bolinhaPosicaoX = canvas.width/2 - 20;

let qtdPipes = Math.ceil(canvas.width/260);
let espacoEntrePipes = canvas.height * 0.70;

// variáveis de controle
let pontuacao = 0;
let start = false;
let tempo = 0;
let tempoPulo = 0;
let colisao;
let jump = false;

// variáveis utilizadas para guardar as seções de tempo do programa (tela de início e jogo)
let inicio;
let anima;

// variáveis que guardam informações dos pipes do cenário
let alturaPipe = [];
let posicaoPipe = [];

// variáveis utilizadas para fazer o efeito de sobe e desce da bolinha na tela de início
let posicaoOriginalY = bolinhaPosicaoY;
let incremento = 10;

desenhaTelaInicio();

function desenhaBolinha(){
    // define a cor da bolinha (estilo do pincel)
    ctx.fillStyle = "white";

    // se a bolinha colidir, ela será vermelha
    if(colisao) ctx.fillStyle = "red"; //

    // começa novo desenho
    ctx.beginPath();

    // define a posição (x, y) do centro da bolinha/círculo, raio, ângulo inicial e ângulo final
    ctx.arc(bolinhaPosicaoX, bolinhaPosicaoY, 20, 0, 2 * Math.PI);

    // pinta a bolinha
    ctx.fill();
}

function desenhaCenario(){
    // define a cor do plano de fundo
    ctx.fillStyle = "#ff66c4";
    
    // o cenário é composto por pipes, que são aqueles pilares cor-de-rosa
    // os pipes são desenhados de 6 em 6, por isso o laço de repetição de 0 a 5
    for(let i = 0; i < qtdPipes; i++){
        // se o pipe saiu da tela, coloca ele de volta no início (efeito de esteira infinita)
        if(posicaoPipe[i] < -80) {
            posicaoPipe[i] = canvas.width;
            atualizaCenario(i);
        }

        // começa novo desenho
        ctx.beginPath();

        // desenha pipe de cima (que tem o formato de um retângulo)
        // define posição (x, y), largura e altura
        ctx.rect(posicaoPipe[i], 0, 80, espacoEntrePipes - alturaPipe[i]);

        // desenha pipe de baixo
        ctx.rect(posicaoPipe[i], canvas.height - alturaPipe[i], 80, alturaPipe[i]);

        // desenha contorno do pipe
        ctx.stroke();

        // pinta o pipe
        ctx.fill();

        // se a bolinha não colidir com nada, decrementa a posição do pipe
        if(!colisao) posicaoPipe[i] = posicaoPipe[i] - 1;
    }
}

function effectFlycircle(){
    if(bolinhaPosicaoY > posicaoOriginalY + 10){
        incremento = -10;
    } else if(bolinhaPosicaoY < posicaoOriginalY - 10){
        incremento = 10;
    }

    bolinhaPosicaoY += incremento;
}

function desenhaTelaInicio(){
    start = false;
    colisao = false;
    bolinhaPosicaoY = canvas.height/2 - 14;
    for(let i = 0; i < qtdPipes; i++){
        atualizaCenario(i);
    }

    inicio = setInterval(() => {
        ctx.fillStyle = "#cb6ce6";
        ctx.fillRect(0, 0, canvas.width , canvas.height);
        desenhaBolinha();
        effectFlycircle();
        desenhaMensagemPressStart();
    
        if(start){
            clearInterval(inicio);
            iniciaJogo();
        }
    }, 60);
}

function desenhaMensagemPressStart(){
    ctx.fillStyle = "#FFF";
    ctx.font = "24px Arial";
    ctx.fillText("Press space to start...", canvas.width/2 - 120, canvas.height/2 + 80);
}

function desenhaScore(){
    ctx.fillStyle = "#FFF";
    if(colisao) ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + pontuacao, canvas.width - 200, 30);
}

function iniciaJogo(){
    pontuacao = 0;
    
    anima = setInterval(() => {
        ctx.fillStyle = "#cb6ce6";
        ctx.fillRect(0, 0, canvas.width , canvas.height);
    
        if(jump) jumpCircle();
        else if(colisao) bolinhaPosicaoY += 6;
        else bolinhaPosicaoY += 4;

        if(!colisao){
            desenhaBolinha();
            desenhaCenario();
        } else {
            desenhaCenario();
            desenhaBolinha();
        }

        tempo += 10;

        desenhaScore();
        verificaColisao();
        calculaPontuacao();

        if(bolinhaPosicaoY > canvas.height + 20){
            clearInterval(anima);
            desenhaTelaInicio();
        }

    }, 10);
}

function atualizaCenario(indice){
    alturaPipe[indice] = Math.round(Math.random() * (espacoEntrePipes));
    if(!start) posicaoPipe[indice] = canvas.width + 260 * indice;
}

function jumpCircle(){
    // decrementa a posição da bolinha de 4 em 4 (isso significa que ela sobe de quatro em quatro unidades)
    bolinhaPosicaoY -= 4;

    // quando passa 240ms que a bolinha está subindo (pulando), a bolinha volta a descer
    if(tempo - tempoPulo > 240){
        jump = false;

        // reinicia tempo de pulo
        tempoPulo = 0;
    }
}

function verificaColisao(){
    for(let i = 0; i < qtdPipes; i++){
        if(posicaoPipe[i] < bolinhaPosicaoX + 20 && bolinhaPosicaoX - 20 < posicaoPipe[i] + 80 &&
           (bolinhaPosicaoY - 20 < espacoEntrePipes - alturaPipe[i] || (bolinhaPosicaoY + 20 > canvas.height - alturaPipe[i]))
        ){
            jump = false;
            colisao = true;
        }
    }
}

function calculaPontuacao(){
    for(let i = 0; i < qtdPipes; i++){
        // se a bolinha ultrapassa um dos pipes
        if(bolinhaPosicaoX === posicaoPipe[i] + 80 ){
            // aumenta pontuacao de 1 em 1
            pontuacao += 1; 
        }
    }
}

// identifica quando o usuário aperta uma tecla
document.addEventListener("keypress", (evento) => {
    // se a tecla for space
    if(evento.keyCode === 32) {
        // começa o jogo (caso ainda não tenha começado)
        if(!start) start = true;

        // bolinha pula
        jump = true;

        // tempo de pulo começa a contar
        tempoPulo = tempo;
    }
});
