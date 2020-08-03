#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <windows.h>
#include <conio.h>

double ind[10];

double fit[10];
double maxfit = 0.0;
int    maxi  = 0;
int    key;
int    i, g = 0;

void population();
void evaluate();
void elite();
void predation();
void maxfitness();

int main(){

srand(time(NULL));

start:
    g = 0;

    population();


loop:
	g++;

    evaluate();

	maxfitness();


    printf("\n   Generataion:%d", g);
    printf("   Max Fitness:%.2f", maxfit);
    printf("   Best Individual:%d\n", maxi+1);
    printf("\n\n   Population Fitness:[");
    for (i=0;i<10;i++){
        printf("%.2f ", fit[i]);
    }
    printf("]\n\n");
    printf("\n   Press 'q' To Quit   Press 'e' To Create a New Generation\n   Press 'r' to Restart");


	elite();

    if(( g % 10 ) == 0) predation();



	key:
	if (kbhit()){
		key = getch();

		if (key == 'e'){
			system("cls");
			goto loop;
		}
        else if (key == 'r'){
            system("cls");
			goto start;
        }
        else if (key == 'q'){
            printf("\n");
			goto end;
        }
	}
	goto key;


    end:
	return 0;
}


void population(){
    for (i=0;i<10;i++){
        ind[i] = (double) (rand() %(10 * 10)/10.0);
    }
}

void maxfitness(){
    maxfit = fit[0];
    maxi = 0;

    for (i=1; i<10; i++){
        if (fit[i]>maxfit){
            maxfit = fit[i];
            maxi = i;
        }
    }
}

void evaluate(){
   double x;

  for (i=0; i<10; i++){
        x=ind[i];
        if (x>=0.0 && x<10.0)
            fit[i] = x;
        else if (x>=10.0 && x<20.0)
            fit[i] = 20.0 - x;
        else
            fit[i] = 0.0;
    }
}

void elite(){
    maxfit = fit[0];
    maxi = 0;

    for (i=1; i<10; i++){
        if (fit[i]>maxfit){
            maxfit = fit[i];
            maxi = i;
        }
    }

    for (i=0;i<10;i++){
        int aux;
        if (i==maxi)
            continue;

        ind[i] = (ind[i] + ind[maxi])/ 2.0;

        aux=ind[i];
        ind[i] = ind[i] + (double) (((rand() %10 - (10/2.0))/100.0) * 4);

        if (ind[i] >10)
            ind[i]=aux;
    }
}

void predation(){
    double minfit = fit[0];
    int    mini = 0;

    for (i=1;i<10;i++){
        if (fit[i]<minfit){
            minfit = fit[i];
            mini = i;
        }
    }
    ind[mini] = (double) (rand() %(10 * 10)/10.0);
}