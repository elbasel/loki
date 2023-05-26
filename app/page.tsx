import Link from "next/link";

export const fetchCache = "force-no-store";

const linkStyles =
  "flex-center-1 border rounded-lg border-white px-4 py-2 bg-black/30 hover:bg-black transition duration-200";

export default function Home() {
  return (
    <main>
      <h1 className="my-4">Home</h1>
      <ul className="flex flex-col gap-2">
        <Link className={linkStyles} href="/open-ai">
          Chat with an artificial intelligence
        </Link>
        <Link className={linkStyles} href="/supabase">
          Teach your own AI
        </Link>
        <Link className={linkStyles} href="/google">
          Search Google easily
        </Link>

        <p className={linkStyles}>Automate your life (coming soon)</p>
      </ul>
    </main>
  );
}
