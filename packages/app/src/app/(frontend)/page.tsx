export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-6 px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">DevMentor</p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Rozwijaj się jako programista z pomocą mentora.
      </h1>
      <p className="text-lg text-slate-600">
        Strona publiczna (frontend) jest stylowana czystym Tailwind CSS.
      </p>
    </main>
  );
}
