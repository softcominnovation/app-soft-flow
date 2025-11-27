export default interface ICaseFilter {
	numero_caso?: string,
	usuario_dev_id?: string,
	status_descricao?: string,
	status_id?: string | number | (string | number)[],
	produto_id?: string,
	projeto_id?: string,
	usuario_id?: string,
	versao_produto?: string,
	sort_by?: string,
	cursor?: string,
}
