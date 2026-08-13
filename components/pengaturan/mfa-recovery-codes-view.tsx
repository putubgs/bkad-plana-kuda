export default function MfaRecoveryCodesView({ codes }: { codes: string[] }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="mb-2 text-xs font-semibold text-amber-700">
        Simpan kode pemulihan ini di tempat yang aman. Setiap kode hanya dapat dipakai satu kali
        untuk masuk jika Anda kehilangan akses ke aplikasi autentikator.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {codes.map((code) => (
          <code
            key={code}
            className="rounded-lg bg-white px-2.5 py-1.5 text-center text-xs font-mono tracking-wide text-slate-700 ring-1 ring-amber-200"
          >
            {code}
          </code>
        ))}
      </div>
    </div>
  );
}
