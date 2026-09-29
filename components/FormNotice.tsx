export default function FormNotice({ demo, error }: { demo?: string; error?: string }) {
  if (demo) return <div className="formNotice demo">Modo demonstrativo: o formulário está validado visualmente, mas ainda não grava porque o projeto Supabase do Iphan não foi criado.</div>;
  if (error) return <div className="formNotice error">Não foi possível concluir a operação. Verifique os dados e tente novamente.</div>;
  return null;
}
