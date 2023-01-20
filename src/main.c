#include <time.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

#define DIMC 40
#define DIML 40

int tab_length(char tab[])
{
    int length = 0;

    while (tab[length] != '\0')
    {
        length++;
    }

    return length;
}

void copie(char origine[DIML][DIMC], char destination[DIML][DIMC])
{
    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            destination[i][j] = origine[i][j];
        }
    }
}

void fill_random_values(char tab[DIML][DIMC])
{
    int r;

    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            r = rand() % 20;
            switch (r)
            {
            case 0:
                tab[i][j] = '0';
                break;
            case 4:
                tab[i][j] = '0';
                break;
            case 9:
                tab[i][j] = '0';
                break;
            case 14:
                tab[i][j] = '0';
                break;
            case 19:
                tab[i][j] = '0';
                break;
            default:
                tab[i][j] = '1';
                break;
            }
        }
    }
}

void affiche_jeu(char tab[DIML][DIMC])
{
    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            if (tab[i][j] == '0')
            {
                printf("\033[47m  \033[0m");
            }
            else if (tab[i][j] == '1')
            {
                printf("\033[40m  \033[0m");
            }
        }
        printf("\n");
    }
}

void fill(char tab[DIML][DIMC])
{
    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            tab[i][j] = '1';
        }
    }

    tab[7][8] = '0';
    tab[7][10] = '0';
    tab[8][8] = '0';
    tab[8][10] = '0';
    tab[9][8] = '0';
    tab[9][9] = '0';
    tab[9][10] = '0';
}

void test(char tab[DIML][DIMC])
{
    char copy[DIML][DIMC];
    copie(tab, copy);

    int nombre_cellules;

    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            nombre_cellules = 0;

            if (copy[i][j + 1] == '0')
            {
                nombre_cellules++;
            }
            if (copy[i + 1][j] == '0')
            {
                nombre_cellules++;
            }
            if (copy[i + 1][j + 1] == '0')
            {
                nombre_cellules++;
            }
            if (copy[i][j - 1] == '0')
            {
                nombre_cellules++;
            }
            if (copy[i - 1][j] == '0')
            {
                nombre_cellules++;
            }
            if (copy[i - 1][j - 1] == '0')
            {
                nombre_cellules++;
            }
            if (copy[i + 1][j - 1] == '0')
            {
                nombre_cellules++;
            }
            if (copy[i - 1][j + 1] == '0')
            {
                nombre_cellules++;
            }

            if (nombre_cellules == 2 || nombre_cellules == 3)
            {
                if (nombre_cellules == 3 && copy[i][j] == '1')
                {
                    tab[i][j] = '0';
                }
                else if (nombre_cellules == 2 && copy[i][j] == '0')
                {
                    tab[i][j] = '0';
                }
            }
            else
            {
                tab[i][j] = '1';
            }
        }
    }
}

int main(void)
{
    srand(time(NULL));
    system("cls");

    char table_de_jeu[DIML][DIMC];

    fill_random_values(table_de_jeu);
    //fill(table_de_jeu);
    affiche_jeu(table_de_jeu);

    while (1)
    {
        test(table_de_jeu);
        affiche_jeu(table_de_jeu);
        //usleep(100000);
        system("cls");
    }
}