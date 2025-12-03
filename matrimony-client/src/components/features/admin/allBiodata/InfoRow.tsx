interface InfoRowProps {
  label: string
  value: string
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  )
}
