import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';

export default function DenseTable({iteracoes, indexQueEntra}) {

  useEffect(() => {
    console.log("iteracoes Tabela: ", iteracoes)
  }, [iteracoes]);

  const testTable = () => {
    console.log("Inderações: ", iteracoes)

    if(iteracoes.length > 0) {
      console.log(iteracoes[0][0])
      iteracoes[0][0].map((linha) => {
        console.log(linha)
        // linha.map((valores) => {
        //   console.log(valores)
        // })
      })
    }
  }

  if(iteracoes.length == 0) return;
  return (
    <div>
    {iteracoes.map((item, index) => (
    <TableContainer key={index} component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">BASE</TableCell>
            <TableCell align="center">Cb</TableCell>
            {iteracoes[0][0].map((linha, index) => {
              if (iteracoes[0][0].length - 3 <= index) { return null; }
              
              return <TableCell key={index} align="center">
                {`X${index+1}`}
              </TableCell>
            })}
            <TableCell align="center">b</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item.map((lines, i) => (
            <TableRow
              key={i}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {lines.map((li, j) => (
                <TableCell key={j} align="center">
                  {j == indexQueEntra[index] ?
                  li.toFixed(2) : li}
                </TableCell>
              ))}
              {/* <TableCell align="center">{row.calories}</TableCell>
              <TableCell align="center">{row.fat}</TableCell>
              <TableCell align="center">{row.carbs}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <button onClick={testTable}>Teste</button>
    </TableContainer>
    ))}
    </div>
  );
}