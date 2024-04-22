#include <time.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

#define DIMC 40
#define DIML 40

enum cell_state {
    DEAD,
    ALIVE
};

int tab_length(char tab[])
{
    int length = 0;

    while (tab[length] != '\0')
    {
        length++;
    }

    return length;
}

void copy(char src[DIML][DIMC], char dest[DIML][DIMC])
{
    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            dest[i][j] = src[i][j];
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
                tab[i][j] = ALIVE;
                break;
            case 4:
                tab[i][j] = ALIVE;
                break;
            case 9:
                tab[i][j] = ALIVE;
                break;
            case 14:
                tab[i][j] = ALIVE;
                break;
            case 19:
                tab[i][j] = ALIVE;
                break;
            default:
                tab[i][j] = DEAD;
                break;
            }
        }
    }
}

void clear() {
    for (int i = 0; i < DIML; i++)
    {
        char row[DIMC * 2];
        for (int j = 0; j < DIMC; j++)
        {
            row[j] = ' ';
            row[j + 1] = ' ';
        }
        printf("\r%s", row);
    }
}

void render(char pixels[DIML][DIMC])
{
    char *screen = malloc(sizeof(char) * DIML * ((DIMC + 1) * 2));
    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            char filling_char = ' ';
            if (pixels[i][j] == ALIVE)
            {
                filling_char = 'X';
            }

            screen[(i * DIML) + (j * 2)] = filling_char;
            screen[(i * DIML) + (j * 2 + 1)] = filling_char;
        }
        screen[(i * DIML) + (DIMC * 2)] = '\n';
    }
    printf("%s", screen);
    fflush(stdout);
    free(screen);
}

void test(char tab[DIML][DIMC])
{
    char buffer[DIML][DIMC];
    copy(tab, buffer);

    int nombre_cellules;

    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            nombre_cellules = 0;

            if (buffer[i][j + 1] == ALIVE)
            {
                nombre_cellules++;
            }
            if (buffer[i + 1][j] == ALIVE)
            {
                nombre_cellules++;
            }
            if (buffer[i + 1][j + 1] == ALIVE)
            {
                nombre_cellules++;
            }
            if (buffer[i][j - 1] == ALIVE)
            {
                nombre_cellules++;
            }
            if (buffer[i - 1][j] == ALIVE)
            {
                nombre_cellules++;
            }
            if (buffer[i - 1][j - 1] == ALIVE)
            {
                nombre_cellules++;
            }
            if (buffer[i + 1][j - 1] == ALIVE)
            {
                nombre_cellules++;
            }
            if (buffer[i - 1][j + 1] == ALIVE)
            {
                nombre_cellules++;
            }

            if (nombre_cellules == 2 || nombre_cellules == 3)
            {
                if (nombre_cellules == 3 && buffer[i][j] == DEAD)
                {
                    tab[i][j] = ALIVE;
                }
                else if (nombre_cellules == 2 && buffer[i][j] == ALIVE)
                {
                    tab[i][j] = ALIVE;
                }
            }
            else
            {
                tab[i][j] = DEAD;
            }
        }
    }
}

int main(void)
{
    srand(time(NULL));

    char table_de_jeu[DIML][DIMC];

    fill_random_values(table_de_jeu);
    render(table_de_jeu);

    for (;;)
    {
        printf("Game\n");
        //clear();
        system("cls");
        test(table_de_jeu);
        render(table_de_jeu);
        usleep(100000);
    }
}