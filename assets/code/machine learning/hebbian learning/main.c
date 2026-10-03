#include <stdio.h>

// Função de ativação
int ativacao(int soma)
{
    if (soma >= 0)
        return 1;
    else
        return -1;
}

int main()
{

    // Combinações das entradas em representação bipolar
    int x1[4] = {-1, -1, 1, 1};
    int x2[4] = {-1, 1, -1, 1};

    // As 16 funções lógicas possíveis
    int funcoes[16][4] = {
        {-1, -1, -1, -1},
        {-1, -1, -1, 1},
        {-1, -1, 1, -1},
        {-1, -1, 1, 1},
        {-1, 1, -1, -1},
        {-1, 1, -1, 1},
        {-1, 1, 1, -1},
        {-1, 1, 1, 1},
        {1, -1, -1, -1},
        {1, -1, -1, 1},
        {1, -1, 1, -1},
        {1, -1, 1, 1},
        {1, 1, -1, -1},
        {1, 1, -1, 1},
        {1, 1, 1, -1},
        {1, 1, 1, 1}};

    // Nome de cada função lógica
    char *nomes[16] = {
        "FALSE",
        "AND",
        "A AND NOT B",
        "A",
        "NOT A AND B",
        "B",
        "XOR",
        "OR",
        "NOR",
        "XNOR",
        "NOT B",
        "A OR NOT B",
        "NOT A",
        "NOT A OR B",
        "NAND",
        "TRUE"};

    // Testar as 16 funções
    for (int f = 0; f < 16; f++)
    {

        int w0 = 0;
        int w1 = 0;
        int w2 = 0;

        int saida[4];

        // Aplicação da Regra de Hebb
        for (int i = 0; i < 4; i++)
        {

            saida[i] = funcoes[f][i];

            w0 = w0 + saida[i];
            w1 = w1 + x1[i] * saida[i];
            w2 = w2 + x2[i] * saida[i];
        }

        printf("\nFuncao %d - %s:\n", f, nomes[f]);

        printf("w0 = %d | w1 = %d | w2 = %d\n",
               w0, w1, w2);

        // Testar se os pesos encontrados reproduzem a funcao
        int acertos = 0;

        for (int i = 0; i < 4; i++)
        {

            int soma = w0 + w1 * x1[i] + w2 * x2[i];

            int resultado = ativacao(soma);

            printf("Entrada: (%d, %d) | Esperada: %d | Obtida: %d\n",
                   x1[i], x2[i], saida[i], resultado);

            if (resultado == saida[i])
            {
                acertos++;
            }
        }

        printf("Acertos: %d de 4\n", acertos);
    }

    return 0;
}