import React from "react";

const PatientDetailsSidebar = ({ patient }) => {
  const mockPatient = {
    id: "PT-2025-0001",
    name: "John Doe",
    age: 47,
    gender: "Male",
    dob: "1978-09-22",
    contact: "+1 234 567 890",
    email: "johndoe@example.com",
    address: "123 Health Street, New York, NY",
    vitals: {
      height: "180 cm",
      weight: "78 kg",
      bp: "120/80",
      pulse: "72 bpm",
    },
  };

  const data = patient || mockPatient;

  return (
    <div className="p-2 text-gray-900 dark:text-white">
      <h2 className="text-3xl font-semibold mb-3">Patient Information</h2>

      <div className="space-y-2 text-lg">
        <div>
          <strong>ID:</strong> {data.centerPatientNumber}
        </div>
        <div>
          <strong>Name:</strong> {data.name}
        </div>
        <div>
          <strong>Age:</strong> {data.age}
        </div>
        <div>
          <strong>Gender:</strong> {data.gender}
        </div>
        {/* <div>
          <strong>DOB:</strong> {data.dob}
        </div> */}
        {/* <div>
          <strong>Contact:</strong> {data.contact}
        </div>
        <div>
          <strong>Email:</strong> {data.email}
        </div> */}
      </div>

      {/* <h3 className="mt-4 font-semibold">Vitals</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        <div>
          <strong>Height:</strong> {data.vitals.height}
        </div>
        <div>
          <strong>Weight:</strong> {data.vitals.weight}
        </div>
        <div>
          <strong>BP:</strong> {data.vitals.bp}
        </div>
        <div>
          <strong>Pulse:</strong> {data.vitals.pulse}
        </div>
      </div> */}
    </div>
  );
};

export default PatientDetailsSidebar;
