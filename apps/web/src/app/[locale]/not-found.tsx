import Link from "next/link";

export default function NotFound() {
  return (
    <main data-field="guayaba" className="pagina-trama grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="numero-lamina text-[9rem] leading-none opacity-40" aria-hidden>¿?</p>
        <h1 className="mt-4 font-cartel text-5xl">Esta lámina no existe</h1>
        <p className="mt-3 text-lg" style={{ color: "var(--on-field-soft)" }}>This sticker doesn’t exist.</p>
        <Link href="/es" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-lamina px-6 font-rotulo text-lg text-tinta no-underline">
          Volver al álbum · Back to the album
        </Link>
      </div>
    </main>
  );
}
