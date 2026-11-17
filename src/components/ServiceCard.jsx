export default function ServiceCard({ service, onOpen }) {
  const handleOpen = () => onOpen?.(service);

  return (
    <button
      type="button"
      className="glass-card service-card service-card--link"
      aria-label={`Open ${service.title} details popup`}
      onClick={handleOpen}
    >
      <div className="service-image-wrap service-image-wrap--full">
        <img src={service.image} alt={service.imageAlt} loading="lazy" decoding="async" />
      </div>
    </button>
  );
}
