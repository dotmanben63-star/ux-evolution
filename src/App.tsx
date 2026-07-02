import { ItemsGallery } from "./components/ItemsGallery";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <main>
        <ItemsGallery />
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
export default App;
