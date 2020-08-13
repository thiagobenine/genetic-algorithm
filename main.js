// vetores que guardam os valores de x e y q foram aleatóriamente gerados para serem avaliados
xArray = Array.apply(null, Array(10)).map(function () {});
yArray = Array.apply(null, Array(10)).map(function () {});

// vetores que guardam os valores para se plotar a função
var xSpace = Array.apply(null, Array(50)).map(function () {});
var ySpace = Array.apply(null, Array(50)).map(function () {});
var z = new Array(50);
for(i=0; i<50; i++){
        z[i] = new Array(50);
}

// vetor que guarda o fitness (no caso é o valor avaliado da função)
fitness = Array.apply(null, Array(10)).map(function () {});

bestFit = 0.0; // guardo o maior fitness, o valor do melhor indíviduo da geração
besti  = 0; // guarda o indice do melhor individuo
i = j = g = 0; // iteradores, o g guarda o valor da geração

leftBoundNumber = -10; //intervalo esquerdo da função
rightBoundNumber = 10; //intervalo direito da função
mutationRate = execJison("10^-5"); //taxa de mutação

// variáveis que fazem referencia aos inputs do front
inputText = document.querySelector("#inputText")
leftBoundInput = document.querySelector("#leftBoundInput")
rightBoundInput = document.querySelector("#rightBoundInput")
mutationRateInput = document.querySelector("#mutationRateInput")

// função que parseia e calcula o valor de uma expressão matemática (usando a lib Jison)
function execJison (input) {
    return parser.parse(input);
}

// função que inicia todo o processo: exibe o gráfico da funcao, limpa o ambiente e gera a população
function start(){
    evaluateFunction()
    g = 0;
    clear();
    generatePopulation();
    evaluateFitness();
    bestFitness();
    plotMarker();
    printResults();
}

// função que limpa os dados exibidos no front
function clear(){
    document.querySelector("#generation").innerHTML = 0;
    document.querySelector("#max-fitness").innerHTML = 0;
    document.querySelector("#best-individual").innerHTML = 0;
    for (i=0;i<10;i++){
      document.querySelector(`#population-fitness-${i}`).innerHTML = 0;
    }
}

// função que exibe os dados no front
function printResults(){
    document.querySelector("#generation").innerHTML = g;
    document.querySelector("#max-fitness").innerHTML = bestFit;
    document.querySelector("#best-individual").innerHTML = besti+1;
    for (i=0;i<10;i++){
      document.querySelector(`#population-fitness-${i}`).innerHTML = fitness[i];
    }
}

// função auxiliar responsável por setar o limite esquerdo
function setLeftBound() {
    if (leftBoundInput.value == "") {
        leftBoundNumber = -10
    }
    leftBoundNumber = parseFloat(leftBoundInput.value)
}

// função auxiliar responsável por setar o limite direito
function setRightBound(){
    if (rightBoundInput.value == "") {
        rightBoundNumber = -10
    }
    rightBoundNumber = parseFloat(rightBoundInput.value)
}

// função auxiliar responsável por setar a taxa de mutação
function setMutationRate(){
    if (mutationRateInput.value == "") {
        mutationRate = execJison("10^-5")
    }
    mutationRate = execJison(mutationRateInput.value)
}

// função responsável pelo fluxo geral da nova geração: avalia os novos indivíduos e qual o melhor gerado.
// além disso, exibe esses individuos no grafico e realiza o crossOver
function loop() {
    g++;
    evaluateFitness();
    bestFitness();

    printResults();
    plotMarker();
    crossOver();

    //a cada 10 gerações jogamos os 3 piores fora
    if(( g % 10 ) == 0) naturalSelection();
}

// função que inicializa a população (gera os 10 indivíduos aleatórios iniciais)
function generatePopulation(){
    for (i=0;i<10;i++){
        xArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
        yArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
    }
}

// função que busca o indivíduo com maior fitness e salva o valor e seu indice
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

// função que avalia cada individuo da população na função dada pelo usuário.
// como queremos o máximo da função, ele avalia o valor da função nos pontos gerados
function evaluateFitness(){
   var x = 0.0;
   var y = 0.0;

   var input = inputText.value

    // aplicando regex para substituir x^2 e y^2 por (x^2) e (y^2)
   input = input.replace(/(x\^\d+(.\d+)?)/g,'($1)').replace(/(y\^\d+(.\d+)?)/g,'($1)');

   for (i=0; i<10; i++){
        x=xArray[i];
        y=yArray[i];

        fitness[i] = execJison(replaceVars(input, x, y));
    }
}

function replaceVars(input, x ,y) {
    return input.replace(/x(?!p)/g, x).replace(/y/g, y)
}

// função que usa o melhor indivíduo para gerar a próxima geração cruzando os genes dele com os demais.
// funcionamento: pega o melhor ponto e soma com cada um dos outros e divide por 2, tirando a média.
// quanto maior a mutação mais aleatório fica o filho
function crossOver(){
    for (i=0;i<10;i++){
        var auxX = 0;
        var auxY = 0;

        // ignora o melhor indivíduo
        if (i==besti)
            continue;

        xArray[i] = (xArray[i] + xArray[besti])/ 2.0;
        yArray[i] = (yArray[i] + yArray[besti])/ 2.0;

        auxX = xArray[i];
        auxY = yArray[i];

        mutation = ((Math.random() * 2 - 1)*mutationRate);
        xArray[i] = xArray[i] + (mutation);
        yArray[i] = yArray[i] + (mutation);
        
        if(xArray[i] > rightBoundNumber) 
            xArray[i] = auxX;
        if(yArray[i] > rightBoundNumber) 
            yArray[i] = auxY;
        
    }
}

// função que mata os piores individuos e aleatoriamente cria 3 novos pontos,
// isso faz com que o algoritmo consiga sair de máximos globais e não fique preso em máximos locais
function naturalSelection(){
    worstFit = fitness[0];
    worsti = 0;
    for (i=0;i<3;i++){
        for (j=0;j<10;j++){
            if (fitness[j]<worstFit){
                worstFit = fitness[j];
                worsti = j;
            }
        }
        xArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
        yArray[i] = (Math.random() * (rightBoundNumber - leftBoundNumber) + leftBoundNumber);
    }
}

// função que calcula os pontos a serem plotados no grafico
function evaluateFunction(){
    var axisRange = rightBoundNumber - leftBoundNumber;
    var axisSpace = axisRange/50;
    var input = inputText.value
    input = input.replace(/(x\^\d+(.\d+)?)/g,'($1)').replace(/(y\^\d+(.\d+)?)/g,'($1)');

    for(i=0; i<50; i++){
        xSpace[i] = leftBoundNumber + i*axisSpace;
        ySpace[i] = leftBoundNumber + i*axisSpace;
    }

    for(i=0; i<50; i++){
        for(j=0; j<50; j++){
            z[i][j] = execJison(replaceVars(input, xSpace[j], ySpace[i]));
        }  
    }

    var function3d = {x: xSpace, y: ySpace, z: z, type: 'surface', showscale: true};
    Plotly.newPlot('plot-container', [function3d]);
}

// função responsável por colocar no gráfico todos os indivíduos da população
// e destacar o melhor indivíduo
function plotMarker(){
    var function3d = {x: xSpace, y: ySpace, z: z, type: 'surface', showscale: true};
    
    var bestMarker = {
        x: [xArray[besti]], 
        y: [yArray[besti]], 
        z: [bestFit],   
        mode: 'markers',
        marker: {
            size: 10,
            opacity: 1,
            color:  'rgb(73, 235, 52)',
        },
        type: 'scatter3d'
    };
    var allMarkers = {
        x: xArray, 
        y: yArray, 
        z: fitness,   
        mode: 'markers',
        marker: {
            size: 10,
            opacity: 1,
            color:  'rgb(52, 58, 235)',
        },
        type: 'scatter3d'
    };
    Plotly.newPlot('plot-container', [function3d, allMarkers, bestMarker]);
}

