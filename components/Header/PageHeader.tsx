
const PageHeader = ({title, description}: {title: string; description: string;}) => {
  return (
    <div className="flex flex-col gap-1 mt-8">
        <h2 className="text-base">{title}</h2>
        <p className="text-slate-300">{description}</p>
      </div>
  )
}

export default PageHeader