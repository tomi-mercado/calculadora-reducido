import { Calculator } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="bg-gray-800 py-6">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 justify-between">
        <div className="flex gap-4 items-center">
          <Calculator />
          <h1 className="text-2xl font-semibold">
            Calculadora Reducido Primera Nacional
          </h1>
        </div>
      </div>
    </header>
  );
};
