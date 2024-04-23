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

void render(char pixels[DIML][DIMC])
{
    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            char filling_char = '.';
            if (pixels[i][j] == ALIVE)
            {
                filling_char = 'X';
            }

            printf("%c", filling_char);
        }
        printf("\n");
    }
}

void update(char tab[DIML][DIMC])
{
    char buffer[DIML][DIMC];
    copy(tab, buffer);

    int cell_count;

    for (int i = 0; i < DIML; i++)
    {
        for (int j = 0; j < DIMC; j++)
        {
            cell_count = 0;

            if (buffer[i][j + 1] == ALIVE)
            {
                cell_count++;
            }
            if (buffer[i + 1][j] == ALIVE)
            {
                cell_count++;
            }
            if (buffer[i + 1][j + 1] == ALIVE)
            {
                cell_count++;
            }
            if (buffer[i][j - 1] == ALIVE)
            {
                cell_count++;
            }
            if (buffer[i - 1][j] == ALIVE)
            {
                cell_count++;
            }
            if (buffer[i - 1][j - 1] == ALIVE)
            {
                cell_count++;
            }
            if (buffer[i + 1][j - 1] == ALIVE)
            {
                cell_count++;
            }
            if (buffer[i - 1][j + 1] == ALIVE)
            {
                cell_count++;
            }

            if (cell_count == 2 || cell_count == 3)
            {
                if (cell_count == 3 && buffer[i][j] == DEAD)
                {
                    tab[i][j] = ALIVE;
                }
                else if (cell_count == 2 && buffer[i][j] == ALIVE)
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

    char pixels[DIML][DIMC];

    fill_random_values(pixels);

    for (;;)
    {
        system("clear");
        printf("Game\n");
        update(pixels);
        render(pixels);
        sleep(1);
    }
}