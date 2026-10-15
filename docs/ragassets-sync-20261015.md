# Sincronização do ragassets em 15/10/2026

Fonte: tabelas públicas `items.json`, `jobs.json`, `mobs.json` e `skills.json` em
<https://assets.latam-tools.com.br/raw/>. Os geradores preservam o conteúdo do
cliente; as regras calculáveis ficam em `item.json`.

O catálogo recebeu 165 IDs e 45 atualizações de registros existentes. A tabela de
sprites recebeu 36 IDs e a máscara de posição da Batata-doce na Boca foi corrigida
para Baixo. Classes, atributos e nomes de monstros e tempos de habilidades não
tiveram alterações. Trinta armas perderam a marca de pré-lançamento porque agora
estão no cliente, e oito equipamentos sombrios receberam o HP por refino descrito.

Os 14 itens antes ausentes agora têm registro: Escudo Formoso (480087), Orelhas
Sanguinárias (410213), Orelhas Espirituais (410215), Orelhas Abissais (410216), os
nove Colares Consagrados (491111–491119) e Carta Rgan de Alto Nível Modificado
(300379). Os slots foram conferidos diretamente no feed: as três Orelhas têm
zero slots, Escudo Formoso e os nove colares têm um slot.

## Autoconjurações incluídas

Ambas pertencem ao Colar Consagrado: Pureza (491113), exigem Grimório Vivatus Fides
(540024) e usam o gatilho `physical-attack`, por tentativa de ataque físico:

| Condição | Texto do cliente, sem cores |
| --- | --- |
| Arma equipada | Ao realizar ataques físicos: 10% de chance de autoconjurar [Onda Psíquica] nv.4. |
| Arma com refino +10 ou mais | Ao realizar ataques físicos, 7% de chance de autoconjurar [Tremor de Terra] nv.2. |

Os testes verificam o parceiro, os limiares de refino e o cálculo das fórmulas em
outras classes. A interface foi conferida com Elementalista: apenas Onda Psíquica
antes de +10 e os dois efeitos em +10. O fallback de Tremor de Terra usa a fórmula
sem Terramotus; o Elementalista usa sua definição nativa e mantém o bônus do espírito.

Por decisão do usuário, autoconjurações acionadas pelo uso de habilidades ficam
sem mapeamento nesta alteração. Isso inclui Tiro Preciso, Fúria Estridente,
Disparo Triplo, Fogueira Espiritual, Huuma Aderente, Kunai Rotatória e Talismã do
Jabuti, além da ativação temporária de Ilimitar.

## Limitações dos demais efeitos

- **Escudo Formoso:** a reflexão de 10% do dano corpo a corpo recebido em +11
  permanece somente na descrição; não há regra de dano refletido no motor.
- **Amizade com Harpa ou Chicote:** a chance de infligir Sono ao atacar magicamente
  permanece somente na descrição.
- **Coragem com Espada:** o cliente escreve “Recarga de [Crux Tempestas] 0,7 segundos.”,
  sem indicar redução nem aumento. A cláusula fica sem mapeamento até esclarecer
  o sinal; os bônus de dano e atributos desse conjunto estão cadastrados.
- **Conhecimento com Clava:** “Ativar Robô Atacante” não tem correspondência exata
  no catálogo de habilidades. Seus bônus de dano ficam sem mapeamento.
- **Conhecimento com Rapieira:** “Atirar Ácido” não identifica qual das quatro
  variantes do catálogo recebe o bônus. Seus bônus de dano ficam sem mapeamento.

## Greva Sombria POD

O usuário confirmou P.ATQ +3 para o conjunto da Greva Sombria POD (24873) com
Escudo Sombrio POD (24752), com soma dos refinos de pelo menos 18. O script já
trazia a magnitude +3; a condição agora usa o ID do escudo e há teste com nomes
localizados. O bônus próprio de P.ATQ +2 da greva em +10 é independente do +3 do
conjunto. A descrição sincronizada do ragassets também traz +3 no conjunto.
