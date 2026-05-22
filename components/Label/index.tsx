export default function Label({ text }: { text: string }) {
  return (
    <label className="block text-sm font-semibold mb-2">{text}</label>
  );
}