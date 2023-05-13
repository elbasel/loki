import Link from "next/link";

const linkStyles =
  "bg-black border-blue-700 hover:bg-white hover:text-black transition-all text-3xl w-fit px-4 py-2 mx-auto rounded-lg";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <ul className="flex flex-col gap-2">
        <Link className={linkStyles} href="/open-ai">
          Chat with an artificial intelligence
        </Link>
        <Link className={linkStyles} href="/google">
          Search Google easily
        </Link>

        <p className={linkStyles}>Automate your life (coming soon)</p>
      </ul>
    </main>
  );
}
