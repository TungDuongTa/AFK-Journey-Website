import { useParams } from "react-router-dom";

export default function NewsPageDetail() {
  const { id } = useParams();
  return (
    <div>
      <h1>News Detail for ID: {id}</h1>
      {/* Render the details based on the id */}
      {/* You can fetch data from an API or state here based on the `id` */}
    </div>
  );
}
