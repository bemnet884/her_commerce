interface ContactInfoProps {
  email: string;
  phone?: string;
  location?: string;
  specialization?: string;
  memberSince: string;
}

export default function ContactInfo({
  email,
  phone,
  location,
  specialization,
  memberSince,
}: ContactInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
      <div className="space-y-2 text-sm">
        <p className="text-gray-600">
          <span className="font-medium">Email:</span> {email}
        </p>
        {phone && (
          <p className="text-gray-600">
            <span className="font-medium">Phone:</span> {phone}
          </p>
        )}
        {location && (
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {location}
          </p>
        )}
        {specialization && (
          <p className="text-gray-600">
            <span className="font-medium">Specialization:</span> {specialization}
          </p>
        )}
        <p className="text-gray-600">
          <span className="font-medium">Member since:</span> {new Date(memberSince).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
