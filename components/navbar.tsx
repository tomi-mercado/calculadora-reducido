import { Calculator } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="bg-gray-800 py-6">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 justify-between">
        <div className="flex gap-4 items-center">
          <Calculator />
          <h1 className="text-2xl font-semibold hidden sm:block">
            Calculadora Reducido Primera Nacional
          </h1>
          <p className="text-xl font-semibold sm:hidden">
            Calculadora Reducido PN
          </p>
        </div>
      </div>
    </header>
  );
};
