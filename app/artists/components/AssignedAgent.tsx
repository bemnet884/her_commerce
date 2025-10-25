interface AssignedAgentProps {
  agent: {
    name: string;
    region?: string;
    contactPhone?: string;
  };
}

export default function AssignedAgent({ agent }: AssignedAgentProps) {
  if (!agent) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h3 className="font-semibold text-gray-900 mb-4">Assigned Agent</h3>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-semibold text-sm">
            {agent.name.split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{agent.name}</h4>
          {agent.region && <p className="text-sm text-gray-600">{agent.region}</p>}
          {agent.contactPhone && <p className="text-sm text-gray-600">{agent.contactPhone}</p>}
        </div>
      </div>
    </div>
  );
}
