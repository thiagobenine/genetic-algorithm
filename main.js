//vetor que guarda o valor de x q foi aleatóriamente gerado para ser avaliado
xArray = Array.apply(null, Array(10)).map(function () {});
yArray = Array.apply(null, Array(10)).map(function () {});

//vetor que guarda o fitness (no caso é o valor avaliado da função)
fitness = Array.apply(null, Array(10)).map(function () {});

bestFit = 0.0; //guardo o maior fitness, o valor do melhor indíviduo da geração
besti  = 0; //guarda o indice do melhor individuo
i = g = 0; //iteradores, o g guarda o valor da geração

leftBoundNumber = -10; //intervalo esquerdo da função
rightBoundNumber = 10; //intervalo direito da função

// a = -10
// b = 10;

inputText = document.querySelector("#inputText")
leftBoundInput = document.querySelector("#leftBoundNumber")
rightBoundInput = document.querySelector("#rightBoundNumber")

function execJison (input) {
    return parser.parse(input);
}

function run(input, min, max){
    start(min, max);
    loop(input);
}

function start(){
    g = 0;
    clear();
    generatePopulation();
}

// função que limpa os dados
function clear(){
    document.querySelector("#generation").innerHTML = 0;
    document.querySelector("#max-fitness").innerHTML = 0;
    document.querySelector("#best-individual").innerHTML = 0;
    for (i=0;i<10;i++){
      document.querySelector(`#population-fitness-${i}`).innerHTML = 0;
    }
}

function printResults(){
    document.querySelector("#generation").innerHTML = g;
    document.querySelector("#max-fitness").innerHTML = bestFit;
    document.querySelector("#best-individual").innerHTML = besti+1;
    for (i=0;i<10;i++){
      document.querySelector(`#population-fitness-${i}`).innerHTML = fitness[i];
    }
}

function setLeftBound() {
    leftBoundNumber = leftBoundInput.value
}

function setRightBound(){
    rightBoundNumber = rightBoundInput.value
}

function loop() {
    g++;
    evaluateFitness();
    bestFitness();

    printResults();

    crossOver();

    //a cada 10 gerações jogamos o pior fora
    if(( g % 10 ) == 0) naturalSelection();
}

//função que inicializa a população
function generatePopulation(){
    for (i=0;i<10;i++){
        xArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
        yArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
    }
}

//função que busca o indivíduo com maior fitness e salva o valor e seu indice
function bestFitness(){
    bestFit = fitness[0];
    besti = 0;

    for (i=1; i<10; i++){
        if (fitness[i]>bestFit){
            bestFit = fitness[i];
            besti = i;
        }
    }
}

//função fitness avalia o quão bom cada individuo da população é.
//como queremos o máximo da função ele avalia o valor da função nos pontos gerados
function evaluateFitness(){
   x = 0.0;
   y = 0.0;

   input = inputText.value

  for (i=0; i<10; i++){
        x=xArray[i];
        y=yArray[i];

        fitness[i] = execJison(replaceVars(input, x, y));
        console.log(fitness[i]);
    }
}

function replaceVars(input, x ,y) {
    return input.replace(/x/g, x).replace(/y/g, y)
}

// usa o melhor indivíduo para gerar a próxima geração cruzando os genes dele com os demais.
// pega o melhor ponto e soma com cada um dos outros e divide por 2, tirando a média.
// quanto maior a mutação mais aleatório fica o filho
function crossOver(){
    for (i=0;i<10;i++){
        aux = 0;
        if (i==besti)
            continue;

        xArray[i] = (xArray[i] + xArray[besti])/ 2.0;
        yArray[i] = (yArray[i] + yArray[besti])/ 2.0;

        mutation = ((Math.random() * 10 - (5))/10000.0);
        xArray[i] = xArray[i] + (mutation);
        mutation = ((Math.random() * 10 - (5))/10000.0);
        yArray[i] = yArray[i] + (mutation);
        
    }
}

// função que mata o pior individuo e aleatoriamente cria um novo ponto,
// isso faz com que o algoritmo consiga sair de máximos globais e não fique preso em máximos locais
function naturalSelection(){
    minfit = fitness[0];
    mini = 0;

    for (i=1;i<10;i++){
        if (fitness[i]<minfit){
            minfit = fitness[i];
            mini = i;
        }
    }
    xArray[mini] = (Math.random() * 20);
}