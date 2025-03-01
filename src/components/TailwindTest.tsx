export default function TailwindTest() {
  return (
    <div className="p-4 m-4 rounded-lg">
      <div className="bg-primary text-white p-4 rounded-lg mb-4">
        Primary background color (Green)
      </div>
      <div className="bg-secondary text-white p-4 rounded-lg mb-4">
        Secondary background color (Blue)
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        Gray background color
      </div>
      <div className="shadow-card p-4 rounded-lg mb-4">
        Card with custom shadow
      </div>
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-lg">
        Gradient background
      </div>
    </div>
  );
}
