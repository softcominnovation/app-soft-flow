export default interface IAgendaDevAssistant {
  ordem: string;
  produto: string;
  abertos: string;
  corrigidos: string;
  retornos: string;
  resolvidos: string;
  id_colaborador: string;
  Cronograma_id: string;
  versao: string;
  selecionado: string;
  id_produto: string;
  NomeSuporte: string;
  ProdutoVersao: string;
  abertos_estimado: string;
  tem_caso_iniciado: string; // "*" quando possui caso iniciado; vazio caso contrário
}

