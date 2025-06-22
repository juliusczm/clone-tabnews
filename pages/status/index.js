import useSWR from 'swr';

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = 'Carregando...';
  let maxConnections;
  let openedConnections;
  let dbVersion;

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString('pt-BR');
    const dbDependenciesValue = data.dependencies.database;
    maxConnections = dbDependenciesValue.max_connections;
    openedConnections = dbDependenciesValue.opened_connections;
    dbVersion = dbDependenciesValue.version;
  }

  return (
    <div>
      <div>Última atualização: {updatedAtText}</div>
      {!isLoading && data && (
        <>
          <h2>Banco de Dados</h2>
          <div>Conexões disponíveis: {maxConnections}</div>
          <div>Conexões abertas: {openedConnections}</div>
          <div>Versão do PostgreSQL: {dbVersion}</div>
        </>
      )}
    </div>
  );
}
