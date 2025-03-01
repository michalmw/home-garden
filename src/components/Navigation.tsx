import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-green-600">
          Kwiaty
        </Link>

        <div className="space-x-4">
          <Link href="/plants" className="hover:text-green-600">
            Rośliny
          </Link>
          <Link href="/calendar" className="hover:text-green-600">
            Kalendarz
          </Link>
          {/* Usunięto link do sekcji admin */}
        </div>
      </div>
    </nav>
  );
}
