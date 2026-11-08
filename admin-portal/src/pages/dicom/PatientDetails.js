const PatientDetailsSidebar = ({ patient }) => {
  const data = patient || {};

  return (
    <div className="p-4 text-black dark:text-white">
      <h2 className="text-3xl font-semibold mb-3">Patient Info</h2>
      <div className="space-y-4 text-lg">
        <div><strong>ID:</strong> {data.centerPatientNumber}</div>
        <div><strong>Name:</strong> {data.name}</div>
        <div><strong>Age:</strong> {data.age}</div>
        <div><strong>Gender:</strong> {data.gender}</div>
        {/* <div><strong>Contact:</strong> {data.phoneNumber}</div>
        <div><strong>Email:</strong> {data.email}</div> */}
      </div>

      {/* <h3 className="mt-4 font-semibold">Vitals</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        <div><strong>Height:</strong> {data.vitals?.height}</div>
        <div><strong>Weight:</strong> {data.vitals?.weight}</div>
        <div><strong>BP:</strong> {data.vitals?.bp}</div>
        <div><strong>Pulse:</strong> {data.vitals?.pulse}</div>
      </div> */}
    </div>
  );
};

export default PatientDetailsSidebar;
