const messages:Record<string,string>={
  inativo:"Este acesso está inativo. Procure um administrador do sistema.",
  permissao:"Seu perfil não tem permissão para executar esta operação.",
  dados:"Revise os campos obrigatórios e os valores informados.",
  periodo:"A data final não pode ser anterior à data inicial.",
  unidade:"Seu perfil não está vinculado a uma unidade institucional.",
  bem:"O bem cultural selecionado não está disponível para este perfil.",
  intervencao:"A intervenção selecionada não está disponível para este perfil.",
  medicao:"A medição selecionada não pertence à intervenção informada.",
  registro:"O registro não foi encontrado ou está fora do seu escopo institucional.",
  arquivo:"Selecione um arquivo válido.",
  upload:"Não foi possível enviar o arquivo. Tente novamente.",
  etapa:"Selecione uma etapa válida para a evidência.",
  duplicada:"Já existe uma medição com esse número nesta intervenção.",
  concluida:"Este registro já foi concluído.",
  pendencias:"Ainda existem decisões ou restrições abertas. Conclua as pendências antes de encerrar a intervenção.",
  salvar:"Não foi possível salvar as alterações. Tente novamente.",
  credenciais:"E-mail ou senha inválidos.",
  cadastro:"Não foi possível criar o acesso.",
  dominio:"Este Beta aceita apenas e-mails institucionais autorizados.",
  envio:"Não foi possível enviar o e-mail de recuperação.",
  email:"Informe um e-mail válido.",
  titulo:"Informe um título válido.",
  percentual:"Os percentuais devem estar entre 0 e 100.",
};

export default function FormNotice({ demo, error }: { demo?: string; error?: string }) {
  if (demo) return <div className="formNotice demo">Modo demonstrativo: a operação não foi gravada no ambiente real.</div>;
  if (error) return <div className="formNotice error">{messages[error] || "Não foi possível concluir a operação. Verifique os dados e tente novamente."}</div>;
  return null;
}
