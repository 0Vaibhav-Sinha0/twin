import BottomDock from "@/components/shared/BottomDock";

export default function Page() {
  return (
    <main className="relative min-h-screen mode-night flex items-center justify-center" style={{backgroundColor: "#05070f"}}>
      <div className="text-center has-dock">
        <p className="font-hand text-2xl mb-3" style={{color:"rgba(58,169,255,0.5)"}}>coming soon</p>
        <h1 className="font-display text-4xl tracking-widest" style={{color:"#e8f4ff", textTransform:"capitalize"}}>gallery</h1>
      </div>
      <BottomDock />
    </main>
  );
}
