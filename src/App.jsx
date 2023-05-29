import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp } from "react-icons/fi";
import DenseTable from "./components/Table";

const tipoRestricao = ["<=", "=", ">="];

export default function App() {
  const [calculated, setCalculated] = useState(false);
  const [decimal, setDecimal] = useState(false);
  const [wasMIN, setWasMIN] = useState(0);
  const [linhas, setLinhas] = useState([]);
  const [duasFases, setDuasFases] = useState(false);
  const [countExcessos, setCountExcessos] = useState(0);
  const [indexOfExcessos, setIndexOfExcessos] = useState([]);
  const [interacoes, setInteracoes] = useState([]);
  const [indexQueEntra, setIndexQueEntra] = useState([]);
  const [indexQueSai, setIndexQueSai] = useState([]);
  const [resultado, setResultado] = useState({
    zOtimo: 0,
    xOtimo: [],
    zInteger: 0,
    xInteger: [],
  });
  const [form, setForm] = useState({
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
  });

  const editTipo = (value) => {
    const newForm = form;
    newForm.to = value;
    setForm({...newForm});
  }
  const editZ = (value, index) => {
    const newForm = form;
    newForm.f[index] = value;
    setForm({...newForm});
  }
  const editXs = (value, index, i) => {
    const newForm = form;
    console.log(value, index, i);
    newForm.constrained[index].vars[i] = value;
    setForm({...newForm});
  }
  const editRestricoes = (value, index) => {
    const newForm = form;
    newForm.constrained[index].to = value;
    setForm({...newForm});
  }
  const editResult = (value, index) => {
    const newForm = form;
    newForm.constrained[index].cost = value;
    setForm({...newForm});
  }

  // RETIRAR UMA VÁRIAVEL AO PROBLEMA
  const subVars = () => {
    if(form.f.length > 2){
      const newForm = form;
      newForm.f.pop();

      for (let i = 0; i < form.constrained.length; i++) {
        newForm.constrained[i].vars.pop()
      }
      setForm({...newForm});
    }
  }

  // ADICIONAR MAIS UMA VÁRIAVEL AO PROBLEMA
  const addVars = () => {
    if(form.f.length < 4){
      const newForm = form;
      newForm.f.push(0);

      for (let i = 0; i < form.constrained.length; i++) {
          newForm.constrained[i].vars.push(0);
      }
      console.log("NewForm:", newForm);
      setForm({...newForm});
    }
  }

  // RETIRAR UMA RESTRIÇÕA DO PROBLEMA
  const subConstraineds = () => {
    const newForm = form;
    if(form.constrained.length > 2){
      newForm.constrained.pop()
      setForm({...newForm});
    }
  }

  //ADICIONAR MAIS UMA RESTRIÇÃO AO PROBLEMA
  const addConstraineds = () => {
    if(form.constrained.length <= 4){
        const newForm = form;
        const newConstrained = {
            vars: [0, 0],
            to: "<=",
            cost: 0,
            folga: [],
            artificial: [],
            excesso: 0,
        }

        if (form.constrained[0].vars.length != 2) {
            for (let i = 0; i < form.constrained[0].vars.length - 2; i++) {
                newConstrained.vars.push(0)
            }
        }

        newForm.constrained.push(newConstrained);
        setForm({...newForm});
    }
  }

  // FUNÇÃO DE CÁLCULO
  const calc = () => {
    let newForm = form;
    let newWasMIN = wasMIN;
    setCalculated(true);

    //TRATANDO MINIMIZACÃO
    if (newForm.to == "MIN") {
      for (let i = 0; i < newForm.f.length; i++) {
        newForm.f[i] *= -1;
      }

      newForm.to = "MAX";
      setWasMIN(1);
      newWasMIN = 1;
    }

    //CONSTRUINDO LINHA Z
    let linhaZ = []

    linhaZ.push('Z')
    linhaZ.push(0)

    for (let i = 0; i < newForm.f.length; i++) {
        linhaZ.push(newForm.f[i]);
    }

    let newLinhas = linhas;
    let newDuasFases = duasFases;
    let newCountExecessos = countExcessos;
    let newIndexExecessos = indexOfExcessos;
    newLinhas.push(linhaZ);

    //CRIANDO LINHAS
    for (let row = 0; row < newForm.constrained.length; row++) {
      let linha = [];

      // Base
      linha.push('x_' + (newForm.f.length + 1 + row))

      // Cb
      linha.push(0)

      // Variáveis
      for (let i = 0; i < newForm.constrained[row].vars.length; i++) {
          linha.push(newForm.constrained[row].vars[i]);
      }

      newLinhas.push(linha);
    }

    // // ADICIONANDO FOLGA, ARTIFICIAL E EXCESSO
    for (let i = 0; i < newForm.constrained.length; i++) {

      // ADICIONANDO FOLGA
      if (newForm.constrained[i].to == "<=") {
        for (let j = 0; j < newLinhas.length; j++) {
          newLinhas[j].push(0)

          if(newForm.constrained.indexOf(newForm.constrained[i]) + 1 == j){
              newLinhas[j][newLinhas[j].length - 1] = 1
          }
        }
      }

      // ADICIONANDO ARTIFICIAL
      if (newForm.constrained[i].to == "=") {
        for (let j = 0; j < newLinhas.length; j++) {

          newLinhas[j].push(0)

          if(newForm.constrained.indexOf(newForm.constrained[i]) + 1 == j){
            newLinhas[j][newLinhas[j].length - 1] = 1

            //Cb
            newLinhas[j][1] = 1
            newDuasFases = true
          }
        }
      }

      // ADICIONANDO EXCESSO
      if (newForm.constrained[i].to == ">=") {
        newCountExecessos++

        for (let j = 0; j < newLinhas.length; j++) {
          newLinhas[j].push(0)

          if(newForm.constrained.indexOf(newForm.constrained[i]) + 1 == j){
            newLinhas[j][newLinhas[j].length - 1] = 1

            newLinhas[j][1] = 1
            newDuasFases = true
          }

          newLinhas[j].push(0)

          if(newForm.constrained.indexOf(newForm.constrained[i]) + 1 == j){
            newLinhas[j][newLinhas[j].length - 1] = -1
            newLinhas[0][newLinhas[j].length - 1] = 1
            newIndexExecessos.push(newLinhas[0].indexOf(newLinhas[0][newLinhas[j].length - 1]))
          }
        }
      }
    }

    // ADICIONANDO O b
    for (let i = 0; i < newForm.constrained.length; i++) {
      if(i == 0){
        newLinhas[i].push(0);
      }

      newLinhas[i + 1].push(newForm.constrained[i].cost);
    }

    // TRATANDO SE O PROBLEMA FOR DE DUAS FASES
    if(newDuasFases){
      for (let i = 0; i < newLinhas.length; i++) {
        if(newLinhas[i][1] == 1){
          for (let j = 0; j < newForm.constrained[0].vars.length; j++) {
            newLinhas[0][j + 2] = 0
          }

          newLinhas[0][newLinhas[0].length - 1] = 0
        }
      }

      for (let i = 0; i < newLinhas.length; i++) {
        if(newLinhas[i][1] == 1){
          for (let j = 0; j < newForm.constrained[0].vars.length; j++) {
            newLinhas[0][j + 2] += newLinhas[i][j + 2]
          }

          newLinhas[0][newLinhas[0].length - 1] += newLinhas[i][newLinhas[0].length - 1]
        }
      }
    }

    // INVERTENDO LINHA Z PARA O PROGRESSO DA SOLUÇÃO TABULAR
    for (let i = 2; i < newForm.f.length + 2; i++) {
        newLinhas[0][i] *= -1
    }

    // ULTIMOS TRATAMENTOS PARA A PRIMEIRA ITERAÇÃO
    let newInteracoes = interacoes;
    newLinhas[0][newLinhas[0].length - 1] *= -1
    newInteracoes.push(newLinhas);
    console.log("Interacoes: ", newInteracoes);
    setInteracoes(newInteracoes);
    setForm(newForm);
    setLinhas(newLinhas);
    iteracao(newInteracoes[0], newCountExecessos, newIndexExecessos, newInteracoes, newDuasFases, newWasMIN);
  }

  // FUNÇÃO RECURSIVA DE ITERAÇÃO
  const iteracao = (linhaAnterior, newCountExecessos, newIndexExecessos, newInteracoes, newDuasFases, newWasMIN) => {
    let novaLinha = [];
    novaLinha = JSON.parse(JSON.stringify(linhaAnterior));

    // VARIÁVEIS AUXILIARES
    let iteracaoExcesso = false
    let countNovaLinha0 = 0

    // let newLinhas = linhas;
    let newForm = form;
    // console.log("newLinhas: ", newLinhas);
    // console.log("newForm: ", newForm);
    // console.log("formTest: ", formTest);
    // console.log("newIndexExecessos: ", newIndexExecessos);

    for (let i = 2; i < newForm.f.length + 2; i++) {
      if(novaLinha[0][i] < 0) {
        countNovaLinha0 = novaLinha[0][i]
      }
    }

    if(countNovaLinha0 >= 0 && newCountExecessos > 0){
      iteracaoExcesso = true
    }

    //DEFININDO VÁRIAVEL QUE ENTRA NA BASE
    let maior = -1
    let queEntra = 0;

    if (iteracaoExcesso == true) {
      newCountExecessos --

      maior = novaLinha[0][newIndexExecessos[0]];
      queEntra = newIndexExecessos[0];

      newIndexExecessos.shift();
    } else {
      //DEFININDO PESOS
      let linhaZpositivada = [];

      for (let i = 2; i < newForm.constrained[0].vars.length + 2; i++) {
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

    let newIndexQueEntra = indexQueEntra;
    let newIndexQueSai = indexQueSai;
    newIndexQueEntra.push(queEntra);
    setIndexQueEntra(newIndexQueEntra);
    newIndexQueSai.push(queSai);
    console.log(newIndexQueEntra, newIndexQueSai)

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

    newInteracoes.push(novaLinha)
    console.log("Interacoes: ", newInteracoes);

    // NECESSÁRIA MAIS ITERAÇÕES?
    let maisiteracoes = false;
    countNovaLinha0 = 0

    for (let i = 2; i < newForm.f.length + 2; i++) {
        if(novaLinha[0][i] < 0) {
            countNovaLinha0 = novaLinha[0][i]
        }
    }


    if(countNovaLinha0 < 0 || newCountExecessos > 0) {
      //SE TEM MAIS VARIAVEIS PARA ITERAR OU EXISTEM EXCESSOS
      maisiteracoes = true;
    } else if(countNovaLinha0 >= 0 && newCountExecessos == 0 && newDuasFases == true) {
        //SE NÃO TEM MAIS VARIAVEIS PARA ITERAR E NÃO EXISTEM MAIS EXCESSOS PORÉM A FASE DOIS AINDA NÃO FOI EXECUTADA
        let linhaZduasFases = JSON.parse(JSON.stringify(novaLinha))

        //ITERANDO A TABELA DA FASE 2
        let counter = 1;
        for (let j = 0; j < newForm.f.length; j++) {
            for (let i = 1; i < novaLinha.length; i++) {
                if (novaLinha[i][0].includes("x_" + counter)) {
                    if (newWasMIN) {
                        linhaZduasFases[i][1] = newForm.f[j] * -1
                    } else {
                        linhaZduasFases[i][1] = newForm.f[j]
                    }
                }
            }
            counter ++
        }

        for (let i = 2; i < linhaZduasFases[0].length; i++) {
            if(newWasMIN){
                linhaZduasFases[0][i] = newForm.f[i - 2] ? newForm.f[i - 2] : 0
            } else {
                linhaZduasFases[0][i] = newForm.f[i - 2] ? (newForm.f[i - 2] * -1) : 0
            }
            for (let j = 1; j < linhaZduasFases.length; j++) {
                linhaZduasFases[0][i] += linhaZduasFases[j][1] * linhaZduasFases[j][i]
            }
        }

        //VERIFICANDO EXISTÊNCIA DE MAIS ITERAÇÕES
        let sumlinhza = 0

        for (let i = 2; i < newForm.f.length + 2; i++) {
            if(linhaZduasFases[0][i] < 0) {
                sumlinhza = linhaZduasFases[0][i]
            }
        }

        if (sumlinhza < 0) {
            maisiteracoes = true
        } else {
            maisiteracoes = false
        }

        newInteracoes.push(linhaZduasFases)
        console.log("Interacoes final: ", newInteracoes);
        setInteracoes(newInteracoes);
        newDuasFases = false
    } else if(countNovaLinha0 >= 0 && newCountExecessos == 0 && newDuasFases == false) {
        //SE NÃO TEM MAIS VARIÁVEIS PARA ITERAR E NÃO EXISTEM MAIS EXCESSOS E FASE DOIS FOI EXECUTADA
        maisiteracoes = false;
    }


    if(maisiteracoes) {
        //CASO HAJA MAIS ITERAÇÕES PARA FAZER, A FUNÇÃO RECURSIVA É ACIONADA
        // newCountExecessos, newIndexExecessos, newInteracoes, newDuasFases, newWasMIN
        iteracao(newInteracoes[newInteracoes.length - 1], newCountExecessos, newIndexExecessos, newInteracoes, newDuasFases, newWasMIN)
    } else {
        // ITERAÇÃO FINAL
        let iteracaoFinal = JSON.parse(JSON.stringify(newInteracoes[newInteracoes.length - 1]))
        // setInteracoes(iteracaoFinal);

        let newResultado = resultado;

        // ADICIONANDO OS VALORES ÓTIMOS DE X
        let counter = 1;
        let aux = 0
        for (let j = 0; j < newForm.f.length; j++) {
            aux = 0
            for (let i = 1; i < novaLinha.length; i++) {
                aux += novaLinha[i][j+2]
            }
            if(aux == 1){
                for (let i = 1; i < novaLinha.length; i++) {
                    if(novaLinha[i][0].includes("x_" + counter)) {
                      newResultado.xOtimo.push(iteracaoFinal[i][iteracaoFinal[i].length - 1])
                    }
                }
            } else {
              newResultado.xOtimo.push(0)
            }
            counter ++
        }

        // VERIFICANDO A EXISTÊNCIA DE SOLUÇÃO INTEIRA CASO RESULTADO SEJA DECIMAL
        newResultado.xOtimo.forEach(i => {
            if(isDecimal(i) == true ) {
                setDecimal(true);
            }
        });

        // ADICIONANDO OS VALORES ÓTIMOS DE Z
        newResultado.zOtimo = iteracaoFinal[0][iteracaoFinal[i].length - 1];

        console.log("newResultado: ", newResultado);
        // console.log("iteracaoFinal: ", iteracaoFinal);
    }
  }

  const isDecimal = (input) => {
    let regex = /^[-+]?[0-9]+\.[0-9]+$/;
    return (regex.test(input));
  }

  return (
    <div>
      <div className="text-center">
        <h2>Problema Simplez</h2>
      </div>

      {/* Botões de Controle */}
      <div>
        <div>
            {/* <small>VARIÁVEIS</small> */}
            {/* <small>RESTRIÇÕES</small> */}
            <small>VARIÁVEIS</small>
            <div style={{ flex: '1' }}></div>
            <button onClick={subVars} className="text-red-600">
              {/* <FiChevronLeft size={25} /> */}
              Remover
            </button>
            <button onClick={addVars} className="text-green-600">
              {/* <FiChevronRight size={25} /> */}
              Adicionar
            </button>
        </div>

        <div>
          <small>RESTRIÇÕES</small>
          <div style={{ flex: '1' }}></div>
          <button onClick={subConstraineds} className="text-red-600">
            {/* <FiChevronDown size={25} /> */}
            Remover
          </button>
          <button onClick={addConstraineds} className="text-green-600">
            {/* <FiChevronUp size={25} /> */}
            Adicionar
          </button>
        </div>
      </div>

      {/* Formulario Principal */}
      <div className="flex justify-center mt-10">
        <form>
          <div>
            {/* Função Z */}
            <table>
              <thead>
                <tr>
                  <th>
                    <FormControl>
                      <InputLabel id="demo-simple-select-label">tipo</InputLabel>
                      <Select
                        className="w-full pr-36"
                        labelId="demo-simple-select-label"
                        value={form.to}
                        label="Age"
                        onChange={(e) => editTipo(e.target.value)}
                      >
                        <MenuItem value="MAX">MAX</MenuItem>
                        <MenuItem value="MIN">MIN</MenuItem>
                      </Select>
                    </FormControl>
                  </th>
                  <th><TextField id="filled-basic" label="Z =" disabled /></th>
                  {form.f.map((f, index) => (
                    <th key={index}>
                      <TextField 
                        type="number"
                        label={`X${index+1}`}
                        value={f}
                        onChange={(e) => editZ(e.target.value, index)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
            </table>

            {/* Restrições Z */}
            <table className="mt-10">
              <tbody>
                {form.constrained.map((constrained, index) => (
                <tr key={index}>
                  {form.constrained[index].vars.map((j, i) => (
                  <td className="pb-2" key={i}>
                    <TextField 
                      type="number" 
                      label={`X${i+1}`} 
                      value={form.constrained[index].vars[i]}
                      onChange={(e) => editXs(e.target.value, index, i)}
                    />
                  </td>))}

                  <td>
                    <FormControl sx={{ minWidth: 120 }}>
                      <Select
                        className="mb-2"
                        value={form.constrained[index].to}
                        onChange={(e) => editRestricoes(e.target.value, index)}
                        displayEmpty
                      >
                        {tipoRestricao.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </td>

                  <td className="pb-2">
                    <TextField 
                      type="number" 
                      value={form.constrained[index].cost}
                      onChange={(e) => editResult(e.target.value, index)}
                    />
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>


        </form>
      </div>

      <button onClick={calc}>
        Calcular
      </button>

      <div>
        Tabela

        <DenseTable iteracoes={interacoes} indexQueEntra={indexQueEntra} />
      </div>
    </div>
  )
}
