<!--
Documento de apoio apresentado ao Curso de Bacharelado em Sistemas de Informação,
da Universidade Estadual de Montes Claros - UNIMONTES,
como requisito parcial de nota na disciplina de Pesquisa Operacional,
ministrada pelo professor Lenir de Abreu Júnior.

EQUIPE:
Enael, George, Lucas Gabriel, Mateus Reis e Mayara

INFORMAÇÕES TÉCNICAS:
Linguagem: Javascript
Framework: Vue
Interface: Vuetify
-->

<template>
  <v-app dark>
      <v-main>
          <v-container style="max-width: 768px">
              <v-sheet>
                  <v-card-text class="text-center">
                      <h1>Solucionador Simplex</h1>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                      <p>O presente trabalho, que se iniciou durante o curso de Sistemas de Informação na Universidade Estadual de Montes Claros (UNIMONTES), sob orientação do professor Lenir de Abreu Júnior propõe a realização de um trabalho da disciplina de Pesquisa Operacional. Esse projeto foi realizado usando as métricas e métodos expostos pelo professor durante as aulas, além de pesquisas feitas pelos integrantes da equipe. <br> O código-fonte se encontra em repositório: <a href="https://github.com/mateuskonige/simplex" target="_blank" rel="noopener noreferrer">GitHub</a></p>
                  </v-card-text>
              </v-sheet>

              <!-- BOTÕES DE CONTROLE -->
              <v-card elevation="0">
                  <div class="d-flex justify-space-between px-5">
                      <small>VARIÁVEIS</small>
                      <small>RESTRIÇÕES</small>
                  </div>

                  <v-card-text class="d-flex">
                      <v-btn color="error" outlined small fab depressed @click="subVars">
                        <v-icon>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn color="success" outlined small fab depressed @click="addVars">
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                      <v-spacer />
                      <v-btn color="error" outlined small fab depressed @click="subConstraineds"><v-icon>mdi-chevron-up</v-icon></v-btn>
                      <v-btn color="success" outlined small fab depressed @click="addConstraineds"><v-icon>mdi-chevron-down</v-icon></v-btn>
                  </v-card-text>
              </v-card>

              <!-- INFORMAÇÃO DO PROBLEMA -->
              <v-sheet>
                  <v-card-text class="text-center">
                      <span>O problema tem: <br><b>{{this.form.f.length}}</b> variáveis e <b>{{ this.form.constrained.length}}</b> restrições</span>
                  </v-card-text>
              </v-sheet>

              <!-- CARD FORMULÁRIO PRINCIPAL -->
              <v-card elevation="0">
                  <form @submit.prevent="calc()">
                      <v-card-text>

                          <!-- FUNCÃO Z -->
                          <v-row>
                              <v-col>
                                  <v-select :items="items" v-model="form.to">
                                  </v-select>
                              </v-col>

                              <v-col>
                                  <v-text-field
                                      disabled
                                      value="Z ="
                                  ></v-text-field>
                              </v-col>

                              <v-col v-for="(i, index) in form.f" :key="index">
                                  <v-text-field
                                      type="number"
                                      step="0.01"
                                      :label="'x_' + (index + 1)"
                                      v-model.number="form.f[index]"
                                  ></v-text-field>
                              </v-col>
                          </v-row>

                          <v-row>
                              <v-col> Sujeito a: </v-col>
                          </v-row>

                          <!-- RESTRICÕES -->
                          <v-row v-for="(i, index) in form.constrained.length" :key="index">
                              <!-- RESTRICÕES: X -->
                              <v-col v-for="(j, jndex) in form.constrained[index].vars" :key="jndex">
                                  <v-text-field
                                      type="number"
                                      step="0.01"
                                      :label="'x_' + (jndex + 1)"
                                      v-model.number="form.constrained[index].vars[jndex]"
                                  ></v-text-field>
                              </v-col>

                              <!-- RESTRICÕES: <=,>= OU == -->
                              <v-col>
                                  <v-select
                                      :items="to"
                                      v-model="form.constrained[index].to"
                                  >
                                  </v-select>
                              </v-col>

                              <!-- RESTRICÕES: CUSTO -->
                              <v-col>
                                  <v-text-field
                                      type="number"
                                      step="0.1"
                                      v-model.number="form.constrained[index].cost"
                                  ></v-text-field>
                              </v-col>
                          </v-row>
                      </v-card-text>

                      <!-- BOTÃO CÁLCULO -->
                      <v-card-actions>
                          <v-spacer />
                          <v-btn v-if="!calculated"
                              type="submit"
                              class="align-right"
                              color="primary"
                              depressed
                              block
                              ><v-icon>mdi-calculator</v-icon> Calcular (FORMA TABULAR)</v-btn
                          >
                      </v-card-actions>
                  </form>
              </v-card>

              <!-- TABELAS -->
              <div v-if="calculated">
                  <v-card class="mb-8" v-for="(x, tableau) in this.iteracoes" :key="tableau">
                      <v-card-title>{{'Iteração ' + tableau }}</v-card-title>
                      <v-card-text>
                          <v-simple-table dense>
                              <thead>
                                  <tr>
                                      <th>Base</th>
                                      <th>Cb</th>
                                      <template v-for="(i, index) in x[0].length - 3">
                                          <th :style=" index == (indexQueEntra[tableau] - 2) ? 'color: blue; font-weight: bold;' : ''" :key="index">{{ 'x_' + (index + 1) }}</th>
                                      </template>
                                      <th>b</th>
                                  </tr>
                              </thead>

                              <tbody>
                                  <tr v-for="(lines, i) in x" :key="i">
                                      <td v-for="(li, j) in lines" :key="j" :style="i == indexQueSai[tableau] && j == 0 ? 'color: red; ' : ''">
                                          <template v-if="j == indexQueEntra[tableau] && i == indexQueSai[tableau]">
                                              <p style="color: green; font-weight: bold;">{{ li.toFixed(2) }}</p>
                                          </template>
                                          <template v-else>
                                              <p >{{ li }}</p>
                                          </template>
                                      </td>
                                  </tr>
                              </tbody>
                          </v-simple-table>

                          <div v-if="indexQueEntra[tableau]">
                              <span>
                                  Váriavel que <b style="color: blue;">entra</b> na base: <b>{{ 'x_' + (indexQueEntra[tableau] - 1) }}</b> <br>
                                  Váriável que <b style="color: red;">sai</b> da base: <b>{{ x[indexQueSai[tableau]][0] }}</b>
                              </span>
                          </div>
                      </v-card-text>
                  </v-card>

                  <v-sheet>
                          <!-- RESULTADO ÓTIMO -->
                          <v-card-text>
                              <h3 class="mt-4">X* = {{ resultado.xOtimo }}</h3>
                              <h3 class="mt-4">Z* = {{ resultado.zOtimo }}</h3>
                          </v-card-text>

                          <!-- RESULTADO ÓTIMO INTEIRO SE POSSÍVEL -->
                          <v-card-text v-if="valoresInteiros">
                              <h3 class="mt-4">X* = {{ ...resultado.xInteger }}</h3>
                              <h3 class="mt-4">Z* = {{ resultado.zInteger }}</h3>
                          </v-card-text>

                          <!-- BOTÃO SOLUÇÃO INTEIRA -->
                          <v-card-actions v-if="!valoresInteiros">
                              <v-spacer></v-spacer>
                              <v-btn color="secondary" block v-if="decimal" @click="calcIntegers"><v-icon>mdi-calculator</v-icon> Encontrar solução inteira</v-btn>
                          </v-card-actions>
                          <v-card-actions v-else >
                              <v-spacer></v-spacer>
                              <v-btn color="secondary" elevation="0" block disabled>Solução inteira calculada</v-btn>
                          </v-card-actions>

                          <v-card-actions>
                              <v-btn small outlined @click="scrollToTop">Voltar para o topo</v-btn>
                              <v-spacer></v-spacer>
                              <v-btn small outlined @click="reloadPage">Resetar página</v-btn>
                          </v-card-actions>
                  </v-sheet>
              </div>
          </v-container>
      </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
      return {
          calculated: false,
          valoresInteiros: false,
          decimal: false,

          items: ["MAX", "MIN"],
          to: ["<=", "=", ">="],
          linhas: [],
          iteracoes: [],

          duasFases: false,

          wasMIN: 0,
          countExcessos: 0,
          indexOfExcessos: [],

          indexQueEntra: [],
          indexQueSai: [],

          resultado: {
              zOtimo: 0,
              xOtimo: [],
              zInteger: 0,
              xInteger: [],
          },

          form: {
              f: [0.4, 0.5],
              to: "MIN",
              constrained: [
                  {
                      vars: [0.3, 0.1],
                      to: "<=",
                      cost: 2.7,
                      folga: [],
                      artificial: [],
                      excesso: 0,
                  },
                  {
                      vars: [0.5, 0.5],
                      to: "=",
                      cost: 6,
                      folga: [],
                      artificial: [],
                      excesso: 0,
                  },
                  {
                      vars: [0.6, 0.4],
                      to: ">=",
                      cost: 6,
                      folga: [],
                      artificial: [],
                      excesso: 0,
                  },
              ],
          },
      };
  },

  methods: {
      scrollToTop() {
          window.scrollTo(0,0);
      },

      reloadPage() {
          window.location.reload();
      },

      // RETIRAR UMA VÁRIAVEL AO PROBLEMA
      subVars() {
          if(this.form.f.length > 2){
              this.form.f.pop()

              for (let i = 0; i < this.form.constrained.length; i++) {
                  this.form.constrained[i].vars.pop()
              }
          }
      },

      // ADICIONAR MAIS UMA VÁRIAVEL AO PROBLEMA
      addVars() {
          if(this.form.f.length < 4){
              this.form.f.push(0)

              for (let i = 0; i < this.form.constrained.length; i++) {
                  this.form.constrained[i].vars.push(0)
              }
          }
      },

      // RETIRAR UMA RESTRIÇÕA DO PROBLEMA
      subConstraineds(){
          if(this.form.constrained.length > 2){
              this.form.constrained.pop()
          }
      },

      //ADICIONAR MAIS UMA RESTRIÇÃO AO PROBLEMA
      addConstraineds(){
          if(this.form.constrained.length <= 4){
              const newConstrained = {
                  vars: [0, 0],
                  to: "<=",
                  cost: 0,
                  folga: [],
                  artificial: [],
                  excesso: 0,
              }

              if (this.form.constrained[0].vars.length != 2) {
                  for (let i = 0; i < this.form.constrained[0].vars.length - 2; i++) {
                      newConstrained.vars.push(0)
                  }
              }

              this.form.constrained.push(newConstrained)
          }
      },

      // FUNÇÃO DE CÁLCULO
      calc() {
          this.calculated = true;

          //TRATANDO MINIMIZACÃO
          if (this.form.to == "MIN") {
              for (let i = 0; i < this.form.f.length; i++) {
                  this.form.f[i] *= -1;
              }

              this.form.to = "MAX";
              this.wasMIN = 1
          }

          //CONSTRUINDO LINHA Z
          let linhaZ = []

          linhaZ.push('Z')
          linhaZ.push(0)

          for (let i = 0; i < this.form.f.length; i++) {
              linhaZ.push(this.form.f[i]);
          }

          this.linhas.push(linhaZ);

          //CRIANDO LINHAS
          for (let row = 0; row < this.form.constrained.length; row++) {
              let linha = [];

              // Base
              linha.push('x_' + (this.form.f.length + 1 + row ))

              // Cb
              linha.push(0)

              // Variáveis
              for (let i = 0; i < this.form.constrained[row].vars.length; i++) {
                  linha.push(this.form.constrained[row].vars[i]);
              }

              this.linhas.push(linha);
          }

          // ADICIONANDO FOLGA, ARTIFICIAL E EXCESSO
          for (let i = 0; i < this.form.constrained.length; i++) {

              // ADICIONANDO FOLGA
              if (this.form.constrained[i].to == "<=") {
                  for (let j = 0; j < this.linhas.length; j++) {
                      this.linhas[j].push(0)

                      if(this.form.constrained.indexOf(this.form.constrained[i]) + 1 == j){
                          this.linhas[j][this.linhas[j].length - 1] = 1
                      }
                  }
              }

              // ADICIONANDO ARTIFICIAL
              if (this.form.constrained[i].to == "=") {
                  for (let j = 0; j < this.linhas.length; j++) {
                      this.linhas[j].push(0)

                      if(this.form.constrained.indexOf(this.form.constrained[i]) + 1 == j){
                          this.linhas[j][this.linhas[j].length - 1] = 1

                          //Cb
                          this.linhas[j][1] = 1
                          this.duasFases = true
                      }
                  }
              }

              // ADICIONANDO EXCESSO
              if (this.form.constrained[i].to == ">=") {
                  this.countExcessos++

                  for (let j = 0; j < this.linhas.length; j++) {
                      this.linhas[j].push(0)

                      if(this.form.constrained.indexOf(this.form.constrained[i]) + 1 == j){
                          this.linhas[j][this.linhas[j].length - 1] = 1

                          this.linhas[j][1] = 1
                          this.duasFases = true
                      }

                      this.linhas[j].push(0)

                      if(this.form.constrained.indexOf(this.form.constrained[i]) + 1 == j){
                          this.linhas[j][this.linhas[j].length - 1] = -1
                          this.linhas[0][this.linhas[j].length - 1] = 1
                          this.indexOfExcessos.push(this.linhas[0].indexOf(this.linhas[0][this.linhas[j].length - 1]))
                      }
                  }
              }
          }

          // ADICIONANDO O b
          for (let i = 0; i < this.form.constrained.length; i++) {
              if(i == 0){
                  this.linhas[i].push(0);
              }

              this.linhas[i + 1].push(this.form.constrained[i].cost);
          }

          // TRATANDO SE O PROBLEMA FOR DE DUAS FASES
          if(this.duasFases){
              for (let i = 0; i < this.linhas.length; i++) {
                  if(this.linhas[i][1] == 1){
                      for (let j = 0; j < this.form.constrained[0].vars.length; j++) {
                          this.linhas[0][j + 2] = 0
                      }

                      this.linhas[0][this.linhas[0].length - 1] = 0
                  }
              }

              for (let i = 0; i < this.linhas.length; i++) {
                  if(this.linhas[i][1] == 1){
                      for (let j = 0; j < this.form.constrained[0].vars.length; j++) {
                          this.linhas[0][j + 2] += this.linhas[i][j + 2]
                      }

                      this.linhas[0][this.linhas[0].length - 1] += this.linhas[i][this.linhas[0].length - 1]
                  }
              }
          }

          // INVERTENDO LINHA Z PARA O PROGRESSO DA SOLUÇÃO TABULAR
          for (let i = 2; i < this.form.f.length + 2; i++) {
              this.linhas[0][i] *= -1
          }

          // ULTIMOS TRATAMENTOS PARA A PRIMEIRA ITERAÇÃO
          this.linhas[0][this.linhas[0].length - 1] *= -1
          this.iteracoes.push(this.linhas);
          this.iteracao(this.iteracoes[0])
      },

      // FUNÇÃO RECURSIVA DE ITERAÇÃO
      iteracao(linhaAnterior) {
          let novaLinha = [];
          novaLinha = JSON.parse(JSON.stringify(linhaAnterior));

          // VARIÁVEIS AUXILIARES
          let iteracaoExcesso = false
          let countNovaLinha0 = 0

          for (let i = 2; i < this.form.f.length + 2; i++) {
              if(novaLinha[0][i] < 0) {
                  countNovaLinha0 = novaLinha[0][i]
              }
          }

          if(countNovaLinha0 >= 0 && this.countExcessos > 0){
              iteracaoExcesso = true
          }

          //DEFININDO VÁRIAVEL QUE ENTRA NA BASE
          let maior = -1
          let queEntra = 0;

          if (iteracaoExcesso == true) {
              this.countExcessos --

              maior = novaLinha[0][this.indexOfExcessos[0]];
              queEntra = this.indexOfExcessos[0];

              this.indexOfExcessos.shift();
          } else {
              //DEFININDO PESOS
              let linhaZpositivada = [];

              for (let i = 2; i < this.form.constrained[0].vars.length + 2; i++) {
                  linhaZpositivada.push(novaLinha[0][i] * -1)
              }

              for (var i = 0; i < linhaZpositivada.length; i++) {
                  if (maior < linhaZpositivada[i] ) {
                      maior = linhaZpositivada[i];
                      queEntra = linhaZpositivada.indexOf(linhaZpositivada[i])
                  }
              }
          }

          // DIVISÃO DOS CUSTOS PELA VARIÁVEL DA COLUNA QUE ENTRA
          let divisao = [];

          for (let i = 1; i < novaLinha.length; i++) {
              if (novaLinha[i][novaLinha[i].length - 1] == 0) {
                  divisao.push(Infinity)
              } else {
                  if (iteracaoExcesso == false) {
                      divisao.push(parseFloat(novaLinha[i][novaLinha[i].length - 1]) / linhaAnterior[i][queEntra + 2]);
                  } else {
                      divisao.push(parseFloat(novaLinha[i][novaLinha[i].length - 1]) / linhaAnterior[i][queEntra]);
                  }
              }
          }

          //DEFININDO VÁRIAVEL QUE SAI DA BASE
          var menor = 999999999;
          var queSai = 0;

          for (var i = 0; i < divisao.length; i++) {
              if (menor > divisao[i] && divisao[i] > 0) {
                  menor = divisao[i];
                  queSai = divisao.indexOf(divisao[i])
              }
          }

          //AJUSTANDO AS POSIÇÕES DE ACORDO COM A TABELA
          if(iteracaoExcesso == false) {
              queEntra += 2
          }
          queSai += 1

          this.indexQueEntra.push(queEntra);
          this.indexQueSai.push(queSai);

          // ITERANDO A LINHA PIVÔ
          for (let i = 2; i < novaLinha[queSai].length; i++) {
              novaLinha[queSai][i] = linhaAnterior[queSai][i] / linhaAnterior[queSai][queEntra];
          }

          novaLinha[queSai][0] = 'x_' + (queEntra - 1)
          novaLinha[queSai][1] = 0

          // ITERANDO AS OUTRAS LINHAS
          for (let i = 0; i < novaLinha.length; i++) {
              for (let j = 2; j < novaLinha[queSai].length; j++) {
                  if(i != queSai) {
                      novaLinha[i][j] = linhaAnterior[i][j] - (linhaAnterior[i][queEntra] * novaLinha[queSai][j]);
                  }
              }
          }

          this.iteracoes.push(novaLinha)

          // NECESSÁRIA MAIS ITERAÇÕES?
          let maisiteracoes = false;
          countNovaLinha0 = 0

          for (let i = 2; i < this.form.f.length + 2; i++) {
              if(novaLinha[0][i] < 0) {
                  countNovaLinha0 = novaLinha[0][i]
              }
          }


          if(countNovaLinha0 < 0 || this.countExcessos > 0) {
              //SE TEM MAIS VARIAVEIS PARA ITERAR OU EXISTEM EXCESSOS
              maisiteracoes = true;
          } else if(countNovaLinha0 >= 0 && this.countExcessos == 0 && this.duasFases == true) {
              //SE NÃO TEM MAIS VARIAVEIS PARA ITERAR E NÃO EXISTEM MAIS EXCESSOS PORÉM A FASE DOIS AINDA NÃO FOI EXECUTADA
              let linhaZduasFases = JSON.parse(JSON.stringify(novaLinha))

              //ITERANDO A TABELA DA FASE 2
              let counter = 1;
              for (let j = 0; j < this.form.f.length; j++) {
                  for (let i = 1; i < novaLinha.length; i++) {
                      if (novaLinha[i][0].includes("x_" + counter)) {
                          if (this.wasMIN) {
                              linhaZduasFases[i][1] = this.form.f[j] * -1
                          } else {
                              linhaZduasFases[i][1] = this.form.f[j]
                          }
                      }
                  }
                  counter ++
              }

              for (let i = 2; i < linhaZduasFases[0].length; i++) {
                  if(this.wasMIN){
                      linhaZduasFases[0][i] = this.form.f[i - 2] ? this.form.f[i - 2] : 0
                  } else {
                      linhaZduasFases[0][i] = this.form.f[i - 2] ? (this.form.f[i - 2] * -1) : 0
                  }
                  for (let j = 1; j < linhaZduasFases.length; j++) {
                      linhaZduasFases[0][i] += linhaZduasFases[j][1] * linhaZduasFases[j][i]
                  }
              }

              //VERIFICANDO EXISTÊNCIA DE MAIS ITERAÇÕES
              let sumlinhza = 0

              for (let i = 2; i < this.form.f.length + 2; i++) {
                  if(linhaZduasFases[0][i] < 0) {
                      sumlinhza = linhaZduasFases[0][i]
                  }
              }

              if (sumlinhza < 0) {
                  maisiteracoes = true
              } else {
                  maisiteracoes = false
              }

              this.iteracoes.push(linhaZduasFases)
              this.duasFases = false
          } else if(countNovaLinha0 >= 0 && this.countExcessos == 0 && this.duasFases == false) {
              //SE NÃO TEM MAIS VARIÁVEIS PARA ITERAR E NÃO EXISTEM MAIS EXCESSOS E FASE DOIS FOI EXECUTADA
              maisiteracoes = false;
          }


          if(maisiteracoes) {
              //CASO HAJA MAIS ITERAÇÕES PARA FAZER, A FUNÇÃO RECURSIVA É ACIONADA
              this.iteracao(this.iteracoes[this.iteracoes.length - 1])
          } else {
              // ITERAÇÃO FINAL
              let iteracaoFinal = JSON.parse(JSON.stringify(this.iteracoes[this.iteracoes.length - 1]))

              // ADICIONANDO OS VALORES ÓTIMOS DE X
              let counter = 1;
              let aux = 0
              for (let j = 0; j < this.form.f.length; j++) {
                  aux = 0
                  for (let i = 1; i < novaLinha.length; i++) {
                      aux += novaLinha[i][j+2]
                  }
                  if(aux == 1){
                      for (let i = 1; i < novaLinha.length; i++) {
                          if(novaLinha[i][0].includes("x_" + counter)) {
                              this.resultado.xOtimo.push(iteracaoFinal[i][iteracaoFinal[i].length - 1])
                          }
                      }
                  } else {
                      this.resultado.xOtimo.push(0)
                  }
                  counter ++
              }

              // VERIFICANDO A EXISTÊNCIA DE SOLUÇÃO INTEIRA CASO RESULTADO SEJA DECIMAL
              this.resultado.xOtimo.forEach(i => {
                  if(this.isDecimal(i) == true ) {
                      this.decimal = true
                  }
              });

              // ADICIONANDO OS VALORES ÓTIMOS DE Z
              this.resultado.zOtimo = iteracaoFinal[0][iteracaoFinal[i].length - 1]
          }
      },

      //FUNÇÃO QUE VERIFICA SE O NÚMERO É DECIMAL
      isDecimal(input){
          let regex = /^[-+]?[0-9]+\.[0-9]+$/;
          return (regex.test(input));
      },

      // FUNÇÃO PARA O CÁLCULO DE INTEIROS
      calcIntegers() {
          this.valoresInteiros = true

          let maioreMenorQueX = [];
          let MaioreseMenoresQueX = [];

          for (let i = 0; i < this.form.f.length; i++) {
              maioreMenorQueX = [];
                  maioreMenorQueX.push(Math.floor(this.resultado.xOtimo[i]))
                  maioreMenorQueX.push(Math.ceil(this.resultado.xOtimo[i]))
              MaioreseMenoresQueX.push(maioreMenorQueX)
          }

          // CONBINAÇÕES POSSÍVEIS DOS VALORES DE X
          let combinacoes = []
          combinacoes = this.combinar(MaioreseMenoresQueX)

          // VARIÁVEIS AUXILIÁRES
          let resultadoInteiro = 0;
          let zInteiro = 0
          let xInteiro = []
          if(this.wasMIN){
              zInteiro = 99999
          } else {
              zInteiro = -1
          }

          // VERIFICANDO SE O VALOR INTEIRO É MELHOR QUE O ANTERIOR ENCONTRADO, E PIOR QUE O VALOR ÓTIMO DECIMAL
          for (let i = 0; i < combinacoes.length; i++) {
              if(this.wasMIN){
                  resultadoInteiro = 0
                  for (let j = 0; j < this.form.f.length; j++) {
                      resultadoInteiro += (this.form.f[j] * -1) * combinacoes[i][j]
                  }
                  if(resultadoInteiro >= this.resultado.zOtimo && resultadoInteiro < zInteiro){
                      zInteiro = resultadoInteiro
                      xInteiro = [];
                      xInteiro.push(combinacoes[i])
                  }
                  } else {
                      resultadoInteiro = 0
                      for (let j = 0; j < this.form.f.length; j++) {
                          resultadoInteiro += this.form.f[j] * combinacoes[i][j]
                      }
                      if(resultadoInteiro <= this.resultado.zOtimo && resultadoInteiro > zInteiro){
                          zInteiro = resultadoInteiro
                          xInteiro = [];
                          xInteiro.push(combinacoes[i])
                      }
                  }
              }

          // Z ÓTIMO INTEIRO
          this.resultado.zInteger = zInteiro;

          // X ÓTIMO INTEIRO
          for (let i = 0; i < xInteiro.length; i++) {
              this.resultado.xInteger.push(xInteiro[i])
          }
      },

      // FUNCÃO PARA GERAR TODAS AS COMBINAÇÕES DOS VALORES DE Z
      combinar(arraysToCombine) {
          var divisors = [];

          for (var i = arraysToCombine.length - 1; i >= 0; i--) {
              divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
          }

          function getPermutation(n, arraysToCombine) {
          var result = [],
              curArray;
          for (var i = 0; i < arraysToCombine.length; i++) {
              curArray = arraysToCombine[i];
              result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
          }
          return result;
          }

          var numPerms = arraysToCombine[0].length;
          for(var i = 1; i < arraysToCombine.length; i++) {
              numPerms *= arraysToCombine[i].length;
          }

          var combinations = [];
          for(var i = 0; i < numPerms; i++) {
              combinations.push(getPermutation(i, arraysToCombine));
          }

          return combinations;
      }
  },
};
</script>
