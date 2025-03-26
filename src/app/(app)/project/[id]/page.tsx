
"use client "
export default function StuffPage({ params }: { params: { id: string } }) {
  return <div>Stuff ID: {params.id}</div>;
}
