export default function FloatingBubbles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      <div className="absolute w-72 h-72 bg-orange-300/30 blur-3xl -top-20 -right-20 rounded-full"/>
      <div className="absolute w-96 h-96 bg-green-300/30 blur-3xl top-1/4 -left-32 rounded-full"/>
      <div className="absolute w-48 h-48 bg-orange-300/30 blur-3xl top-1/2 right-10 rounded-full"/>
      <div className="absolute w-64 h-64 bg-green-300/30 blur-3xl bottom-1/4 left-1/4 rounded-full"/>

    </div>
  )
}