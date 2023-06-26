import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataTable = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
        reponsive: true,
        serverSide: true,
        scrollX: true,
        processing: "<i class='fa fa-spinner fa-spin fa-3x fa-fw'></i>Carregando...",
        ajax: 'http://datasaude-api.beloni.dev.br/api/v1/poluentes',
        columns: [
            { data: "nome", title: 'nome'},
            { data: 'situacao_rede', title: 'situacao_rede'},
            { data: 'tipo_rede', title: 'tipo_rede'},
            { data: 'data', title: 'data'},
            { data: 'qualidade', title: 'qualidade'},
            { data: 'endereco', title: 'endereco'},
            { data: 'indice', title: 'indice'},
            { data: 'poluente', title: 'poluente'},
            { data: 'municipio', title: 'municipio'},
            { data: 'data_atual', title: 'data_atual'},
            { data: 'data', title: 'data'}
        ],
    });

    return () => {
      table.destroy();
    };
  }, []);

  return (
    <table className="table" ref={tableRef}>     
    </table>
  );
};

export default DataTable;
