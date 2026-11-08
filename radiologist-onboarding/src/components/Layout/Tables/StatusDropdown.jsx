export const StatusDropdown = (props) => {
  const handleChange = (e) => {
    props.node.setDataValue("status", e.target.value);
  };

  return (
    <select
      value={props.value}
      onChange={handleChange}
      className="text-sm rounded-md border px-3 py-1 bg-white"
    >
      <option value="Unassigned">Unassigned</option>
      <option value="Assigned">Assigned</option>
      <option value="Completed">Completed</option>
      <option value="Accepted">Accepted</option>
      <option value="History">History</option>
    </select>
  );
};
