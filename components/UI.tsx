import Link from "next/link";

export function Status({children,tone="regular"}:{children:React.ReactNode;tone?:string}){ return <span className={"status "+tone}><i/>{children}</span> }
export function Metric({value,label,detail,tone=""}:{value:string;label:string;detail?:string;tone?:string}){ return <div className="metricCard"><strong className={tone}>{value}</strong><span>{label}</span>{detail&&<small className={tone}>{detail}</small>}</div> }
export function SectionTitle({title,action,href="#"}:{title:string;action?:string;href?:string}){ return <div className="sectionTitle"><h2>{title}</h2>{action&&<Link href={href}>{action} →</Link>}</div> }
