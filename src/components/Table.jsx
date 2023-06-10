import { useEffect } from 'react';

export default function DenseTable({iteracoes, indexQueEntra}) {

  useEffect(() => {
    console.log("iteracoes Tabela: ", iteracoes)
  }, [iteracoes]);

  if(iteracoes.length == 0) return;
  return (
    <div>
      {iteracoes.map((item, index) => (
      <div key={index} className="relative overflow-x-auto shadow-md sm:rounded-lg w-3/4 mb-6 m-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                Interação {index+1}
              </caption>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    BASE
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cb
                  </th>
                  {iteracoes[0][0].map((linha, index) => {
                    if (iteracoes[0][0].length - 3 <= index) { return null; }

                    return <th scope="col" className="px-6 py-3" key={index}>{`X${index+1}`}</th>
                  })}
                  <th scope="col" className="px-6 py-3">
                    b
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.map((lines, i) => (
                  <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    {lines.map((li, j) => (
                      <td key={j} className="px-6 py-4">
                        {j == indexQueEntra[index] ?
                        li : li}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
          </table>
      </div>))}
    </div>
  );
}