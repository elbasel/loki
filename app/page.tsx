import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <ul className="flex gap-2">
        <Link className="navLink" href="/ask">
          Ask
        </Link>
        <Link className="navLink" href="/google">
          Google
        </Link>
        <Link className="navLink" href="/open-ai">
          Open Ai
        </Link>
      </ul>
    </main>
  );
}
