import ServersTable from "../components/ServersTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Servers</h1>
      <ServersTable />
    </div>
  );
}
